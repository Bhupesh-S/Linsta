import { Request, Response } from "express";
import SavedService from "./saved.service";

export class SavedController {
  /**
   * POST /api/posts/:id/save
   * Save a post
   */
  static async savePost(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id: postId } = req.params;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      if (!postId) {
        res.status(400).json({ error: "Post ID is required" });
        return;
      }

      const result = await SavedService.savePost(userId, postId);
      res.status(201).json(result);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Failed to save post";
      res.status(statusCode).json({ error: message });
    }
  }

  /**
   * DELETE /api/posts/:id/save
   * Unsave a post
   */
  static async unsavePost(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id: postId } = req.params;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      if (!postId) {
        res.status(400).json({ error: "Post ID is required" });
        return;
      }

      const result = await SavedService.unsavePost(userId, postId);
      res.status(200).json(result);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Failed to unsave post";
      res.status(statusCode).json({ error: message });
    }
  }

  /**
   * GET /api/users/me/saved-posts
   * Get all saved posts for authenticated user
   */
  static async getSavedPosts(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const result = await SavedService.getSavedPosts(userId, page, limit);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch saved posts" });
    }
  }

  /**
   * POST /api/events/:id/save
   * Save an event
   */
  static async saveEvent(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id: eventId } = req.params;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      if (!eventId) {
        res.status(400).json({ error: "Event ID is required" });
        return;
      }

      const result = await SavedService.saveEvent(userId, eventId);
      res.status(201).json(result);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Failed to save event";
      res.status(statusCode).json({ error: message });
    }
  }

  /**
   * DELETE /api/events/:id/save
   * Unsave an event
   */
  static async unsaveEvent(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id: eventId } = req.params;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      if (!eventId) {
        res.status(400).json({ error: "Event ID is required" });
        return;
      }

      const result = await SavedService.unsaveEvent(userId, eventId);
      res.status(200).json(result);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Failed to unsave event";
      res.status(statusCode).json({ error: message });
    }
  }

  /**
   * GET /api/users/me/saved-events
   * Get all saved events for authenticated user
   */
  static async getSavedEvents(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const result = await SavedService.getSavedEvents(userId, page, limit);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch saved events" });
    }
  }
}

export default SavedController;
