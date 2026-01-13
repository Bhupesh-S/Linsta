import { Request, Response } from 'express';
import notificationService from './notification.service';

export class NotificationController {
  /**
   * GET /api/notifications
   * Get all notifications for logged-in user
   * Query: limit, skip
   */
  async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const skip = parseInt(req.query.skip as string) || 0;

      if (!userId) {
        res.status(401).json({ error: 'Missing or invalid token' });
        return;
      }

      const notifications = await notificationService.getNotifications(
        userId,
        limit,
        skip
      );

      res.status(200).json({
        success: true,
        data: notifications,
        count: notifications.length,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
    }
  }

  /**
   * GET /api/notifications/unread
   * Get only unread notifications
   */
  async getUnreadNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const skip = parseInt(req.query.skip as string) || 0;

      if (!userId) {
        res.status(401).json({ error: 'Missing or invalid token' });
        return;
      }

      const notifications = await notificationService.getUnreadNotifications(
        userId,
        limit,
        skip
      );

      res.status(200).json({
        success: true,
        data: notifications,
        count: notifications.length,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch unread notifications' });
    }
  }

  /**
   * PUT /api/notifications/:id/read
   * Mark single notification as read
   */
  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ error: 'Missing or invalid token' });
        return;
      }

      if (!id) {
        res.status(400).json({ error: 'Missing notification ID' });
        return;
      }

      const notification = await notificationService.markAsRead(id, userId);

      if (!notification) {
        res.status(404).json({ success: false, error: 'Notification not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        data: notification,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update notification' });
    }
  }

  /**
   * GET /api/notifications/unread/count
   * Get unread notification count
   */
  async getUnreadCount(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Missing or invalid token' });
        return;
      }

      const count = await notificationService.getUnreadCount(userId);

      res.status(200).json({
        success: true,
        unreadCount: count,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch unread count' });
    }
  }

  /**
   * PUT /api/notifications/mark-all-read
   * Mark all notifications as read (bulk operation)
   */
  async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Missing or invalid token' });
        return;
      }

      const result = await notificationService.markAllAsRead(userId);

      res.status(200).json({
        success: true,
        message: 'All notifications marked as read',
        data: {
          modifiedCount: result.modifiedCount,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update notifications' });
    }
  }

  /**
   * PUT /api/notifications/mark-multiple-read
   * Mark multiple specific notifications as read (bulk operation)
   */
  async markMultipleAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { notificationIds } = req.body;

      if (!userId) {
        res.status(401).json({ error: 'Missing or invalid token' });
        return;
      }

      if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
        res.status(400).json({
          success: false,
          error: 'notificationIds must be a non-empty array',
        });
        return;
      }

      const result = await notificationService.markMultipleAsRead(notificationIds, userId);

      res.status(200).json({
        success: true,
        message: `${result.modifiedCount} notifications marked as read`,
        data: {
          modifiedCount: result.modifiedCount,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update notifications' });
    }
  }

  /**
   * DELETE /api/notifications/cleanup
   * Clean old notifications (older than specified days)
   * Admin/maintenance endpoint
   */
  async cleanupOldNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { olderThanDays = 90 } = req.body;

      if (!userId) {
        res.status(401).json({ error: 'Missing or invalid token' });
        return;
      }

      if (typeof olderThanDays !== 'number' || olderThanDays < 1) {
        res.status(400).json({
          success: false,
          error: 'olderThanDays must be a positive number',
        });
        return;
      }

      const result = await notificationService.deleteOldNotifications(olderThanDays);

      res.status(200).json({
        success: true,
        message: `Deleted ${result.deletedCount} notifications older than ${olderThanDays} days`,
        data: {
          deletedCount: result.deletedCount,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to cleanup notifications' });
    }
  }

  /**
   * GET /api/notifications/:id
   * Get single notification by ID
   */
  async getNotificationById(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ error: 'Missing or invalid token' });
        return;
      }

      if (!id) {
        res.status(400).json({ error: 'Missing notification ID' });
        return;
      }

      const notification = await notificationService.getNotificationById(id, userId);

      if (!notification) {
        res.status(404).json({ success: false, error: 'Notification not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: notification,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch notification' });
    }
  }
}

export default new NotificationController();
