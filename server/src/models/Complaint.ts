import mongoose, { Schema, Model } from 'mongoose';
import { IComplaint } from '../types';

const complaintTimelineSchema = new Schema(
    {
        status: { type: String, required: true },
        updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        updatedAt: { type: Date, default: Date.now },
        comment: { type: String, default: '' },
    },
    { _id: false }
);

const complaintSchema = new Schema<IComplaint>(
    {
        studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        category: {
            type: String,
            enum: ['electrical', 'plumbing', 'furniture', 'cleaning', 'internet', 'other'],
            required: [true, 'Category is required'],
        },
        title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 200 },
        description: { type: String, required: [true, 'Description is required'], trim: true, maxlength: 1000 },
        roomNumber: { type: String, trim: true },
        block: { type: String, trim: true },
        images: [{ type: String }],
        status: {
            type: String,
            enum: ['open', 'assigned', 'in_progress', 'closed'],
            default: 'open', index: true,
        },
        priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
        assignedTo: { type: String },
        assignedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        resolvedAt: Date,
        timeline: [complaintTimelineSchema],
    },
    { timestamps: true }
);

const Complaint: Model<IComplaint> = mongoose.model<IComplaint>('Complaint', complaintSchema);
export default Complaint;
