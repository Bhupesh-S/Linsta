import { Request, Response } from 'express';
import { CloseFriendService } from './closefriend.service';

export class CloseFriendController {
  static async addCloseFriend(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { friendId } = req.params;

      const result = await CloseFriendService.addCloseFriend(userId, friendId);

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to add close friend',
      });
    }
  }

  static async removeCloseFriend(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { friendId } = req.params;

      const result = await CloseFriendService.removeCloseFriend(userId, friendId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to remove close friend',
      });
    }
  }

  static async getCloseFriends(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 100);
      const skip = parseInt(req.query.skip as string) || 0;

      const result = await CloseFriendService.getCloseFriends(userId, limit, skip);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to fetch close friends',
      });
    }
  }
}
