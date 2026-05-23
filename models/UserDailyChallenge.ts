import mongoose, { Schema, Document } from 'mongoose';

interface UserDailyChallengeDocument extends Document {
  userId: string;
  streak: number;
  lastDate: string;
  history: Record<string, unknown>;
}

const UserDailyChallengeSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    streak: { type: Number, default: 0 },
    lastDate: { type: String, default: '' },
    history: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const UserDailyChallenge =
  mongoose.models.UserDailyChallenge ||
  mongoose.model<UserDailyChallengeDocument>('UserDailyChallenge', UserDailyChallengeSchema);
