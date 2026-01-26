import { Request, Response } from 'express';
import { PostShareService } from './postshare.service';
import { createPostShareNotification } from '../../utils/notificationHelper';
import { Types } from 'mongoose';

export class PostShareController {
  static async sharePost(req: Request, res: Response) {
    try {
      const senderId = (req as any).userId;
      const { receiverId, postId, message } = req.body;

      if (!receiverId || !postId) {
        return res.status(400).json({
          success: false,
          message: 'Receiver ID and Post ID are required',
        });
      }

      const result = await PostShareService.sharePost(senderId, receiverId, postId, message);

      // Create notification for receiver
      await createPostShareNotification(
        new Types.ObjectId(receiverId),
        new Types.ObjectId(senderId),
        new Types.ObjectId(postId),
        message
      );

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to share post',
      });
    }
  }

  static async getSharedPosts(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 100);
      const skip = parseInt(req.query.skip as string) || 0;

      const result = await PostShareService.getSharedPosts(userId, limit, skip);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to fetch shared posts',
      });
    }
  }

  static async getSentShares(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 100);
      const skip = parseInt(req.query.skip as string) || 0;

      const result = await PostShareService.getSentShares(userId, limit, skip);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to fetch sent shares',
      });
    }
  }
}
