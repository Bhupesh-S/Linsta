import { Socket } from 'socket.io';
import { GroupService } from '../modules/groups/group.service';
import { GroupMessageService } from '../modules/groups/groupmessage.service';
import { Types } from 'mongoose';

/**
 * Group Chat Socket Handler
 * Handles real-time group messaging
 */
export const setupGroupSocket = (io: any) => {
  io.on('connection', (socket: Socket) => {
    /**
     * Join a group room
     * Client emits: { groupId }
     */
    socket.on('join_group', async (data: { groupId: string; userId: string }) => {
      try {
        const { groupId, userId } = data;

        // Verify user is member
        const isMember = await GroupService.isMember(userId, groupId);
        if (!isMember) {
          socket.emit('error', 'You are not a member of this group');
          return;
        }

        // Join socket room
        socket.join(`group_${groupId}`);
        console.log(`User ${userId} joined group ${groupId}`);

        // Notify group that user joined
        io.to(`group_${groupId}`).emit('user_joined_group', {
          groupId,
          userId,
          timestamp: new Date(),
        });
      } catch (error: any) {
        socket.emit('error', error.message || 'Failed to join group');
      }
    });

    /**
     * Send message to group
     * Client emits: { groupId, userId, message }
     */
    socket.on('send_group_message', async (data: { groupId: string; userId: string; message: string }) => {
      try {
        const { groupId, userId, message } = data;

        // Verify user is member
        const isMember = await GroupService.isMember(userId, groupId);
        if (!isMember) {
          socket.emit('error', 'You are not a member of this group');
          return;
        }

        // Save message to database
        const result = await GroupMessageService.sendMessage(userId, groupId, message);

        // Broadcast to group
        io.to(`group_${groupId}`).emit('receive_group_message', {
          _id: result.data._id,
          groupId,
          senderId: result.data.senderId,
          message: result.data.message,
          createdAt: result.data.createdAt,
        });

        console.log(`Message sent to group ${groupId} by ${userId}`);
      } catch (error: any) {
        socket.emit('error', error.message || 'Failed to send message');
      }
    });

    /**
     * Leave a group
     * Client emits: { groupId, userId }
     */
    socket.on('leave_group', async (data: { groupId: string; userId: string }) => {
      try {
        const { groupId, userId } = data;

        // Leave socket room
        socket.leave(`group_${groupId}`);
        console.log(`User ${userId} left group ${groupId}`);

        // Notify group that user left
        io.to(`group_${groupId}`).emit('user_left_group', {
          groupId,
          userId,
          timestamp: new Date(),
        });
      } catch (error: any) {
        socket.emit('error', error.message || 'Failed to leave group');
      }
    });

    /**
     * Disconnect handler
     */
    socket.on('disconnect', () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
  });
};

export default setupGroupSocket;
