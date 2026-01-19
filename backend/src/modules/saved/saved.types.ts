// Type definitions for saved feature
import { Types } from "mongoose";

export interface SavedPostResponse {
  _id: string;
  userId: string;
  postId: string;
  createdAt: string;
}

export interface SavedEventResponse {
  _id: string;
  userId: string;
  eventId: string;
  createdAt: string;
}

export interface SaveResponse {
  success: boolean;
  message: string;
  data?: SavedPostResponse | SavedEventResponse;
}

export interface FetchSavedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}
