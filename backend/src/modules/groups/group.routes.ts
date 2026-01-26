import { Router } from 'express';
import { GroupController } from './group.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// Create group (auth required)
router.post('/', authMiddleware, GroupController.createGroup);

// Get user's groups (auth required)
router.get('/', authMiddleware, GroupController.getUserGroups);

// Get group details (public)
router.get('/:id', GroupController.getGroup);

// Join group (auth required)
router.post('/:id/join', authMiddleware, GroupController.joinGroup);

// Leave group (auth required)
router.post('/:id/leave', authMiddleware, GroupController.leaveGroup);

// Get group messages (auth required)
router.get('/:id/messages', authMiddleware, GroupController.getGroupMessages);

// Send message to group (auth required)
router.post('/:id/message', authMiddleware, GroupController.sendMessage);

export default router;
