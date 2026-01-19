// User routes
import { Router, Request, Response } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { User } from "./user.model";
import { UserProfile } from "./profile.model";
import SavedController from "../saved/saved.controller";
import FollowController from "../follows/follow.controller";

const router = Router();

// GET /api/users/profile - Protected route
router.get("/profile", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    // Fetch user
    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Fetch profile
    const profile = await UserProfile.findOne({ userId });

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      profile,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/me/saved-posts - Get user's saved posts
router.get("/me/saved-posts", authMiddleware, (req: Request, res: Response) => SavedController.getSavedPosts(req, res));

// GET /api/users/me/saved-events - Get user's saved events
router.get("/me/saved-events", authMiddleware, (req: Request, res: Response) => SavedController.getSavedEvents(req, res));

// Follow/Unfollow routes
router.post("/:id/follow", authMiddleware, (req: Request, res: Response) => FollowController.followUser(req, res));
router.delete("/:id/follow", authMiddleware, (req: Request, res: Response) => FollowController.unfollowUser(req, res));

// Get followers/following (public)
router.get("/:id/followers", (req: Request, res: Response) => FollowController.getFollowers(req, res));
router.get("/:id/following", (req: Request, res: Response) => FollowController.getFollowing(req, res));
router.get("/:id/follow-counts", (req: Request, res: Response) => FollowController.getFollowCounts(req, res));

export default router;
