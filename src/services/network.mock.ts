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
    name: 'Priya Sharma',
    role: 'student',
    organization: 'IIT Bombay',
    skills: ['React Native', 'Node.js', 'MongoDB'],
    avatarUrl: undefined,
    connectionStatus: 'none',
    isFollowing: false,
    followStatus: 'not_following',
    location: 'Mumbai, India',
    bio: 'Computer Science student passionate about mobile development',
  },
  {
    id: '2',
    name: 'Rahul Verma',
    role: 'faculty',
    organization: 'IIT Delhi',
    skills: ['Machine Learning', 'AI', 'Python'],
    avatarUrl: undefined,
    connectionStatus: 'connected',
    isFollowing: true,
    followStatus: 'mutual',
    location: 'New Delhi, India',
    bio: 'Assistant Professor specializing in AI and ML',
  },
  {
    id: '3',
    name: 'Ananya Reddy',
    role: 'student',
    organization: 'NIT Trichy',
    skills: ['React', 'TypeScript', 'Full Stack'],
    avatarUrl: undefined,
    connectionStatus: 'pending',
    isFollowing: true,
    followStatus: 'following',
    location: 'Tiruchirappalli, India',
    bio: 'Final year student, Full Stack Developer',
  },
  {
    id: '4',
    name: 'Arjun Patel',
    role: 'faculty',
    organization: 'IISc Bangalore',
    skills: ['Data Science', 'Deep Learning', 'TensorFlow'],
    avatarUrl: undefined,
    connectionStatus: 'none',
    isFollowing: false,
    followStatus: 'not_following',
    location: 'Bangalore, India',
    bio: 'Research Professor in Deep Learning',
  },
  {
    id: '5',
    name: 'Sneha Gupta',
    role: 'student',
    organization: 'IIT Madras',
    skills: ['Flutter', 'Dart', 'Mobile Development'],
    avatarUrl: undefined,
    connectionStatus: 'none',
    isFollowing: false,
    followStatus: 'followed_by',
    location: 'Chennai, India',
    bio: 'Mobile app developer and UI/UX enthusiast',
  },
  {
    id: '6',
    name: 'Vikram Singh',
    role: 'organizer',
    organization: 'IIT Kharagpur',
    skills: ['Event Management', 'Community Building', 'Marketing'],
    avatarUrl: undefined,
    connectionStatus: 'connected',
    isFollowing: true,
    followStatus: 'mutual',
    location: 'Kharagpur, India',
    bio: 'Tech event organizer and community builder',
  },
  {
    id: '7',
    name: 'Kavya Iyer',
    role: 'student',
    organization: 'NIT Surathkal',
    skills: ['DevOps', 'AWS', 'Docker'],
    avatarUrl: undefined,
    connectionStatus: 'none',
    isFollowing: false,
    followStatus: 'not_following',
    location: 'Mangalore, India',
    bio: 'DevOps enthusiast, cloud computing student',
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
    user: {
      id: '8',
      name: 'Aditya Kumar',
      role: 'student',
      organization: 'IIT Kanpur',
      skills: ['Python', 'AI', 'Machine Learning'],
      connectionStatus: 'requested',
      isFollowing: false,
      followStatus: 'not_following',
      location: 'Kanpur, India',
      bio: 'AI/ML enthusiast, looking to collaborate on projects',
    },
    timestamp: '2024-01-15T10:30:00Z',
    message: 'Hi! I saw your profile and would love to connect. I\'m working on similar AI projects.',
  },
  {
    id: 'r2',
    user: {
      id: '9',
      name: 'Meera Nair',
      role: 'student',
      organization: 'NIT Calicut',
      skills: ['React', 'Node.js', 'MongoDB'],
      connectionStatus: 'requested',
      isFollowing: false,
      followStatus: 'not_following',
      location: 'Calicut, India',
      bio: 'Full stack developer, open source contributor',
    },
    timestamp: '2024-01-14T15:20:00Z',
    message: 'Would love to connect and discuss web development opportunities!',
  },
  {
    id: 'r3',
    user: {
      id: '10',
      name: 'Rohan Desai',
      role: 'student',
      organization: 'IIT Roorkee',
      skills: ['Blockchain', 'Solidity', 'Web3'],
      connectionStatus: 'requested',
      isFollowing: false,
      followStatus: 'not_following',
      location: 'Roorkee, India',
      bio: 'Blockchain developer and crypto enthusiast',
    },
    timestamp: '2024-01-13T09:45:00Z',
  },
  {
    id: 'r4',
    user: {
      id: '11',
      name: 'Sanjana Iyer',
      role: 'student',
      organization: 'IIT Guwahati',
      skills: ['Data Science', 'Python', 'TensorFlow'],
      connectionStatus: 'requested',
      isFollowing: false,
      followStatus: 'not_following',
      location: 'Guwahati, India',
      bio: 'Data science student passionate about ML and analytics',
    },
    timestamp: '2024-01-12T14:15:00Z',
    message: 'I noticed we have similar interests in data science. Let\'s connect!',
  },
  {
    id: 'r5',
    user: {
      id: '12',
      name: 'Karthik Menon',
      role: 'student',
      organization: 'NIT Warangal',
      skills: ['Java', 'Spring Boot', 'Microservices'],
      connectionStatus: 'requested',
      isFollowing: false,
      followStatus: 'not_following',
      location: 'Warangal, India',
      bio: 'Backend developer, building scalable systems',
    },
    timestamp: '2024-01-11T11:30:00Z',
    message: 'Hey! I\'m working on microservices architecture. Would be great to exchange ideas.',
  },
  {
    id: 'r6',
    user: {
      id: '13',
      name: 'Divya Reddy',
      role: 'student',
      organization: 'IIT Hyderabad',
      skills: ['UI/UX', 'Figma', 'React Native'],
      connectionStatus: 'requested',
      isFollowing: false,
      followStatus: 'not_following',
      location: 'Hyderabad, India',
      bio: 'UI/UX designer and mobile app developer',
    },
    timestamp: '2024-01-10T16:45:00Z',
    message: 'Love your work! I\'m also into mobile app design and development.',
  },
  {
    id: 'r7',
    user: {
      id: '14',
      name: 'Arjun Pillai',
      role: 'student',
      organization: 'BITS Pilani',
      skills: ['C++', 'Competitive Programming', 'Algorithms'],
      connectionStatus: 'requested',
      isFollowing: false,
      followStatus: 'not_following',
      location: 'Pilani, India',
      bio: 'Competitive programmer, ACM ICPC participant',
    },
    timestamp: '2024-01-09T13:20:00Z',
  },
  {
    id: 'r8',
    user: {
      id: '15',
      name: 'Pooja Sharma',
      role: 'student',
      organization: 'IIT Indore',
      skills: ['Cybersecurity', 'Ethical Hacking', 'Network Security'],
      connectionStatus: 'requested',
      isFollowing: false,
      followStatus: 'not_following',
      location: 'Indore, India',
      bio: 'Cybersecurity enthusiast, CTF player',
    },
    timestamp: '2024-01-08T10:00:00Z',
    message: 'Interested in cybersecurity? Let\'s connect and share resources!',
  },
  {
    id: 'r9',
    user: {
      id: '16',
      name: 'Varun Krishnan',
      role: 'student',
      organization: 'NIT Rourkela',
      skills: ['DevOps', 'Kubernetes', 'CI/CD'],
      connectionStatus: 'requested',
      isFollowing: false,
      followStatus: 'not_following',
      location: 'Rourkela, India',
      bio: 'DevOps engineer, automating everything',
    },
    timestamp: '2024-01-07T12:30:00Z',
    message: 'Hi! I work with DevOps tools. Would love to connect with fellow tech enthusiasts.',
  },
  {
    id: 'r10',
    user: {
      id: '17',
      name: 'Lakshmi Menon',
      role: 'student',
      organization: 'IIT Mandi',
      skills: ['IoT', 'Embedded Systems', 'Arduino'],
      connectionStatus: 'requested',
      isFollowing: false,
      followStatus: 'not_following',
      location: 'Mandi, India',
      bio: 'IoT developer, building smart solutions',
    },
    timestamp: '2024-01-06T09:15:00Z',
    message: 'Working on IoT projects. Let\'s collaborate!',
  },
];

