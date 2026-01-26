import { Schema, model, Document, Types } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  description?: string;
  createdBy: Types.ObjectId;
  members: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const groupSchema = new Schema<IGroup>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// Indexes for efficient queries
groupSchema.index({ createdBy: 1, createdAt: -1 });
groupSchema.index({ members: 1 });
groupSchema.index({ name: 'text' });

export const Group = model<IGroup>('Group', groupSchema);
