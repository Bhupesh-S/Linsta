import { Types } from 'mongoose';
import { CloseFriend } from './closefriend.model';

export class CloseFriendService {
  static async addCloseFriend(userId: string, friendId: string): Promise<any> {
    try {
      if (userId === friendId) {
        throw { statusCode: 400, message: 'You cannot add yourself as a close friend' };
      }

      const closeFriend = await CloseFriend.create({
        userId: new Types.ObjectId(userId),
        friendId: new Types.ObjectId(friendId),
      });

      return { success: true, message: 'Close friend added successfully', data: closeFriend };
    } catch (error: any) {
      if (error.code === 11000) {
        throw { statusCode: 409, message: 'User is already in your close friends list' };
      }
      throw error;
    }
  }

  static async removeCloseFriend(userId: string, friendId: string): Promise<any> {
    try {
      const result = await CloseFriend.deleteOne({
        userId: new Types.ObjectId(userId),
        friendId: new Types.ObjectId(friendId),
      });

      if (result.deletedCount === 0) {
        throw { statusCode: 404, message: 'Close friend not found' };
      }

      return { success: true, message: 'Close friend removed successfully' };
    } catch (error: any) {
      throw error;
    }
  }

  static async getCloseFriends(userId: string, limit: number = 100, skip: number = 0): Promise<any> {
    try {
      const closeFriends = await CloseFriend.find({
        userId: new Types.ObjectId(userId),
      })
        .populate('friendId', 'username profilePicture')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

      const total = await CloseFriend.countDocuments({
        userId: new Types.ObjectId(userId),
      });

      return {
        data: closeFriends,
        pagination: { total, limit, skip, hasMore: skip + limit < total },
      };
    } catch (error: any) {
      throw error;
    }
  }

  static async isCloseFriend(userId: string, friendId: string): Promise<boolean> {
    try {
      const result = await CloseFriend.findOne({
        userId: new Types.ObjectId(userId),
        friendId: new Types.ObjectId(friendId),
      });

      return !!result;
    } catch (error: any) {
      throw error;
    }
  }

  static async getCloseFriendsIds(userId: string): Promise<Types.ObjectId[]> {
    try {
      const closeFriends = await CloseFriend.find({
        userId: new Types.ObjectId(userId),
      }).select('friendId').lean();

      return closeFriends.map(cf => cf.friendId);
    } catch (error: any) {
      throw error;
    }
  }
}
