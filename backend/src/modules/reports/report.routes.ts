import { Router } from "express";
import ReportController from "./report.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Submit report (requires authentication)
router.post("/", authMiddleware, (req, res) => ReportController.submitReport(req, res));

// Get user's reports (requires authentication)
router.get("/my", authMiddleware, (req, res) => ReportController.getUserReports(req, res));

// Get report statistics (public for now, can restrict later)
router.get("/stats", (req, res) => ReportController.getReportStats(req, res));

export default router;
