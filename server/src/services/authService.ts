import jwt from 'jsonwebtoken';
import UserModel from '../models/User';
import { ApiError } from '../utils/ApiError';
import { config } from '../config/env';
import { IUser } from '../types';

interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

const generateTokens = (userId: string): TokenPair => {
    const accessToken = jwt.sign({ id: userId }, config.jwtSecret as string, { expiresIn: config.jwtExpiresIn as any });
    const refreshToken = jwt.sign({ id: userId }, config.jwtRefreshSecret as string, { expiresIn: config.jwtRefreshExpiresIn as any });
    return { accessToken, refreshToken };
};

/**
 * Register a new user.
 */
export const signup = async (userData: Record<string, any>): Promise<{ user: IUser } & TokenPair> => {
    const existing = await UserModel.findByEmailOrPhone(userData.email, userData.phone);
    if (existing) {
        throw ApiError.badRequest('User with this email or phone already exists');
    }

    const user = await UserModel.create({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        role: userData.role,
        roll_number: userData.rollNumber || userData.roll_number,
        room_number: userData.roomNumber || userData.room_number,
        block: userData.block,
        assigned_block: userData.assignedBlock || userData.assigned_block,
    });

    const tokens = generateTokens(user.id);
    await UserModel.updateById(user.id, { refresh_token: tokens.refreshToken });

    return { user, ...tokens };
};

/**
 * Login with Roll Number and password.
 */
export const login = async (rollNumber: string, password: string): Promise<{ user: IUser } & TokenPair> => {
    const user = await UserModel.findByRollNumber(rollNumber);
    if (!user || !user.password) {
        throw ApiError.unauthorized('Invalid roll number or password');
    }

    const isMatch = await UserModel.comparePassword(password, user.password);
    if (!isMatch) {
        throw ApiError.unauthorized('Invalid roll number or password');
    }

    const tokens = generateTokens(user.id);
    await UserModel.updateById(user.id, { refresh_token: tokens.refreshToken });

    // Remove sensitive fields before returning
    delete user.password;
    delete user.refresh_token;

    return { user, ...tokens };
};

/**
 * Refresh the access token.
 */
export const refreshAccessToken = async (refreshToken: string): Promise<TokenPair> => {
    if (!refreshToken) {
        throw ApiError.unauthorized('Refresh token required');
    }

    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as { id: string };
    const user = await UserModel.findByIdWithPassword(decoded.id);

    if (!user || user.refresh_token !== refreshToken) {
        throw ApiError.unauthorized('Invalid refresh token');
    }

    const tokens = generateTokens(user.id);
    await UserModel.updateById(user.id, { refresh_token: tokens.refreshToken });

    return tokens;
};

/**
 * Reset password using roll number.
 */
export const resetPassword = async (rollNumber: string, newPassword: string): Promise<{ message: string }> => {
    const user = await UserModel.findByRollNumber(rollNumber);
    if (!user) {
        throw ApiError.notFound('User not found');
    }

    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await UserModel.updateById(user.id, { password: hashedPassword } as any);

    return { message: 'Password reset successfully' };
};
