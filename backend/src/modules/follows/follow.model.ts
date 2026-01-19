import { Schema, model, Document, Types } from "mongoose";

export interface IFollow extends Document {
  followerId: Types.ObjectId;
  followingId: Types.ObjectId;
  createdAt: Date;
}

const followSchema = new Schema<IFollow>(
  {
    followerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    followingId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to prevent duplicate follows
followSchema.index({ followerId: 1, followingId: 1 }, { unique: true });
// Index for fetching user's followers
followSchema.index({ followingId: 1, createdAt: -1 });
// Index for fetching user's following list
followSchema.index({ followerId: 1, createdAt: -1 });

export const Follow = model<IFollow>("Follow", followSchema);
