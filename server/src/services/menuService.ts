import FoodMenuModel from '../models/FoodMenu';
import { ApiError } from '../utils/ApiError';
import { IFoodMenu } from '../types';

export const getCurrent = async (): Promise<IFoodMenu> => {
    const menu = await FoodMenuModel.findActive();
    if (!menu) throw ApiError.notFound('No active menu found');
    return menu;
};

export const createOrUpdate = async (data: Partial<IFoodMenu>, userId: string): Promise<IFoodMenu> => {
    await FoodMenuModel.deactivateAll();
    const menu = await FoodMenuModel.create({ ...data, created_by: userId, is_active: true });
    return menu;
};

export const getByWeek = async (dateStr: string): Promise<IFoodMenu> => {
    const menu = await FoodMenuModel.findByWeek(dateStr);
    if (!menu) throw ApiError.notFound('Menu not found for this week');
    return menu;
};
