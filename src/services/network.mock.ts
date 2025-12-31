// Mock Implementation of Network API
// This allows frontend to work standalone without backend

import {
  NetworkAPI,
} from './network.api';
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
  SearchFilters,
  ConnectRequest as ConnectReq,
  ConnectionResponse as ConnResp,
} from '../types/network.types';

// Mock Data Store
let mockUsers: NetworkUser[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'faculty',
    organization: 'MIT',
    skills: ['Machine Learning', 'Data Science', 'Python'],
    avatarUrl: undefined,
    connectionStatus: 'none',
    location: 'Boston, MA',
    bio: 'Professor of Computer Science',
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'student',
    organization: 'Stanford University',
    skills: ['Web Development', 'React', 'TypeScript'],
    avatarUrl: undefined,
    connectionStatus: 'connected',
    location: 'Palo Alto, CA',
    bio: 'CS Graduate Student',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'organizer',
    organization: 'TechConf',
    skills: ['Event Planning', 'Marketing', 'Community Building'],
    avatarUrl: undefined,
    connectionStatus: 'requested',
    location: 'San Francisco, CA',
    bio: 'Tech Event Organizer',
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'faculty',
    organization: 'Harvard University',
    skills: ['AI Research', 'Neural Networks', 'TensorFlow'],
    avatarUrl: undefined,
    connectionStatus: 'none',
    location: 'Cambridge, MA',
    bio: 'AI Research Professor',
  },
  {
    id: '5',
    name: 'Lisa Wang',
    role: 'student',
    organization: 'UC Berkeley',
    skills: ['Mobile Development', 'React Native', 'Swift'],
    avatarUrl: undefined,
    connectionStatus: 'none',
    location: 'Berkeley, CA',
    bio: 'Mobile App Developer',
  },
];

let mockCommunities: Community[] = [
  {
    id: 'c1',
    name: 'AI Researchers',
    category: 'Research',
    memberCount: 1250,
    isJoined: false,
    description: 'Community for AI and ML researchers',
  },
  {
    id: 'c2',
    name: 'Web Developers',
    category: 'Technology',
    memberCount: 3400,
    isJoined: true,
    description: 'Frontend and backend web development',
  },
  {
    id: 'c3',
    name: 'Event Organizers',
    category: 'Professional',
    memberCount: 890,
    isJoined: false,
    description: 'Tech event planning and networking',
  },
  {
    id: 'c4',
    name: 'Alumni Network',
    category: 'Alumni',
    memberCount: 5600,
    isJoined: true,
    description: 'Connect with fellow alumni',
  },
];

let mockRequests: ConnectionRequest[] = [
  {
    id: 'r1',
    user: mockUsers[2],
    timestamp: '2024-01-15T10:30:00Z',
    message: 'Would love to connect!',
  },
];

const mockStats: NetworkStats = {
  connectionsCount: 234,
  followersCount: 567,
  pendingRequestsCount: 3,
};

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockNetworkAPI implements NetworkAPI {
  async getSuggestions(): Promise<SuggestionsResponse> {
    await delay(500);
    return {
      users: mockUsers.filter(u => u.connectionStatus === 'none'),
      total: mockUsers.filter(u => u.connectionStatus === 'none').length,
    };
  }

  async searchUsers(query: string, filters?: SearchFilters): Promise<SearchResponse> {
    await delay(300);
    
    let results = [...mockUsers];
    
    // Filter by query
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(
        u =>
          u.name.toLowerCase().includes(lowerQuery) ||
          u.organization.toLowerCase().includes(lowerQuery) ||
          u.skills.some(s => s.toLowerCase().includes(lowerQuery))
      );
    }
    
    // Apply filters
    if (filters?.role) {
      results = results.filter(u => u.role === filters.role);
    }
    
    if (filters?.location) {
      results = results.filter(u => u.location?.includes(filters.location!));
    }
    
    if (filters?.skills && filters.skills.length > 0) {
      results = results.filter(u =>
        filters.skills!.some(skill => u.skills.includes(skill))
      );
    }
    
    return {
      users: results,
      total: results.length,
    };
  }

  async sendConnectionRequest(request: ConnectReq): Promise<ConnectResponse> {
    await delay(400);
    
    const user = mockUsers.find(u => u.id === request.userId);
    if (user) {
      user.connectionStatus = 'requested';
    }
    
    return {
      success: true,
      requestId: `req_${Date.now()}`,
      message: 'Connection request sent successfully',
    };
  }

  async respondToRequest(response: ConnResp): Promise<ConnectionActionResponse> {
    await delay(400);
    
    if (response.action === 'accept') {
      const request = mockRequests.find(r => r.id === response.requestId);
      if (request) {
        request.user.connectionStatus = 'connected';
        mockRequests = mockRequests.filter(r => r.id !== response.requestId);
      }
      return {
        success: true,
        message: 'Connection request accepted',
      };
    } else {
      mockRequests = mockRequests.filter(r => r.id !== response.requestId);
      return {
        success: true,
        message: 'Connection request rejected',
      };
    }
  }

  async removeConnection(userId: string): Promise<ConnectionActionResponse> {
    await delay(400);
    
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      user.connectionStatus = 'none';
    }
    
    return {
      success: true,
      message: 'Connection removed successfully',
    };
  }

  async getCommunities(): Promise<CommunitiesResponse> {
    await delay(500);
    return {
      communities: mockCommunities,
      total: mockCommunities.length,
    };
  }

  async joinCommunity(communityId: string): Promise<CommunityActionResponse> {
    await delay(400);
    
    const community = mockCommunities.find(c => c.id === communityId);
    if (community) {
      community.isJoined = true;
      community.memberCount += 1;
    }
    
    return {
      success: true,
      message: 'Successfully joined community',
    };
  }

  async leaveCommunity(communityId: string): Promise<CommunityActionResponse> {
    await delay(400);
    
    const community = mockCommunities.find(c => c.id === communityId);
    if (community) {
      community.isJoined = false;
      community.memberCount -= 1;
    }
    
    return {
      success: true,
      message: 'Successfully left community',
    };
  }

  async checkMessagingPermission(userId: string): Promise<PermissionsResponse> {
    await delay(200);
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return {
        canMessage: false,
        reason: 'User not found',
      };
    }
    
    if (user.connectionStatus !== 'connected') {
      return {
        canMessage: false,
        reason: 'You must be connected to message this user',
      };
    }
    
    return {
      canMessage: true,
    };
  }

  async getConnectionRequests() {
    await delay(300);
    return {
      requests: mockRequests,
    };
  }

  async getNetworkStats() {
    await delay(300);
    return mockStats;
  }
}

// Export singleton instance
export const networkAPI = new MockNetworkAPI();
