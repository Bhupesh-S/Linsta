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

      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  }

  /**
   * PUT /api/notifications/:id/read
   * Mark notification as read
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

      const notification = await notificationService.markAsRead(id);

      if (!notification) {
        res.status(404).json({ error: 'Notification not found' });
        return;
      }

      res.status(200).json(notification);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update notification' });
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

      res.status(200).json({ unreadCount: count });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch unread count' });
    }
  }

  /**
   * PUT /api/notifications/mark-all-read
   * Mark all notifications as read
   */
  async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ error: 'Missing or invalid token' });
        return;
      }

      await notificationService.markAllAsRead(userId);

      res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update notifications' });
    }
  }
}

export default new NotificationController();
