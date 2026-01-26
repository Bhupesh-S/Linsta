import { Router } from 'express';
import { CommentExtendedController } from './commentextended.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// Create reply to comment (auth required)
router.post('/:postId/comments/:parentCommentId/reply', authMiddleware, CommentExtendedController.createReply);

// Get threaded comments (public)
router.get('/:postId/comments/threaded', CommentExtendedController.getThreadedComments);

// Get replies to specific comment (public)
router.get('/comments/:commentId/replies', CommentExtendedController.getReplies);

// Update comment (auth required)
router.put('/comments/:commentId', authMiddleware, CommentExtendedController.updateComment);

export default router;
