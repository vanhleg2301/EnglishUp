import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  googleId: string | null
  name: string
  role: 'admin' | 'user'
  subscription: {
    status: 'free' | 'active' | 'expired'
    plan: 'free' | 'monthly' | 'yearly'
    expiresAt: Date | null
  }
  resetPasswordToken: string | null
  resetPasswordExpires: Date | null
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      default: '',
    },
    googleId: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    subscription: {
      status: {
        type: String,
        enum: ['free', 'active', 'expired'],
        default: 'free',
      },
      plan: {
        type: String,
        enum: ['free', 'monthly', 'yearly'],
        default: 'free',
      },
      expiresAt: {
        type: Date,
        default: null,
      },
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User
