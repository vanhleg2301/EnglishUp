import mongoose, { Schema, Document } from 'mongoose';
import type { SRSCard } from '@/hooks/useVocabSRS';

interface VocabSRSDocument extends Document {
  userId: string;
  cards: SRSCard[];
}

const SRSCardSchema = new Schema(
  {
    word: String,
    translation: String,
    phonetic: String,
    example: String,
    exampleTranslation: String,
    sourceDay: Number,
    interval: { type: Number, default: 0 },
    ease: { type: Number, default: 2.5 },
    reviews: { type: Number, default: 0 },
    dueDate: String,
    lastReviewed: String,
  },
  { _id: false }
);

const VocabSRSSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    cards: [SRSCardSchema],
  },
  { timestamps: true }
);

export const VocabSRS =
  mongoose.models.VocabSRS ||
  mongoose.model<VocabSRSDocument>('VocabSRS', VocabSRSSchema);
