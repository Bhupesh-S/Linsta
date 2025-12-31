import Notification from './notification.model';
import { NotificationData, NotificationResponse } from './notification.types';
import mongoose from 'mongoose';

export class NotificationService {
  /**
   * Create a notification
   * Don't notify if user performs action on their own content
   */
  async createNotification(
    receiverId: string,
    actorId: string,
    type: 'LIKE' | 'COMMENT' | 'EVENT_RSVP',
    message: string,
    referenceId: string
  ): Promise<void> {
    // Don't notify user of their own actions
    if (receiverId === actorId) {
      return;
    }

    try {
      await Notification.create({
        userId: new mongoose.Types.ObjectId(receiverId),
        type,
        message,
        referenceId: new mongoose.Types.ObjectId(referenceId),
        isRead: false,
      });
    } catch (error) {
      // Log error but don't crash the main operation
      console.error('Failed to create notification:', error);
    }
  }

  /**
   * Get all notifications for a user
   * Latest first, with pagination
   */
  async getNotifications(
    userId: string,
    limit: number = 20,
    skip: number = 0
  ): Promise<NotificationResponse[]> {
    const notifications = await Notification.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    return notifications.map((notif) => ({
      _id: notif._id.toString(),
      userId: notif.userId.toString(),
      type: notif.type,
      message: notif.message,
      referenceId: notif.referenceId.toString(),
      isRead: notif.isRead,
      createdAt: notif.createdAt.toISOString(),
    }));
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<NotificationResponse | null> {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    ).lean();

    if (!notification) {
      return null;
    }

    return {
      _id: notification._id.toString(),
      userId: notification.userId.toString(),
      type: notification.type,
      message: notification.message,
      referenceId: notification.referenceId.toString(),
      isRead: notification.isRead,
      createdAt: notification.createdAt.toISOString(),
    };
  }

  /**
   * Get unread count for user
   */
  async getUnreadCount(userId: string): Promise<number> {
    return Notification.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
      isRead: false,
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    await Notification.updateMany(
      {
        userId: new mongoose.Types.ObjectId(userId),
        isRead: false,
      },
      { isRead: true }
    );
  }
}

export default new NotificationService();
