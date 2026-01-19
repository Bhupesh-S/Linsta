import { Router } from "express";
import FollowController from "./follow.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Follow/Unfollow routes (require authentication)
router.post("/:id/follow", authMiddleware, (req, res) => FollowController.followUser(req, res));
router.delete("/:id/follow", authMiddleware, (req, res) => FollowController.unfollowUser(req, res));

// Get followers/following (public, can be viewed by anyone)
router.get("/:id/followers", (req, res) => FollowController.getFollowers(req, res));
router.get("/:id/following", (req, res) => FollowController.getFollowing(req, res));
router.get("/:id/follow-counts", (req, res) => FollowController.getFollowCounts(req, res));

export default router;
