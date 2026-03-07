import { Document, Types } from 'mongoose';

// ─── User Roles ──────────────────────────────────────────────
export type UserRole = 'student' | 'parent' | 'warden' | 'admin';

// ─── User ────────────────────────────────────────────────────
export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    isVerified: boolean;
    avatar: string;
    rollNumber?: string;
    roomNumber?: string;
    block?: string;
    parentId?: Types.ObjectId;
    wardenId?: Types.ObjectId;
    studentIds?: Types.ObjectId[];
    assignedBlock?: string;
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// ─── Outing Status ──────────────────────────────────────────
export type OutingStatus =
    | 'pending_parent'
    | 'parent_approved'
    | 'parent_rejected'
    | 'pending_warden'
    | 'warden_approved'
    | 'warden_rejected'
    | 'completed';

export interface ITimelineEntry {
    status: string;
    changedBy: Types.ObjectId;
    changedAt: Date;
    comment: string;
}

export interface IOutingRequest extends Document {
    _id: Types.ObjectId;
    studentId: Types.ObjectId;
    parentId?: Types.ObjectId;
    wardenId?: Types.ObjectId;
    date: Date;
    timeFrom: string;
    timeTo: string;
    purpose: string;
    destination: string;
    emergencyContact?: string;
    status: OutingStatus;
    parentComment: string;
    wardenComment: string;
    parentActionAt?: Date;
    wardenActionAt?: Date;
    passCode?: string;
    timeline: ITimelineEntry[];
    createdAt: Date;
    updatedAt: Date;
}

// ─── Complaint ──────────────────────────────────────────────
export type ComplaintStatus = 'open' | 'assigned' | 'in_progress' | 'closed';
export type ComplaintCategory =
    | 'electrical'
    | 'plumbing'
    | 'furniture'
    | 'cleaning'
    | 'internet'
    | 'other';

export interface IComplaintTimeline {
    status: string;
    updatedBy: Types.ObjectId;
    updatedAt: Date;
    comment: string;
}

export interface IComplaint extends Document {
    _id: Types.ObjectId;
    studentId: Types.ObjectId;
    category: ComplaintCategory;
    title: string;
    description: string;
    roomNumber: string;
    block: string;
    images: string[];
    status: ComplaintStatus;
    priority: 'low' | 'medium' | 'high';
    assignedTo?: string;
    assignedBy?: Types.ObjectId;
    resolvedAt?: Date;
    timeline: IComplaintTimeline[];
    createdAt: Date;
    updatedAt: Date;
}

// ─── Food Menu ──────────────────────────────────────────────
export interface IMealItem {
    type: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
    items: string;
}

export interface IDayMenu {
    day: string;
    meals: IMealItem[];
}

export interface IFoodMenu extends Document {
    _id: Types.ObjectId;
    weekStartDate: Date;
    days: IDayMenu[];
    isActive: boolean;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

// ─── Notification ───────────────────────────────────────────
export interface INotification extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    relatedId?: Types.ObjectId;
    relatedModel?: string;
    createdAt: Date;
    updatedAt: Date;
}

// ─── Express Augmentation ───────────────────────────────────
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

// ─── API Response ───────────────────────────────────────────
export interface ApiResponse<T = unknown> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: Array<{ msg: string; param?: string }>;
}
