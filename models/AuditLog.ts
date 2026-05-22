import mongoose, { Schema, Document } from 'mongoose'

export interface IAuditLog extends Document {
  action: string
  resource: string
  userId: mongoose.Types.ObjectId | null
  userEmail: string
  status: 'success' | 'error' | 'warning'
  metadata: Record<string, unknown>
  createdAt: Date
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    action: {
      type: String,
      required: true,
    },
    resource: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    userEmail: {
      type: String,
      required: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['success', 'error', 'warning'],
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

const AuditLog =
  mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>('AuditLog', AuditLogSchema)

export default AuditLog
