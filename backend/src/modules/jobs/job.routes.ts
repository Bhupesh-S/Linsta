import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { JobController } from "./job.controller";

const router = Router();

// Public routes
router.get("/", JobController.getJobs); // Search and list jobs
router.get("/:id", JobController.getJob); // Get job details

// Protected routes (auth required)
router.post("/", authMiddleware, JobController.createJob); // Create job
router.post("/:id/apply", authMiddleware, JobController.applyForJob); // Apply for job
router.get("/my/jobs", authMiddleware, JobController.getMyJobs); // Get user's posted jobs
router.get("/my/applications", authMiddleware, JobController.getMyApplications); // Get user's applications
router.get("/:jobId/applications", authMiddleware, JobController.getJobApplications); // Get job's applications (job poster only)
router.patch(
  "/:jobId/applications/:applicationId",
  authMiddleware,
  JobController.updateApplicationStatus
); // Update application status

export default router;
