import mongoose, { Schema, Model } from 'mongoose';
import { IFoodMenu } from '../types';

const mealItemSchema = new Schema(
    {
        type: { type: String, enum: ['breakfast', 'lunch', 'snacks', 'dinner'], required: true },
        items: { type: String, required: true },
    },
    { _id: false }
);

const dayMenuSchema = new Schema(
    {
        day: { type: String, required: true },
        meals: [mealItemSchema],
    },
    { _id: false }
);

const foodMenuSchema = new Schema<IFoodMenu>(
    {
        weekStartDate: { type: Date, required: true },
        days: [dayMenuSchema],
        isActive: { type: Boolean, default: true },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

foodMenuSchema.index({ weekStartDate: 1 });
foodMenuSchema.index({ isActive: 1 });

const FoodMenu: Model<IFoodMenu> = mongoose.model<IFoodMenu>('FoodMenu', foodMenuSchema);
export default FoodMenu;
