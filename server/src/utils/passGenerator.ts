import crypto from 'crypto';

export const generatePassCode = (): string => {
    const prefix = 'OTP';
    const code = crypto.randomInt(100000, 999999).toString();
    return `${prefix}-${code}`;
};
