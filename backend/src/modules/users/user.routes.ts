// User routes
import { Router, Request, Response } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { User } from "./user.model";
import { UserProfile } from "./profile.model";

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

// PUT /api/users/profile - Update profile
router.put("/profile", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { university, course, year, skills, interests } = req.body;

    // Fetch user
    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Update or create profile
    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      {
        university,
        course,
        year,
        skills: skills || [],
        interests: interests || [],
      },
      { new: true, upsert: true }
    );

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

export default router;
