// Post routes
import { Router } from "express";
import { PostController } from "./post.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

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

export default router;
