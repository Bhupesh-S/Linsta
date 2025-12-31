// Network Hook - All async logic centralized here
// UI components should use this hook, not call API directly

import { useState, useEffect, useCallback } from 'react';
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
  const [searchResults, setSearchResults] = useState<NetworkUser[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load suggestions
  const loadSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await networkAPI.getSuggestions();
      setSuggestions(response.users);
    } catch (err) {
      setError('Failed to load suggestions');
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
        // Update local state
        setSuggestions(prev =>
          prev.map(u => (u.id === userId ? { ...u, connectionStatus: 'requested' } : u))
        );
        setSearchResults(prev =>
          prev.map(u => (u.id === userId ? { ...u, connectionStatus: 'requested' } : u))
        );
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
        setRequests(prev => prev.filter(r => r.id !== requestId));
        // Reload stats
        loadNetworkStats();
      }
      
      return response;
    } catch (err) {
      setError('Failed to accept request');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reject connection request
  const rejectRequest = useCallback(async (requestId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await networkAPI.respondToRequest({ requestId, action: 'reject' });
      
      if (response.success) {
        setRequests(prev => prev.filter(r => r.id !== requestId));
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

  return {
    // State
    suggestions,
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
  };
};
