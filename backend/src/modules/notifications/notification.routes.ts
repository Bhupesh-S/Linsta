import { Router } from 'express';
import notificationController from './notification.controller';
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// All notification routes are protected - require JWT token

/**
 * GET /api/notifications
 * Get all notifications for logged-in user
 */
router.get('/', authMiddleware, (req, res) =>
  notificationController.getNotifications(req, res)
);

/**
 * GET /api/notifications/unread
 * Get only unread notifications
 * IMPORTANT: Place before /:id route to avoid param conflict
 */
router.get('/unread', authMiddleware, (req, res) =>
  notificationController.getUnreadNotifications(req, res)
);

/**
 * GET /api/notifications/unread/count
 * Get unread notification count
 * IMPORTANT: Place before /:id route to avoid param conflict
 */
router.get('/unread/count', authMiddleware, (req, res) =>
  notificationController.getUnreadCount(req, res)
);

/**
 * PUT /api/notifications/mark-all-read
 * Mark all notifications as read
 * IMPORTANT: Place before /:id route to avoid param conflict
 */
router.put('/mark-all/read', authMiddleware, (req, res) =>
  notificationController.markAllAsRead(req, res)
);

/**
 * PUT /api/notifications/mark-multiple-read
 * Mark multiple notifications as read (bulk operation)
 * Body: { notificationIds: string[] }
 * IMPORTANT: Place before /:id route to avoid param conflict
 */
router.put('/mark-multiple/read', authMiddleware, (req, res) =>
  notificationController.markMultipleAsRead(req, res)
);

/**
 * DELETE /api/notifications/cleanup
 * Clean old notifications
 * Body: { olderThanDays: number } (optional, default 90)
 * IMPORTANT: Place before /:id route to avoid param conflict
 */
router.delete('/cleanup', authMiddleware, (req, res) =>
  notificationController.cleanupOldNotifications(req, res)
);

/**
 * GET /api/notifications/:id
 * Get single notification by ID
 */
router.get('/:id', authMiddleware, (req, res) =>
  notificationController.getNotificationById(req, res)
);

/**
 * PUT /api/notifications/:id/read
 * Mark notification as read
 */
router.put('/:id/read', authMiddleware, (req, res) =>
  notificationController.markAsRead(req, res)
);

export default router;
