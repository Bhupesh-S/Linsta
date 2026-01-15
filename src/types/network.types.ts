// Type Contracts for Networking Module
// These types define the contract between frontend and backend

export type UserRole = 'student' | 'faculty' | 'organizer';
export type ConnectionStatus = 'none' | 'pending' | 'connected' | 'declined' | 'blocked';
export type FollowStatus = 'not_following' | 'following' | 'followed_by' | 'mutual';

export interface NetworkUser {
  id: string;
  name: string;
  role: UserRole;
  organization: string;
  skills: string[];
  avatarUrl?: string;
  connectionStatus: ConnectionStatus;
  followStatus?: FollowStatus;
  location?: string;
  bio?: string;
}

export interface Community {
  id: string;
  name: string;
  category: string;
  memberCount: number;
  isJoined: boolean;
  description?: string;
  imageUrl?: string;
}

export interface ConnectionRequest {
  id: string;
  user: NetworkUser;
  timestamp: string;
  message?: string;
}

export interface NetworkStats {
  connectionsCount: number;
  followersCount: number;
  followingCount: number;
  pendingRequestsCount: number;
}

export interface MessagingPermission {
  userId: string;
  canMessage: boolean;
  reason?: string;
}

// API Request Types
export interface SearchFilters {
  role?: UserRole;
  location?: string;
  skills?: string[];
}

export interface ConnectRequest {
  userId: string;
  message?: string;
}

export interface ConnectionResponse {
  requestId: string;
  action: 'accept' | 'reject';
}

// API Response Types
export interface SuggestionsResponse {
  users: NetworkUser[];
  total: number;
}

export interface SearchResponse {
  users: NetworkUser[];
  total: number;
}

export interface ConnectResponse {
  success: boolean;
  requestId: string;
  message: string;
}

export interface ConnectionActionResponse {
  success: boolean;
  message: string;
}

export interface CommunitiesResponse {
  communities: Community[];
  total: number;
}

export interface CommunityActionResponse {
  success: boolean;
  message: string;
}

export interface PermissionsResponse {
  canMessage: boolean;
  reason?: string;
}

export interface FollowResponse {
  success: boolean;
  message: string;
}

export interface BlockResponse {
  success: boolean;
  message: string;
}
