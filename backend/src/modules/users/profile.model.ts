// User Profile schema
import { Schema, model, Document, Types } from "mongoose";

export interface IUserProfile extends Document {
  userId: Types.ObjectId;
  university?: string;
  course?: string;
  year?: string;
  skills: string[];
  interests: string[];
}

const profileSchema = new Schema<IUserProfile>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  university: {
    type: String,
  },
  course: {
    type: String,
  },
  year: {
    type: String,
  },
  skills: {
    type: [String],
    default: [],
  },
  interests: {
    type: [String],
    default: [],
  },
});

export const UserProfile = model<IUserProfile>("UserProfile", profileSchema);
