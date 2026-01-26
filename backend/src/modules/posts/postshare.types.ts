export interface PostShareResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    postId: string;
    senderId: string;
    receiverId: string;
    message?: string;
    createdAt: Date;
  };
}

export interface SharedPostsResponse {
  success: boolean;
  data: Array<{
    _id: string;
    postId: {
      _id: string;
      caption: string;
      mediaUrl?: string;
      likesCount: number;
      commentsCount: number;
    };
    senderId: {
      _id: string;
      username: string;
      profilePicture?: string;
    };
    message?: string;
    createdAt: Date;
  }>;
  pagination: {
    total: number;
    limit: number;
    skip: number;
    hasMore: boolean;
  };
}
