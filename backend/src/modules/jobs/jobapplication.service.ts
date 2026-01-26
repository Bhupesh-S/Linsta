import JobApplication, { IJobApplication } from "./jobapplication.model";
import Job from "./job.model";
import { Types } from "mongoose";

export class JobApplicationService {
  // Apply for a job
  static async applyForJob(
    userId: string,
    jobId: string,
    resumeUrl: string
  ) {
    try {
      // Validate inputs
      if (!jobId?.trim()) {
        throw { statusCode: 400, message: "Job ID is required" };
      }
      if (!resumeUrl?.trim()) {
        throw { statusCode: 400, message: "Resume URL is required" };
      }

      // Check if job exists
      const job = await Job.findById(jobId);
      if (!job) {
        throw { statusCode: 404, message: "Job not found" };
      }

      // Check if user already applied
      const existingApplication = await JobApplication.findOne({
        jobId: new Types.ObjectId(jobId),
        applicantId: new Types.ObjectId(userId),
      });

      if (existingApplication) {
        throw {
          statusCode: 409,
          message: "You have already applied for this job",
        };
      }

      // Create application
      const application = await JobApplication.create({
        jobId: new Types.ObjectId(jobId),
        applicantId: new Types.ObjectId(userId),
        resumeUrl: resumeUrl.trim(),
        status: "Applied",
      });

      // Populate and return
      await application.populate([
        { path: "jobId", select: "title companyName" },
        { path: "applicantId", select: "name email" },
      ]);

      return {
        success: true,
        message: "Application submitted successfully",
        data: application,
      };
    } catch (error: any) {
      throw error.statusCode
        ? error
        : { statusCode: 500, message: "Internal server error" };
    }
  }

  // Get user's applications
  static async getMyApplications(
    userId: string,
    limit: number = 20,
    skip: number = 0
  ) {
    try {
      const total = await JobApplication.countDocuments({
        applicantId: new Types.ObjectId(userId),
      });

      const applications = await JobApplication.find({
        applicantId: new Types.ObjectId(userId),
      })
        .populate("jobId", "title companyName location jobType")
        .populate("applicantId", "name email")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

      return {
        success: true,
        data: applications,
        pagination: {
          total,
          limit,
          skip,
          hasMore: skip + limit < total,
        },
      };
    } catch (error: any) {
      throw { statusCode: 500, message: "Internal server error" };
    }
  }

  // Get applications for a job (for job poster)
  static async getJobApplications(
    jobId: string,
    userId: string,
    limit: number = 20,
    skip: number = 0
  ) {
    try {
      // Verify job ownership
      const job = await Job.findById(jobId);
      if (!job) {
        throw { statusCode: 404, message: "Job not found" };
      }

      if (job.createdBy.toString() !== userId) {
        throw {
          statusCode: 403,
          message: "You can only view applications for your own jobs",
        };
      }

      const total = await JobApplication.countDocuments({
        jobId: new Types.ObjectId(jobId),
      });

      const applications = await JobApplication.find({
        jobId: new Types.ObjectId(jobId),
      })
        .populate("applicantId", "name email profilePicture")
        .populate("jobId", "title companyName")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

      return {
        success: true,
        data: applications,
        pagination: {
          total,
          limit,
          skip,
          hasMore: skip + limit < total,
        },
      };
    } catch (error: any) {
      throw error.statusCode
        ? error
        : { statusCode: 500, message: "Internal server error" };
    }
  }

  // Update application status
  static async updateApplicationStatus(
    applicationId: string,
    jobId: string,
    userId: string,
    status: "Applied" | "Reviewed" | "Rejected"
  ) {
    try {
      // Verify job ownership
      const job = await Job.findById(jobId);
      if (!job) {
        throw { statusCode: 404, message: "Job not found" };
      }

      if (job.createdBy.toString() !== userId) {
        throw {
          statusCode: 403,
          message: "You can only update applications for your own jobs",
        };
      }

      // Validate status
      if (!["Applied", "Reviewed", "Rejected"].includes(status)) {
        throw { statusCode: 400, message: "Invalid status" };
      }

      // Update application
      const application = await JobApplication.findByIdAndUpdate(
        applicationId,
        { status },
        { new: true }
      )
        .populate("applicantId", "name email")
        .populate("jobId", "title companyName");

      if (!application) {
        throw { statusCode: 404, message: "Application not found" };
      }

      return {
        success: true,
        message: "Application status updated",
        data: application,
      };
    } catch (error: any) {
      throw error.statusCode
        ? error
        : { statusCode: 500, message: "Internal server error" };
    }
  }
}
