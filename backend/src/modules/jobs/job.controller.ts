import { Request, Response } from "express";
import { JobService } from "./job.service";
import { JobApplicationService } from "./jobapplication.service";

export class JobController {
  // Create a job
  static async createJob(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { title, companyName, description, location, jobType } = req.body;

      const result = await JobService.createJob(
        userId,
        title,
        companyName,
        description,
        location,
        jobType
      );

      return res.status(201).json(result);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal server error";
      return res.status(statusCode).json({ success: false, message });
    }
  }

  // Get all jobs with search and filters
  static async getJobs(req: Request, res: Response) {
    try {
      const { search, jobType, location, limit = 20, skip = 0 } = req.query;

      const result = await JobService.getJobs(
        search as string,
        jobType as string,
        location as string,
        parseInt(limit as string),
        parseInt(skip as string)
      );

      return res.status(200).json(result);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal server error";
      return res.status(statusCode).json({ success: false, message });
    }
  }

  // Get job by ID
  static async getJob(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await JobService.getJob(id);

      return res.status(200).json(result);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal server error";
      return res.status(statusCode).json({ success: false, message });
    }
  }

  // Get jobs posted by user
  static async getMyJobs(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { limit = 20, skip = 0 } = req.query;

      const result = await JobService.getMyJobs(
        userId,
        parseInt(limit as string),
        parseInt(skip as string)
      );

      return res.status(200).json(result);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal server error";
      return res.status(statusCode).json({ success: false, message });
    }
  }

  // Apply for a job
  static async applyForJob(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { id } = req.params;
      const { resumeUrl } = req.body;

      const result = await JobApplicationService.applyForJob(
        userId,
        id,
        resumeUrl
      );

      return res.status(201).json(result);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal server error";
      return res.status(statusCode).json({ success: false, message });
    }
  }

  // Get user's job applications
  static async getMyApplications(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { limit = 20, skip = 0 } = req.query;

      const result = await JobApplicationService.getMyApplications(
        userId,
        parseInt(limit as string),
        parseInt(skip as string)
      );

      return res.status(200).json(result);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal server error";
      return res.status(statusCode).json({ success: false, message });
    }
  }

  // Get applications for a job (for job poster)
  static async getJobApplications(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { id } = req.params;
      const { limit = 20, skip = 0 } = req.query;

      const result = await JobApplicationService.getJobApplications(
        id,
        userId,
        parseInt(limit as string),
        parseInt(skip as string)
      );

      return res.status(200).json(result);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal server error";
      return res.status(statusCode).json({ success: false, message });
    }
  }

  // Update application status
  static async updateApplicationStatus(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const { jobId, applicationId } = req.params;
      const { status } = req.body;

      const result = await JobApplicationService.updateApplicationStatus(
        applicationId,
        jobId,
        userId,
        status
      );

      return res.status(200).json(result);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal server error";
      return res.status(statusCode).json({ success: false, message });
    }
  }
}
