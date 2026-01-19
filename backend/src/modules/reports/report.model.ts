import { Schema, model, Document, Types } from "mongoose";

export type ReportReason = "spam" | "abuse" | "fake" | "other";
export type ReportTargetType = "post" | "story" | "comment";

export interface IReport extends Document {
  reporterId: Types.ObjectId;
  targetType: ReportTargetType;
  targetId: Types.ObjectId;
  reason: ReportReason;
  description?: string;
  createdAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ["post", "story", "comment"],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    reason: {
      type: String,
      enum: ["spam", "abuse", "fake", "other"],
      required: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: prevent duplicate reports from same user on same content
reportSchema.index({ reporterId: 1, targetType: 1, targetId: 1 }, { unique: true });
// Index for fetching reports by target
reportSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });
// Index for fetching user's reports
reportSchema.index({ reporterId: 1, createdAt: -1 });

export const Report = model<IReport>("Report", reportSchema);
