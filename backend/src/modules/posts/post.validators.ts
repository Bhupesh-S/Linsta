// Post input validators
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateCaption(caption: any): ValidationResult {
  const errors: string[] = [];

  if (!caption) {
    errors.push("Caption is required");
    return { valid: false, errors };
  }

  if (typeof caption !== "string") {
    errors.push("Caption must be a string");
    return { valid: false, errors };
  }

  const trimmed = caption.trim();
  if (trimmed.length === 0) {
    errors.push("Caption cannot be empty");
  }

  if (trimmed.length > 2000) {
    errors.push("Caption cannot exceed 2000 characters");
  }

  return { valid: errors.length === 0, errors };
}

export function validateCommentText(text: any): ValidationResult {
  const errors: string[] = [];

  if (!text) {
    errors.push("Comment text is required");
    return { valid: false, errors };
  }

  if (typeof text !== "string") {
    errors.push("Comment must be a string");
    return { valid: false, errors };
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    errors.push("Comment cannot be empty");
  }

  if (trimmed.length > 500) {
    errors.push("Comment cannot exceed 500 characters");
  }

  return { valid: errors.length === 0, errors };
}

export function validatePostInput(data: any): ValidationResult {
  return validateCaption(data?.caption);
}
