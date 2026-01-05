// Post API controllers
import { Request, Response } from "express";
import { PostService } from "./post.service";
import { CreatePostRequest, CommentRequest } from "./post.types";

export class PostController {
  // POST /api/posts - Create post
  static async createPost(req: Request, res: Response): Promise<void> {
    try {
      const { caption, eventId, media } = req.body as CreatePostRequest;
      const userId = req.userId;

      // Validation
      if (!caption) {
        res.status(400).json({ error: "Caption is required" });
        return;
      }

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const post = await PostService.createPost({ caption, eventId, media }, userId);
      res.status(201).json(post);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/posts - Get feed with optional search & filters
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

      const posts = await PostService.getFeed(userId, limit, skip, search, eventId);
      res.status(200).json(posts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
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
      res.status(404).json({ error: error.message });
    }
  }

  // DELETE /api/posts/:id - Delete post
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
      if (error.message.includes("Unauthorized")) {
        res.status(403).json({ error: error.message });
      } else if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  // POST /api/posts/:id/like - Like a post
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
      if (error.message.includes("already liked")) {
        res.status(409).json({ error: error.message });
      } else if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
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
      res.status(404).json({ error: error.message });
    }
  }

  // POST /api/posts/:id/comment - Add comment
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
        res.status(400).json({ error: "Comment text is required" });
        return;
      }

      const comment = await PostService.addComment(id, userId, text);
      res.status(201).json(comment);
    } catch (error: any) {
      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  // GET /api/posts/:id/comments - Get all comments
  static async getComments(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const limit = Math.min(Number(req.query.limit) || 20, 100);
      const skip = Number(req.query.skip) || 0;

      const comments = await PostService.getComments(id, limit, skip);
      res.status(200).json(comments);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  // DELETE /api/posts/:postId/comments/:commentId - Delete comment
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
      if (error.message.includes("Unauthorized")) {
        res.status(403).json({ error: error.message });
      } else if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}
