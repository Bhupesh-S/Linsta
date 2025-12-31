// Event service - Business logic
import { Event, IEvent } from "./event.model";
import { EventRsvp, IEventRsvp } from "./rsvp.model";
import { Types } from "mongoose";
import notificationService from "../notifications/notification.service";

export class EventService {
  // Create a new event
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
    },
    createdBy: string
  ): Promise<IEvent> {
    const event = await Event.create({
      ...data,
      createdBy: new Types.ObjectId(createdBy),
    });
    return event;
  }

  // Get all events
  static async getAllEvents(): Promise<IEvent[]> {
    const events = await Event.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    return events;
  }

  // Get event by ID with attendee count
  static async getEventById(eventId: string): Promise<any> {
    const event = await Event.findById(eventId).populate("createdBy", "name email");
    if (!event) {
      throw new Error("Event not found");
    }

    // Get attendee count
    const attendeeCount = await EventRsvp.countDocuments({ eventId });

    return {
      ...event.toObject(),
      attendeeCount,
    };
  }

  // Register user for an event (RSVP)
  static async registerForEvent(eventId: string, userId: string): Promise<IEventRsvp> {
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Check if already registered
    const existingRsvp = await EventRsvp.findOne({
      eventId: new Types.ObjectId(eventId),
      userId: new Types.ObjectId(userId),
    });

    if (existingRsvp) {
      throw new Error("Already registered for this event");
    }

    // Create RSVP
    const rsvp = await EventRsvp.create({
      eventId: new Types.ObjectId(eventId),
      userId: new Types.ObjectId(userId),
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
        'EVENT_RSVP',
        `${userName} registered for your event`,
        eventId
      );
    }

    return rsvp;
  }

  // Get event attendees
  static async getEventAttendees(eventId: string): Promise<any[]> {
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
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
    const result = await EventRsvp.deleteOne({
      eventId: new Types.ObjectId(eventId),
      userId: new Types.ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      throw new Error("RSVP not found");
    }
  }
}
