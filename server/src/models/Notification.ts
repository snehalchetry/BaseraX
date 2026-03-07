import supabase from '../config/db';
import { INotification } from '../types';

const TABLE = 'notifications';

export const create = async (data: Partial<INotification>): Promise<INotification> => {
    const { data: notification, error } = await supabase
        .from(TABLE)
        .insert({
            user_id: data.user_id,
            title: data.title,
            message: data.message,
            type: data.type,
            is_read: false,
            related_id: data.related_id,
            related_model: data.related_model,
        })
        .select()
        .single();
    if (error) throw new Error(`Failed to create notification: ${error.message}`);
    return notification as INotification;
};

interface ListOptions {
    filter: Record<string, unknown>;
    page: number;
    limit: number;
}

export const findMany = async (opts: ListOptions): Promise<{ notifications: INotification[]; total: number }> => {
    let query = supabase.from(TABLE).select('*', { count: 'exact' });

    for (const [key, value] of Object.entries(opts.filter)) {
        query = query.eq(key, value);
    }

    const from = (opts.page - 1) * opts.limit;
    const to = from + opts.limit - 1;

    const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) throw new Error(`Failed to list notifications: ${error.message}`);
    return { notifications: (data ?? []) as INotification[], total: count ?? 0 };
};

export const countUnread = async (userId: string): Promise<number> => {
    const { count, error } = await supabase
        .from(TABLE)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);
    if (error) return 0;
    return count ?? 0;
};

export const markAsRead = async (id: string, userId: string): Promise<INotification | null> => {
    const { data, error } = await supabase
        .from(TABLE)
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();
    if (error || !data) return null;
    return data as INotification;
};

export const markAllAsRead = async (userId: string): Promise<void> => {
    await supabase
        .from(TABLE)
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);
};

const NotificationModel = { create, findMany, countUnread, markAsRead, markAllAsRead };
export default NotificationModel;
