export interface StoryHighlightResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface StoryHighlightListResponse {
  success: boolean;
  data: Array<{
    _id: string;
    userId: string;
    title: string;
    coverImageUrl?: string;
    stories: Array<{
      _id: string;
      mediaUrl: string;
      caption?: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
  }>;
  pagination: {
    total: number;
    limit: number;
    skip: number;
    hasMore: boolean;
  };
}

export interface HighlightDetailResponse {
  success: boolean;
  data: {
    _id: string;
    userId: string;
    title: string;
    coverImageUrl?: string;
    stories: Array<{
      _id: string;
      mediaUrl: string;
      caption?: string;
      mediaType: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
  };
}
