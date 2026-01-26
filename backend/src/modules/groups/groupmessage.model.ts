import { Schema, model, Document, Types } from 'mongoose';

export interface IGroupMessage extends Document {
  groupId: Types.ObjectId;
  senderId: Types.ObjectId;
  message: string;
  createdAt: Date;
}

const groupMessageSchema = new Schema<IGroupMessage>(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
groupMessageSchema.index({ groupId: 1, createdAt: -1 });
groupMessageSchema.index({ senderId: 1, createdAt: -1 });
groupMessageSchema.index({ groupId: 1, createdAt: -1 }, { name: 'group_messages_index' });

export const GroupMessage = model<IGroupMessage>('GroupMessage', groupMessageSchema);
