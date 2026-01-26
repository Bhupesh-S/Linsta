import { Types } from 'mongoose';
import { StoryHighlight } from './storyhighlight.model';
import { Story } from './story.model';

export class StoryHighlightService {
  static async createHighlight(userId: string, title: string): Promise<any> {
    try {
      const highlight = await StoryHighlight.create({
        userId: new Types.ObjectId(userId),
        title,
        stories: [],
      });

      return { success: true, message: 'Highlight created successfully', data: highlight };
    } catch (error: any) {
      throw error;
    }
  }

  static async addStoryToHighlight(userId: string, highlightId: string, storyId: string): Promise<any> {
    try {
      const highlight = await StoryHighlight.findOne({
        _id: new Types.ObjectId(highlightId),
        userId: new Types.ObjectId(userId),
      });

      if (!highlight) {
        throw { statusCode: 404, message: 'Highlight not found' };
      }

      // Check if story already exists in highlight
      if (highlight.stories.includes(new Types.ObjectId(storyId))) {
        throw { statusCode: 409, message: 'Story already in highlight' };
      }

      // Verify story exists and is owned by user
      const story = await Story.findOne({
        _id: new Types.ObjectId(storyId),
        userId: new Types.ObjectId(userId),
      });

      if (!story) {
        throw { statusCode: 404, message: 'Story not found' };
      }

      highlight.stories.push(new Types.ObjectId(storyId));

      // Update cover image if not set
      if (!highlight.coverImageUrl) {
        highlight.coverImageUrl = story.mediaUrl;
      }

      await highlight.save();

      return { success: true, message: 'Story added to highlight successfully', data: highlight };
    } catch (error: any) {
      throw error;
    }
  }

  static async removeStoryFromHighlight(userId: string, highlightId: string, storyId: string): Promise<any> {
    try {
      const highlight = await StoryHighlight.findOne({
        _id: new Types.ObjectId(highlightId),
        userId: new Types.ObjectId(userId),
      });

      if (!highlight) {
        throw { statusCode: 404, message: 'Highlight not found' };
      }

      highlight.stories = highlight.stories.filter(
        id => !id.equals(new Types.ObjectId(storyId))
      );

      await highlight.save();

      return { success: true, message: 'Story removed from highlight successfully' };
    } catch (error: any) {
      throw error;
    }
  }

  static async getHighlights(userId: string, limit: number = 100, skip: number = 0): Promise<any> {
    try {
      const highlights = await StoryHighlight.find({
        userId: new Types.ObjectId(userId),
      })
        .populate('stories', 'mediaUrl caption')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

      const total = await StoryHighlight.countDocuments({
        userId: new Types.ObjectId(userId),
      });

      return {
        data: highlights,
        pagination: { total, limit, skip, hasMore: skip + limit < total },
      };
    } catch (error: any) {
      throw error;
    }
  }

  static async getHighlight(highlightId: string): Promise<any> {
    try {
      const highlight = await StoryHighlight.findById(highlightId)
        .populate('stories', 'mediaUrl caption mediaType')
        .lean();

      if (!highlight) {
        throw { statusCode: 404, message: 'Highlight not found' };
      }

      return highlight;
    } catch (error: any) {
      throw error;
    }
  }

  static async updateHighlight(userId: string, highlightId: string, data: { title?: string; coverImageUrl?: string }): Promise<any> {
    try {
      const highlight = await StoryHighlight.findOne({
        _id: new Types.ObjectId(highlightId),
        userId: new Types.ObjectId(userId),
      });

      if (!highlight) {
        throw { statusCode: 404, message: 'Highlight not found' };
      }

      if (data.title) highlight.title = data.title;
      if (data.coverImageUrl) highlight.coverImageUrl = data.coverImageUrl;

      await highlight.save();

      return { success: true, message: 'Highlight updated successfully', data: highlight };
    } catch (error: any) {
      throw error;
    }
  }

  static async deleteHighlight(userId: string, highlightId: string): Promise<any> {
    try {
      const result = await StoryHighlight.deleteOne({
        _id: new Types.ObjectId(highlightId),
        userId: new Types.ObjectId(userId),
      });

      if (result.deletedCount === 0) {
        throw { statusCode: 404, message: 'Highlight not found' };
      }

      return { success: true, message: 'Highlight deleted successfully' };
    } catch (error: any) {
      throw error;
    }
  }
}
