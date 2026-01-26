import { Types } from 'mongoose';
import { PostShare } from './postshare.model';
import { Post } from './post.model';

export class PostShareService {
  static async sharePost(senderId: string, receiverId: string, postId: string, message?: string): Promise<any> {
    try {
      if (senderId === receiverId) {
        throw { statusCode: 400, message: 'You cannot share a post with yourself' };
      }

      // Verify post exists
      const post = await Post.findById(postId);
      if (!post) {
        throw { statusCode: 404, message: 'Post not found' };
      }

      const postShare = await PostShare.create({
        postId: new Types.ObjectId(postId),
        senderId: new Types.ObjectId(senderId),
        receiverId: new Types.ObjectId(receiverId),
        message,
      });

      return { success: true, message: 'Post shared successfully', data: postShare };
    } catch (error: any) {
      throw error;
    }
  }

  static async getSharedPosts(userId: string, limit: number = 100, skip: number = 0): Promise<any> {
    try {
      const shares = await PostShare.find({
        receiverId: new Types.ObjectId(userId),
      })
        .populate('postId', 'caption mediaUrl likesCount commentsCount')
        .populate('senderId', 'username profilePicture')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

      const total = await PostShare.countDocuments({
        receiverId: new Types.ObjectId(userId),
      });

      return {
        data: shares,
        pagination: { total, limit, skip, hasMore: skip + limit < total },
      };
    } catch (error: any) {
      throw error;
    }
  }

  static async getSentShares(userId: string, limit: number = 100, skip: number = 0): Promise<any> {
    try {
      const shares = await PostShare.find({
        senderId: new Types.ObjectId(userId),
      })
        .populate('postId', 'caption mediaUrl')
        .populate('receiverId', 'username profilePicture')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

      const total = await PostShare.countDocuments({
        senderId: new Types.ObjectId(userId),
      });

      return {
        data: shares,
        pagination: { total, limit, skip, hasMore: skip + limit < total },
      };
    } catch (error: any) {
      throw error;
    }
  }
}
