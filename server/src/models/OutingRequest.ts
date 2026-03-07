import supabase from '../config/db';
import { IOutingRequest } from '../types';

const TABLE = 'outing_requests';

export const create = async (data: Partial<IOutingRequest>): Promise<IOutingRequest> => {
    const { data: outing, error } = await supabase
        .from(TABLE)
        .insert({
            student_id: data.student_id,
            parent_id: data.parent_id,
            warden_id: data.warden_id,
            date: data.date,
            time_from: data.time_from,
            time_to: data.time_to,
            purpose: data.purpose,
            destination: data.destination,
            emergency_contact: data.emergency_contact,
            status: data.status ?? 'pending_parent',
            timeline: data.timeline ?? [],
        })
        .select()
        .single();
    if (error) throw new Error(`Failed to create outing request: ${error.message}`);
    return outing as IOutingRequest;
};

export const findById = async (id: string): Promise<IOutingRequest | null> => {
    const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('id', id)
        .single();
    if (error || !data) return null;
    return data as IOutingRequest;
};

export const findByIdWithStudent = async (id: string): Promise<IOutingRequest | null> => {
    const { data, error } = await supabase
        .from(TABLE)
        .select('*, student:users!student_id(id, name, roll_number, room_number, block, phone)')
        .eq('id', id)
        .single();
    if (error || !data) return null;
    return data as IOutingRequest;
};

export const findOne = async (filter: Record<string, unknown>): Promise<IOutingRequest | null> => {
    let query = supabase.from(TABLE).select('*');
    for (const [key, value] of Object.entries(filter)) {
        query = query.eq(key, value as string);
    }
    const { data, error } = await query.limit(1).maybeSingle();
    if (error || !data) return null;
    return data as IOutingRequest;
};

interface ListOptions {
    filter: Record<string, unknown>;
    page: number;
    limit: number;
}

export const findMany = async (opts: ListOptions): Promise<{ outings: IOutingRequest[]; total: number }> => {
    let query = supabase.from(TABLE).select('*, student:users!student_id(id, name, roll_number, room_number, block)', { count: 'exact' });

    for (const [key, value] of Object.entries(opts.filter)) {
        query = query.eq(key, value as string);
    }

    const from = (opts.page - 1) * opts.limit;
    const to = from + opts.limit - 1;

    const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) throw new Error(`Failed to list outing requests: ${error.message}`);
    return { outings: (data ?? []) as IOutingRequest[], total: count ?? 0 };
};

export const updateById = async (id: string, updates: Partial<IOutingRequest>): Promise<IOutingRequest | null> => {
    const { data, error } = await supabase
        .from(TABLE)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    if (error || !data) return null;
    return data as IOutingRequest;
};

const OutingRequestModel = { create, findById, findByIdWithStudent, findOne, findMany, updateById };
export default OutingRequestModel;
