import { Schema, model, Document, Types } from "mongoose";

// Job Application interface
export interface IJobApplication extends Document {
  jobId: Types.ObjectId; // Reference to Job
  applicantId: Types.ObjectId; // Reference to User
  resumeUrl: string;
  status: "Applied" | "Reviewed" | "Rejected";
  createdAt: Date;
  updatedAt: Date;
}

// Job Application schema
const jobApplicationSchema = new Schema<IJobApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeUrl: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Reviewed", "Rejected"],
      default: "Applied",
    },
  },
  { timestamps: true }
);

// Unique constraint: one application per user per job
jobApplicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

// Indexes for performance
jobApplicationSchema.index({ applicantId: 1, createdAt: -1 }); // User's applications
jobApplicationSchema.index({ jobId: 1, createdAt: -1 }); // Job's applications
jobApplicationSchema.index({ status: 1 }); // Filter by status

// Export model
export default model<IJobApplication>("JobApplication", jobApplicationSchema);
