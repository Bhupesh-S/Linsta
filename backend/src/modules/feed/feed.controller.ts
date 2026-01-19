import { Request, Response } from "express";
import FeedService from "./feed.service";

export class FeedController {
  /**
   * GET /api/feed
   * Get personalized feed for logged-in user
   */
  static async getFeed(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const result = await FeedService.getFeed(userId, page, limit);
      res.status(200).json(result);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Failed to fetch feed";
      res.status(statusCode).json({ error: message });
    }
  }

  /**
   * GET /api/feed/explore
   * Get explore feed (all posts for discovery)
   */
  static async getExploreFeed(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const result = await FeedService.getExploreFeed(userId, page, limit);
      res.status(200).json(result);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Failed to fetch explore feed";
      res.status(statusCode).json({ error: message });
    }
  }
}

export default FeedController;
