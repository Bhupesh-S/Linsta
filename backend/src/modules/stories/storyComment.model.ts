// Story Comment schema - Tracks comments on a story
import { Schema, model, Document, Types } from "mongoose";

export interface IStoryComment extends Document {
  storyId: Types.ObjectId;
  userId: Types.ObjectId;
  text: string;
  createdAt: Date;
}

const storyCommentSchema = new Schema<IStoryComment>(
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
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for querying comments for a story
storyCommentSchema.index({ storyId: 1, createdAt: -1 });

// Index for querying user's comments
storyCommentSchema.index({ userId: 1, createdAt: -1 });

export const StoryComment = model<IStoryComment>("StoryComment", storyCommentSchema);
