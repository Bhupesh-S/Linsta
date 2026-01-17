// NetworkScreen - Main networking interface

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNetwork } from '../hooks/useNetwork';
import { UserCard } from '../components/UserCard';
import { CommunityCard } from '../components/CommunityCard';
import { ProfilePreviewModal } from '../components/ProfilePreviewModal';
import { JobCard } from '../components/JobCard';
import { NetworkUser, SearchFilters } from '../types/network.types';
import { mockJobs } from '../types/job.types';
import BottomNavigation from '../components/BottomNavigation';
import CreateContentModal from '../components/CreateContentModal';

type TabType = 'jobs' | 'connections' | 'communities' | 'requests';

interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  isJoined: boolean;
}

// Mock communities data
const mockCommunities: Community[] = [
  {
    id: 'c1',
    name: 'React Native Developers',
    description: 'A community for React Native developers to share knowledge and collaborate',
    members: 12500,
    category: 'Technology',
    isJoined: true,
  },
  {
    id: 'c2',
    name: 'IIT Alumni Network',
    description: 'Connect with fellow IIT graduates from all campuses',
    members: 45000,
    category: 'Alumni',
    isJoined: false,
  },
  {
    id: 'c3',
    name: 'Startup Founders India',
    description: 'Network of startup founders and entrepreneurs in India',
    members: 8900,
    category: 'Business',
    isJoined: true,
  },
  {
    id: 'c4',
    name: 'AI & Machine Learning',
    description: 'Discuss latest trends in AI, ML, and Deep Learning',
    members: 23400,
    category: 'Technology',
    isJoined: false,
  },
  {
    id: 'c5',
    name: 'Product Managers India',
    description: 'Community for product managers to share best practices',
    members: 15600,
    category: 'Product',
    isJoined: false,
  },
];

interface NetworkScreenProps {
  navigation?: any;
}

