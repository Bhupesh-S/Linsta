// Network Hook - All async logic centralized here
// UI components should use this hook, not call API directly

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { networkAPI } from '../services/network.mock';
import {
  NetworkUser,
  Community,
  ConnectionRequest,
  NetworkStats,
  SearchFilters,
} from '../types/network.types';

export const useNetwork = () => {
  const [suggestions, setSuggestions] = useState<NetworkUser[]>([]);
  const [connections, setConnections] = useState<NetworkUser[]>([]);
  const [searchResults, setSearchResults] = useState<NetworkUser[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persistence helpers
  const saveToStorage = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error(`Failed to save ${key}:`, err);
    }
  };

  const loadFromStorage = async (key: string) => {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error(`Failed to load ${key}:`, err);
      return null;
    }
  };

  // Load suggestions
  const loadSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load from storage first
      const cached = await loadFromStorage('network_suggestions');
      if (cached) {
        setSuggestions(cached);
      }
      
      // Then fetch fresh data
      const response = await networkAPI.getSuggestions();
      setSuggestions(response.users);
      await saveToStorage('network_suggestions', response.users);
    } catch (err) {
      setError('Failed to load suggestions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load connections
  const loadConnections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await networkAPI.getConnections();
      setConnections(response.users);
    } catch (err) {
      setError('Failed to load connections');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search users
  const searchUsers = useCallback(async (query: string, filters?: SearchFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await networkAPI.searchUsers(query, filters);
      setSearchResults(response.users);
    } catch (err) {
      setError('Search failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Send connection request
  const sendConnectionRequest = useCallback(async (userId: string, message?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await networkAPI.sendConnectionRequest({ userId, message });
      
      if (response.success) {
        // Update local state - mark as pending and auto-follow
        setSuggestions(prev =>
          prev.map(u => (u.id === userId ? { 
            ...u, 
            connectionStatus: 'pending' as const,
            isFollowing: true, // Auto-follow when sending connection request
          } : u))
        );
        setSearchResults(prev =>
          prev.map(u => (u.id === userId ? { 
            ...u, 
            connectionStatus: 'pending' as const,
            isFollowing: true,
          } : u))
        );
        
        // Update stats
        setStats(prev => prev ? {
          ...prev,
          followingCount: prev.followingCount + 1, // We auto-follow them
        } : null);
      }
      
      return response;
    } catch (err) {
      setError('Failed to send connection request');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Accept connection request
  const acceptRequest = useCallback(async (requestId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await networkAPI.respondToRequest({ requestId, action: 'accept' });
      
      if (response.success) {
        // Find the request being accepted
        const acceptedRequest = requests.find(r => r.id === requestId);
        
        if (acceptedRequest) {
          // Create the connected user with mutual follow
          const connectedUser: NetworkUser = {
            ...acceptedRequest.user,
            connectionStatus: 'connected',
            isFollowing: true, // Mutual follow on accept
          };
          
          // Remove from requests list
          setRequests(prev => prev.filter(r => r.id !== requestId));
          
          // Add to connections list
          setConnections(prev => [...prev, connectedUser]);
          
          // Update suggestions if the user exists there
          setSuggestions(prev => 
            prev.map(user => 
              user.id === acceptedRequest.user.id 
                ? connectedUser 
                : user
            )
          );
          
          // Update stats - increment connections, decrement pending, increment followers and following
          setStats(prev => prev ? {
            ...prev,
            connectionsCount: prev.connectionsCount + 1,
            pendingRequestsCount: prev.pendingRequestsCount - 1,
            followersCount: prev.followersCount + 1, // They follow us
            followingCount: prev.followingCount + 1, // We follow them (mutual)
          } : null);
        }
      }
      
      return response;
    } catch (err) {
      setError('Failed to accept request');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [requests]);

  // Reject connection request
  const rejectRequest = useCallback(async (requestId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await networkAPI.respondToRequest({ requestId, action: 'reject' });
      
      if (response.success) {
        // Remove from requests list
        setRequests(prev => prev.filter(r => r.id !== requestId));
        
        // Update stats
        setStats(prev => prev ? {
          ...prev,
          pendingRequestsCount: prev.pendingRequestsCount - 1,
        } : null);
      }
      
      return response;
    } catch (err) {
      setError('Failed to reject request');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove connection
  const removeConnection = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await networkAPI.removeConnection(userId);
      
      if (response.success) {
        setSuggestions(prev =>
          prev.map(u => (u.id === userId ? { ...u, connectionStatus: 'none' } : u))
        );
        setSearchResults(prev =>
          prev.map(u => (u.id === userId ? { ...u, connectionStatus: 'none' } : u))
        );
        loadNetworkStats();
      }
      
      return response;
    } catch (err) {
      setError('Failed to remove connection');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load communities
  const loadCommunities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await networkAPI.getCommunities();
      setCommunities(response.communities);
    } catch (err) {
      setError('Failed to load communities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Join community
  const joinCommunity = useCallback(async (communityId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await networkAPI.joinCommunity(communityId);
      
      if (response.success) {
        setCommunities(prev =>
          prev.map(c => (c.id === communityId ? { ...c, isJoined: true, memberCount: c.memberCount + 1 } : c))
        );
      }
      
      return response;
    } catch (err) {
      setError('Failed to join community');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Leave community
  const leaveCommunity = useCallback(async (communityId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await networkAPI.leaveCommunity(communityId);
      
      if (response.success) {
        setCommunities(prev =>
          prev.map(c => (c.id === communityId ? { ...c, isJoined: false, memberCount: c.memberCount - 1 } : c))
        );
      }
      
      return response;
    } catch (err) {
      setError('Failed to leave community');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check messaging permission
  const checkMessagingPermission = useCallback(async (userId: string) => {
    try {
      const response = await networkAPI.checkMessagingPermission(userId);
      return response;
    } catch (err) {
      console.error(err);
      return { canMessage: false, reason: 'Permission check failed' };
    }
  }, []);

  // Load connection requests
  const loadConnectionRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await networkAPI.getConnectionRequests();
      setRequests(response.requests);
    } catch (err) {
      setError('Failed to load requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load network stats
  const loadNetworkStats = useCallback(async () => {
    try {
      const response = await networkAPI.getNetworkStats();
      setStats(response);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadSuggestions();
    loadCommunities();
    loadConnectionRequests();
    loadNetworkStats();
  }, [loadSuggestions, loadCommunities, loadConnectionRequests, loadNetworkStats]);

  // Follow user
  const followUser = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await networkAPI.followUser(userId);
      
      if (response.success) {
        // Update local state
        setSuggestions(prev =>
          prev.map(u => (u.id === userId ? { ...u, followStatus: response.followStatus } : u))
        );
        setSearchResults(prev =>
          prev.map(u => (u.id === userId ? { ...u, followStatus: response.followStatus } : u))
        );
      }
      
      return response;
    } catch (err) {
      setError('Failed to follow user');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Unfollow user
  const unfollowUser = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await networkAPI.unfollowUser(userId);
      
      if (response.success) {
        // Update local state
        setSuggestions(prev =>
          prev.map(u => (u.id === userId ? { ...u, followStatus: response.followStatus } : u))
        );
        setSearchResults(prev =>
          prev.map(u => (u.id === userId ? { ...u, followStatus: response.followStatus } : u))
        );
      }
      
      return response;
    } catch (err) {
      setError('Failed to unfollow user');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Block user
  const blockUser = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await networkAPI.blockUser(userId);
      
      if (response.success) {
        // Remove from all lists
        setSuggestions(prev => prev.filter(u => u.id !== userId));
        setSearchResults(prev => prev.filter(u => u.id !== userId));
        setRequests(prev => prev.filter(r => r.user.id !== userId));
      }
      
      return response;
    } catch (err) {
      setError('Failed to block user');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Unblock user
  const unblockUser = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await networkAPI.unblockUser(userId);
      
      return response;
    } catch (err) {
      setError('Failed to unblock user');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // State
    suggestions,
    connections,
    searchResults,
    communities,
    requests,
    stats,
    loading,
    error,
    
    // Actions
    searchUsers,
    sendConnectionRequest,
    acceptRequest,
    rejectRequest,
    removeConnection,
    joinCommunity,
    leaveCommunity,
    checkMessagingPermission,
    loadSuggestions,
    loadCommunities,
    loadConnectionRequests,
    loadConnections,
    followUser,
    unfollowUser,
    blockUser,
    unblockUser,
  };
};
