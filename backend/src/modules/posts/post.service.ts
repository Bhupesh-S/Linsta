// Post service - Business logic
import { Post, IPost } from "./post.model";
import { PostMedia, IPostMedia } from "./post-media.model";
import { Like, ILike } from "./like.model";
import { Comment, IComment } from "./comment.model";
import { Types } from "mongoose";
import { CreatePostRequest, PostResponse, CommentResponse } from "./post.types";
import { PostErrors } from "./post.errors";
import { validatePostInput, validateCommentText } from "./post.validators";

// Import services safely with fallback
let notificationService: any;
let analyticsService: any;

try {
  notificationService = require("../notifications/notification.service").default;
} catch (e) {
  console.warn("Notification service not available");
  notificationService = { createNotification: async () => {} };
}

try {
  analyticsService = require("../analytics/analytics.service").default;
} catch (e) {
  console.warn("Analytics service not available");
  analyticsService = {
    trackPostLike: async () => {},
    trackPostComment: async () => {},
    logUserActivity: async () => {},
  };
}

export class PostService {
  // Create a new post with validation
  static async createPost(
    data: CreatePostRequest,
    userId: string
  ): Promise<PostResponse> {
    // Validate caption
    const validation = validatePostInput(data);
    if (!validation.valid) {
      throw PostErrors.INVALID_INPUT;
    }

    // Create post
    const post = await Post.create({
      authorId: new Types.ObjectId(userId),
      caption: data.caption.trim(),
      eventId: data.eventId ? new Types.ObjectId(data.eventId) : undefined,
    });

    // Add media if provided
    if (data.media && data.media.length > 0) {
      const mediaDocuments = data.media.map((m) => ({
        postId: post._id,
        mediaType: m.type,
        mediaUrl: m.url,
      }));
      await PostMedia.insertMany(mediaDocuments);
    }

    // Return populated post
    return this.getPostById(post._id.toString(), userId);
  }

  // Get feed with latest posts (with pagination, search, and filters)
  static async getFeed(
    userId: string,
    limit: number = 20,
    skip: number = 0,
    search?: string,
    eventId?: string
  ): Promise<{ posts: PostResponse[]; total: number; limit: number; skip: number; hasMore: boolean }> {
    // Build query object
    const query: any = {};

    // Search by caption (case-insensitive regex)
    if (search && search.trim()) {
      query.caption = { $regex: search.trim(), $options: "i" };
    }

    // Filter by event
    if (eventId && eventId.trim()) {
      query.eventId = new Types.ObjectId(eventId);
    }

    // Get total count for pagination metadata
    const total = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .populate("authorId", "name email")
      .populate("eventId", "title")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    // Fetch likes and comments for each post
    const postsWithCounts: PostResponse[] = await Promise.all(
      posts.map(async (post) => {
        const media = await PostMedia.find({ postId: post._id });
        const likeCount = await Like.countDocuments({ postId: post._id });
        const commentCount = await Comment.countDocuments({ postId: post._id });
        const userLiked = await Like.findOne({ postId: post._id, userId: new Types.ObjectId(userId) });

        return {
          _id: post._id.toString(),
          authorId: post.authorId.toString(),
          eventId: post.eventId ? post.eventId.toString() : undefined,
          caption: post.caption,
          media: media.map((m) => ({
            _id: m._id.toString(),
            postId: m.postId.toString(),
            mediaType: m.mediaType,
            mediaUrl: m.mediaUrl,
          })),
          author: post.authorId
            ? {
                _id: (post.authorId as any)._id.toString(),
                name: (post.authorId as any).name,
                email: (post.authorId as any).email,
              }
            : undefined,
          event: post.eventId
            ? {
                _id: (post.eventId as any)._id.toString(),
                title: (post.eventId as any).title,
              }
            : undefined,
          likeCount,
          commentCount,
          userLiked: !!userLiked,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        };
      })
    );

    return {
      posts: postsWithCounts,
      total,
      limit,
      skip,
      hasMore: skip + limit < total,
    };
  }

