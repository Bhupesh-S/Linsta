// Network controller - maps HTTP requests to service
import { Request, Response } from "express";
import { NetworkService } from "./network.service";

export class NetworkController {
  static async getSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }
      const data = await NetworkService.getSuggestions(userId);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getConnections(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const data = await NetworkService.getConnections(userId);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getFollowers(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const data = await NetworkService.getFollowers(userId);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getFollowing(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const data = await NetworkService.getFollowing(userId);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async searchUsers(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const query = (req.query.query as string) || "";
      const filtersRaw = (req.query.filters as string) || "";
      let filters: any = {};
      if (filtersRaw) {
        try {
          filters = JSON.parse(filtersRaw);
        } catch {
          filters = {};
        }
      }

      const data = await NetworkService.searchUsers(userId, query, filters);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async sendConnectionRequest(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }
      const { userId: targetUserId, message } = req.body;
      if (!targetUserId) {
        res.status(400).json({ error: "userId is required" });
        return;
      }

      const result = await NetworkService.sendConnectionRequest(
        userId,
        targetUserId,
        message
      );
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async respondToRequest(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }
      const { requestId, action } = req.body as {
        requestId?: string;
        action?: "accept" | "reject";
      };

      if (!requestId || !action) {
        res.status(400).json({ error: "requestId and action are required" });
        return;
      }

      const result = await NetworkService.respondToRequest(userId, requestId, action);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async removeConnection(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }
      const { userId: targetUserId } = req.params as { userId?: string };
      if (!targetUserId) {
        res.status(400).json({ error: "userId is required" });
        return;
      }

      const result = await NetworkService.removeConnection(userId, targetUserId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCommunities(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const data = await NetworkService.getCommunities(userId);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async joinCommunity(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }
      const { communityId } = req.body as { communityId?: string };
      if (!communityId) {
        res.status(400).json({ error: "communityId is required" });
        return;
      }

      const result = await NetworkService.joinCommunity(userId, communityId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async leaveCommunity(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }
      const { communityId } = req.body as { communityId?: string };
      if (!communityId) {
        res.status(400).json({ error: "communityId is required" });
        return;
      }

      const result = await NetworkService.leaveCommunity(userId, communityId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async checkMessagingPermission(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }
      const { userId: targetUserId } = req.params as { userId?: string };
      if (!targetUserId) {
        res.status(400).json({ error: "userId is required" });
        return;
      }

      const result = await NetworkService.checkMessagingPermission(userId, targetUserId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getConnectionRequests(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const requests = await NetworkService.getConnectionRequests(userId);
      res.status(200).json({ requests });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async followUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }
      const { userId: targetUserId } = req.params as { userId?: string };
      if (!targetUserId) {
        res.status(400).json({ error: "userId is required" });
        return;
      }

      const result = await NetworkService.followUser(userId, targetUserId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async unfollowUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }
      const { userId: targetUserId } = req.params as { userId?: string };
      if (!targetUserId) {
        res.status(400).json({ error: "userId is required" });
        return;
      }

      const result = await NetworkService.unfollowUser(userId, targetUserId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async blockUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }
      const { userId: targetUserId } = req.body as { userId?: string };
      if (!targetUserId) {
        res.status(400).json({ error: "userId is required" });
        return;
      }

      const result = await NetworkService.blockUser(userId, targetUserId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async unblockUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }
      const { userId: targetUserId } = req.params as { userId?: string };
      if (!targetUserId) {
        res.status(400).json({ error: "userId is required" });
        return;
      }

      const result = await NetworkService.unblockUser(userId, targetUserId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const stats = await NetworkService.getNetworkStats(userId);
      res.status(200).json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUserStats(req: Request, res: Response): Promise<void> {
    try {
      const requesterId = req.userId;
      if (!requesterId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const { userId } = req.params as { userId?: string };
      if (!userId) {
        res.status(400).json({ error: "userId is required" });
        return;
      }

      const stats = await NetworkService.getNetworkStats(userId);
      res.status(200).json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
