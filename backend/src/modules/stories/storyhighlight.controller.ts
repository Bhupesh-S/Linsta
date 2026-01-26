import { Request, Response } from 'express';
import { StoryHighlightService } from './storyhighlight.service';

export class StoryHighlightController {
  static async createHighlight(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { title } = req.body;

      if (!title) {
        return res.status(400).json({
          success: false,
          message: 'Title is required',
        });
      }

      const result = await StoryHighlightService.createHighlight(userId, title);

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to create highlight',
      });
    }
  }

  static async addStoryToHighlight(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { highlightId, storyId } = req.body;

      if (!highlightId || !storyId) {
        return res.status(400).json({
          success: false,
          message: 'Highlight ID and Story ID are required',
        });
      }

      const result = await StoryHighlightService.addStoryToHighlight(userId, highlightId, storyId);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to add story to highlight',
      });
    }
  }

  static async removeStoryFromHighlight(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { highlightId, storyId } = req.params;

      const result = await StoryHighlightService.removeStoryFromHighlight(userId, highlightId, storyId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to remove story from highlight',
      });
    }
  }

  static async getHighlights(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 100);
      const skip = parseInt(req.query.skip as string) || 0;

      const result = await StoryHighlightService.getHighlights(userId, limit, skip);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to fetch highlights',
      });
    }
  }

  static async getHighlight(req: Request, res: Response) {
    try {
      const { highlightId } = req.params;

      const highlight = await StoryHighlightService.getHighlight(highlightId);

      res.status(200).json({
        success: true,
        data: highlight,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to fetch highlight',
      });
    }
  }

  static async updateHighlight(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { highlightId } = req.params;
      const { title, coverImageUrl } = req.body;

      const result = await StoryHighlightService.updateHighlight(userId, highlightId, {
        title,
        coverImageUrl,
      });

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to update highlight',
      });
    }
  }

  static async deleteHighlight(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { highlightId } = req.params;

      const result = await StoryHighlightService.deleteHighlight(userId, highlightId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to delete highlight',
      });
    }
  }
}
