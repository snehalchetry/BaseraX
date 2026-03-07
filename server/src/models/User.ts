import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 100 },
        email: {
            type: String, required: [true, 'Email is required'], unique: true,
            lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        phone: {
            type: String, required: [true, 'Phone number is required'], unique: true,
            match: [/^\d{10}$/, 'Phone number must be 10 digits'],
        },
        password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
        role: { type: String, enum: ['student', 'parent', 'warden', 'admin'], required: true, index: true },
        isVerified: { type: Boolean, default: false },
        avatar: { type: String, default: '' },
        rollNumber: { type: String, sparse: true, trim: true },
        roomNumber: { type: String, trim: true },
        block: { type: String, trim: true },
        parentId: { type: Schema.Types.ObjectId, ref: 'User' },
        wardenId: { type: Schema.Types.ObjectId, ref: 'User' },
        studentIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        assignedBlock: { type: String, trim: true },
        refreshToken: { type: String, select: false },
    },
    { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ rollNumber: 1 });

userSchema.pre('save', async function () {
    const doc = this as any;
    if (!doc.isModified('password')) return;
    doc.password = await bcrypt.hash(doc.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.refreshToken;
    return obj;
};

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;
