import OutingRequest from '../models/OutingRequest';
import User from '../models/User';
import Notification from '../models/Notification';
import { ApiError } from '../utils/ApiError';
import { generatePassCode } from '../utils/passGenerator';
import { IUser, IOutingRequest } from '../types';

interface PaginatedResult {
    outings: IOutingRequest[];
    total: number;
    page: number;
    pages: number;
}

export const createRequest = async (studentId: string, data: Partial<IOutingRequest>): Promise<IOutingRequest> => {
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
        throw ApiError.badRequest('Invalid student');
    }

    const outing = await OutingRequest.create({
        ...data,
        studentId,
        parentId: student.parentId,
        wardenId: student.wardenId,
        timeline: [{ status: 'pending_parent', changedBy: studentId, comment: 'Request submitted' }],
    });

    if (student.parentId) {
        await Notification.create({
            userId: student.parentId,
            title: 'New Outing Request',
            message: `${student.name} has requested an outing to ${data.destination}`,
            type: 'outing_request',
            relatedId: outing._id,
            relatedModel: 'OutingRequest',
        });
    }

    return outing;
};

export const listRequests = async (user: IUser, query: Record<string, string> = {}): Promise<PaginatedResult> => {
    const filter: Record<string, unknown> = {};
    const { status, page = '1', limit = '20' } = query;

    if (user.role === 'student') filter.studentId = user._id;
    else if (user.role === 'parent') filter.parentId = user._id;
    else if (user.role === 'warden') filter.wardenId = user._id;
    if (status) filter.status = status;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const outings = await OutingRequest.find(filter)
        .populate('studentId', 'name rollNumber roomNumber block')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

    const total = await OutingRequest.countDocuments(filter);

    return { outings, total, page: pageNum, pages: Math.ceil(total / limitNum) };
};

export const parentAction = async (outingId: string, parentId: string, action: string, comment = ''): Promise<IOutingRequest> => {
    const outing = await OutingRequest.findOne({ _id: outingId, parentId });
    if (!outing) throw ApiError.notFound('Outing request not found');
    if (outing.status !== 'pending_parent') {
        throw ApiError.badRequest('Request is not pending parent approval');
    }

    const newStatus = action === 'approve' ? 'pending_warden' : 'parent_rejected';
    outing.status = newStatus as IOutingRequest['status'];
    outing.parentComment = comment;
    outing.parentActionAt = new Date();
    outing.timeline.push({
        status: newStatus, changedBy: parentId as any,
        changedAt: new Date(),
        comment: comment || (action === 'approve' ? 'Approved by parent' : 'Rejected by parent'),
    });

    await outing.save();

    await Notification.create({
        userId: outing.studentId,
        title: `Outing ${action === 'approve' ? 'Approved' : 'Rejected'} by Parent`,
        message: comment || `Your outing request has been ${action}d by your parent`,
        type: action === 'approve' ? 'outing_approved' : 'outing_rejected',
        relatedId: outing._id, relatedModel: 'OutingRequest',
    });

    if (action === 'approve' && outing.wardenId) {
        await Notification.create({
            userId: outing.wardenId,
            title: 'Outing Request for Review',
            message: 'A parent-approved outing request is awaiting your review',
            type: 'outing_request',
            relatedId: outing._id, relatedModel: 'OutingRequest',
        });
    }

    return outing;
};

export const wardenAction = async (outingId: string, wardenId: string, action: string, comment = ''): Promise<IOutingRequest> => {
    const outing = await OutingRequest.findOne({ _id: outingId, wardenId });
    if (!outing) throw ApiError.notFound('Outing request not found');
    if (outing.status !== 'pending_warden') {
        throw ApiError.badRequest('Request is not pending warden approval');
    }

    const newStatus = action === 'approve' ? 'warden_approved' : 'warden_rejected';
    outing.status = newStatus as IOutingRequest['status'];
    outing.wardenComment = comment;
    outing.wardenActionAt = new Date();

    if (action === 'approve') {
        outing.passCode = generatePassCode();
    }

    outing.timeline.push({
        status: newStatus, changedBy: wardenId as any,
        changedAt: new Date(),
        comment: comment || (action === 'approve' ? 'Approved by warden' : 'Rejected by warden'),
    });

    await outing.save();

    await Notification.create({
        userId: outing.studentId,
        title: `Outing ${action === 'approve' ? 'Approved' : 'Rejected'} by Warden`,
        message: action === 'approve'
            ? `Your outing pass has been generated: ${outing.passCode}`
            : 'Your outing request was rejected by the warden',
        type: action === 'approve' ? 'outing_approved' : 'outing_rejected',
        relatedId: outing._id, relatedModel: 'OutingRequest',
    });

    return outing;
};

export const getPass = async (outingId: string): Promise<IOutingRequest> => {
    const outing = await OutingRequest.findById(outingId)
        .populate('studentId', 'name rollNumber roomNumber block phone');

    if (!outing) throw ApiError.notFound('Outing request not found');
    if (outing.status !== 'warden_approved' && outing.status !== 'completed') {
        throw ApiError.badRequest('Outing pass is not yet generated');
    }

    return outing;
};
