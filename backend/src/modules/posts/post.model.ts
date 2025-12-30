// Post schema
import { Schema, model, Document, Types } from "mongoose";

export interface IPost extends Document {
  authorId: Types.ObjectId;
  authorRole: string;
  type: "text" | "image" | "video" | "link";
  text?: string;
  media?: {
    url: string;
    type: string;
  };
  thumbnailUrl?: string;
  hashtags?: string[];
  taggedUsers?: Types.ObjectId[];
  taggedEventId?: Types.ObjectId;
  taggedCommunityId?: Types.ObjectId;
  visibility: "public" | "connections" | "private";
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  isFlagged: boolean;
  moderationStatus: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}
const postSchema = new Schema<IPost>(
  {
    // Core
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorRole: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "image", "video", "link"],
      required: true,
    },
    text: {
      type: String,
      trim: true,
    },
    media: {
      url: {
        type: String,
      },
      type: {
        type: String,
      },
    },
    thumbnailUrl: {
      type: String,
    },
    hashtags: {
      type: [String],
      default: [],
    },
    taggedUsers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    taggedEventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
    taggedCommunityId: {
      type: Schema.Types.ObjectId,
      ref: "Community",
    },
    visibility: {
      type: String,
      enum: ["public", "connections", "private"],
      required: true,
      default: "public",
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    comments: {
      type: Number,
      default: 0,
      min: 0,
    },
    shares: {
      type: Number,
      default: 0,
      min: 0,
    },
    saves: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ authorId: 1, createdAt: -1 });
postSchema.index({ hashtags: 1 });
postSchema.index({ taggedEventId: 1 });
postSchema.index({ taggedCommunityId: 1 });
postSchema.index({ visibility: 1, createdAt: -1 });
export const Post = model<IPost>("Post", postSchema);