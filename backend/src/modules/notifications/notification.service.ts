import Notification from './notification.model';
import { NotificationData, NotificationResponse } from './notification.types';
import mongoose from 'mongoose';
import { Server as SocketIOServer } from 'socket.io';
import { emitNotificationToUser } from '../../socket/notification.socket';

let io: SocketIOServer | null = null;

// Initialize Socket.IO instance for notification emission
export const setSocketIO = (socketIO: SocketIOServer): void => {
  io = socketIO;
};

export class NotificationService {
  /**
   * Create a notification
   * IMPORTANT: Don't notify if user performs action on their own content
   */
  async createNotification(
    receiverId: string,
    actorId: string,
    type: 'LIKE' | 'COMMENT' | 'EVENT_RSVP' | 'STORY_VIEW' | 'STORY_LIKE' | 'STORY_COMMENT',
    message: string,
    referenceId: string
  ): Promise<void> {
    // RULE #1: Do not notify user for their own actions
    if (receiverId === actorId) {
      return;
    }

    try {
      const notification = await Notification.create({
        userId: new mongoose.Types.ObjectId(receiverId),
        actorId: new mongoose.Types.ObjectId(actorId),
        type,
        message,
        referenceId: new mongoose.Types.ObjectId(referenceId),
        isRead: false,
      });

      // Emit notification in real-time if Socket.IO is initialized
      if (io) {
        emitNotificationToUser(io, receiverId, {
          _id: notification._id,
          userId: notification.userId,
          actorId: notification.actorId,
          type: notification.type,
          message: notification.message,
          referenceId: notification.referenceId,
          isRead: notification.isRead,
          createdAt: notification.createdAt,
        });
      }
    } catch (error) {
      // Log error but don't crash the main operation
      console.error('Failed to create notification:', error);
    }
  }

  /**
   * Get all notifications for a user
   * RULE #3: Sort by latest first
   * Includes pagination
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
      actorId: notif.actorId.toString(),
      type: notif.type,
      message: notif.message,
      referenceId: notif.referenceId.toString(),
      isRead: notif.isRead,
      createdAt: notif.createdAt.toISOString(),
      updatedAt: notif.updatedAt.toISOString(),
    }));
  }

  /**
   * Get only unread notifications
   * RULE #3: Sort by latest first
   */
  async getUnreadNotifications(
    userId: string,
    limit: number = 20,
    skip: number = 0
  ): Promise<NotificationResponse[]> {
    const notifications = await Notification.find({
      userId: new mongoose.Types.ObjectId(userId),
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    return notifications.map((notif) => ({
      _id: notif._id.toString(),
      userId: notif.userId.toString(),
      actorId: notif.actorId.toString(),
      type: notif.type,
      message: notif.message,
      referenceId: notif.referenceId.toString(),
      isRead: notif.isRead,
      createdAt: notif.createdAt.toISOString(),
      updatedAt: notif.updatedAt.toISOString(),
    }));
  }

  /**
   * Mark notification as read
   * RULE #2: Ensure isRead flag works correctly
   */
  async markAsRead(notificationId: string, userId: string): Promise<NotificationResponse | null> {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(notificationId),
        userId: new mongoose.Types.ObjectId(userId),
      },
      { isRead: true },
      { new: true }
    ).lean();

    if (!notification) {
      return null;
    }

    return {
      _id: notification._id.toString(),
      userId: notification.userId.toString(),
      actorId: notification.actorId.toString(),
      type: notification.type,
      message: notification.message,
      referenceId: notification.referenceId.toString(),
      isRead: notification.isRead,
      createdAt: notification.createdAt.toISOString(),
      updatedAt: notification.updatedAt.toISOString(),
    };
  }

  /**
   * Get unread count for user
   * RULE #2: Ensure isRead flag works correctly
   */
  async getUnreadCount(userId: string): Promise<number> {
    return Notification.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
      isRead: false,
    });
  }

  /**
   * RULE #4: Bulk mark-as-read option
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<{ modifiedCount: number }> {
    const result = await Notification.updateMany(
      {
        userId: new mongoose.Types.ObjectId(userId),
        isRead: false,
      },
      { isRead: true }
    );

    return {
      modifiedCount: result.modifiedCount,
    };
  }

  /**
   * RULE #4: Bulk mark multiple notifications as read
   */
  async markMultipleAsRead(notificationIds: string[], userId: string): Promise<{ modifiedCount: number }> {
    const objectIds = notificationIds.map((id) => new mongoose.Types.ObjectId(id));

    const result = await Notification.updateMany(
      {
        _id: { $in: objectIds },
        userId: new mongoose.Types.ObjectId(userId),
        isRead: false,
      },
      { isRead: true }
    );

    return {
      modifiedCount: result.modifiedCount,
    };
  }

  /**
   * RULE #5: Clean old notifications if needed
   * Manually clean notifications older than specified days
   */
  async deleteOldNotifications(olderThanDays: number = 90): Promise<{ deletedCount: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await Notification.deleteMany({
      createdAt: { $lt: cutoffDate },
    });

    return {
      deletedCount: result.deletedCount,
    };
  }

  /**
   * Get notification by ID
   * Verify user is the receiver
   */
  async getNotificationById(notificationId: string, userId: string): Promise<NotificationResponse | null> {
    const notification = await Notification.findOne({
      _id: new mongoose.Types.ObjectId(notificationId),
      userId: new mongoose.Types.ObjectId(userId),
    }).lean();

    if (!notification) {
      return null;
    }

    return {
      _id: notification._id.toString(),
      userId: notification.userId.toString(),
      actorId: notification.actorId.toString(),
      type: notification.type,
      message: notification.message,
      referenceId: notification.referenceId.toString(),
      isRead: notification.isRead,
      createdAt: notification.createdAt.toISOString(),
      updatedAt: notification.updatedAt.toISOString(),
    };
  }
}

export default new NotificationService();
