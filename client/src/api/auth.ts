import type { AuthResponse } from '../types';
import api from './client';

export const login = async (rollNumber: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', { rollNumber, password });
    return data.data;
};

export const logout = async (): Promise<void> => {
    // To handle server-side cache/token invalidation if needed
    // For now, client-side only based on AuthContext logic
};
