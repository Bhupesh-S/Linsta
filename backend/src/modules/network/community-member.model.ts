// CommunityMember schema
import { Schema, model, Document, Types } from "mongoose";

export type CommunityMemberRole = "member" | "admin";

export interface ICommunityMember extends Document {
  communityId: Types.ObjectId;
  userId: Types.ObjectId;
  role: CommunityMemberRole;
  joinedAt: Date;
}

const communityMemberSchema = new Schema<ICommunityMember>({
  communityId: {
    type: Schema.Types.ObjectId,
    ref: "Community",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["member", "admin"],
    default: "member",
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

communityMemberSchema.index({ communityId: 1, userId: 1 }, { unique: true });

export const CommunityMember = model<ICommunityMember>(
  "CommunityMember",
  communityMemberSchema
);
