// Event API controllers
import { Request, Response } from "express";
import { EventService } from "./event.service";
import { EventError } from "./event.errors";

export class EventController {
  // POST /api/events - Create event
  static async createEvent(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, category, date, time, venue, isOnline, meetingLink, maxCapacity } = req.body;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const event = await EventService.createEvent(
        {
          title,
          description,
          category,
          date,
          time,
          venue,
          isOnline: isOnline || false,
          meetingLink,
          maxCapacity,
        },
        userId
      );

      res.status(201).json(event);
    } catch (error: any) {
      if (error instanceof EventError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  // GET /api/events - Get all events with optional search & filters
  static async getAllEvents(req: Request, res: Response): Promise<void> {
    try {
      const search = req.query.search as string | undefined;
      const category = req.query.category as string | undefined;
      const upcoming = req.query.upcoming === "true";
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const skip = parseInt(req.query.skip as string) || 0;

      const events = await EventService.getAllEvents(
        search,
        category,
        upcoming,
        limit,
        skip
      );

      res.status(200).json(events);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET /api/events/:id - Get single event
  static async getEventById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const event = await EventService.getEventById(id);
      res.status(200).json(event);
    } catch (error: any) {
      if (error instanceof EventError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  // PUT /api/events/:id - Update event (creator only)
  static async updateEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const event = await EventService.updateEvent(id, userId, req.body);
      res.status(200).json(event);
    } catch (error: any) {
      if (error instanceof EventError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  // DELETE /api/events/:id - Delete event (creator only)
  static async deleteEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      await EventService.deleteEvent(id, userId);
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error: any) {
      if (error instanceof EventError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  // POST /api/events/:id/rsvp - Register for event
  static async registerForEvent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const rsvp = await EventService.registerForEvent(id, userId);
      res.status(201).json({ message: "Successfully registered for event", rsvp });
    } catch (error: any) {
      if (error instanceof EventError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  // GET /api/events/:id/attendees - Get event attendees
  static async getEventAttendees(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const attendees = await EventService.getEventAttendees(id);
      res.status(200).json(attendees);
    } catch (error: any) {
      if (error instanceof EventError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }

  // DELETE /api/events/:id/rsvp - Cancel RSVP
  static async cancelRsvp(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      await EventService.cancelRsvp(id, userId);
      res.status(200).json({ message: "RSVP cancelled successfully" });
    } catch (error: any) {
      if (error instanceof EventError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
}
