import mongoose, { Schema, Document } from 'mongoose';

// Notification types
export type NotificationType = 'LIKE' | 'COMMENT' | 'EVENT_RSVP' | 'STORY_VIEW' | 'STORY_LIKE' | 'STORY_COMMENT';

// Interface for TypeScript
export interface INotification extends Document {
  userId: mongoose.Types.ObjectId; // receiver
  actorId: mongoose.Types.ObjectId; // person who triggered notification
  type: NotificationType;
  message: string;
  referenceId: mongoose.Types.ObjectId; // postId or eventId
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition
const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    actorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['LIKE', 'COMMENT', 'EVENT_RSVP', 'STORY_VIEW', 'STORY_LIKE', 'STORY_COMMENT'],
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    referenceId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
NotificationSchema.index({ userId: 1, createdAt: -1 }); // Latest first
NotificationSchema.index({ userId: 1, isRead: 1 }); // Unread count
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 }); // Unread notifications
NotificationSchema.index({ userId: 1, actorId: 1, createdAt: -1 }); // Prevent duplicate notifications

// TTL Index: Auto-delete notifications older than 90 days (7776000 seconds)
// Removes old notifications to prevent unbounded growth
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

// Export model
const Notification = mongoose.model<INotification>(
  'Notification',
  NotificationSchema
);

export default Notification;
