import OutingRequestModel from '../models/OutingRequest';
import UserModel from '../models/User';
import NotificationModel from '../models/Notification';
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
    const student = await UserModel.findById(studentId);
    if (!student || student.role !== 'student') {
        throw ApiError.badRequest('Invalid student');
    }

    const outing = await OutingRequestModel.create({
        ...data,
        student_id: studentId,
        parent_id: student.parent_id,
        warden_id: student.warden_id,
        timeline: [{ status: 'pending_parent', changed_by: studentId, changed_at: new Date().toISOString(), comment: 'Request submitted' }],
    });

    if (student.parent_id) {
        await NotificationModel.create({
            user_id: student.parent_id,
            title: 'New Outing Request',
            message: `${student.name} has requested an outing to ${data.destination}`,
            type: 'outing_request',
            related_id: outing.id,
            related_model: 'OutingRequest',
        });
    }

    return outing;
};

export const listRequests = async (user: IUser, query: Record<string, string> = {}): Promise<PaginatedResult> => {
    const filter: Record<string, unknown> = {};
    const { status, page = '1', limit = '20' } = query;

    if (user.role === 'student') filter.student_id = user.id;
    else if (user.role === 'parent') filter.parent_id = user.id;
    else if (user.role === 'warden') filter.warden_id = user.id;
    if (status) filter.status = status;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const { outings, total } = await OutingRequestModel.findMany({ filter, page: pageNum, limit: limitNum });
    return { outings, total, page: pageNum, pages: Math.ceil(total / limitNum) };
};

export const parentAction = async (outingId: string, parentId: string, action: string, comment = ''): Promise<IOutingRequest> => {
    const outing = await OutingRequestModel.findOne({ id: outingId, parent_id: parentId });
    if (!outing) throw ApiError.notFound('Outing request not found');
    if (outing.status !== 'pending_parent') {
        throw ApiError.badRequest('Request is not pending parent approval');
    }

    const newStatus = action === 'approve' ? 'pending_warden' : 'parent_rejected';
    const timeline = [...(outing.timeline || []), {
        status: newStatus, changed_by: parentId,
        changed_at: new Date().toISOString(),
        comment: comment || (action === 'approve' ? 'Approved by parent' : 'Rejected by parent'),
    }];

    const updated = await OutingRequestModel.updateById(outingId, {
        status: newStatus as IOutingRequest['status'],
        parent_comment: comment,
        parent_action_at: new Date().toISOString(),
        timeline,
    });
    if (!updated) throw ApiError.notFound('Outing request not found');

    await NotificationModel.create({
        user_id: outing.student_id,
        title: `Outing ${action === 'approve' ? 'Approved' : 'Rejected'} by Parent`,
        message: comment || `Your outing request has been ${action}d by your parent`,
        type: action === 'approve' ? 'outing_approved' : 'outing_rejected',
        related_id: outing.id, related_model: 'OutingRequest',
    });

    if (action === 'approve' && outing.warden_id) {
        await NotificationModel.create({
            user_id: outing.warden_id,
            title: 'Outing Request for Review',
            message: 'A parent-approved outing request is awaiting your review',
            type: 'outing_request',
            related_id: outing.id, related_model: 'OutingRequest',
        });
    }

    return updated;
};

export const wardenAction = async (outingId: string, wardenId: string, action: string, comment = ''): Promise<IOutingRequest> => {
    const outing = await OutingRequestModel.findOne({ id: outingId, warden_id: wardenId });
    if (!outing) throw ApiError.notFound('Outing request not found');
    if (outing.status !== 'pending_warden') {
        throw ApiError.badRequest('Request is not pending warden approval');
    }

    const newStatus = action === 'approve' ? 'warden_approved' : 'warden_rejected';
    const passCode = action === 'approve' ? generatePassCode() : undefined;

    const timeline = [...(outing.timeline || []), {
        status: newStatus, changed_by: wardenId,
        changed_at: new Date().toISOString(),
        comment: comment || (action === 'approve' ? 'Approved by warden' : 'Rejected by warden'),
    }];

    const updates: Partial<IOutingRequest> = {
        status: newStatus as IOutingRequest['status'],
        warden_comment: comment,
        warden_action_at: new Date().toISOString(),
        timeline,
    };
    if (passCode) updates.pass_code = passCode;

    const updated = await OutingRequestModel.updateById(outingId, updates);
    if (!updated) throw ApiError.notFound('Outing request not found');

    await NotificationModel.create({
        user_id: outing.student_id,
        title: `Outing ${action === 'approve' ? 'Approved' : 'Rejected'} by Warden`,
        message: action === 'approve'
            ? `Your outing pass has been generated: ${passCode}`
            : 'Your outing request was rejected by the warden',
        type: action === 'approve' ? 'outing_approved' : 'outing_rejected',
        related_id: outing.id, related_model: 'OutingRequest',
    });

    return updated;
};

export const getPass = async (outingId: string): Promise<IOutingRequest> => {
    const outing = await OutingRequestModel.findByIdWithStudent(outingId);
    if (!outing) throw ApiError.notFound('Outing request not found');
    if (outing.status !== 'warden_approved' && outing.status !== 'completed') {
        throw ApiError.badRequest('Outing pass is not yet generated');
    }
    return outing;
};
