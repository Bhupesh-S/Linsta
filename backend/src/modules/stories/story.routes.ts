// Story routes
import { Router } from "express";
import { StoryController } from "./story.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Basic story endpoints
router.post("/", asyncHandler(StoryController.createStory));
router.get("/", asyncHandler(StoryController.getAllStories));
router.get("/user/:userId", asyncHandler(StoryController.getUserStories));

// Engagement endpoints
router.post("/:id/view", asyncHandler(StoryController.viewStory));
router.post("/:id/like", asyncHandler(StoryController.likeStory));
router.delete("/:id/like", asyncHandler(StoryController.unlikeStory));

// Comments endpoints
router.post("/:id/comment", asyncHandler(StoryController.addComment));
router.get("/:id/comments", asyncHandler(StoryController.getComments));
router.delete("/comment/:commentId", asyncHandler(StoryController.deleteComment));

// Viewers endpoint
router.get("/:id/viewers", asyncHandler(StoryController.getViewers));

export default router;
