import FoodMenu from '../models/FoodMenu';
import { ApiError } from '../utils/ApiError';
import { IFoodMenu } from '../types';

export const getCurrent = async (): Promise<IFoodMenu> => {
    const menu = await FoodMenu.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!menu) throw ApiError.notFound('No active menu found');
    return menu;
};

export const createOrUpdate = async (data: Partial<IFoodMenu>, userId: string): Promise<IFoodMenu> => {
    await FoodMenu.updateMany({}, { isActive: false });
    const menu = await FoodMenu.create({ ...data, createdBy: userId, isActive: true });
    return menu;
};

export const getByWeek = async (dateStr: string): Promise<IFoodMenu> => {
    const date = new Date(dateStr);
    const menu = await FoodMenu.findOne({ weekStartDate: date });
    if (!menu) throw ApiError.notFound('Menu not found for this week');
    return menu;
};
