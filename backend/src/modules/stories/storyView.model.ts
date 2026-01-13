// Story View schema - Tracks who viewed a story
import { Schema, model, Document, Types } from "mongoose";

export interface IStoryView extends Document {
  storyId: Types.ObjectId;
  userId: Types.ObjectId;
  seenAt: Date;
}

const storyViewSchema = new Schema<IStoryView>(
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
    seenAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

// Unique index to prevent duplicate views
storyViewSchema.index({ storyId: 1, userId: 1 }, { unique: true });

// Index for querying views for a story
storyViewSchema.index({ storyId: 1, seenAt: -1 });

export const StoryView = model<IStoryView>("StoryView", storyViewSchema);