const mockStats: NetworkStats = {
  connectionsCount: 2,
  followersCount: 15,
  followingCount: 12,
  pendingRequestsCount: 10,
};

// Internal tracking for connection/follow states
let sentRequests = new Set<string>(['3']); // User IDs we sent requests to
let acceptedFromMe = new Set<string>(['2', '6']); // Users who accepted our requests (mutual connections)
let mutualConnections = new Set<string>(['2', '6']); // Fully mutual connections
let followingUsers = new Set<string>(['3']); // Users we are following
let followerUsers = new Set<string>(['5']); // Users following us
let blockedUsers = new Set<string>(); // Users we have blocked
let acceptedConnectionsMap = new Map<string, NetworkUser>(); // User objects we accepted from requests

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

  async getConnections(): Promise<SuggestionsResponse> {
    await delay(500);
    
    // Get connections from mockUsers
    const connectedFromMockUsers = mockUsers.filter(u => u.connectionStatus === 'connected');
    
    // Get accepted connections from the Map
    const acceptedFromRequests = Array.from(acceptedConnectionsMap.values());
    
    const allConnections = [...connectedFromMockUsers, ...acceptedFromRequests];
    
    return {
      users: allConnections,
      total: allConnections.length,
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
      user.connectionStatus = 'pending';
      sentRequests.add(request.userId);
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
        // Store the full user object with connected status
        const connectedUser: NetworkUser = {
          ...request.user,
          connectionStatus: 'connected',
          isFollowing: true, // Mutual follow
        };
        
        acceptedConnectionsMap.set(request.user.id, connectedUser);
        mutualConnections.add(request.user.id);
        
        // Remove from requests
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
    
    // Calculate connections dynamically
    const connectedFromMockUsers = mockUsers.filter(u => u.connectionStatus === 'connected').length;
    const acceptedConnectionsCount = acceptedConnectionsMap.size;
    const totalConnections = connectedFromMockUsers + acceptedConnectionsCount;
    
    // Calculate pending requests dynamically
    const pendingRequestsCount = mockRequests.length;
    
    // Use tracking sets for followers/following
    const followersCount = followerUsers.size + mutualConnections.size;
    const followingCount = followingUsers.size + mutualConnections.size;
    
    return {
      connectionsCount: totalConnections,
      followersCount: followersCount,
      followingCount: followingCount,
      pendingRequestsCount: pendingRequestsCount,
    };
  }

  async followUser(userId: string) {
    await delay(300);
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return {
        success: false,
        message: 'User not found',
        followStatus: 'not_following',
      };
    }

    followingUsers.add(userId);
    
    // Update follow status based on mutual following
    if (followerUsers.has(userId)) {
      user.followStatus = 'mutual';
    } else {
      user.followStatus = 'following';
    }

    return {
      success: true,
      message: 'Successfully followed user',
      followStatus: user.followStatus,
    };
  }

  async unfollowUser(userId: string) {
    await delay(300);
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return {
        success: false,
        message: 'User not found',
        followStatus: 'not_following',
      };
    }

    followingUsers.delete(userId);
    
    // Update follow status
    if (followerUsers.has(userId)) {
      user.followStatus = 'followed_by';
    } else {
      user.followStatus = 'not_following';
    }

    return {
      success: true,
      message: 'Successfully unfollowed user',
      followStatus: user.followStatus,
    };
  }

  async blockUser(userId: string) {
    await delay(300);
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    blockedUsers.add(userId);
    user.connectionStatus = 'blocked';
    
    // Remove from all tracking sets
    followingUsers.delete(userId);
    followerUsers.delete(userId);
    sentRequests.delete(userId);
    acceptedFromMe.delete(userId);
    mutualConnections.delete(userId);

    return {
      success: true,
      message: 'User blocked successfully',
    };
  }

  async unblockUser(userId: string) {
    await delay(300);
    
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    blockedUsers.delete(userId);
    user.connectionStatus = 'none';
    user.followStatus = 'not_following';

    return {
      success: true,
      message: 'User unblocked successfully',
    };
  }
}

// Export singleton instance
export const networkAPI = new MockNetworkAPI();
