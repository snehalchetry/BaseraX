import Notification from '../models/Notification';
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
    const filter: Record<string, unknown> = { userId };
    if (unreadOnly === 'true') filter.isRead = false;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const notifications = await Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    return { notifications, total, unreadCount, page: pageNum, pages: Math.ceil(total / limitNum) };
};

export const markAsRead = async (notificationId: string, userId: string): Promise<INotification> => {
    const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true },
        { new: true }
    );
    if (!notification) throw ApiError.notFound('Notification not found');
    return notification;
};

export const markAllAsRead = async (userId: string): Promise<{ message: string }> => {
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    return { message: 'All notifications marked as read' };
};
