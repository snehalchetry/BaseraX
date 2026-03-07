// ─── User Roles ──────────────────────────────────────────────
export type UserRole = 'student' | 'parent' | 'warden' | 'admin';

// ─── User ────────────────────────────────────────────────────
export interface IUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    password?: string;
    role: UserRole;
    is_verified: boolean;
    avatar: string;
    roll_number?: string;
    room_number?: string;
    block?: string;
    parent_id?: string;
    warden_id?: string;
    student_ids?: string[];
    assigned_block?: string;
    refresh_token?: string;
    created_at: string;
    updated_at: string;
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
    changed_by: string;
    changed_at: string;
    comment: string;
}

export interface IOutingRequest {
    id: string;
    student_id: string;
    parent_id?: string;
    warden_id?: string;
    date: string;
    time_from: string;
    time_to: string;
    purpose: string;
    destination: string;
    emergency_contact?: string;
    status: OutingStatus;
    parent_comment: string;
    warden_comment: string;
    parent_action_at?: string;
    warden_action_at?: string;
    pass_code?: string;
    timeline: ITimelineEntry[];
    created_at: string;
    updated_at: string;
    // Joined data
    student?: Partial<IUser>;
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
    updated_by: string;
    updated_at: string;
    comment: string;
}

export interface IComplaint {
    id: string;
    student_id: string;
    category: ComplaintCategory;
    title: string;
    description: string;
    room_number: string;
    block: string;
    images: string[];
    status: ComplaintStatus;
    priority: 'low' | 'medium' | 'high';
    assigned_to?: string;
    assigned_by?: string;
    resolved_at?: string;
    timeline: IComplaintTimeline[];
    created_at: string;
    updated_at: string;
    // Joined data
    student?: Partial<IUser>;
    assigner?: Partial<IUser>;
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

export interface IFoodMenu {
    id: string;
    week_start_date: string;
    days: IDayMenu[];
    is_active: boolean;
    created_by: string;
    created_at: string;
    updated_at: string;
}

// ─── Notification ───────────────────────────────────────────
export interface INotification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    related_id?: string;
    related_model?: string;
    created_at: string;
    updated_at: string;
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
