// Event routes
import { Router } from "express";
import { EventController } from "./event.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Public routes
router.get("/", EventController.getAllEvents);
router.get("/:id", EventController.getEventById);
router.get("/:id/attendees", EventController.getEventAttendees);

// Protected routes
router.post("/", authMiddleware, EventController.createEvent);
router.post("/:id/rsvp", authMiddleware, EventController.registerForEvent);
router.delete("/:id/rsvp", authMiddleware, EventController.cancelRsvp);

export default router;
