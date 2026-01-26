import { Request, Response } from 'express';
import { GroupService } from './group.service';
import { GroupMessageService } from './groupmessage.service';

export class GroupController {
  /**
   * Create a new group
   * POST /api/groups
   */
  static async createGroup(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Group name is required',
        });
      }

      const result = await GroupService.createGroup(userId, name, description);

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to create group',
      });
    }
  }

  /**
   * Join a group
   * POST /api/groups/:id/join
   */
  static async joinGroup(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id: groupId } = req.params;

      const result = await GroupService.joinGroup(userId, groupId);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to join group',
      });
    }
  }

  /**
   * Leave a group
   * DELETE /api/groups/:id/leave
   */
  static async leaveGroup(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id: groupId } = req.params;

      const result = await GroupService.leaveGroup(userId, groupId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to leave group',
      });
    }
  }

  /**
   * Get group details
   * GET /api/groups/:id
   */
  static async getGroup(req: Request, res: Response) {
    try {
      const { id: groupId } = req.params;

      const group = await GroupService.getGroup(groupId);

      res.status(200).json({
        success: true,
        data: group,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to fetch group',
      });
    }
  }

  /**
   * Get user's groups
   * GET /api/groups
   */
  static async getUserGroups(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 100);
      const skip = parseInt(req.query.skip as string) || 0;

      const result = await GroupService.getUserGroups(userId, limit, skip);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to fetch groups',
      });
    }
  }

  /**
   * Get group messages
   * GET /api/groups/:id/messages
   */
  static async getGroupMessages(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id: groupId } = req.params;
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const skip = parseInt(req.query.skip as string) || 0;

      const result = await GroupMessageService.getMessages(groupId, userId, limit, skip);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to fetch messages',
      });
    }
  }

  /**
   * Send message to group
   * POST /api/groups/:id/message
   */
  static async sendMessage(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id: groupId } = req.params;
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({
          success: false,
          message: 'Message is required',
        });
      }

      const result = await GroupMessageService.sendMessage(userId, groupId, message);

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to send message',
      });
    }
  }
}
