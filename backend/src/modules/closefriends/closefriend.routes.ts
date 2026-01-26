import { Router } from 'express';
import { CloseFriendController } from './closefriend.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// Add close friend (auth required)
router.post('/:friendId/close-friends', authMiddleware, CloseFriendController.addCloseFriend);

// Remove close friend (auth required)
router.delete('/:friendId/close-friends', authMiddleware, CloseFriendController.removeCloseFriend);

// Get close friends list (public)
router.get('/:userId/close-friends', CloseFriendController.getCloseFriends);

export default router;
