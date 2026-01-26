import { Schema, model, Document, Types } from 'mongoose';

export interface ICloseFriend extends Document {
  userId: Types.ObjectId;
  friendId: Types.ObjectId;
  createdAt: Date;
}

const closeFriendSchema = new Schema<ICloseFriend>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    friendId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Compound unique index to prevent duplicates
closeFriendSchema.index({ userId: 1, friendId: 1 }, { unique: true });

// Sort indexes for efficient queries
closeFriendSchema.index({ userId: 1, createdAt: -1 });

export const CloseFriend = model<ICloseFriend>('CloseFriend', closeFriendSchema);
