import { Types } from "mongoose";
import { SavedPost, SavedEvent } from "./saved.model";

export class SavedService {
  /**
   * Save a post
   */
  static async savePost(userId: string, postId: string): Promise<any> {
    try {
      const saved = await SavedPost.create({
        userId: new Types.ObjectId(userId),
        postId: new Types.ObjectId(postId),
      });

      return {
        success: true,
        message: "Post saved successfully",
        data: {
          _id: saved._id.toString(),
          userId: saved.userId.toString(),
          postId: saved.postId.toString(),
          createdAt: saved.createdAt.toISOString(),
        },
      };
    } catch (error: any) {
      // Handle duplicate key error
      if (error.code === 11000) {
        throw {
          statusCode: 409,
          message: "Post already saved",
        };
      }
      throw error;
    }
  }

  /**
   * Unsave a post
   */
  static async unsavePost(userId: string, postId: string): Promise<any> {
    const result = await SavedPost.findOneAndDelete({
      userId: new Types.ObjectId(userId),
      postId: new Types.ObjectId(postId),
    });

    if (!result) {
      throw {
        statusCode: 404,
        message: "Saved post not found",
      };
    }

    return {
      success: true,
      message: "Post unsaved successfully",
    };
  }

  /**
   * Get all saved posts for a user
   */
  static async getSavedPosts(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<any> {
    const skip = (page - 1) * limit;

    const [savedPosts, total] = await Promise.all([
      SavedPost.find({ userId: new Types.ObjectId(userId) })
        .populate("postId", "caption authorId createdAt updatedAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      SavedPost.countDocuments({ userId: new Types.ObjectId(userId) }),
    ]);

    return {
      success: true,
      data: savedPosts.map((item: any) => ({
        _id: item._id.toString(),
        userId: item.userId.toString(),
        postId: item.postId,
        createdAt: item.createdAt.toISOString(),
      })),
      total,
      page,
      limit,
    };
  }

  /**
   * Save an event
   */
  static async saveEvent(userId: string, eventId: string): Promise<any> {
    try {
      const saved = await SavedEvent.create({
        userId: new Types.ObjectId(userId),
        eventId: new Types.ObjectId(eventId),
      });

      return {
        success: true,
        message: "Event saved successfully",
        data: {
          _id: saved._id.toString(),
          userId: saved.userId.toString(),
          eventId: saved.eventId.toString(),
          createdAt: saved.createdAt.toISOString(),
        },
      };
    } catch (error: any) {
      // Handle duplicate key error
      if (error.code === 11000) {
        throw {
          statusCode: 409,
          message: "Event already saved",
        };
      }
      throw error;
    }
  }

  /**
   * Unsave an event
   */
  static async unsaveEvent(userId: string, eventId: string): Promise<any> {
    const result = await SavedEvent.findOneAndDelete({
      userId: new Types.ObjectId(userId),
      eventId: new Types.ObjectId(eventId),
    });

    if (!result) {
      throw {
        statusCode: 404,
        message: "Saved event not found",
      };
    }

    return {
      success: true,
      message: "Event unsaved successfully",
    };
  }

  /**
   * Get all saved events for a user
   */
  static async getSavedEvents(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<any> {
    const skip = (page - 1) * limit;

    const [savedEvents, total] = await Promise.all([
      SavedEvent.find({ userId: new Types.ObjectId(userId) })
        .populate("eventId", "title description startDate endDate")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      SavedEvent.countDocuments({ userId: new Types.ObjectId(userId) }),
    ]);

    return {
      success: true,
      data: savedEvents.map((item: any) => ({
        _id: item._id.toString(),
        userId: item.userId.toString(),
        eventId: item.eventId,
        createdAt: item.createdAt.toISOString(),
      })),
      total,
      page,
      limit,
    };
  }
}

export default SavedService;
