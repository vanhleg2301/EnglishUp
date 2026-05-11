import mongoose, { Schema, Document } from 'mongoose';
import type { UserProgress } from '@/types';

export interface ProgressDocument extends UserProgress, Document {}

const DayProgressSchema = new Schema({
  day: Number,
  completed: Boolean,
  score: Number,
  xpEarned: Number,
  completedAt: String,
});

const ProgressSchema = new Schema(
  {
    userId: { type: String, default: 'local', unique: true },
    totalXP: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastLoginDate: String,
    completedDays: [DayProgressSchema],
  },
  { timestamps: true }
);

export const Progress =
  mongoose.models.Progress || mongoose.model<ProgressDocument>('Progress', ProgressSchema);
