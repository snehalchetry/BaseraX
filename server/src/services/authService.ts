import jwt from 'jsonwebtoken';
import User from '../models/User';
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
export const signup = async (userData: Partial<IUser>): Promise<{ user: IUser } & TokenPair> => {
    const existing = await User.findOne({
        $or: [{ email: userData.email }, { phone: userData.phone }],
    });
    if (existing) {
        throw ApiError.badRequest('User with this email or phone already exists');
    }

    const user = await User.create(userData);
    const tokens = generateTokens(user._id.toString());

    user.refreshToken = tokens.refreshToken;
    await user.save();

    return { user, ...tokens };
};

/**
 * Login with Roll Number and password.
 */
export const login = async (rollNumber: string, password: string): Promise<{ user: IUser } & TokenPair> => {
    const user = await User.findOne({ rollNumber }).select('+password');
    if (!user) {
        throw ApiError.unauthorized('Invalid roll number or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw ApiError.unauthorized('Invalid roll number or password');
    }

    const tokens = generateTokens(user._id.toString());
    user.refreshToken = tokens.refreshToken;
    await user.save();

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
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
        throw ApiError.unauthorized('Invalid refresh token');
    }

    const tokens = generateTokens(user._id.toString());
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return tokens;
};

/**
 * Reset password using roll number.
 */
export const resetPassword = async (rollNumber: string, newPassword: string): Promise<{ message: string }> => {
    const user = await User.findOne({ rollNumber }).select('+password');
    if (!user) {
        throw ApiError.notFound('User not found');
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password reset successfully' };
};
