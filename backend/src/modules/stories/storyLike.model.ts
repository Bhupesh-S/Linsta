// Story Like schema - Tracks who liked a story
import { Schema, model, Document, Types } from "mongoose";

export interface IStoryLike extends Document {
  storyId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
}

const storyLikeSchema = new Schema<IStoryLike>(
  {
    storyId: {
      type: Schema.Types.ObjectId,
      ref: "Story",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique index to prevent duplicate likes
storyLikeSchema.index({ storyId: 1, userId: 1 }, { unique: true });

// Index for querying likes for a story
storyLikeSchema.index({ storyId: 1, createdAt: -1 });

export const StoryLike = model<IStoryLike>("StoryLike", storyLikeSchema);
