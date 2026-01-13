// Story types and interfaces
export interface CreateStoryRequest {
  mediaType: "image" | "video";
  mediaUrl: string;
  caption?: string;
}

export interface StoryResponse {
  _id: string;
  userId: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  caption?: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  expiresAt: Date;
  createdAt: Date;
  userLiked?: boolean;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface UserStoriesResponse {
  userId: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  stories: StoryResponse[];
}

export interface AllStoriesResponse {
  [userId: string]: UserStoriesResponse;
}

export interface StoryCommentResponse {
  _id: string;
  storyId: string;
  userId: string;
  text: string;
  createdAt: Date;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface StoryViewerResponse {
  _id: string;
  name: string;
  email: string;
  viewedAt: Date;
}

export interface CreateCommentRequest {
  text: string;
}
