// Network routes
import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { NetworkController } from "./network.controller";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Suggestions & search
router.get("/suggestions", NetworkController.getSuggestions);
router.get("/search", NetworkController.searchUsers);

// Lists
router.get("/connections", NetworkController.getConnections);
router.get("/followers", NetworkController.getFollowers);
router.get("/following", NetworkController.getFollowing);

// Connections
router.post("/connect", NetworkController.sendConnectionRequest);
router.post("/respond", NetworkController.respondToRequest);
router.delete("/connection/:userId", NetworkController.removeConnection);
router.get("/requests", NetworkController.getConnectionRequests);

// Communities
router.get("/communities", NetworkController.getCommunities);
router.post("/community/join", NetworkController.joinCommunity);
router.post("/community/leave", NetworkController.leaveCommunity);

// Messaging permissions
router.get("/permissions/:userId", NetworkController.checkMessagingPermission);

// Follows
router.post("/follows/:userId", NetworkController.followUser);
router.delete("/follows/:userId", NetworkController.unfollowUser);

// Blocks
router.post("/connections/block", NetworkController.blockUser);
router.delete("/connections/block/:userId", NetworkController.unblockUser);

// Stats
router.get("/stats", NetworkController.getStats);
router.get("/stats/:userId", NetworkController.getUserStats);

export default router;
