import { Types } from 'mongoose';
import { Comment } from './comment.model';
import { parseMentions, getMentionedUserIds } from '../../utils/mentions';

export class CommentExtendedService {
  static async createReply(
    postId: string,
    userId: string,
    text: string,
    parentCommentId: string
  ): Promise<any> {
    try {
      // Verify parent comment exists
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        throw { statusCode: 404, message: 'Parent comment not found' };
      }

      // Parse mentions from text
      const mentions = await parseMentions(text);
      const mentionedUserIds = getMentionedUserIds(mentions);

      const reply = await Comment.create({
        postId: new Types.ObjectId(postId),
        userId: new Types.ObjectId(userId),
        text,
        mentions: mentionedUserIds,
        parentCommentId: new Types.ObjectId(parentCommentId),
      });

      return { success: true, message: 'Reply created successfully', data: reply };
    } catch (error: any) {
      throw error;
    }
  }

  static async getThreadedComments(
    postId: string,
    limit: number = 100,
    skip: number = 0
  ): Promise<any> {
    try {
      // Get parent comments only
      const parentComments = await Comment.find({
        postId: new Types.ObjectId(postId),
        parentCommentId: null,
      })
        .populate('userId', 'username profilePicture')
        .populate('mentions', 'username')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

      // For each parent, get replies
      const threaded = await Promise.all(
        parentComments.map(async (parent: any) => {
          const replies = await Comment.find({
            postId: new Types.ObjectId(postId),
            parentCommentId: parent._id,
          })
            .populate('userId', 'username profilePicture')
            .populate('mentions', 'username')
            .sort({ createdAt: 1 })
            .lean();

          return {
            ...parent,
            replies,
            replyCount: replies.length,
          };
        })
      );

      const total = await Comment.countDocuments({
        postId: new Types.ObjectId(postId),
        parentCommentId: null,
      });

      return {
        data: threaded,
        pagination: { total, limit, skip, hasMore: skip + limit < total },
      };
    } catch (error: any) {
      throw error;
    }
  }

  static async getReplies(
    parentCommentId: string,
    limit: number = 100,
    skip: number = 0
  ): Promise<any> {
    try {
      const replies = await Comment.find({
        parentCommentId: new Types.ObjectId(parentCommentId),
      })
        .populate('userId', 'username profilePicture')
        .populate('mentions', 'username')
        .sort({ createdAt: 1 })
        .limit(limit)
        .skip(skip)
        .lean();

      const total = await Comment.countDocuments({
        parentCommentId: new Types.ObjectId(parentCommentId),
      });

      return {
        data: replies,
        pagination: { total, limit, skip, hasMore: skip + limit < total },
      };
    } catch (error: any) {
      throw error;
    }
  }

  static async updateComment(
    commentId: string,
    userId: string,
    text: string
  ): Promise<any> {
    try {
      const comment = await Comment.findOne({
        _id: new Types.ObjectId(commentId),
        userId: new Types.ObjectId(userId),
      });

      if (!comment) {
        throw { statusCode: 404, message: 'Comment not found' };
      }

      // Parse mentions from new text
      const mentions = await parseMentions(text);
      const mentionedUserIds = getMentionedUserIds(mentions);

      comment.text = text;
      comment.mentions = mentionedUserIds;

      await comment.save();

      return { success: true, message: 'Comment updated successfully', data: comment };
    } catch (error: any) {
      throw error;
    }
  }
}
