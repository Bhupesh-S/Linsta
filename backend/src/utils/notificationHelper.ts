import { Types } from 'mongoose';
import Notification from '../modules/notifications/notification.model';

export interface NotificationData {
  recipientId: Types.ObjectId;
  senderId: Types.ObjectId;
  type: string;
  content: string;
  relatedId?: Types.ObjectId;
  relatedType?: string;
}

/**
 * Create a mention notification
 * @param mentionedUserId - User being mentioned
 * @param mentionedByUserId - User who made the mention
 * @param relatedType - Type of content (post or comment)
 * @param relatedId - ID of the post or comment
 * @param content - Preview of the mention context
 */
export async function createMentionNotification(
  mentionedUserId: Types.ObjectId,
  mentionedByUserId: Types.ObjectId,
  relatedType: 'post' | 'comment',
  relatedId: Types.ObjectId,
  content: string
): Promise<any> {
  try {
    return await Notification.create({
      recipientId: mentionedUserId,
      senderId: mentionedByUserId,
      type: 'mention',
      content: `@${mentionedByUserId} mentioned you in a ${relatedType}`,
      relatedId,
      relatedType,
    });
  } catch (error) {
    console.error('Error creating mention notification:', error);
  }
}

/**
 * Create a post share notification
 * @param receiverId - User receiving the share
 * @param senderId - User sharing the post
 * @param postId - ID of the shared post
 * @param message - Optional message with the share
 */
export async function createPostShareNotification(
  receiverId: Types.ObjectId,
  senderId: Types.ObjectId,
  postId: Types.ObjectId,
  message?: string
): Promise<any> {
  try {
    return await Notification.create({
      recipientId: receiverId,
      senderId: senderId,
      type: 'post_share',
      content: message || 'shared a post with you',
      relatedId: postId,
      relatedType: 'post',
    });
  } catch (error) {
    console.error('Error creating post share notification:', error);
  }
}

/**
 * Create a comment reply notification
 * @param recipientId - Original comment author
 * @param senderId - User replying
 * @param commentId - ID of the original comment
 * @param replyId - ID of the reply
 */
export async function createCommentReplyNotification(
  recipientId: Types.ObjectId,
  senderId: Types.ObjectId,
  commentId: Types.ObjectId,
  replyId: Types.ObjectId
): Promise<any> {
  try {
    return await Notification.create({
      recipientId,
      senderId,
      type: 'comment_reply',
      content: 'replied to your comment',
      relatedId: replyId,
      relatedType: 'comment',
    });
  } catch (error) {
    console.error('Error creating reply notification:', error);
  }
}

/**
 * Create a close friend addition notification
 * @param recipientId - User being added as close friend
 * @param senderId - User adding them
 */
export async function createCloseFriendNotification(
  recipientId: Types.ObjectId,
  senderId: Types.ObjectId
): Promise<any> {
  try {
    return await Notification.create({
      recipientId,
      senderId,
      type: 'close_friend',
      content: 'added you to their close friends',
      relatedType: 'user',
    });
  } catch (error) {
    console.error('Error creating close friend notification:', error);
  }
}
