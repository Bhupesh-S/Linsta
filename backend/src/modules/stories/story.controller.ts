// Story API controllers
import { Request, Response } from "express";
import { StoryService } from "./story.service";
import { CreateStoryRequest } from "./story.types";
import { StoryError, StoryErrors } from "./story.errors";

export class StoryController {
  // POST /api/stories - Create a new story
  static async createStory(req: Request, res: Response): Promise<void> {
    try {
      const { mediaType, mediaUrl, caption } = req.body as CreateStoryRequest;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      if (!mediaType) {
        res.status(400).json({ error: StoryErrors.INVALID_MEDIA_TYPE.message });
        return;
      }

      if (!mediaUrl) {
        res.status(400).json({ error: StoryErrors.MISSING_MEDIA_URL.message });
        return;
      }

      const story = await StoryService.createStory(userId, { mediaType, mediaUrl, caption });
      res.status(201).json(story);
    } catch (error: any) {
      if (error instanceof StoryError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message || "Internal server error" });
      }
    }
  }

  // GET /api/stories - Get all active stories grouped by user
  static async getAllStories(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const stories = await StoryService.getAllStories();
      res.status(200).json({
        data: stories,
        count: Object.keys(stories).length,
      });
    } catch (error: any) {
      if (error instanceof StoryError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message || "Internal server error" });
      }
    }
  }

  // GET /api/stories/user/:userId - Get stories for a specific user
  static async getUserStories(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const authUserId = req.userId;

      if (!authUserId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const userStories = await StoryService.getUserStories(userId);
      res.status(200).json(userStories);
    } catch (error: any) {
      if (error instanceof StoryError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message || "Internal server error" });
      }
    }
  }

  // POST /api/stories/:id/view - Mark story as viewed
  static async viewStory(req: Request, res: Response): Promise<void> {
    try {
      const { id: storyId } = req.params;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const result = await StoryService.viewStory(storyId, userId);
      res.status(200).json({
        success: true,
        message: result.message,
        data: { viewsCount: result.viewsCount },
      });
    } catch (error: any) {
      if (error instanceof StoryError) {
        res.status(error.statusCode).json({ error: error.message });
      } else if (error === StoryErrors.EXPIRED) {
        res.status(410).json({ error: "Story has expired" });
      } else {
        res.status(500).json({ error: error.message || "Internal server error" });
      }
    }
  }

  // POST /api/stories/:id/like - Like a story
  static async likeStory(req: Request, res: Response): Promise<void> {
    try {
      const { id: storyId } = req.params;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const result = await StoryService.likeStory(storyId, userId);
      res.status(201).json({
        success: true,
        message: result.message,
        data: { likesCount: result.likesCount },
      });
    } catch (error: any) {
      if (error instanceof StoryError) {
        res.status(error.statusCode).json({ error: error.message });
      } else if (error === StoryErrors.ALREADY_LIKED) {
        res.status(409).json({ error: "You already liked this story" });
      } else if (error === StoryErrors.EXPIRED) {
        res.status(410).json({ error: "Story has expired" });
      } else {
        res.status(500).json({ error: error.message || "Internal server error" });
      }
    }
  }

  // DELETE /api/stories/:id/like - Unlike a story
  static async unlikeStory(req: Request, res: Response): Promise<void> {
    try {
      const { id: storyId } = req.params;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const result = await StoryService.unlikeStory(storyId, userId);
      res.status(200).json({
        success: true,
        message: result.message,
        data: { likesCount: result.likesCount },
      });
    } catch (error: any) {
      if (error instanceof StoryError) {
        res.status(error.statusCode).json({ error: error.message });
      } else if (error === StoryErrors.NOT_LIKED) {
        res.status(404).json({ error: "You haven't liked this story" });
      } else if (error === StoryErrors.EXPIRED) {
        res.status(410).json({ error: "Story has expired" });
      } else {
        res.status(500).json({ error: error.message || "Internal server error" });
      }
    }
  }

  // POST /api/stories/:id/comment - Add comment to story
  static async addComment(req: Request, res: Response): Promise<void> {
    try {
      const { id: storyId } = req.params;
      const { text } = req.body;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      if (!text) {
        res.status(400).json({ error: "Comment text is required" });
        return;
      }

      const comment = await StoryService.addComment(storyId, userId, text);
      res.status(201).json({
        success: true,
        message: "Comment added successfully",
        data: comment,
      });
    } catch (error: any) {
      if (error instanceof StoryError) {
        res.status(error.statusCode).json({ error: error.message });
      } else if (error === StoryErrors.EXPIRED) {
        res.status(410).json({ error: "Story has expired" });
      } else if (error === StoryErrors.MISSING_COMMENT) {
        res.status(400).json({ error: "Comment text is required (max 300 characters)" });
      } else {
        res.status(500).json({ error: error.message || "Internal server error" });
      }
    }
  }

  // GET /api/stories/:id/comments - Get all comments for a story
  static async getComments(req: Request, res: Response): Promise<void> {
    try {
      const { id: storyId } = req.params;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const skip = parseInt(req.query.skip as string) || 0;

      const result = await StoryService.getComments(storyId, limit, skip);
      res.status(200).json({
        success: true,
        message: "Comments retrieved successfully",
        data: result,
      });
    } catch (error: any) {
      if (error instanceof StoryError) {
        res.status(error.statusCode).json({ error: error.message });
      } else if (error === StoryErrors.EXPIRED) {
        res.status(410).json({ error: "Story has expired" });
      } else {
        res.status(500).json({ error: error.message || "Internal server error" });
      }
    }
  }

  // DELETE /api/stories/comment/:commentId - Delete comment
  static async deleteComment(req: Request, res: Response): Promise<void> {
    try {
      const { commentId } = req.params;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const result = await StoryService.deleteComment(commentId, userId);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      if (error instanceof StoryError) {
        res.status(error.statusCode).json({ error: error.message });
      } else if (error === StoryErrors.COMMENT_NOT_FOUND) {
        res.status(404).json({ error: "Comment not found" });
      } else if (error === StoryErrors.CANNOT_DELETE_COMMENT) {
        res.status(403).json({ error: "You can only delete your own comments" });
      } else {
        res.status(500).json({ error: error.message || "Internal server error" });
      }
    }
  }

  // GET /api/stories/:id/viewers - Get viewers of a story
  static async getViewers(req: Request, res: Response): Promise<void> {
    try {
      const { id: storyId } = req.params;

      const result = await StoryService.getViewers(storyId);
      res.status(200).json({
        success: true,
        message: "Viewers retrieved successfully",
        data: result,
      });
    } catch (error: any) {
      if (error instanceof StoryError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message || "Internal server error" });
      }
    }
  }
}
