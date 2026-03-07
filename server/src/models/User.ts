import bcrypt from 'bcryptjs';
import supabase from '../config/db';
import { IUser } from '../types';

const TABLE = 'users';

export const findById = async (id: string): Promise<IUser | null> => {
    const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('id', id)
        .single();
    if (error || !data) return null;
    const user = data as IUser;
    delete user.password;
    delete user.refresh_token;
    return user;
};

export const findByIdWithPassword = async (id: string): Promise<IUser | null> => {
    const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('id', id)
        .single();
    if (error || !data) return null;
    return data as IUser;
};

export const findOne = async (filter: Partial<IUser>): Promise<IUser | null> => {
    let query = supabase.from(TABLE).select('*');
    for (const [key, value] of Object.entries(filter)) {
        query = query.eq(key, value);
    }
    const { data, error } = await query.limit(1).single();
    if (error || !data) return null;
    return data as IUser;
};

export const findByEmailOrPhone = async (email: string, phone: string): Promise<IUser | null> => {
    const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .or(`email.eq.${email},phone.eq.${phone}`)
        .limit(1)
        .maybeSingle();
    if (error || !data) return null;
    return data as IUser;
};

export const findByRollNumber = async (rollNumber: string): Promise<IUser | null> => {
    const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('roll_number', rollNumber)
        .single();
    if (error || !data) return null;
    return data as IUser;
};

export const create = async (userData: Partial<IUser> & { password: string }): Promise<IUser> => {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const row = {
        name: userData.name,
        email: userData.email?.toLowerCase(),
        phone: userData.phone,
        password: hashedPassword,
        role: userData.role,
        is_verified: userData.is_verified ?? false,
        avatar: userData.avatar ?? '',
        roll_number: userData.roll_number,
        room_number: userData.room_number,
        block: userData.block,
        parent_id: userData.parent_id,
        warden_id: userData.warden_id,
        student_ids: userData.student_ids ?? [],
        assigned_block: userData.assigned_block,
    };

    const { data, error } = await supabase
        .from(TABLE)
        .insert(row)
        .select()
        .single();
    if (error) throw new Error(`Failed to create user: ${error.message}`);
    const user = data as IUser;
    delete user.password;
    delete user.refresh_token;
    return user;
};

export const updateById = async (id: string, updates: Partial<IUser>): Promise<IUser | null> => {
    const { data, error } = await supabase
        .from(TABLE)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    if (error || !data) return null;
    return data as IUser;
};

export const comparePassword = async (candidatePassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(candidatePassword, hashedPassword);
};

export const deleteAll = async (): Promise<void> => {
    await supabase.from(TABLE).delete().neq('id', '00000000-0000-0000-0000-000000000000');
};

const UserModel = { findById, findByIdWithPassword, findOne, findByEmailOrPhone, findByRollNumber, create, updateById, comparePassword, deleteAll };
export default UserModel;
