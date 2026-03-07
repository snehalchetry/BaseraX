import NotificationModel from '../models/Notification';
import { ApiError } from '../utils/ApiError';
import { INotification } from '../types';

interface PaginatedNotifications {
    notifications: INotification[];
    total: number;
    unreadCount: number;
    page: number;
    pages: number;
}

export const getUserNotifications = async (userId: string, query: Record<string, string> = {}): Promise<PaginatedNotifications> => {
    const { page = '1', limit = '20', unreadOnly = 'false' } = query;
    const filter: Record<string, unknown> = { user_id: userId };
    if (unreadOnly === 'true') filter.is_read = false;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const { notifications, total } = await NotificationModel.findMany({ filter, page: pageNum, limit: limitNum });
    const unreadCount = await NotificationModel.countUnread(userId);

    return { notifications, total, unreadCount, page: pageNum, pages: Math.ceil(total / limitNum) };
};

export const markAsRead = async (notificationId: string, userId: string): Promise<INotification> => {
    const notification = await NotificationModel.markAsRead(notificationId, userId);
    if (!notification) throw ApiError.notFound('Notification not found');
    return notification;
};

export const markAllAsRead = async (userId: string): Promise<{ message: string }> => {
    await NotificationModel.markAllAsRead(userId);
    return { message: 'All notifications marked as read' };
};
