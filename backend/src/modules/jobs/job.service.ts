import Job, { IJob } from "./job.model";
import { Types } from "mongoose";

export class JobService {
  // Create a new job
  static async createJob(
    userId: string,
    title: string,
    companyName: string,
    description: string,
    location: string,
    jobType: "Internship" | "Full-time" | "Part-time"
  ) {
    try {
      // Validate required fields
      if (!title?.trim()) {
        throw { statusCode: 400, message: "Job title is required" };
      }
      if (!companyName?.trim()) {
        throw { statusCode: 400, message: "Company name is required" };
      }
      if (!description?.trim()) {
        throw { statusCode: 400, message: "Description is required" };
      }
      if (!location?.trim()) {
        throw { statusCode: 400, message: "Location is required" };
      }
      if (!["Internship", "Full-time", "Part-time"].includes(jobType)) {
        throw { statusCode: 400, message: "Invalid job type" };
      }

      const job = await Job.create({
        title: title.trim(),
        companyName: companyName.trim(),
        description: description.trim(),
        location: location.trim(),
        jobType,
        createdBy: new Types.ObjectId(userId),
      });

      return {
        success: true,
        message: "Job posted successfully",
        data: job,
      };
    } catch (error: any) {
      throw error.statusCode
        ? error
        : { statusCode: 500, message: "Internal server error" };
    }
  }

  // Get all jobs with search and filters
  static async getJobs(
    searchQuery?: string,
    jobType?: string,
    location?: string,
    limit: number = 20,
    skip: number = 0
  ) {
    try {
      const filters: any = {};

      // Full-text search on title, description, location
      if (searchQuery?.trim()) {
        filters.$text = { $search: searchQuery.trim() };
      }

      // Filter by job type
      if (jobType && ["Internship", "Full-time", "Part-time"].includes(jobType)) {
        filters.jobType = jobType;
      }

      // Filter by location
      if (location?.trim()) {
        filters.location = new RegExp(location.trim(), "i"); // Case-insensitive
      }

      const total = await Job.countDocuments(filters);
      const jobs = await Job.find(filters)
        .populate("createdBy", "name email profilePicture")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

      return {
        success: true,
        data: jobs,
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

  // Get job by ID
  static async getJob(jobId: string) {
    try {
      const job = await Job.findById(jobId)
        .populate("createdBy", "name email profilePicture")
        .lean();

      if (!job) {
        throw { statusCode: 404, message: "Job not found" };
      }

      return {
        success: true,
        data: job,
      };
    } catch (error: any) {
      throw error.statusCode
        ? error
        : { statusCode: 500, message: "Internal server error" };
    }
  }

  // Get jobs posted by user
  static async getMyJobs(userId: string, limit: number = 20, skip: number = 0) {
    try {
      const total = await Job.countDocuments({
        createdBy: new Types.ObjectId(userId),
      });

      const jobs = await Job.find({
        createdBy: new Types.ObjectId(userId),
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

      return {
        success: true,
        data: jobs,
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
}