export const NetworkScreen: React.FC<NetworkScreenProps> = ({ navigation }) => {
  const {
    suggestions,
    connections,
    searchResults,
    communities: networkCommunities,
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
    loadConnections,
  } = useNetwork();

  const [activeTab, setActiveTab] = useState<TabType>('jobs');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedUser, setSelectedUser] = useState<NetworkUser | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showFirstVisitBanner, setShowFirstVisitBanner] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [jobs, setJobs] = useState(mockJobs);
  const [communities, setCommunities] = useState(mockCommunities);

  // Load applied jobs state from AsyncStorage on mount
  useEffect(() => {
    const loadAppliedJobs = async () => {
      try {
        const savedAppliedJobs = await AsyncStorage.getItem('appliedJobs');
        if (savedAppliedJobs) {
          const appliedJobIds = JSON.parse(savedAppliedJobs);
          setJobs(prevJobs => 
            prevJobs.map(job => ({
              ...job,
              userState: {
                ...job.userState,
                hasApplied: appliedJobIds.includes(job.id),
                appliedDate: appliedJobIds.includes(job.id) ? job.userState?.appliedDate : undefined,
              }
            }))
          );
        }
      } catch (error) {
        console.error('Error loading applied jobs:', error);
      }
    };
    loadAppliedJobs();
  }, []);

  // Load joined communities from AsyncStorage
  useEffect(() => {
    const loadJoinedCommunities = async () => {
      try {
        const savedJoinedCommunities = await AsyncStorage.getItem('joinedCommunities');
        if (savedJoinedCommunities) {
          const joinedCommunityIds = JSON.parse(savedJoinedCommunities);
          setCommunities(prevCommunities => 
            prevCommunities.map(community => ({
              ...community,
              isJoined: joinedCommunityIds.includes(community.id),
            }))
          );
        }
      } catch (error) {
        console.error('Error loading joined communities:', error);
      }
    };
    loadJoinedCommunities();
  }, []);

  // Load data based on active tab
  useEffect(() => {
    if (activeTab === 'connections') {
      loadConnections();
    }
  }, [activeTab, loadConnections]);

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
    if (navigation) {
      navigation.navigate('UserProfileDetail', { user });
    }
  };

  const handleMessage = (userId: string) => {
    Alert.alert('Message', `Opening chat with user ${userId}`);
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
    Alert.alert('Create Story', 'Story creation coming soon!');
  };

  const handleCreatePost = () => {
    Alert.alert('Write Article', 'Article creation coming soon!');
  };

  const handleCreateEvent = () => {
    if (navigation) {
      navigation.navigate('CreateEvent');
    }
  };

  const handleCreateReel = () => {
    Alert.alert('Record Reel', 'Reel recording coming soon!');
  };

  const handleCommunityAction = async (communityId: string, isJoined: boolean) => {
    // Update communities state
    setCommunities(prevCommunities => 
      prevCommunities.map(c => 
        c.id === communityId 
          ? { ...c, isJoined: !isJoined }
          : c
      )
    );

    // Save to AsyncStorage
    try {
      const savedJoinedCommunities = await AsyncStorage.getItem('joinedCommunities');
      let joinedCommunityIds = savedJoinedCommunities ? JSON.parse(savedJoinedCommunities) : [];
      
      if (isJoined) {
        // Remove from joined
        joinedCommunityIds = joinedCommunityIds.filter((id: string) => id !== communityId);
        Alert.alert('Left', 'You left the community');
      } else {
        // Add to joined
        if (!joinedCommunityIds.includes(communityId)) {
          joinedCommunityIds.push(communityId);
        }
        Alert.alert('Joined', 'You joined the community!');
      }
      
      await AsyncStorage.setItem('joinedCommunities', JSON.stringify(joinedCommunityIds));
    } catch (error) {
      console.error('Error saving joined community:', error);
    }
  };

  const handleCommunityPress = (community: Community) => {
    if (navigation) {
      navigation.navigate('CommunityDetail', { community });
    }
  };

  const renderTabContent = () => {
    if (loading && !connections.length && activeTab === 'connections') {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0a66c2" />
        </View>
      );
    }

    switch (activeTab) {
      case 'connections':
        return (
          <View>
            {/* Connected Users */}
            {connections.length > 0 ? (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Your Connections</Text>
                {connections.map(user => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onConnect={handleConnect}
                    onViewProfile={handleViewProfile}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={64} color="#d1d5db" />
                <Text style={styles.emptyStateText}>No connections yet</Text>
                <Text style={styles.emptyStateSubtext}>Start connecting with people you know</Text>
              </View>
            )}

            {/* Suggested Connections */}
            {suggestions.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>People You May Know</Text>
                {suggestions.map(user => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onConnect={handleConnect}
                    onViewProfile={handleViewProfile}
                  />
                ))}
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

      case 'communities':
        return (
          <View>
            {/* Browse All Communities Button */}
            <TouchableOpacity 
              style={styles.browseCommunitiesButton}
              onPress={() => navigation?.navigate?.('CommunitiesList')}
            >
              <View style={styles.browseCommunitiesContent}>
                <Ionicons name="search-circle" size={32} color="#2563eb" />
                <View style={styles.browseCommunitiesText}>
                  <Text style={styles.browseCommunitiesTitle}>Discover More Communities</Text>
                  <Text style={styles.browseCommunitiesSubtitle}>Browse all available communities</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#2563eb" />
              </View>
            </TouchableOpacity>

            {communities.map(community => (
              <TouchableOpacity 
                key={community.id} 
                style={styles.communityCard}
                onPress={() => handleCommunityPress(community)}
                activeOpacity={0.7}
              >
                <View style={styles.communityHeader}>
                  <View style={styles.communityIcon}>
                    <Ionicons name="people" size={32} color="#2563eb" />
                  </View>
                  <View style={styles.communityInfo}>
                    <Text style={styles.communityName} numberOfLines={1}>{community.name}</Text>
                    <View style={styles.communityMetaRow}>
                      <Ionicons name="people-outline" size={14} color="#6b7280" />
                      <Text style={styles.communityMeta}>
                        {community.members.toLocaleString()} members
                      </Text>
                      <Text style={styles.metaDot}>•</Text>
                      <View style={styles.categoryTag}>
                        <Text style={styles.categoryTagText}>{community.category}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <Text style={styles.communityDescription} numberOfLines={2}>{community.description}</Text>
                <View style={styles.communityFooter}>
                  <TouchableOpacity
                    style={[
                      styles.communityButton,
                      community.isJoined && styles.communityButtonJoined,
                    ]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleCommunityAction(community.id, community.isJoined);
                    }}
                  >
                    <Ionicons 
                      name={community.isJoined ? "checkmark-circle" : "add-circle-outline"} 
                      size={18} 
                      color={community.isJoined ? "#059669" : "#fff"}
                      style={styles.buttonIcon}
                    />
                    <Text
                      style={[
                        styles.communityButtonText,
                        community.isJoined && styles.communityButtonTextJoined,
                      ]}
                    >
                      {community.isJoined ? 'Joined' : 'Join Community'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.viewDetailsButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleCommunityPress(community);
                    }}
                  >
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <Ionicons name="chevron-forward" size={16} color="#2563eb" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'jobs':
        return (
          <View>
            {jobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                navigation={navigation}
                onApply={async (jobId) => {
                  setJobs(prevJobs => 
                    prevJobs.map(j => 
                      j.id === jobId 
                        ? { 
                            ...j, 
                            userState: { 
                              ...j.userState, 
                              hasApplied: true, 
                              appliedDate: new Date().toISOString() 
                            } 
                          }
                        : j
                    )
                  );
                  
                  // Save to AsyncStorage
                  try {
                    const savedAppliedJobs = await AsyncStorage.getItem('appliedJobs');
                    const appliedJobIds = savedAppliedJobs ? JSON.parse(savedAppliedJobs) : [];
                    if (!appliedJobIds.includes(jobId)) {
                      appliedJobIds.push(jobId);
                      await AsyncStorage.setItem('appliedJobs', JSON.stringify(appliedJobIds));
                    }
                  } catch (error) {
                    console.error('Error saving applied job:', error);
                  }
                  
                  Alert.alert('Success', 'Application submitted successfully!');
                }}
              />
            ))}
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
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.connectionsCount}</Text>
              <Text style={styles.statLabel}>Connections</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.followersCount}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.pendingRequestsCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          {([
            { id: 'jobs' as TabType, label: 'Jobs', count: jobs.length },
            { id: 'connections' as TabType, label: 'Connections', count: stats?.connectionsCount },
            { id: 'requests' as TabType, label: 'Requests', count: stats?.pendingRequestsCount || 0 },
            { id: 'communities' as TabType, label: 'Communities', count: communities.length },
          ]).map(tab => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                {tab.label} {tab.count !== undefined && tab.count > 0 && `(${tab.count})`}
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
              activeTab === 'jobs' ? 'Search jobs...' :
              activeTab === 'connections' ? 'Search connections...' :
              activeTab === 'communities' ? 'Search communities...' :
              activeTab === 'requests' ? 'Search requests...' :
              'Search...'
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
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
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
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
  browseCommunitiesButton: {
    backgroundColor: '#eff6ff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#dbeafe',
    borderStyle: 'dashed',
  },
  browseCommunitiesContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  browseCommunitiesText: {
    flex: 1,
    marginLeft: 12,
  },
  browseCommunitiesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 2,
  },
  browseCommunitiesSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  communityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  communityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  communityIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  communityMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  communityMeta: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 4,
  },
  metaDot: {
    fontSize: 13,
    color: '#d1d5db',
    marginHorizontal: 6,
  },
  categoryTag: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563eb',
  },
  communityDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  communityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  communityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  communityButtonJoined: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
  },
  buttonIcon: {
    marginRight: 6,
  },
  communityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  communityButtonTextJoined: {
    color: '#059669',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
    marginRight: 4,
  },
});
