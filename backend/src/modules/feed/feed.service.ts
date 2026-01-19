import { Types } from "mongoose";
import { Post } from "../posts/post.model";
import { Follow } from "../follows/follow.model";
import { User } from "../users/user.model";
import { Event } from "../events/event.model";

export class FeedService {
  /**
   * Get smart feed for a user
   * Shows posts from:
   * - Followed users
   * - Events user RSVP'd for
   */
  static async getFeed(userId: string, page: number = 1, limit: number = 20): Promise<any> {
    const skip = (page - 1) * limit;
    const userObjectId = new Types.ObjectId(userId);

    try {
      // Get list of users that this user follows
      const followingUsers = await Follow.find({ followerId: userObjectId }).select("followingId").lean();
      const followingIds = followingUsers.map((f: any) => f.followingId);

      // Get list of events that this user RSVP'd for
      const rsvpEvents = await Event.find({ attendees: userObjectId }).select("_id").lean();
      const eventIds = rsvpEvents.map((e: any) => e._id);

      // Build query to get posts from followed users or events user RSVP'd for
      const query: any = {
        $or: [
          { authorId: { $in: followingIds } }, // Posts from followed users
          { eventId: { $in: eventIds } }, // Posts from events user RSVP'd for
        ],
      };

      // Get total count for pagination
      const total = await Post.countDocuments(query);

      // Fetch posts with pagination
      const posts = await Post.find(query)
        .populate("authorId", "name email")
        .populate("eventId", "title description")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Enrich posts with engagement data
      const enrichedPosts = await Promise.all(
        posts.map(async (post: any) => {
          const likes = await Post.collection.db.collection("likes").countDocuments({ postId: post._id });
          const comments = await Post.collection.db.collection("comments").countDocuments({ postId: post._id });

          return {
            _id: post._id.toString(),
            caption: post.caption,
            author: post.authorId,
            event: post.eventId,
            likes,
            comments,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
          };
        })
      );

      return {
        success: true,
        data: enrichedPosts,
        total,
        page,
        limit,
        hasMore: skip + limit < total,
      };
    } catch (error: any) {
      throw {
        statusCode: 500,
        message: error.message || "Failed to fetch feed",
      };
    }
  }

  /**
   * Get explore feed (posts from all users, not just followers)
   * Used for discovery
   */
  static async getExploreFeed(userId: string, page: number = 1, limit: number = 20): Promise<any> {
    const skip = (page - 1) * limit;

    try {
      const total = await Post.countDocuments();

      const posts = await Post.find()
        .populate("authorId", "name email")
        .populate("eventId", "title description")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      // Enrich posts with engagement data
      const enrichedPosts = await Promise.all(
        posts.map(async (post: any) => {
          const likes = await Post.collection.db.collection("likes").countDocuments({ postId: post._id });
          const comments = await Post.collection.db.collection("comments").countDocuments({
            postId: post._id,
          });

          return {
            _id: post._id.toString(),
            caption: post.caption,
            author: post.authorId,
            event: post.eventId,
            likes,
            comments,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
          };
        })
      );

      return {
        success: true,
        data: enrichedPosts,
        total,
        page,
        limit,
        hasMore: skip + limit < total,
      };
    } catch (error: any) {
      throw {
        statusCode: 500,
        message: error.message || "Failed to fetch explore feed",
      };
    }
  }
}

export default FeedService;
