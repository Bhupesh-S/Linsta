// Real HTTP implementation of NetworkAPI
// Replaces the mock implementation to use the backend /api/network routes

import { getApiUrl, getAuthHeader } from './api';
import {
  NetworkUser,
  Community,
  ConnectionRequest,
  NetworkStats,
  SuggestionsResponse,
  SearchResponse,
  ConnectResponse,
  ConnectionActionResponse,
  CommunitiesResponse,
  CommunityActionResponse,
  PermissionsResponse,
  FollowResponse,
  BlockResponse,
  SearchFilters,
  ConnectRequest as ConnectReq,
  ConnectionResponse as ConnResp,
} from '../types/network.types';
import { NetworkAPI } from './network.api';

class HttpNetworkAPI implements NetworkAPI {
  private async getJson<T>(path: string, options: RequestInit = {}): Promise<T> {
    const apiUrl = await getApiUrl();
    const authHeader = await getAuthHeader();

    const response = await fetch(`${apiUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
        ...authHeader,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Network request failed');
    }
    return data as T;
  }

  async getSuggestions(): Promise<SuggestionsResponse> {
    return this.getJson<SuggestionsResponse>('/api/network/suggestions', {
      method: 'GET',
    });
  }

  async getConnections(): Promise<SuggestionsResponse> {
    return this.getJson<SuggestionsResponse>('/api/network/connections', {
      method: 'GET',
    });
  }

  async getFollowers(): Promise<SuggestionsResponse> {
    return this.getJson<SuggestionsResponse>('/api/network/followers', {
      method: 'GET',
    });
  }

  async getFollowing(): Promise<SuggestionsResponse> {
    return this.getJson<SuggestionsResponse>('/api/network/following', {
      method: 'GET',
    });
  }

  async searchUsers(query: string, filters?: SearchFilters): Promise<SearchResponse> {
    const apiUrl = await getApiUrl();
    const authHeader = await getAuthHeader();

    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (filters && Object.keys(filters).length > 0) {
      params.append('filters', JSON.stringify(filters));
    }

    const response = await fetch(`${apiUrl}/api/network/search?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Search failed');
    }
    return data as SearchResponse;
  }

  async sendConnectionRequest(request: ConnectReq): Promise<ConnectResponse> {
    return this.getJson<ConnectResponse>('/api/network/connect', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async respondToRequest(responseBody: ConnResp): Promise<ConnectionActionResponse> {
    return this.getJson<ConnectionActionResponse>('/api/network/respond', {
      method: 'POST',
      body: JSON.stringify(responseBody),
    });
  }

  async removeConnection(userId: string): Promise<ConnectionActionResponse> {
    return this.getJson<ConnectionActionResponse>(`/api/network/connection/${userId}`, {
      method: 'DELETE',
    });
  }

  async getCommunities(): Promise<CommunitiesResponse> {
    return this.getJson<CommunitiesResponse>('/api/network/communities', {
      method: 'GET',
    });
  }

  async joinCommunity(communityId: string): Promise<CommunityActionResponse> {
    return this.getJson<CommunityActionResponse>('/api/network/community/join', {
      method: 'POST',
      body: JSON.stringify({ communityId }),
    });
  }

  async leaveCommunity(communityId: string): Promise<CommunityActionResponse> {
    return this.getJson<CommunityActionResponse>('/api/network/community/leave', {
      method: 'POST',
      body: JSON.stringify({ communityId }),
    });
  }

  async checkMessagingPermission(userId: string): Promise<PermissionsResponse> {
    return this.getJson<PermissionsResponse>(`/api/network/permissions/${userId}`, {
      method: 'GET',
    });
  }

  async getConnectionRequests(): Promise<{ requests: any[] }> {
    return this.getJson<{ requests: any[] }>('/api/network/requests', {
      method: 'GET',
    });
  }

  async followUser(userId: string): Promise<FollowResponse> {
    return this.getJson<FollowResponse>(`/api/network/follows/${userId}`, {
      method: 'POST',
    });
  }

  async unfollowUser(userId: string): Promise<FollowResponse> {
    return this.getJson<FollowResponse>(`/api/network/follows/${userId}`, {
      method: 'DELETE',
    });
  }

  async blockUser(userId: string): Promise<BlockResponse> {
    return this.getJson<BlockResponse>('/api/network/connections/block', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async unblockUser(userId: string): Promise<BlockResponse> {
    return this.getJson<BlockResponse>(`/api/network/connections/block/${userId}`, {
      method: 'DELETE',
    });
  }

  async getNetworkStats(): Promise<NetworkStats> {
    return this.getJson<NetworkStats>('/api/network/stats', {
      method: 'GET',
    });
  }

  async getUserStats(userId: string): Promise<NetworkStats> {
    return this.getJson<NetworkStats>(`/api/network/stats/${userId}`, {
      method: 'GET',
    });
  }
}

export const networkAPI: NetworkAPI = new HttpNetworkAPI();
