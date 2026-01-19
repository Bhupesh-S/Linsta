import { Schema, model, Document, Types } from "mongoose";

// Saved Post interface
export interface ISavedPost extends Document {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  createdAt: Date;
}

const savedPostSchema = new Schema<ISavedPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate saves
savedPostSchema.index({ userId: 1, postId: 1 }, { unique: true });
// Index for fetching user's saved posts
savedPostSchema.index({ userId: 1, createdAt: -1 });

export const SavedPost = model<ISavedPost>("SavedPost", savedPostSchema);

// Saved Event interface
export interface ISavedEvent extends Document {
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  createdAt: Date;
}

const savedEventSchema = new Schema<ISavedEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate saves
savedEventSchema.index({ userId: 1, eventId: 1 }, { unique: true });
// Index for fetching user's saved events
savedEventSchema.index({ userId: 1, createdAt: -1 });

export const SavedEvent = model<ISavedEvent>("SavedEvent", savedEventSchema);
