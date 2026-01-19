// Community schema
import { Schema, model, Document, Types } from "mongoose";

export interface ICommunity extends Document {
  name: string;
  category?: string;
  description?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
}

const communitySchema = new Schema<ICommunity>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

communitySchema.index({ name: 1 });
communitySchema.index({ category: 1 });

export const Community = model<ICommunity>("Community", communitySchema);
