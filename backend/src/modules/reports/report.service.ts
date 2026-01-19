import { Types } from "mongoose";
import { Report } from "./report.model";
import { ReportRequest } from "./report.types";

export class ReportService {
  /**
   * Create a report
   */
  static async createReport(userId: string, data: ReportRequest): Promise<any> {
    const { targetType, targetId, reason, description } = data;

    // Validate input
    if (!targetType || !targetId || !reason) {
      throw {
        statusCode: 400,
        message: "targetType, targetId, and reason are required",
      };
    }

    try {
      const report = await Report.create({
        reporterId: new Types.ObjectId(userId),
        targetType,
        targetId: new Types.ObjectId(targetId),
        reason,
        description,
      });

      return {
        success: true,
        message: "Report submitted successfully",
        data: {
          _id: report._id.toString(),
          reporterId: report.reporterId.toString(),
          targetType: report.targetType,
          targetId: report.targetId.toString(),
          reason: report.reason,
          description: report.description,
          createdAt: report.createdAt.toISOString(),
        },
      };
    } catch (error: any) {
      // Handle duplicate key error
      if (error.code === 11000) {
        throw {
          statusCode: 409,
          message: "You have already reported this content",
        };
      }
      throw error;
    }
  }

  /**
   * Get user's reports (optional endpoint)
   */
  static async getUserReports(userId: string, page: number = 1, limit: number = 20): Promise<any> {
    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      Report.find({ reporterId: new Types.ObjectId(userId) })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Report.countDocuments({ reporterId: new Types.ObjectId(userId) }),
    ]);

    return {
      success: true,
      data: reports.map((report: any) => ({
        _id: report._id.toString(),
        reporterId: report.reporterId.toString(),
        targetType: report.targetType,
        targetId: report.targetId.toString(),
        reason: report.reason,
        description: report.description,
        createdAt: report.createdAt.toISOString(),
      })),
      total,
      page,
      limit,
    };
  }

  /**
   * Get reports for a specific content (admin use)
   */
  static async getReportsForContent(targetType: string, targetId: string): Promise<any> {
    const reports = await Report.find({
      targetType,
      targetId: new Types.ObjectId(targetId),
    })
      .populate("reporterId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      targetType,
      targetId,
      reportCount: reports.length,
      data: reports.map((report: any) => ({
        _id: report._id.toString(),
        reporterId: report.reporterId,
        reason: report.reason,
        description: report.description,
        createdAt: report.createdAt.toISOString(),
      })),
    };
  }

  /**
   * Get report statistics
   */
  static async getReportStats(): Promise<any> {
    const [totalReports, reasonStats, typeStats] = await Promise.all([
      Report.countDocuments(),
      Report.aggregate([
        {
          $group: {
            _id: "$reason",
            count: { $sum: 1 },
          },
        },
      ]),
      Report.aggregate([
        {
          $group: {
            _id: "$targetType",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const reportsByReason = {
      spam: 0,
      abuse: 0,
      fake: 0,
      other: 0,
    };

    const reportsByType = {
      post: 0,
      story: 0,
      comment: 0,
    };

    reasonStats.forEach((stat: any) => {
      reportsByReason[stat._id as keyof typeof reportsByReason] = stat.count;
    });

    typeStats.forEach((stat: any) => {
      reportsByType[stat._id as keyof typeof reportsByType] = stat.count;
    });

    return {
      success: true,
      totalReports,
      reportsByReason,
      reportsByType,
    };
  }
}

export default ReportService;
