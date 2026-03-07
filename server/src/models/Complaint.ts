import supabase from '../config/db';
import { IComplaint, IComplaintTimeline } from '../types';

const TABLE = 'complaints';

export const create = async (data: Partial<IComplaint>): Promise<IComplaint> => {
    const { data: complaint, error } = await supabase
        .from(TABLE)
        .insert({
            student_id: data.student_id,
            category: data.category,
            title: data.title,
            description: data.description,
            room_number: data.room_number,
            block: data.block,
            images: data.images ?? [],
            status: data.status ?? 'open',
            priority: data.priority ?? 'medium',
            timeline: data.timeline ?? [],
        })
        .select()
        .single();
    if (error) throw new Error(`Failed to create complaint: ${error.message}`);
    return complaint as IComplaint;
};

export const findById = async (id: string): Promise<IComplaint | null> => {
    const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('id', id)
        .single();
    if (error || !data) return null;
    return data as IComplaint;
};

interface ListOptions {
    filter: Record<string, unknown>;
    page: number;
    limit: number;
}

export const findMany = async (opts: ListOptions): Promise<{ complaints: IComplaint[]; total: number }> => {
    let query = supabase.from(TABLE).select('*, student:users!student_id(id, name, roll_number, room_number, block), assigner:users!assigned_by(id, name)', { count: 'exact' });

    for (const [key, value] of Object.entries(opts.filter)) {
        query = query.eq(key, value);
    }

    const from = (opts.page - 1) * opts.limit;
    const to = from + opts.limit - 1;

    const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) throw new Error(`Failed to list complaints: ${error.message}`);
    return { complaints: (data ?? []) as IComplaint[], total: count ?? 0 };
};

export const updateById = async (id: string, updates: Partial<IComplaint>): Promise<IComplaint | null> => {
    const { data, error } = await supabase
        .from(TABLE)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    if (error || !data) return null;
    return data as IComplaint;
};

const ComplaintModel = { create, findById, findMany, updateById };
export default ComplaintModel;
