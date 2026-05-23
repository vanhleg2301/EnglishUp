import mongoose, { Schema, Document } from 'mongoose';

interface UserBadgesDocument extends Document {
  userId: string;
  earned: { id: string; earnedAt: string }[];
  consecutivePronScores: number;
  completedB2Ids: string[];
  conversationOpened: boolean;
  totalVocabReviewed: number;
  sgSprintCompleted: boolean;
}

const UserBadgesSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    earned: [{ id: String, earnedAt: String, _id: false }],
    consecutivePronScores: { type: Number, default: 0 },
    completedB2Ids: [String],
    conversationOpened: { type: Boolean, default: false },
    totalVocabReviewed: { type: Number, default: 0 },
    sgSprintCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const UserBadges =
  mongoose.models.UserBadges ||
  mongoose.model<UserBadgesDocument>('UserBadges', UserBadgesSchema);
