// Post API controllers
import { Request, Response } from "express";
import { PostService } from "./post.service";
import { CreatePostRequest, CommentRequest } from "./post.types";
import { PostError, PostErrors } from "./post.errors";

export class PostController {
  // POST /api/posts - Create post
  static async createPost(req: Request, res: Response): Promise<void> {
    try {
      const { caption, eventId, media } = req.body as CreatePostRequest;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      if (!caption) {
        res.status(400).json({ error: PostErrors.MISSING_CAPTION.message });
        return;
      }

      const post = await PostService.createPost({ caption, eventId, media }, userId);
      res.status(201).json(post);
    } catch (error: any) {
      if (error instanceof PostError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message || "Internal server error" });
      }
    }
  }

  // GET /api/posts - Get feed with pagination, search & filters
  static async getFeed(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      const limit = Math.min(Number(req.query.limit) || 20, 100);
      const skip = Number(req.query.skip) || 0;
      const search = req.query.search as string | undefined;
      const eventId = req.query.eventId as string | undefined;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const result = await PostService.getFeed(userId, limit, skip, search, eventId);
      res.status(200).json({
        data: result.posts,
        pagination: {
          total: result.total,
          limit: result.limit,
          skip: result.skip,
          hasMore: result.hasMore,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Internal server error" });
    }
  }

  // GET /api/posts/:id - Get single post
  static async getPost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const post = await PostService.getPostById(id, userId);
      res.status(200).json(post);
    } catch (error: any) {
      if (error instanceof PostError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message || "Internal server error" });
      }
    }
  }

  // DELETE /api/posts/:id - Delete post (owner only)
  static async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const result = await PostService.deletePost(id, userId);
      res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof PostError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message || "Internal server error" });
      }
    }
  }

  // POST /api/posts/:id/like - Like a post (prevent duplicates)
  static async likePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const result = await PostService.likePost(id, userId);
      res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof PostError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message || "Internal server error" });
      }
    }
  }

  // DELETE /api/posts/:id/like - Unlike a post
  static async unlikePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const result = await PostService.unlikePost(id, userId);
      res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof PostError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message || "Internal server error" });
      }
    }
  }

  // POST /api/posts/:id/comment - Add comment with validation
  static async addComment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { text } = req.body as CommentRequest;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      if (!text) {
        res.status(400).json({ error: PostErrors.MISSING_COMMENT_TEXT.message });
        return;
      }

      const comment = await PostService.addComment(id, userId, text);
      res.status(201).json(comment);
    } catch (error: any) {
      if (error instanceof PostError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message || "Internal server error" });
      }
    }
  }

  // GET /api/posts/:id/comments - Get all comments with pagination
  static async getComments(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const limit = Math.min(Number(req.query.limit) || 20, 100);
      const skip = Number(req.query.skip) || 0;

      const result = await PostService.getComments(id, limit, skip);
      res.status(200).json({
        data: result.comments,
        pagination: {
          total: result.total,
          limit: result.limit,
          skip: result.skip,
          hasMore: result.hasMore,
        },
      });
    } catch (error: any) {
      if (error instanceof PostError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message || "Internal server error" });
      }
    }
  }

  // DELETE /api/posts/:postId/comments/:commentId - Delete comment (owner only)
  static async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const { commentId } = req.params;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const result = await PostService.deleteComment(commentId, userId);
      res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof PostError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message || "Internal server error" });
      }
    }
  }
}
