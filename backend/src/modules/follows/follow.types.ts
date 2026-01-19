export interface FollowResponse {
  _id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface UserFollowInfo {
  _id: string;
  name: string;
  email: string;
  followersCount?: number;
  followingCount?: number;
}

export interface FollowListResponse {
  success: boolean;
  data: UserFollowInfo[];
  total: number;
  page: number;
  limit: number;
}
