export type UserRole = 'student' | 'parent' | 'warden' | 'admin';

export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    avatar?: string;
    rollNumber?: string;
    roomNumber?: string;
    block?: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface OutingRequest {
    _id: string;
    studentId: User | string;
    parentId?: User | string;
    wardenId?: User | string;
    date: string;
    timeFrom: string;
    timeTo: string;
    purpose: string;
    destination: string;
    emergencyContact?: string;
    status: 'pending_parent' | 'parent_approved' | 'parent_rejected' | 'pending_warden' | 'warden_approved' | 'warden_rejected' | 'completed';
    passCode?: string;
    timeline: Array<{ status: string; changedAt: string; comment?: string; changedBy: string }>;
    createdAt: string;
}

export interface Complaint {
    _id: string;
    studentId: User | string;
    category: 'electrical' | 'plumbing' | 'furniture' | 'cleaning' | 'internet' | 'other';
    title: string;
    description: string;
    status: 'open' | 'assigned' | 'in_progress' | 'closed';
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
    assignedTo?: string;
}

export interface Notification {
    _id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}
