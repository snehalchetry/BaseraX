import ComplaintModel from '../models/Complaint';
import NotificationModel from '../models/Notification';
import { ApiError } from '../utils/ApiError';
import { IUser, IComplaint } from '../types';

interface PaginatedResult {
    complaints: IComplaint[];
    total: number;
    page: number;
    pages: number;
}

export const createComplaint = async (studentId: string, data: Partial<IComplaint>): Promise<IComplaint> => {
    const complaint = await ComplaintModel.create({
        ...data,
        student_id: studentId,
        timeline: [{ status: 'open', updated_by: studentId, updated_at: new Date().toISOString(), comment: 'Complaint filed' }],
    });
    return complaint;
};

export const listComplaints = async (user: IUser, query: Record<string, string> = {}): Promise<PaginatedResult> => {
    const filter: Record<string, unknown> = {};
    const { status, category, page = '1', limit = '20' } = query;

    if (user.role === 'student') filter.student_id = user.id;
    if (status) filter.status = status;
    if (category) filter.category = category;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const { complaints, total } = await ComplaintModel.findMany({ filter, page: pageNum, limit: limitNum });
    return { complaints, total, page: pageNum, pages: Math.ceil(total / limitNum) };
};

export const assignComplaint = async (complaintId: string, assignedBy: string, assignedTo: string): Promise<IComplaint> => {
    const complaint = await ComplaintModel.findById(complaintId);
    if (!complaint) throw ApiError.notFound('Complaint not found');

    const timeline = [...(complaint.timeline || []), {
        status: 'assigned', updated_by: assignedBy, updated_at: new Date().toISOString(), comment: `Assigned to ${assignedTo}`,
    }];

    const updated = await ComplaintModel.updateById(complaintId, {
        assigned_to: assignedTo,
        assigned_by: assignedBy,
        status: 'assigned',
        timeline,
    });

    if (!updated) throw ApiError.notFound('Complaint not found');

    await NotificationModel.create({
        user_id: complaint.student_id,
        title: 'Complaint Assigned',
        message: `Your complaint has been assigned to ${assignedTo}`,
        type: 'complaint_update',
        related_id: complaint.id,
        related_model: 'Complaint',
    });

    return updated;
};

export const updateStatus = async (complaintId: string, updatedBy: string, status: string, comment = ''): Promise<IComplaint> => {
    const complaint = await ComplaintModel.findById(complaintId);
    if (!complaint) throw ApiError.notFound('Complaint not found');

    const timeline = [...(complaint.timeline || []), {
        status, updated_by: updatedBy, updated_at: new Date().toISOString(),
        comment: comment || `Status updated to ${status}`,
    }];

    const updates: Partial<IComplaint> = { status: status as IComplaint['status'], timeline };
    if (status === 'closed') updates.resolved_at = new Date().toISOString();

    const updated = await ComplaintModel.updateById(complaintId, updates);
    if (!updated) throw ApiError.notFound('Complaint not found');

    await NotificationModel.create({
        user_id: complaint.student_id,
        title: 'Complaint Updated',
        message: `Your complaint status: ${status.replace(/_/g, ' ').toUpperCase()}`,
        type: 'complaint_update',
        related_id: complaint.id,
        related_model: 'Complaint',
    });

    return updated;
};