  // Get single post by ID
  static async getPostById(postId: string, userId?: string): Promise<PostResponse> {
    const post = await Post.findById(postId)
      .populate("authorId", "name email")
      .populate("eventId", "title");

    if (!post) {
      throw PostErrors.NOT_FOUND;
    }

    const media = await PostMedia.find({ postId: new Types.ObjectId(postId) });
    const likeCount = await Like.countDocuments({ postId: new Types.ObjectId(postId) });
    const commentCount = await Comment.countDocuments({ postId: new Types.ObjectId(postId) });
    const userLiked = userId
      ? await Like.findOne({ postId: new Types.ObjectId(postId), userId: new Types.ObjectId(userId) })
      : null;

    return {
      _id: post._id.toString(),
      authorId: post.authorId.toString(),
      eventId: post.eventId ? post.eventId.toString() : undefined,
      caption: post.caption,
      media: media.map((m) => ({
        _id: m._id.toString(),
        postId: m.postId.toString(),
        mediaType: m.mediaType,
        mediaUrl: m.mediaUrl,
      })),
      author: post.authorId
        ? {
            _id: (post.authorId as any)._id.toString(),
            name: (post.authorId as any).name,
            email: (post.authorId as any).email,
          }
        : undefined,
      event: post.eventId
        ? {
            _id: (post.eventId as any)._id.toString(),
            title: (post.eventId as any).title,
          }
        : undefined,
      likeCount,
      commentCount,
      userLiked: !!userLiked,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  // Like a post - prevent duplicates with standardized errors
  static async likePost(postId: string, userId: string): Promise<{ success: boolean; message: string }> {
    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      throw PostErrors.NOT_FOUND;
    }

    // Check if already liked
    const existingLike = await Like.findOne({
      postId: new Types.ObjectId(postId),
      userId: new Types.ObjectId(userId),
    });

    if (existingLike) {
      throw PostErrors.ALREADY_LIKED;
    }

    // Create like
    await Like.create({
      postId: new Types.ObjectId(postId),
      userId: new Types.ObjectId(userId),
    });

    // Track post like analytics asynchronously
    analyticsService.trackPostLike(postId).catch((err: any) => {
      console.error("Failed to track post like:", err);
    });

    // Log user activity
    analyticsService.logUserActivity(userId, "LIKE_POST", postId).catch((err: any) => {
      console.error("Failed to log like activity:", err);
    });

    // Notify post author (if not the liker)
    const author = post.authorId.toString();
    if (author !== userId) {
      const User = require("../users/user.model").default;
      const user = await User.findById(userId).select("name");
      const userName = user?.name || "Someone";

      await notificationService.createNotification(
        author,
        userId,
        "LIKE",
        `${userName} liked your post`,
        postId
      );
    }

    return { success: true, message: "Post liked successfully" };
  }

  // Unlike a post
  static async unlikePost(postId: string, userId: string): Promise<{ success: boolean; message: string }> {
    const result = await Like.deleteOne({
      postId: new Types.ObjectId(postId),
      userId: new Types.ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      throw PostErrors.NOT_LIKED;
    }

    return { success: true, message: "Like removed successfully" };
  }

  // Add comment to post with validation
  static async addComment(postId: string, userId: string, text: string): Promise<CommentResponse> {
    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      throw PostErrors.NOT_FOUND;
    }

    // Validate comment text
    const validation = validateCommentText(text);
    if (!validation.valid) {
      throw PostErrors.INVALID_INPUT;
    }

    // Create comment
    const comment = await Comment.create({
      postId: new Types.ObjectId(postId),
      userId: new Types.ObjectId(userId),
      text: text.trim(),
    });

    // Populate user info
    const populatedComment = await comment.populate("userId", "name email");

    // Track post comment analytics asynchronously
    analyticsService.trackPostComment(postId).catch((err: any) => {
      console.error("Failed to track post comment:", err);
    });

    // Log user activity
    analyticsService.logUserActivity(userId, "COMMENT_POST", postId).catch((err: any) => {
      console.error("Failed to log comment activity:", err);
    });

    // Notify post author (if not the commenter)
    const author = post.authorId.toString();
    if (author !== userId) {
      const commenterName = (populatedComment.userId as any)?.name || "Someone";
      await notificationService.createNotification(
        author,
        userId,
        "COMMENT",
        `${commenterName} commented on your post`,
        postId
      );
    }

    return {
      _id: comment._id.toString(),
      postId: comment.postId.toString(),
      userId: comment.userId.toString(),
      text: comment.text,
      user: (populatedComment.userId as any)
        ? {
            _id: (populatedComment.userId as any)._id.toString(),
            name: (populatedComment.userId as any).name,
            email: (populatedComment.userId as any).email,
          }
        : undefined,
      createdAt: comment.createdAt,
    };
  }

  // Get all comments for a post with pagination
  static async getComments(postId: string, limit: number = 20, skip: number = 0): Promise<{ comments: CommentResponse[]; total: number; limit: number; skip: number; hasMore: boolean }> {
    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      throw PostErrors.NOT_FOUND;
    }

    // Get total count
    const total = await Comment.countDocuments({ postId: new Types.ObjectId(postId) });

    const comments = await Comment.find({ postId: new Types.ObjectId(postId) })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const mappedComments = comments.map((comment) => ({
      _id: comment._id.toString(),
      postId: comment.postId.toString(),
      userId: comment.userId.toString(),
      text: comment.text,
      user: (comment.userId as any)
        ? {
            _id: (comment.userId as any)._id.toString(),
            name: (comment.userId as any).name,
            email: (comment.userId as any).email,
          }
        : undefined,
      createdAt: comment.createdAt,
    }));

    return {
      comments: mappedComments,
      total,
      limit,
      skip,
      hasMore: skip + limit < total,
    };
  }

  // Delete comment - ensure only owner can delete
  static async deleteComment(commentId: string, userId: string): Promise<{ success: boolean; message: string }> {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw PostErrors.COMMENT_NOT_FOUND;
    }

    // Verify user is comment author
    if (comment.userId.toString() !== userId) {
      throw PostErrors.CANNOT_DELETE_COMMENT;
    }

    await Comment.deleteOne({ _id: commentId });

    return { success: true, message: "Comment deleted successfully" };
  }

  // Delete post - ensure only owner can delete + cleanup likes/comments
  static async deletePost(postId: string, userId: string): Promise<{ success: boolean; message: string }> {
    const post = await Post.findById(postId);
    if (!post) {
      throw PostErrors.NOT_FOUND;
    }

    // Verify user is post author
    if (post.authorId.toString() !== userId) {
      throw PostErrors.CANNOT_DELETE_POST;
    }

    // Delete post and all related data (likes, comments, media)
    await Promise.all([
      Post.deleteOne({ _id: postId }),
      PostMedia.deleteMany({ postId: new Types.ObjectId(postId) }),
      Like.deleteMany({ postId: new Types.ObjectId(postId) }),
      Comment.deleteMany({ postId: new Types.ObjectId(postId) }),
    ]);

    return { success: true, message: "Post deleted successfully" };
  }

  // Helper: Get author name by user ID
  private static async getAuthorName(userId: string): Promise<string> {
    const User = require("../users/user.model").default;
    const user = await User.findById(userId).select("name");
    return user?.name || "Someone";
  }
}
