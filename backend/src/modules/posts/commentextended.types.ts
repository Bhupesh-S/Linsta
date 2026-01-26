export interface CommentReplyResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    postId: string;
    userId: string;
    text: string;
    mentions?: string[];
    parentCommentId?: string;
    createdAt: Date;
  };
}

export interface ThreadedCommentResponse {
  success: boolean;
  data: Array<{
    _id: string;
    postId: string;
    userId: {
      _id: string;
      username: string;
      profilePicture?: string;
    };
    text: string;
    mentions?: Array<{
      _id: string;
      username: string;
    }>;
    createdAt: Date;
    replies: Array<{
      _id: string;
      userId: {
        _id: string;
        username: string;
        profilePicture?: string;
      };
      text: string;
      mentions?: Array<{
        _id: string;
        username: string;
      }>;
      createdAt: Date;
    }>;
    replyCount: number;
  }>;
  pagination: {
    total: number;
    limit: number;
    skip: number;
    hasMore: boolean;
  };
}

export interface RepliesResponse {
  success: boolean;
  data: Array<{
    _id: string;
    userId: {
      _id: string;
      username: string;
      profilePicture?: string;
    };
    text: string;
    mentions?: Array<{
      _id: string;
      username: string;
    }>;
    createdAt: Date;
  }>;
  pagination: {
    total: number;
    limit: number;
    skip: number;
    hasMore: boolean;
  };
}
