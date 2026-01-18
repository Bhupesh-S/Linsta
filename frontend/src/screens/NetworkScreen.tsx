// NetworkScreen - Main networking interface

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNetwork } from '../hooks/useNetwork';
import { useMessages } from '../context/MessageContext';
import { UserCard } from '../components/UserCard';
import { CommunityCard } from '../components/CommunityCard';
import { ProfilePreviewModal } from '../components/ProfilePreviewModal';
import { NetworkUser, SearchFilters } from '../types/network.types';
import { postsApi, Post as BackendPost } from '../services/posts.api';
import PostCard from '../components/PostCard';
import BottomNavigation from '../components/BottomNavigation';
import CreateContentModal from '../components/CreateContentModal';

type TabType = 'feed' | 'connections' | 'suggestions' | 'requests';

interface NetworkScreenProps {
  navigation?: any;
}

export const NetworkScreen: React.FC<NetworkScreenProps> = ({ navigation }) => {
  const {
    suggestions,
    searchResults,
    communities,
    requests,
    stats,
    loading,
    error,
    searchUsers,
    sendConnectionRequest,
    acceptRequest,
    rejectRequest,
    joinCommunity,
    leaveCommunity,
    checkMessagingPermission,
    connections,
  } = useNetwork();

  const { openConversationWithUser } = useMessages();

  const [activeTab, setActiveTab] = useState<TabType>('suggestions');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedUser, setSelectedUser] = useState<NetworkUser | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showFirstVisitBanner, setShowFirstVisitBanner] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Network feed state (real posts from backend)
  const [feedPosts, setFeedPosts] = useState<BackendPost[]>([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedRefreshing, setFeedRefreshing] = useState(false);
  const [feedError, setFeedError] = useState<string | null>(null);

  const loadFeed = useCallback(async (isRefresh: boolean = false) => {
    if (!isRefresh) {
      setFeedLoading(true);
    }
    setFeedError(null);
    try {
      const posts = await postsApi.getFeed(20, 0);
      setFeedPosts(posts);
    } catch (err) {
      console.error('Failed to load network feed', err);
      setFeedError('Failed to load network feed');
    } finally {
      if (!isRefresh) {
        setFeedLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'feed' && feedPosts.length === 0 && !feedLoading) {
      loadFeed(false);
    }
  }, [activeTab, feedPosts.length, feedLoading, loadFeed]);

  const handleRefreshFeed = useCallback(async () => {
    setFeedRefreshing(true);
    try {
      await loadFeed(true);
    } finally {
      setFeedRefreshing(false);
    }
  }, [loadFeed]);

  const handlePostDeleted = useCallback((postId: string) => {
    setFeedPosts(prev => prev.filter(p => p._id !== postId));
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchUsers(searchQuery, filters);
    }
  };

  const handleConnect = async (userId: string) => {
    try {
      await sendConnectionRequest(userId);
      Alert.alert('Success', 'Connection request sent!');
    } catch (err) {
      Alert.alert('Error', 'Failed to send connection request');
    }
  };

  const handleViewProfile = (user: NetworkUser) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const handleMessage = async (userId: string, name: string) => {
    try {
      const conversationId = await openConversationWithUser(userId, name);
      if (navigation) {
        navigation.navigate('Chat', { conversationId });
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to open chat');
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptRequest(requestId);
      Alert.alert('Success', 'Connection request accepted!');
    } catch (err) {
      Alert.alert('Error', 'Failed to accept request');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectRequest(requestId);
      Alert.alert('Success', 'Connection request rejected');
    } catch (err) {
      Alert.alert('Error', 'Failed to reject request');
    }
  };

  const handleCreatePress = () => {
    setShowCreateModal(true);
  };

  const handleCreateStory = () => {
    if (navigation) {
      navigation.navigate('CreateStory');
    }
  };

  const handleCreatePost = () => {
    if (navigation) {
      navigation.navigate('CreateArticle');
    }
  };

  const handleCreateEvent = () => {
    if (navigation) {
      navigation.navigate('CreateEvent');
    }
  };

  const handleCreateReel = () => {
    if (navigation) {
      navigation.navigate('CreateReel');
    }
  };

  const renderTabContent = () => {
    if (loading && !suggestions.length) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0a66c2" />
        </View>
      );
    }

    switch (activeTab) {
      case 'suggestions':
        return (
          <View>
            {suggestions.map(user => (
              <UserCard
                key={user.id}
                user={user}
                onConnect={handleConnect}
                onViewProfile={handleViewProfile}
              />
            ))}
            {suggestions.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No suggestions available</Text>
              </View>
            )}
          </View>
        );

      case 'requests':
        return (
          <View>
            {requests.map(request => (
              <View key={request.id} style={styles.requestCard}>
                <UserCard
                  user={request.user}
                  onConnect={handleConnect}
                  onViewProfile={handleViewProfile}
                />
                {request.message && (
                  <Text style={styles.requestMessage}>"{request.message}"</Text>
                )}
                <View style={styles.requestActions}>
                  <TouchableOpacity
                    onPress={() => handleAcceptRequest(request.id)}
                    style={[styles.requestButton, styles.acceptButton]}
                  >
                    <Text style={styles.acceptButtonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleRejectRequest(request.id)}
                    style={[styles.requestButton, styles.rejectButton]}
                  >
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            {requests.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No pending requests</Text>
              </View>
            )}
          </View>
        );

      case 'connections':
        const connectedUsers = connections;
        return (
          <View>
            {connectedUsers.length > 0 ? (
              connectedUsers.map(user => (
                <UserCard
                  key={user.id}
                  user={user}
                  onConnect={handleConnect}
                  onViewProfile={handleViewProfile}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="people-outline" size={64} color="#d1d5db" />
                <Text style={styles.emptyText}>No connections yet</Text>
                <Text style={styles.emptySubtext}>Start connecting with people to build your network</Text>
              </View>
            )}
          </View>
        );

      case 'feed':
        if (feedLoading && feedPosts.length === 0) {
          return (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0a66c2" />
            </View>
          );
        }

        return (
          <View>
            {feedError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{feedError}</Text>
              </View>
            )}

            {feedPosts.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="briefcase-outline" size={64} color="#d1d5db" />
                <Text style={styles.emptyText}>No updates in your network yet</Text>
                <Text style={styles.emptySubtext}>
                  Start posting and connecting to see professional updates here.
                </Text>
              </View>
            ) : (
              feedPosts.map(post => (
                <View key={post._id} style={{ marginBottom: 16 }}>
                  <PostCard post={post} onPostDeleted={() => handlePostDeleted(post._id)} />
                </View>
              ))
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Network</Text>
        </View>
      </View>

      {/* First Visit Banner */}
      {showFirstVisitBanner && (
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>
                Follow = see public updates
              </Text>
              <Text style={styles.bannerSubtitle}>
                Connect = professional relationship (mutual approval)
              </Text>
            </View>
            <TouchableOpacity onPress={() => setShowFirstVisitBanner(false)} style={styles.bannerClose}>
              <Ionicons name="close" size={20} color="#1e40af" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Stats */}
      {stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => navigation?.navigate?.('Connections', { initialTab: 'connections' })}
            >
              <Text style={styles.statValue}>{stats.connectionsCount}</Text>
              <Text style={styles.statLabel}>Connections</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => navigation?.navigate?.('Connections', { initialTab: 'followers' })}
            >
              <Text style={styles.statValue}>{stats.followersCount}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => navigation?.navigate?.('Connections', { initialTab: 'following' })}
            >
              <Text style={styles.statValue}>{stats.followingCount}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => navigation?.navigate?.('Communities')}
            >
              <Text style={styles.statValue}>{communities.length}</Text>
              <Text style={styles.statLabel}>Communities</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => setActiveTab('requests')}
            >
              <Text style={styles.statValue}>{stats.pendingRequestsCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          {(['feed', 'connections', 'suggestions', 'requests'] as TabType[]).map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder={
              activeTab === 'feed' ? 'Search people in your network...' :
              activeTab === 'connections' ? 'Search connections...' :
              activeTab === 'suggestions' ? 'Search suggestions...' :
              activeTab === 'requests' ? 'Search requests...' :
              'Search people...'
            }
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          activeTab === 'feed'
            ? (
                <RefreshControl
                  refreshing={feedRefreshing}
                  onRefresh={handleRefreshFeed}
                  colors={["#0A66C2"]}
                  tintColor="#0A66C2"
                />
              )
            : undefined
        }
      >
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {searchQuery && searchResults.length > 0 ? (
          <View>
            <Text style={styles.searchResultsTitle}>
              Search Results ({searchResults.length})
            </Text>
            {searchResults.map(user => (
              <UserCard
                key={user.id}
                user={user}
                onConnect={handleConnect}
                onViewProfile={handleViewProfile}
              />
            ))}
          </View>
        ) : (
          renderTabContent()
        )}

        {/* Communities Section */}
        {activeTab === 'suggestions' && !searchQuery && (
          <View style={styles.communitiesSection}>
            <Text style={styles.communitiesTitle}>Communities</Text>
            {communities.map(community => (
              <CommunityCard
                key={community.id}
                community={community}
                onJoin={joinCommunity}
                onLeave={leaveCommunity}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Profile Preview Modal */}
      <ProfilePreviewModal
        visible={showProfileModal}
        user={selectedUser}
        onClose={() => setShowProfileModal(false)}
        onConnect={handleConnect}
        onMessage={handleMessage}
        checkMessagingPermission={checkMessagingPermission}
      />

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab="Network" 
        navigation={navigation} 
        onCreatePress={handleCreatePress}
      />

      {/* Create Content Modal */}
      <CreateContentModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateStory={handleCreateStory}
        onCreatePost={handleCreatePost}
        onCreateEvent={handleCreateEvent}
        onCreateReel={handleCreateReel}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  badge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  banner: {
    backgroundColor: '#eff6ff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dbeafe',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e3a8a',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#1d4ed8',
  },
  bannerClose: {
    marginLeft: 8,
  },
  statsContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  tabsContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tabsScroll: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  tabText: {
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#2563eb',
  },
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 100, // Increased to account for fixed bottom navigation
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#b91c1c',
  },
  searchResultsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  requestCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  requestMessage: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    fontStyle: 'italic',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  requestButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#2563eb',
  },
  rejectButton: {
    backgroundColor: '#e5e7eb',
  },
  acceptButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  rejectButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  communitiesSection: {
    marginTop: 24,
  },
  communitiesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
});
