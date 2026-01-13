// Story service - Business logic
import { Story, IStory } from "./story.model";
import { StoryView } from "./storyView.model";
import { StoryLike } from "./storyLike.model";
import { StoryComment } from "./storyComment.model";
import { Types } from "mongoose";
import { CreateStoryRequest, StoryResponse, UserStoriesResponse, AllStoriesResponse, StoryCommentResponse, StoryViewerResponse } from "./story.types";
import { StoryErrors } from "./story.errors";
import { validateStoryInput, validateComment } from "./story.validators";

// Import services safely with fallback
let notificationService: any;

try {
  notificationService = require("../notifications/notification.service").default;
} catch (e) {
  console.warn("Notification service not available");
  notificationService = { createNotification: async () => {} };
}

export class StoryService {
  // Helper: Check if story is expired
  private static isStoryExpired(story: IStory): boolean {
    return new Date() > story.expiresAt;
  }

  // Helper: Map story document to response format
  private static mapStoryToResponse(story: IStory, userLiked?: boolean): StoryResponse {
    return {
      _id: story._id.toString(),
      userId: story.userId.toString(),
      mediaType: story.mediaType,
      mediaUrl: story.mediaUrl,
      caption: story.caption,
      viewsCount: story.viewsCount,
      likesCount: story.likesCount,
      commentsCount: story.commentsCount,
      expiresAt: story.expiresAt,
      createdAt: story.createdAt,
      userLiked: userLiked || false,
      user: story.userId
        ? {
            _id: (story.userId as any)._id?.toString() || story.userId.toString(),
            name: (story.userId as any).name || "Unknown",
            email: (story.userId as any).email || "unknown@example.com",
          }
        : undefined,
    };
  }

  // Create a new story (expires after 24 hours)
  static async createStory(userId: string, data: CreateStoryRequest): Promise<StoryResponse> {
    // Validate input
    const validation = validateStoryInput(data);
    if (!validation.valid) {
      throw StoryErrors.INVALID_INPUT;
    }

    // Calculate expiration date (24 hours from now)
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Create story
    const story = await Story.create({
      userId: new Types.ObjectId(userId),
      mediaType: data.mediaType,
      mediaUrl: data.mediaUrl.trim(),
      caption: data.caption ? data.caption.trim() : undefined,
      viewsCount: 0,
      likesCount: 0,
      commentsCount: 0,
      expiresAt,
    });

    return this.mapStoryToResponse(story);
  }

  // Get all active stories grouped by user (sorted by latest first)
  static async getAllStories(): Promise<AllStoriesResponse> {
    const now = new Date();

    // Query only non-expired stories
    const stories = await Story.find({ expiresAt: { $gt: now } })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    if (stories.length === 0) {
      throw StoryErrors.NO_STORIES;
    }

    // Group stories by userId
    const groupedStories: AllStoriesResponse = {};

    for (const story of stories) {
      const userIdStr = story.userId.toString();

      if (!groupedStories[userIdStr]) {
        groupedStories[userIdStr] = {
          userId: userIdStr,
          user: story.userId
            ? {
                _id: (story.userId as any)._id.toString(),
                name: (story.userId as any).name,
                email: (story.userId as any).email,
              }
            : undefined,
          stories: [],
        };
      }

      groupedStories[userIdStr].stories.push(this.mapStoryToResponse(story));
    }

    return groupedStories;
  }

