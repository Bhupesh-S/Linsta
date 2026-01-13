// Event-specific errors
import { AppError } from "../../utils/appError";

export class EventError extends AppError {
  constructor(statusCode: number, message: string) {
    super(statusCode, message);
    this.name = "EventError";
  }
}

export const EventErrors = {
  NOT_FOUND: new EventError(404, "Event not found"),
  INVALID_INPUT: (msg: string) => new EventError(400, msg),
  UNAUTHORIZED: new EventError(403, "You are not authorized to perform this action"),
  ALREADY_REGISTERED: new EventError(409, "You are already registered for this event"),
  NOT_REGISTERED: new EventError(404, "You are not registered for this event"),
  EVENT_FULL: new EventError(409, "This event has reached maximum capacity"),
  INVALID_EVENT_DATA: new EventError(400, "Invalid event data"),
};
