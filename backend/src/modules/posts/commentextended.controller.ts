import { Request, Response } from 'express';
import { CommentExtendedService } from './commentextended.service';
import { createMentionNotification, createCommentReplyNotification } from '../../utils/notificationHelper';
import { parseMentions } from '../../utils/mentions';
import { Types } from 'mongoose';

export class CommentExtendedController {
  static async createReply(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { postId, parentCommentId, text } = req.body;

      if (!postId || !parentCommentId || !text) {
        return res.status(400).json({
          success: false,
          message: 'Post ID, Parent Comment ID, and Text are required',
        });
      }

      const result = await CommentExtendedService.createReply(postId, userId, text, parentCommentId);

      // Parse mentions and notify mentioned users
      const mentions = await parseMentions(text);
      for (const mention of mentions) {
        await createMentionNotification(
          mention.userId,
          new Types.ObjectId(userId),
          'comment',
          result.data._id,
          text.substring(0, 100)
        );
      }

      // Get parent comment author and notify them
      const Comment = require('./comment.model').Comment;
      const parentComment = await Comment.findById(parentCommentId);
      if (parentComment && parentComment.userId.toString() !== userId) {
        await createCommentReplyNotification(
          parentComment.userId,
          new Types.ObjectId(userId),
          new Types.ObjectId(parentCommentId),
          result.data._id
        );
      }

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to create reply',
      });
    }
  }

  static async getThreadedComments(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 100);
      const skip = parseInt(req.query.skip as string) || 0;

      const result = await CommentExtendedService.getThreadedComments(postId, limit, skip);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to fetch threaded comments',
      });
    }
  }

  static async getReplies(req: Request, res: Response) {
    try {
      const { commentId } = req.params;
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 100);
      const skip = parseInt(req.query.skip as string) || 0;

      const result = await CommentExtendedService.getReplies(commentId, limit, skip);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to fetch replies',
      });
    }
  }

  static async updateComment(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { commentId } = req.params;
      const { text } = req.body;

      if (!text) {
        return res.status(400).json({
          success: false,
          message: 'Text is required',
        });
      }

      const result = await CommentExtendedService.updateComment(commentId, userId, text);

      // Parse mentions and notify new mentioned users
      const mentions = await parseMentions(text);
      for (const mention of mentions) {
        await createMentionNotification(
          mention.userId,
          new Types.ObjectId(userId),
          'comment',
          new Types.ObjectId(commentId),
          text.substring(0, 100)
        );
      }

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to update comment',
      });
    }
  }
}
