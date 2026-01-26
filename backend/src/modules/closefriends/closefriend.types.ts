export interface CloseFriendResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface CloseFriendListResponse {
  success: boolean;
  data: Array<{
    _id: string;
    friendId: {
      _id: string;
      username: string;
      profilePicture?: string;
    };
    createdAt: Date;
  }>;
  pagination: {
    total: number;
    limit: number;
    skip: number;
    hasMore: boolean;
  };
}
