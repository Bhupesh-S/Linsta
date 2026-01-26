import { Types } from 'mongoose';
import { User } from '../modules/users/user.model';

export interface MentionData {
  userId: Types.ObjectId;
  username?: string;
}

/**
 * Parse mentions from text
 * Looks for @username patterns
 * @param text - Text to parse
 * @returns Array of mention data with userId and username
 */
export async function parseMentions(text: string): Promise<MentionData[]> {
  if (!text) return [];

  // Regex to find @username patterns (alphanumeric and underscore)
  const mentionRegex = /@([a-zA-Z0-9_]+)/g;
  const matches = text.match(mentionRegex) || [];

  // Remove duplicates
  const uniqueMentions = Array.from(new Set(matches));

  const mentions: MentionData[] = [];

  for (const mention of uniqueMentions) {
    const username = mention.substring(1); // Remove @
    const user = await User.findOne({ email: new RegExp(username, 'i') }).select('_id');

    if (user) {
      mentions.push({
        userId: user._id,
        username: username,
      });
    }
  }

  return mentions;
}

/**
 * Extract mentioned user IDs from mentions data
 * @param mentions - Mentions data array
 * @returns Array of user IDs
 */
export function getMentionedUserIds(mentions: MentionData[]): Types.ObjectId[] {
  return mentions.map(m => m.userId);
}

/**
 * Check if user is mentioned in mentions
 * @param userId - User ID to check
 * @param mentions - Mentions data array
 * @returns Boolean
 */
export function isUserMentioned(userId: Types.ObjectId | string, mentions: MentionData[]): boolean {
  const userIdStr = userId.toString();
  return mentions.some(m => m.userId.toString() === userIdStr);
}

/**
 * Replace mentions in text with formatted links
 * @param text - Original text with @mentions
 * @param mentions - Mentions data array
 * @returns Text with formatted mention links
 */
export function formatMentions(text: string, mentions: MentionData[]): string {
  let formattedText = text;

  for (const mention of mentions) {
    const regex = new RegExp(`@${mention.username}`, 'g');
    formattedText = formattedText.replace(
      regex,
      `[@${mention.username}](user/${mention.userId})`
    );
  }

  return formattedText;
}
