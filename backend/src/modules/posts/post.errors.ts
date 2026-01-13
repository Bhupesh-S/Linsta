// Post-related errors with standardized HTTP status codes
import { AppError } from "../../utils/appError";

export class PostError extends AppError {
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.name = "PostError";
  }
}

export const PostErrors = {
  NOT_FOUND: new PostError(404, "Post not found"),
  UNAUTHORIZED: new PostError(403, "You are not authorized to perform this action"),
  INVALID_INPUT: new PostError(400, "Invalid post input"),
  ALREADY_LIKED: new PostError(409, "You have already liked this post"),
  NOT_LIKED: new PostError(404, "You have not liked this post"),
  COMMENT_NOT_FOUND: new PostError(404, "Comment not found"),
  CANNOT_DELETE_COMMENT: new PostError(403, "You can only delete your own comments"),
  CANNOT_DELETE_POST: new PostError(403, "You can only delete your own posts"),
  MISSING_CAPTION: new PostError(400, "Caption is required"),
  MISSING_COMMENT_TEXT: new PostError(400, "Comment text is required"),
  EMPTY_CAPTION: new PostError(400, "Caption cannot be empty"),
};
