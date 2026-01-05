import { Router, Request, Response } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import ChatRoom from "./chatroom.model";
import Message from "./message.model";
import { Types } from "mongoose";

const router = Router();

// Create or get chat room with another user
router.post(
  "/rooms",
  authMiddleware,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = (req as any).userId;
      const { otherUserId } = req.body;

      if (!otherUserId) {
        return res.status(400).json({ error: "otherUserId is required" });
      }

      // Check if chat room already exists
      let chatRoom = await ChatRoom.findOne({
        participants: {
          $all: [
            new Types.ObjectId(userId),
            new Types.ObjectId(otherUserId),
          ],
        },
      });

      // Create new chat room if it doesn't exist
      if (!chatRoom) {
        chatRoom = new ChatRoom({
          participants: [
            new Types.ObjectId(userId),
            new Types.ObjectId(otherUserId),
          ],
        });
        await chatRoom.save();
      }

      res.json({
        chatRoomId: chatRoom._id,
        participants: chatRoom.participants,
        createdAt: chatRoom.createdAt,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get chat rooms for current user
router.get(
  "/rooms",
  authMiddleware,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = (req as any).userId;

      const chatRooms = await ChatRoom.find({
        participants: new Types.ObjectId(userId),
      }).populate("participants", "name email");

      res.json(chatRooms);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get messages from a chat room
router.get(
  "/messages/:chatRoomId",
  authMiddleware,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const userId = (req as any).userId;
      const { chatRoomId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const skip = parseInt(req.query.skip as string) || 0;

      // Verify user is participant
      const chatRoom = await ChatRoom.findById(chatRoomId);
      if (!chatRoom) {
        return res.status(404).json({ error: "Chat room not found" });
      }

      const isParticipant = chatRoom.participants.some(
        (id) => id.toString() === userId
      );
      if (!isParticipant) {
        return res.status(403).json({ error: "You are not a participant in this room" });
      }

      // Fetch messages
      const messages = await Message.find({
        chatRoomId: new Types.ObjectId(chatRoomId),
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate("senderId", "name email");

      res.json(messages.reverse());
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
