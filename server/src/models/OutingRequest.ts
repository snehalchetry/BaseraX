import mongoose, { Schema, Model } from 'mongoose';
import { IOutingRequest } from '../types';

const timelineEntrySchema = new Schema(
    {
        status: { type: String, required: true },
        changedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        changedAt: { type: Date, default: Date.now },
        comment: { type: String, default: '' },
    },
    { _id: false }
);

const outingRequestSchema = new Schema<IOutingRequest>(
    {
        studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        parentId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
        wardenId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
        date: { type: Date, required: [true, 'Outing date is required'] },
        timeFrom: { type: String, required: [true, 'Start time is required'] },
        timeTo: { type: String, required: [true, 'End time is required'] },
        purpose: { type: String, required: [true, 'Purpose is required'], trim: true, maxlength: 500 },
        destination: { type: String, required: [true, 'Destination is required'], trim: true, maxlength: 200 },
        emergencyContact: { type: String, match: [/^\d{10}$/, 'Emergency contact must be 10 digits'] },
        status: {
            type: String,
            enum: ['pending_parent', 'parent_approved', 'parent_rejected', 'pending_warden', 'warden_approved', 'warden_rejected', 'completed'],
            default: 'pending_parent', index: true,
        },
        parentComment: { type: String, default: '' },
        wardenComment: { type: String, default: '' },
        parentActionAt: Date,
        wardenActionAt: Date,
        passCode: { type: String, unique: true, sparse: true },
        timeline: [timelineEntrySchema],
    },
    { timestamps: true }
);

outingRequestSchema.index({ studentId: 1, createdAt: -1 });
outingRequestSchema.index({ parentId: 1, status: 1 });
outingRequestSchema.index({ wardenId: 1, status: 1 });

const OutingRequest: Model<IOutingRequest> = mongoose.model<IOutingRequest>('OutingRequest', outingRequestSchema);
export default OutingRequest;
