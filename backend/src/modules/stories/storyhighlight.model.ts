import { Schema, model, Document, Types } from 'mongoose';

export interface IStoryHighlight extends Document {
  userId: Types.ObjectId;
  title: string;
  coverImageUrl?: string;
  stories: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const storyHighlightSchema = new Schema<IStoryHighlight>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    coverImageUrl: {
      type: String,
    },
    stories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Story',
      },
    ],
  },
  { timestamps: true }
);

// Indexes for efficient queries
storyHighlightSchema.index({ userId: 1, createdAt: -1 });
storyHighlightSchema.index({ userId: 1 });

export const StoryHighlight = model<IStoryHighlight>('StoryHighlight', storyHighlightSchema);
