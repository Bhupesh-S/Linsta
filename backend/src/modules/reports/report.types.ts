import { ReportReason, ReportTargetType } from "./report.model";

export interface ReportRequest {
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description?: string;
}

export interface ReportResponse {
  _id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  description?: string;
  createdAt: string;
}

export interface ReportStats {
  totalReports: number;
  reportsByReason: {
    spam: number;
    abuse: number;
    fake: number;
    other: number;
  };
  reportsByType: {
    post: number;
    story: number;
    comment: number;
  };
}
