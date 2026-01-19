import { Router } from "express";
import SavedController from "./saved.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Post save/unsave routes
router.post("/posts/:id/save", (req, res) => SavedController.savePost(req, res));
router.delete("/posts/:id/save", (req, res) => SavedController.unsavePost(req, res));

// Event save/unsave routes
router.post("/events/:id/save", (req, res) => SavedController.saveEvent(req, res));
router.delete("/events/:id/save", (req, res) => SavedController.unsaveEvent(req, res));

export default router;
