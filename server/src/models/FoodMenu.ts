import supabase from '../config/db';
import { IFoodMenu } from '../types';

const TABLE = 'food_menus';

export const findActive = async (): Promise<IFoodMenu | null> => {
    const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
    if (error || !data) return null;
    return data as IFoodMenu;
};

export const findByWeek = async (weekStartDate: string): Promise<IFoodMenu | null> => {
    const { data, error } = await supabase
        .from(TABLE)
        .select('*')
        .eq('week_start_date', weekStartDate)
        .single();
    if (error || !data) return null;
    return data as IFoodMenu;
};

export const deactivateAll = async (): Promise<void> => {
    await supabase
        .from(TABLE)
        .update({ is_active: false })
        .eq('is_active', true);
};

export const create = async (data: Partial<IFoodMenu>): Promise<IFoodMenu> => {
    const { data: menu, error } = await supabase
        .from(TABLE)
        .insert({
            week_start_date: data.week_start_date,
            days: data.days ?? [],
            is_active: data.is_active ?? true,
            created_by: data.created_by,
        })
        .select()
        .single();
    if (error) throw new Error(`Failed to create menu: ${error.message}`);
    return menu as IFoodMenu;
};

const FoodMenuModel = { findActive, findByWeek, deactivateAll, create };
export default FoodMenuModel;
