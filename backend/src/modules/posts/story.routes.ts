// Story routes
import { Router } from "express";
import { StoryController } from "./story.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/upload.middleware";

const router = Router();

// All routes are protected
router.post("/", authMiddleware, StoryController.createStory);
router.post("/upload", authMiddleware, upload.single('media'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No media file uploaded" });
      return;
    }

    // File is uploaded to cloudinary via middleware
    const mediaUrl = (req.file as any).path; // Cloudinary URL
    const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';

    // Add to request body
    req.body.mediaUrl = mediaUrl;
    req.body.mediaType = mediaType;

    // Call controller
    await StoryController.createStory(req, res);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", authMiddleware, StoryController.getStories);
router.get("/my-stories", authMiddleware, StoryController.getMyStories);
router.post("/:id/view", authMiddleware, StoryController.viewStory);
router.delete("/:id", authMiddleware, StoryController.deleteStory);
router.get("/:id/viewers", authMiddleware, StoryController.getStoryViewers);

export default router;
