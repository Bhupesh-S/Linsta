import { Router } from "express";
import FeedController from "./feed.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// All feed routes require authentication
router.use(authMiddleware);

// GET /api/feed - Get personalized feed
router.get("/", (req, res) => FeedController.getFeed(req, res));

// GET /api/feed/explore - Get explore feed
router.get("/explore", (req, res) => FeedController.getExploreFeed(req, res));

export default router;
