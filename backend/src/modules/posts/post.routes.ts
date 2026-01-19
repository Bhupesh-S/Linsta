// Post routes
import { Router } from "express";
import { PostController } from "./post.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import SavedController from "../saved/saved.controller";

const router = Router();

// Public routes
router.get("/:id", PostController.getPost);
router.get("/:id/comments", PostController.getComments);

// Protected routes
router.post("/", authMiddleware, PostController.createPost);
router.get("/", authMiddleware, PostController.getFeed);
router.delete("/:id", authMiddleware, PostController.deletePost);

router.post("/:id/like", authMiddleware, PostController.likePost);
router.delete("/:id/like", authMiddleware, PostController.unlikePost);

router.post("/:id/comment", authMiddleware, PostController.addComment);
router.delete("/:postId/comments/:commentId", authMiddleware, PostController.deleteComment);

// Save/Unsave routes
router.post("/:id/save", authMiddleware, (req, res) => SavedController.savePost(req, res));
router.delete("/:id/save", authMiddleware, (req, res) => SavedController.unsavePost(req, res));

export default router;
