// Story schema - Stories collection
import { Schema, model, Document, Types } from "mongoose";

export interface IStory extends Document {
  userId: Types.ObjectId;
  mediaType: "image" | "video";
  mediaUrl: string;
  caption?: string;
  visibility: "public" | "close_friends";
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  expiresAt: Date;
  createdAt: Date;
}

const storySchema = new Schema<IStory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      trim: true,
    },
    visibility: {
      type: String,
      enum: ["public", "close_friends"],
      default: "public",
    },
    viewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true, // TTL index for auto-deletion
    },
  },
  {
    timestamps: true,
  }
);

// TTL index - automatically delete expired stories after expiresAt
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Indexes for querying
storySchema.index({ userId: 1, createdAt: -1 });
storySchema.index({ createdAt: -1 });

export const Story = model<IStory>("Story", storySchema);
