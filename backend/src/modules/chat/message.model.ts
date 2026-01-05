import mongoose, { Schema, Document, Types } from "mongoose";

// Interface for TypeScript
export interface IMessage extends Document {
  chatRoomId: Types.ObjectId;
  senderId: Types.ObjectId;
  text: string;
  createdAt: Date;
}

// Schema definition
const MessageSchema = new Schema<IMessage>(
  {
    chatRoomId: {
      type: Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

// Index for efficient querying
MessageSchema.index({ chatRoomId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1 });

// Export model
const Message = mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
