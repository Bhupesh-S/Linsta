import { Types } from "mongoose";
import { Follow } from "./follow.model";
import { User } from "../users/user.model";

export class FollowService {
  /**
   * Follow a user
   */
  static async followUser(followerId: string, followingId: string): Promise<any> {
    // Prevent self-follow
    if (followerId === followingId) {
      throw {
        statusCode: 400,
        message: "You cannot follow yourself",
      };
    }

    // Verify target user exists
    const targetUser = await User.findById(followingId);
    if (!targetUser) {
      throw {
        statusCode: 404,
        message: "User to follow not found",
      };
    }

    try {
      const follow = await Follow.create({
        followerId: new Types.ObjectId(followerId),
        followingId: new Types.ObjectId(followingId),
      });

      return {
        success: true,
        message: "User followed successfully",
        data: {
          _id: follow._id.toString(),
          followerId: follow.followerId.toString(),
          followingId: follow.followingId.toString(),
          createdAt: follow.createdAt.toISOString(),
        },
      };
    } catch (error: any) {
      // Handle duplicate key error
      if (error.code === 11000) {
        throw {
          statusCode: 409,
          message: "You are already following this user",
        };
      }
      throw error;
    }
  }

  /**
   * Unfollow a user
   */
  static async unfollowUser(followerId: string, followingId: string): Promise<any> {
    const result = await Follow.findOneAndDelete({
      followerId: new Types.ObjectId(followerId),
      followingId: new Types.ObjectId(followingId),
    });

    if (!result) {
      throw {
        statusCode: 404,
        message: "Follow relationship not found",
      };
    }

    return {
      success: true,
      message: "User unfollowed successfully",
    };
  }

  /**
   * Get followers for a user
   */
  static async getFollowers(userId: string, page: number = 1, limit: number = 20): Promise<any> {
    const skip = (page - 1) * limit;

    const [followers, total] = await Promise.all([
      Follow.find({ followingId: new Types.ObjectId(userId) })
        .populate("followerId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Follow.countDocuments({ followingId: new Types.ObjectId(userId) }),
    ]);

    // Fetch follower and following counts for each follower
    const data = await Promise.all(
      followers.map(async (follow: any) => {
        const followersCount = await Follow.countDocuments({ followingId: follow.followerId });
        const followingCount = await Follow.countDocuments({ followerId: follow.followerId });

        return {
          _id: follow.followerId._id.toString(),
          name: follow.followerId.name,
          email: follow.followerId.email,
          followersCount,
          followingCount,
        };
      })
    );

    return {
      success: true,
      data,
      total,
      page,
      limit,
    };
  }

  /**
   * Get following list for a user
   */
  static async getFollowing(userId: string, page: number = 1, limit: number = 20): Promise<any> {
    const skip = (page - 1) * limit;

    const [following, total] = await Promise.all([
      Follow.find({ followerId: new Types.ObjectId(userId) })
        .populate("followingId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Follow.countDocuments({ followerId: new Types.ObjectId(userId) }),
    ]);

    // Fetch follower and following counts for each following user
    const data = await Promise.all(
      following.map(async (follow: any) => {
        const followersCount = await Follow.countDocuments({ followingId: follow.followingId });
        const followingCount = await Follow.countDocuments({ followerId: follow.followingId });

        return {
          _id: follow.followingId._id.toString(),
          name: follow.followingId.name,
          email: follow.followingId.email,
          followersCount,
          followingCount,
        };
      })
    );

    return {
      success: true,
      data,
      total,
      page,
      limit,
    };
  }

  /**
   * Get follow counts for a user
   */
  static async getFollowCounts(userId: string): Promise<any> {
    const [followersCount, followingCount] = await Promise.all([
      Follow.countDocuments({ followingId: new Types.ObjectId(userId) }),
      Follow.countDocuments({ followerId: new Types.ObjectId(userId) }),
    ]);

    return {
      success: true,
      followersCount,
      followingCount,
    };
  }

  /**
   * Check if user A follows user B
   */
  static async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await Follow.findOne({
      followerId: new Types.ObjectId(followerId),
      followingId: new Types.ObjectId(followingId),
    });

    return !!follow;
  }
}

export default FollowService;
