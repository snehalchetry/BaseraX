import Complaint from '../models/Complaint';
import Notification from '../models/Notification';
import { ApiError } from '../utils/ApiError';
import { IUser, IComplaint } from '../types';

interface PaginatedResult {
    complaints: IComplaint[];
    total: number;
    page: number;
    pages: number;
}

export const createComplaint = async (studentId: string, data: Partial<IComplaint>): Promise<IComplaint> => {
    const complaint = await Complaint.create({
        ...data,
        studentId,
        timeline: [{ status: 'open', updatedBy: studentId, comment: 'Complaint filed' }],
    });
    return complaint;
};

export const listComplaints = async (user: IUser, query: Record<string, string> = {}): Promise<PaginatedResult> => {
    const filter: Record<string, unknown> = {};
    const { status, category, page = '1', limit = '20' } = query;

    if (user.role === 'student') filter.studentId = user._id;
    if (status) filter.status = status;
    if (category) filter.category = category;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const complaints = await Complaint.find(filter)
        .populate('studentId', 'name rollNumber roomNumber block')
        .populate('assignedBy', 'name')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

    const total = await Complaint.countDocuments(filter);
    return { complaints, total, page: pageNum, pages: Math.ceil(total / limitNum) };
};

export const assignComplaint = async (complaintId: string, assignedBy: string, assignedTo: string): Promise<IComplaint> => {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) throw ApiError.notFound('Complaint not found');

    complaint.assignedTo = assignedTo;
    complaint.assignedBy = assignedBy as any;
    complaint.status = 'assigned';
    complaint.timeline.push({ status: 'assigned', updatedBy: assignedBy as any, updatedAt: new Date(), comment: `Assigned to ${assignedTo}` });

    await complaint.save();

    await Notification.create({
        userId: complaint.studentId, title: 'Complaint Assigned',
        message: `Your complaint has been assigned to ${assignedTo}`,
        type: 'complaint_update', relatedId: complaint._id, relatedModel: 'Complaint',
    });

    return complaint;
};

export const updateStatus = async (complaintId: string, updatedBy: string, status: string, comment = ''): Promise<IComplaint> => {
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) throw ApiError.notFound('Complaint not found');

    complaint.status = status as IComplaint['status'];
    if (status === 'closed') complaint.resolvedAt = new Date();
    complaint.timeline.push({
        status, updatedBy: updatedBy as any, updatedAt: new Date(),
        comment: comment || `Status updated to ${status}`,
    });

    await complaint.save();

    await Notification.create({
        userId: complaint.studentId, title: 'Complaint Updated',
        message: `Your complaint status: ${status.replace(/_/g, ' ').toUpperCase()}`,
        type: 'complaint_update', relatedId: complaint._id, relatedModel: 'Complaint',
    });

    return complaint;
};
