// Story-related errors with standardized HTTP status codes
import { AppError } from "../../utils/appError";

export class StoryError extends AppError {
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.name = "StoryError";
  }
}

export const StoryErrors = {
  NOT_FOUND: new StoryError(404, "Story not found"),
  EXPIRED: new StoryError(410, "This story has expired"),
  INVALID_MEDIA_TYPE: new StoryError(400, "Media type must be 'image' or 'video'"),
  MISSING_MEDIA_URL: new StoryError(400, "Media URL is required"),
  INVALID_INPUT: new StoryError(400, "Invalid story input"),
  NO_STORIES: new StoryError(404, "No active stories found"),
  USER_NO_STORIES: new StoryError(404, "This user has no active stories"),
  ALREADY_LIKED: new StoryError(409, "You have already liked this story"),
  NOT_LIKED: new StoryError(404, "You have not liked this story"),
  ALREADY_VIEWED: new StoryError(409, "You have already viewed this story"),
  COMMENT_NOT_FOUND: new StoryError(404, "Comment not found"),
  MISSING_COMMENT: new StoryError(400, "Comment text is required"),
  CANNOT_DELETE_COMMENT: new StoryError(403, "You can only delete your own comments"),
};
