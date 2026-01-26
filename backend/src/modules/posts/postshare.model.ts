import { Schema, model, Document, Types } from 'mongoose';

export interface IPostShare extends Document {
  postId: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  message?: string;
  createdAt: Date;
}

const postShareSchema = new Schema<IPostShare>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
postShareSchema.index({ receiverId: 1, createdAt: -1 });
postShareSchema.index({ senderId: 1, createdAt: -1 });
postShareSchema.index({ postId: 1 });

export const PostShare = model<IPostShare>('PostShare', postShareSchema);
