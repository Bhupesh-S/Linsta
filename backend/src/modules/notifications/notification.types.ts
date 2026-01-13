import { INotification, NotificationType } from './notification.model';

// Response format for API
export interface NotificationResponse {
  _id: string;
  userId: string;
  actorId: string;  // Who triggered the notification
  type: NotificationType;
  message: string;
  referenceId: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// Request format for marking as read
export interface MarkAsReadRequest {
  isRead: boolean;
}

// Request format for marking multiple as read
export interface MarkMultipleAsReadRequest {
  notificationIds: string[];
}

// Request format for cleanup
export interface CleanupRequest {
  olderThanDays?: number;  // Default 90
}

// Internal service return type
export interface NotificationData {
  userId: string;
  actorId: string;
  type: NotificationType;
  message: string;
  referenceId: string;
}
