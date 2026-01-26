import { Router } from 'express';
import { PostShareController } from './postshare.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// Share post with user (auth required)
router.post('/share', authMiddleware, PostShareController.sharePost);

// Get shared posts received (auth required)
router.get('/shared', authMiddleware, PostShareController.getSharedPosts);

// Get sent shares (auth required)
router.get('/shares-sent', authMiddleware, PostShareController.getSentShares);

export default router;
