// Event service - Business logic
import { Event, IEvent } from "./event.model";
import { EventRsvp, IEventRsvp } from "./rsvp.model";
import { Types } from "mongoose";
import { validateEventInput } from "./event.validators";
import { EventError, EventErrors } from "./event.errors";

// Import services safely with fallback
let notificationService: any;
let analyticsService: any;

try {
  notificationService = require("../notifications/notification.service").default;
} catch (e) {
  console.warn("Notification service not available");
  notificationService = { createNotification: async () => {} };
}

try {
  analyticsService = require("../analytics/analytics.service").default;
} catch (e) {
  console.warn("Analytics service not available");
  analyticsService = {
    trackEventView: async () => {},
    trackEventRSVP: async () => {},
    logUserActivity: async () => {},
  };
}

export class EventService {
  // Create a new event with validation
  static async createEvent(
    data: {
      title: string;
      description?: string;
      category?: string;
      date?: Date;
      time?: string;
      venue?: string;
      isOnline: boolean;
      meetingLink?: string;
      maxCapacity?: number;
    },
    createdBy: string
  ): Promise<IEvent> {
    // Validate input
    const validation = validateEventInput(data);
    if (!validation.valid) {
      throw new EventError(400, `Validation failed: ${validation.errors.join(", ")}`);
    }

    const event = await Event.create({
      ...data,
      createdBy: new Types.ObjectId(createdBy),
    });
    return event;
  }

  // Get all events with optional search and filters
  static async getAllEvents(
    search?: string,
    category?: string,
    upcoming?: boolean,
    limit: number = 20,
    skip: number = 0
  ): Promise<IEvent[]> {
    // Build query object
    const query: any = {};

    // Search by title (case-insensitive regex)
    if (search && search.trim()) {
      query.title = { $regex: search.trim(), $options: "i" };
    }

    // Filter by category
    if (category && category.trim()) {
      query.category = { $regex: category.trim(), $options: "i" };
    }

    // Filter for upcoming events (date >= today)
    if (upcoming === true) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
      query.date = { $gte: today };
    }

    const events = await Event.find(query)
      .populate("createdBy", "name email")
      .sort({ date: -1, createdAt: -1 })
      .limit(limit)
      .skip(skip);

    return events;
  }

  // Get event by ID with attendee count and capacity info
  static async getEventById(eventId: string): Promise<any> {
    const event = await Event.findById(eventId).populate("createdBy", "name email");
    if (!event) {
      throw EventErrors.NOT_FOUND;
    }

    // Get attendee count
    const attendeeCount = await EventRsvp.countDocuments({ eventId });

    // Check capacity
    const isFull = event.maxCapacity ? attendeeCount >= event.maxCapacity : false;

    // Track event view asynchronously (don't wait)
    analyticsService.trackEventView(eventId).catch((err: any) => {
      console.error("Failed to track event view:", err);
    });

    return {
      ...event.toObject(),
      attendeeCount,
      spotsAvailable: event.maxCapacity ? event.maxCapacity - attendeeCount : null,
      isFull,
    };
  }

  // Update event (only creator can edit)
  static async updateEvent(eventId: string, userId: string, updateData: any): Promise<IEvent> {
    const event = await Event.findById(eventId);
    if (!event) {
      throw EventErrors.NOT_FOUND;
    }

    // Check authorization
    if (event.createdBy.toString() !== userId) {
      throw EventErrors.UNAUTHORIZED;
    }

    // Validate update data
    const validation = validateEventInput(updateData);
    if (!validation.valid) {
      throw new EventError(400, `Validation failed: ${validation.errors.join(", ")}`);
    }

    // Update event
    Object.assign(event, updateData);
    event.updatedAt = new Date();
    await event.save();

    return event;
  }

  // Delete event (only creator can delete)
  static async deleteEvent(eventId: string, userId: string): Promise<void> {
    const event = await Event.findById(eventId);
    if (!event) {
      throw EventErrors.NOT_FOUND;
    }

    // Check authorization
    if (event.createdBy.toString() !== userId) {
      throw EventErrors.UNAUTHORIZED;
    }

    // Delete event and all associated RSVPs
    await Event.deleteOne({ _id: eventId });
    await EventRsvp.deleteMany({ eventId: new Types.ObjectId(eventId) });
  }

  // Register user for an event (RSVP) with capacity check
  static async registerForEvent(eventId: string, userId: string): Promise<IEventRsvp> {
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      throw EventErrors.NOT_FOUND;
    }

    // Check capacity
    if (event.maxCapacity) {
      const attendeeCount = await EventRsvp.countDocuments({ eventId });
      if (attendeeCount >= event.maxCapacity) {
        throw EventErrors.EVENT_FULL;
      }
    }

    // Check if already registered
    const existingRsvp = await EventRsvp.findOne({
      eventId: new Types.ObjectId(eventId),
      userId: new Types.ObjectId(userId),
    });

    if (existingRsvp) {
      throw EventErrors.ALREADY_REGISTERED;
    }

    // Create RSVP
    const rsvp = await EventRsvp.create({
      eventId: new Types.ObjectId(eventId),
      userId: new Types.ObjectId(userId),
    });

    // Track RSVP analytics asynchronously
    analyticsService.trackEventRSVP(eventId).catch((err: any) => {
      console.error("Failed to track RSVP:", err);
    });

    // Log user activity
    analyticsService.logUserActivity(userId, "RSVP_EVENT", eventId).catch((err: any) => {
      console.error("Failed to log RSVP activity:", err);
    });

    // Notify event creator (if not the RSVP user)
    const creator = event.createdBy.toString();
    if (creator !== userId) {
      const User = require("../users/user.model").default;
      const user = await User.findById(userId).select("name");
      const userName = user?.name || "Someone";

      await notificationService.createNotification(
        creator,
        userId,
        "EVENT_RSVP",
        `${userName} registered for your event`,
        eventId
      );
    }

    return rsvp;
  }

  // Get event attendees with detailed info
  static async getEventAttendees(eventId: string): Promise<any[]> {
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      throw EventErrors.NOT_FOUND;
    }

    // Get all RSVPs with user details
    const attendees = await EventRsvp.find({ eventId })
      .populate("userId", "name email")
      .sort({ registeredAt: -1 });

    return attendees.map((rsvp) => ({
      userId: rsvp.userId,
      registeredAt: rsvp.registeredAt,
    }));
  }

  // Cancel RSVP
  static async cancelRsvp(eventId: string, userId: string): Promise<void> {
    // Check event exists
    const event = await Event.findById(eventId);
    if (!event) {
      throw EventErrors.NOT_FOUND;
    }

    const result = await EventRsvp.deleteOne({
      eventId: new Types.ObjectId(eventId),
      userId: new Types.ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      throw EventErrors.NOT_REGISTERED;
    }
  }
}
