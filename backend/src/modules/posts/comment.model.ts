// Comment schema
import { Schema, model, Document, Types } from "mongoose";

export interface IComment extends Document {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  text: string;
  mentions?: Types.ObjectId[];
  parentCommentId?: Types.ObjectId;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Post",
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
    mentions: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ parentCommentId: 1, createdAt: -1 });
commentSchema.index({ postId: 1, parentCommentId: 1 });

export const Comment = model<IComment>("Comment", commentSchema);