  // Get active stories for a specific user
  static async getUserStories(userId: string): Promise<UserStoriesResponse> {
    const now = new Date();

    // Query only non-expired stories for this user
    const stories = await Story.find({
      userId: new Types.ObjectId(userId),
      expiresAt: { $gt: now },
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    if (stories.length === 0) {
      throw StoryErrors.USER_NO_STORIES;
    }

    // Get user info from first story
    const firstStory = stories[0];
    const userInfo = firstStory.userId
      ? {
          _id: (firstStory.userId as any)._id.toString(),
          name: (firstStory.userId as any).name,
          email: (firstStory.userId as any).email,
        }
      : undefined;

    return {
      userId: userId,
      user: userInfo,
      stories: stories.map((story) => this.mapStoryToResponse(story)),
    };
  }

  // Mark story as viewed - increment view count on first view
  static async viewStory(storyId: string, userId: string): Promise<{ success: boolean; message: string; viewsCount: number }> {
    const now = new Date();

    // Get story and check if expired
    const story = await Story.findById(storyId);
    if (!story) {
      throw StoryErrors.NOT_FOUND;
    }

    if (this.isStoryExpired(story)) {
      throw StoryErrors.EXPIRED;
    }

    // Check if already viewed
    const existingView = await StoryView.findOne({
      storyId: new Types.ObjectId(storyId),
      userId: new Types.ObjectId(userId),
    });

    if (existingView) {
      // Already viewed - don't increment again
      return { success: true, message: "Story already viewed", viewsCount: story.viewsCount };
    }

    // Create new view record and increment view count
    await StoryView.create({
      storyId: new Types.ObjectId(storyId),
      userId: new Types.ObjectId(userId),
      seenAt: now,
    });

    // Increment viewsCount
    story.viewsCount = (story.viewsCount || 0) + 1;
    await story.save();

    // Notify story owner (if not the viewer)
    const storyOwner = story.userId.toString();
    if (storyOwner !== userId) {
      const User = require("../users/user.model").default;
      const viewer = await User.findById(userId).select("name");
      const viewerName = viewer?.name || "Someone";

      await notificationService.createNotification(
        storyOwner,
        userId,
        "STORY_VIEW",
        `${viewerName} viewed your story`,
        storyId
      );
    }

    return { success: true, message: "Story viewed", viewsCount: story.viewsCount };
  }

  // Like a story
  static async likeStory(storyId: string, userId: string): Promise<{ success: boolean; message: string; likesCount: number }> {
    // Get story and check if expired
    const story = await Story.findById(storyId);
    if (!story) {
      throw StoryErrors.NOT_FOUND;
    }

    if (this.isStoryExpired(story)) {
      throw StoryErrors.EXPIRED;
    }

    // Check if already liked
    const existingLike = await StoryLike.findOne({
      storyId: new Types.ObjectId(storyId),
      userId: new Types.ObjectId(userId),
    });

    if (existingLike) {
      throw StoryErrors.ALREADY_LIKED;
    }

    // Create like and increment likesCount
    await StoryLike.create({
      storyId: new Types.ObjectId(storyId),
      userId: new Types.ObjectId(userId),
    });

    story.likesCount = (story.likesCount || 0) + 1;
    await story.save();

    // Notify story owner (if not the liker)
    const storyOwner = story.userId.toString();
    if (storyOwner !== userId) {
      const User = require("../users/user.model").default;
      const liker = await User.findById(userId).select("name");
      const likerName = liker?.name || "Someone";

      await notificationService.createNotification(
        storyOwner,
        userId,
        "STORY_LIKE",
        `${likerName} liked your story`,
        storyId
      );
    }

    return { success: true, message: "Story liked", likesCount: story.likesCount };
  }

  // Unlike a story
  static async unlikeStory(storyId: string, userId: string): Promise<{ success: boolean; message: string; likesCount: number }> {
    // Get story and check if expired
    const story = await Story.findById(storyId);
    if (!story) {
      throw StoryErrors.NOT_FOUND;
    }

    if (this.isStoryExpired(story)) {
      throw StoryErrors.EXPIRED;
    }

    const result = await StoryLike.deleteOne({
      storyId: new Types.ObjectId(storyId),
      userId: new Types.ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      throw StoryErrors.NOT_LIKED;
    }

    // Decrement likesCount
    story.likesCount = Math.max(0, (story.likesCount || 1) - 1);
    await story.save();

    return { success: true, message: "Like removed", likesCount: story.likesCount };
  }

  // Add comment to story
  static async addComment(storyId: string, userId: string, text: string): Promise<StoryCommentResponse> {
    // Validate comment
    const validation = validateComment(text);
    if (!validation.valid) {
      throw StoryErrors.MISSING_COMMENT;
    }

    // Get story and check if expired
    const story = await Story.findById(storyId);
    if (!story) {
      throw StoryErrors.NOT_FOUND;
    }

    if (this.isStoryExpired(story)) {
      throw StoryErrors.EXPIRED;
    }

    // Create comment
    const comment = await StoryComment.create({
      storyId: new Types.ObjectId(storyId),
      userId: new Types.ObjectId(userId),
      text: text.trim(),
    });

    // Populate user info
    const populatedComment = await comment.populate("userId", "name email");

    // Increment commentsCount
    story.commentsCount = (story.commentsCount || 0) + 1;
    await story.save();

    // Notify story owner (if not the commenter)
    const storyOwner = story.userId.toString();
    if (storyOwner !== userId) {
      const commenterName = (populatedComment.userId as any)?.name || "Someone";

      await notificationService.createNotification(
        storyOwner,
        userId,
        "STORY_COMMENT",
        `${commenterName} commented on your story`,
        storyId
      );
    }

    return {
      _id: comment._id.toString(),
      storyId: comment.storyId.toString(),
      userId: comment.userId.toString(),
      text: comment.text,
      createdAt: comment.createdAt,
      user: (populatedComment.userId as any)
        ? {
            _id: (populatedComment.userId as any)._id.toString(),
            name: (populatedComment.userId as any).name,
            email: (populatedComment.userId as any).email,
          }
        : undefined,
    };
  }

  // Get all comments for a story
  static async getComments(storyId: string, limit: number = 20, skip: number = 0): Promise<{ comments: StoryCommentResponse[]; total: number; limit: number; skip: number; hasMore: boolean }> {
    // Get story and check if expired
    const story = await Story.findById(storyId);
    if (!story) {
      throw StoryErrors.NOT_FOUND;
    }

    if (this.isStoryExpired(story)) {
      throw StoryErrors.EXPIRED;
    }

    // Get total count
    const total = await StoryComment.countDocuments({ storyId: new Types.ObjectId(storyId) });

    const comments = await StoryComment.find({ storyId: new Types.ObjectId(storyId) })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const mappedComments = comments.map((comment) => ({
      _id: comment._id.toString(),
      storyId: comment.storyId.toString(),
      userId: comment.userId.toString(),
      text: comment.text,
      createdAt: comment.createdAt,
      user: (comment.userId as any)
        ? {
            _id: (comment.userId as any)._id.toString(),
            name: (comment.userId as any).name,
            email: (comment.userId as any).email,
          }
        : undefined,
    }));

    return {
      comments: mappedComments,
      total,
      limit,
      skip,
      hasMore: skip + limit < total,
    };
  }

  // Delete comment
  static async deleteComment(commentId: string, userId: string): Promise<{ success: boolean; message: string }> {
    const comment = await StoryComment.findById(commentId);
    if (!comment) {
      throw StoryErrors.COMMENT_NOT_FOUND;
    }

    // Verify user is comment author
    if (comment.userId.toString() !== userId) {
      throw StoryErrors.CANNOT_DELETE_COMMENT;
    }

    // Decrement comment count on story
    const story = await Story.findById(comment.storyId);
    if (story) {
      story.commentsCount = Math.max(0, (story.commentsCount || 1) - 1);
      await story.save();
    }

    await StoryComment.deleteOne({ _id: commentId });

    return { success: true, message: "Comment deleted successfully" };
  }

  // Get viewers of a story
  static async getViewers(storyId: string): Promise<{ viewers: StoryViewerResponse[]; total: number }> {
    // Get story
    const story = await Story.findById(storyId);
    if (!story) {
      throw StoryErrors.NOT_FOUND;
    }

    // Get all views with user info
    const views = await StoryView.find({ storyId: new Types.ObjectId(storyId) })
      .populate("userId", "name email")
      .sort({ seenAt: -1 });

    const viewers = views.map((view) => ({
      _id: (view.userId as any)._id.toString(),
      name: (view.userId as any).name || "Unknown",
      email: (view.userId as any).email || "unknown@example.com",
      viewedAt: view.seenAt,
    }));

    return {
      viewers,
      total: viewers.length,
    };
  }
}
