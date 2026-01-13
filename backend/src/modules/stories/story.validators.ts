// Story input validators
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateMediaType(mediaType: any): ValidationResult {
  const errors: string[] = [];

  if (!mediaType) {
    errors.push("Media type is required");
    return { valid: false, errors };
  }

  if (mediaType !== "image" && mediaType !== "video") {
    errors.push("Media type must be 'image' or 'video'");
  }

  return { valid: errors.length === 0, errors };
}

export function validateMediaUrl(mediaUrl: any): ValidationResult {
  const errors: string[] = [];

  if (!mediaUrl) {
    errors.push("Media URL is required");
    return { valid: false, errors };
  }

  if (typeof mediaUrl !== "string") {
    errors.push("Media URL must be a string");
    return { valid: false, errors };
  }

  const trimmed = mediaUrl.trim();
  if (trimmed.length === 0) {
    errors.push("Media URL cannot be empty");
  }

  if (trimmed.length > 2048) {
    errors.push("Media URL cannot exceed 2048 characters");
  }

  // Basic URL validation
  try {
    new URL(trimmed);
  } catch (e) {
    errors.push("Media URL must be a valid URL");
  }

  return { valid: errors.length === 0, errors };
}

export function validateCaption(caption: any): ValidationResult {
  const errors: string[] = [];

  if (!caption) {
    return { valid: true, errors }; // Caption is optional
  }

  if (typeof caption !== "string") {
    errors.push("Caption must be a string");
    return { valid: false, errors };
  }

  const trimmed = caption.trim();
  if (trimmed.length > 500) {
    errors.push("Caption cannot exceed 500 characters");
  }

  return { valid: errors.length === 0, errors };
}

export function validateStoryInput(data: any): ValidationResult {
  const errors: string[] = [];

  // Validate media type
  const mediaTypeValidation = validateMediaType(data?.mediaType);
  if (!mediaTypeValidation.valid) {
    errors.push(...mediaTypeValidation.errors);
  }

  // Validate media URL
  const urlValidation = validateMediaUrl(data?.mediaUrl);
  if (!urlValidation.valid) {
    errors.push(...urlValidation.errors);
  }

  // Validate caption if provided
  if (data?.caption) {
    const captionValidation = validateCaption(data.caption);
    if (!captionValidation.valid) {
      errors.push(...captionValidation.errors);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateComment(text: any): ValidationResult {
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

  if (trimmed.length > 300) {
    errors.push("Comment cannot exceed 300 characters");
  }

  return { valid: errors.length === 0, errors };
}
