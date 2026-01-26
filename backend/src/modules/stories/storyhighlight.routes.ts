import { Router } from 'express';
import { StoryHighlightController } from './storyhighlight.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// Create highlight (auth required)
router.post('/highlights', authMiddleware, StoryHighlightController.createHighlight);

// Add story to highlight (auth required)
router.post('/highlights/stories', authMiddleware, StoryHighlightController.addStoryToHighlight);

// Remove story from highlight (auth required)
router.delete('/highlights/:highlightId/stories/:storyId', authMiddleware, StoryHighlightController.removeStoryFromHighlight);

// Get user's highlights (public)
router.get('/highlights/:userId', StoryHighlightController.getHighlights);

// Get specific highlight (public)
router.get('/highlights/details/:highlightId', StoryHighlightController.getHighlight);

// Update highlight (auth required)
router.put('/highlights/:highlightId', authMiddleware, StoryHighlightController.updateHighlight);

// Delete highlight (auth required)
router.delete('/highlights/:highlightId', authMiddleware, StoryHighlightController.deleteHighlight);

export default router;
