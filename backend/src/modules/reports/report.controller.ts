import { Request, Response } from "express";
import ReportService from "./report.service";

export class ReportController {
  /**
   * POST /api/reports
   * Submit a report
   */
  static async submitReport(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { targetType, targetId, reason, description } = req.body;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const result = await ReportService.createReport(userId, {
        targetType,
        targetId,
        reason,
        description,
      });

      res.status(201).json(result);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Failed to submit report";
      res.status(statusCode).json({ error: message });
    }
  }

  /**
   * GET /api/reports/my
   * Get current user's reports
   */
  static async getUserReports(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      const result = await ReportService.getUserReports(userId, page, limit);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch reports" });
    }
  }

  /**
   * GET /api/reports/stats
   * Get report statistics (admin endpoint)
   */
  static async getReportStats(req: Request, res: Response): Promise<void> {
    try {
      const result = await ReportService.getReportStats();
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch report statistics" });
    }
  }
}

export default ReportController;
