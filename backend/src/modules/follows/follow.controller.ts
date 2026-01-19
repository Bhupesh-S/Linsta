import { Request, Response } from "express";
import FollowService from "./follow.service";

export class FollowController {
  /**
   * POST /api/users/:id/follow
   * Follow a user
   */
  static async followUser(req: Request, res: Response): Promise<void> {
    try {
      const followerId = (req as any).user?.id;
      const { id: followingId } = req.params;

      if (!followerId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      if (!followingId) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      const result = await FollowService.followUser(followerId, followingId);
      res.status(201).json(result);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Failed to follow user";
      res.status(statusCode).json({ error: message });
    }
  }

  /**
   * POST /api/users/:id/unfollow
   * Unfollow a user
   */
  static async unfollowUser(req: Request, res: Response): Promise<void> {
    try {
      const followerId = (req as any).user?.id;
      const { id: followingId } = req.params;

      if (!followerId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      if (!followingId) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      const result = await FollowService.unfollowUser(followerId, followingId);
      res.status(200).json(result);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Failed to unfollow user";
      res.status(statusCode).json({ error: message });
    }
  }

  /**
   * GET /api/users/:id/followers
   * Get user's followers
   */
  static async getFollowers(req: Request, res: Response): Promise<void> {
    try {
      const { id: userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

      if (!userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      const result = await FollowService.getFollowers(userId, page, limit);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch followers" });
    }
  }

  /**
   * GET /api/users/:id/following
   * Get user's following list
   */
  static async getFollowing(req: Request, res: Response): Promise<void> {
    try {
      const { id: userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

      if (!userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      const result = await FollowService.getFollowing(userId, page, limit);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch following list" });
    }
  }

  /**
   * GET /api/users/:id/follow-counts
   * Get follow counts for a user
   */
  static async getFollowCounts(req: Request, res: Response): Promise<void> {
    try {
      const { id: userId } = req.params;

      if (!userId) {
        res.status(400).json({ error: "User ID is required" });
        return;
      }

      const result = await FollowService.getFollowCounts(userId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch follow counts" });
    }
  }
}

export default FollowController;
