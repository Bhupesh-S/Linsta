import { Types } from 'mongoose';
import { GroupMessage } from './groupmessage.model';
import { GroupService } from './group.service';

export class GroupMessageService {
  /**
   * Send message to group
   * Only members can send messages
   */
  static async sendMessage(userId: string, groupId: string, message: string): Promise<any> {
    try {
      if (!message || message.trim().length === 0) {
        throw { statusCode: 400, message: 'Message cannot be empty' };
      }

      // Verify user is member
      const isMember = await GroupService.isMember(userId, groupId);
      if (!isMember) {
        throw { statusCode: 403, message: 'You are not a member of this group' };
      }

      const groupMessage = await GroupMessage.create({
        groupId: new Types.ObjectId(groupId),
        senderId: new Types.ObjectId(userId),
        message: message.trim(),
      });

      // Populate sender info
      const populatedMessage = await GroupMessage.findById(groupMessage._id)
        .populate('senderId', 'name profilePicture')
        .lean();

      return {
        success: true,
        message: 'Message sent successfully',
        data: populatedMessage,
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Get messages for a group
   */
  static async getMessages(
    groupId: string,
    userId: string,
    limit: number = 50,
    skip: number = 0
  ): Promise<any> {
    try {
      // Verify user is member
      const isMember = await GroupService.isMember(userId, groupId);
      if (!isMember) {
        throw { statusCode: 403, message: 'You are not a member of this group' };
      }

      const messages = await GroupMessage.find({
        groupId: new Types.ObjectId(groupId),
      })
        .populate('senderId', 'name profilePicture email')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

      const total = await GroupMessage.countDocuments({
        groupId: new Types.ObjectId(groupId),
      });

      return {
        data: messages.reverse(), // Reverse to get chronological order
        pagination: { total, limit, skip, hasMore: skip + limit < total },
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Delete message (for future enhancement)
   */
  static async deleteMessage(messageId: string, userId: string): Promise<any> {
    try {
      const message = await GroupMessage.findOne({
        _id: new Types.ObjectId(messageId),
        senderId: new Types.ObjectId(userId),
      });

      if (!message) {
        throw { statusCode: 404, message: 'Message not found or not authorized' };
      }

      await GroupMessage.deleteOne({ _id: messageId });

      return {
        success: true,
        message: 'Message deleted successfully',
      };
    } catch (error: any) {
      throw error;
    }
  }
}
