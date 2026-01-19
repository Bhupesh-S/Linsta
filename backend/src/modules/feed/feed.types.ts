export interface FeedPost {
  _id: string;
  caption: string;
  author: any;
  event?: any;
  likes: number;
  comments: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedResponse {
  success: boolean;
  data: FeedPost[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
