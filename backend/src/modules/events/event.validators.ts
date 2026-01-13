// Event validators
export const validateEventInput = (data: {
  title?: string;
  description?: string;
  category?: string;
  date?: any;
  time?: string;
  venue?: string;
  isOnline?: boolean;
  meetingLink?: string;
  maxCapacity?: number;
}): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate title
  if (!data.title || data.title.trim().length < 3) {
    errors.push("Event title must be at least 3 characters long");
  }

  if (data.title && data.title.length > 200) {
    errors.push("Event title must not exceed 200 characters");
  }

  // Validate description
  if (data.description && data.description.length > 5000) {
    errors.push("Description must not exceed 5000 characters");
  }

  // Validate date
  if (data.date) {
    const eventDate = new Date(data.date);
    if (isNaN(eventDate.getTime())) {
      errors.push("Invalid date format");
    } else if (eventDate < new Date()) {
      errors.push("Event date cannot be in the past");
    }
  }

  // Validate time format (HH:MM)
  if (data.time && !/^\d{1,2}:\d{2}$/.test(data.time)) {
    errors.push("Invalid time format. Use HH:MM format");
  }

  // Validate online event requirements
  if (data.isOnline && !data.meetingLink) {
    errors.push("Meeting link is required for online events");
  }

  if (!data.isOnline && !data.venue) {
    errors.push("Venue is required for offline events");
  }

  // Validate max capacity
  if (data.maxCapacity !== undefined) {
    if (data.maxCapacity < 1) {
      errors.push("Max capacity must be at least 1");
    }
    if (data.maxCapacity > 100000) {
      errors.push("Max capacity cannot exceed 100,000");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
