import { Schema, model, Document, Types } from "mongoose";

// Job interface
export interface IJob extends Document {
  title: string;
  companyName: string;
  description: string;
  location: string;
  jobType: "Internship" | "Full-time" | "Part-time";
  createdBy: Types.ObjectId; // Reference to User
  createdAt: Date;
  updatedAt: Date;
}

// Job schema
const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    jobType: {
      type: String,
      enum: ["Internship", "Full-time", "Part-time"],
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes for performance
jobSchema.index({ createdBy: 1, createdAt: -1 }); // Find user's posted jobs
jobSchema.index({ title: "text", description: "text", location: "text" }); // Full-text search
jobSchema.index({ jobType: 1 }); // Filter by job type
jobSchema.index({ createdAt: -1 }); // Latest jobs

// Export model
export default model<IJob>("Job", jobSchema);
