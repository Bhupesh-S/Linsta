// Event routes
import { Router } from "express";
import { EventController } from "./event.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import SavedController from "../saved/saved.controller";

const router = Router();

// Public routes
router.get("/", EventController.getAllEvents);
router.get("/:id", EventController.getEventById);
router.get("/:id/attendees", EventController.getEventAttendees);

// Protected routes
router.post("/", authMiddleware, EventController.createEvent);
router.put("/:id", authMiddleware, EventController.updateEvent);
router.delete("/:id", authMiddleware, EventController.deleteEvent);
router.post("/:id/rsvp", authMiddleware, EventController.registerForEvent);
router.delete("/:id/rsvp", authMiddleware, EventController.cancelRsvp);

// Save/Unsave routes
router.post("/:id/save", authMiddleware, (req, res) => SavedController.saveEvent(req, res));
router.delete("/:id/save", authMiddleware, (req, res) => SavedController.unsaveEvent(req, res));

export default router;
