import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNetwork } from '../../hooks/useNetwork';
import { NetworkStats } from '../../types/network.types';

interface UserProfileScreenProps {
  route?: any;
  navigation?: any;
}

const { width } = Dimensions.get('window');
const imageSize = (width - 6) / 3; // 3 columns with 2px gaps

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ route, navigation }) => {
  const { userId } = route?.params ?? {};
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'about'>('posts');
  const { getUserStats, followUser, unfollowUser } = useNetwork();
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  // Mock user data
  const user = {
    id: userId || '',
    name: 'Priya Sharma',
    username: '@priyasharma',
    bio: 'Digital Marketing Specialist | Content Creator | Travel Enthusiast 🌍',
    location: 'Mumbai, India',
    website: 'priyasharma.com',
    stats: {
      posts: 0,
      followers: 0,
      following: 0,
    },
    media: [
      'https://picsum.photos/400/400?random=1',
      'https://picsum.photos/400/400?random=2',
      'https://picsum.photos/400/400?random=3',
      'https://picsum.photos/400/400?random=4',
      'https://picsum.photos/400/400?random=5',
      'https://picsum.photos/400/400?random=6',
      'https://picsum.photos/400/400?random=7',
      'https://picsum.photos/400/400?random=8',
      'https://picsum.photos/400/400?random=9',
    ],
  };

  useEffect(() => {
    let isMounted = true;
    const loadStats = async () => {
      if (!user.id) return;
      const stats = await getUserStats(user.id);
      if (isMounted && stats) {
        setNetworkStats(stats);
      }
    };
    loadStats();
    return () => {
      isMounted = false;
    };
  }, [getUserStats, user.id]);

  const handleFollowToggle = async () => {
    if (!user.id) return;
    try {
      setLoadingFollow(true);
      if (isFollowing) {
        await unfollowUser(user.id);
        setIsFollowing(false);
      } else {
        await followUser(user.id);
        setIsFollowing(true);
      }
    } finally {
      setLoadingFollow(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.emptyText}>No posts yet</Text>
          </View>
        );
      
      case 'media':
        return (
          <View style={styles.mediaGrid}>
            {user.media.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={styles.mediaItem}
              />
            ))}
          </View>
        );
      
      case 'about':
        return (
          <View style={styles.aboutContent}>
            <View style={styles.aboutItem}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.aboutText}>{user.location}</Text>
            </View>
            <View style={styles.aboutItem}>
              <Ionicons name="link-outline" size={20} color="#666" />
              <Text style={styles.aboutText}>{user.website}</Text>
            </View>
            <View style={styles.aboutItem}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.aboutText}>Joined January 2023</Text>
            </View>
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
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#262626" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{user.username}</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#262626" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={100} color="#0A66C2" />
          </View>

          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.bio}>{user.bio}</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.stats.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {(networkStats?.followersCount ?? user.stats.followers).toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {(networkStats?.followingCount ?? user.stats.following).toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.followButton}
              onPress={handleFollowToggle}
              disabled={loadingFollow || !user.id}
            >
              <Text style={styles.followButtonText}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.messageButton}
              onPress={() => navigation?.navigate('Chat', { conversationId: 'conv_1' })}
            >
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
          >
            <Ionicons 
              name="grid-outline" 
              size={24} 
              color={activeTab === 'posts' ? '#0A66C2' : '#8e8e8e'} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'media' && styles.activeTab]}
            onPress={() => setActiveTab('media')}
          >
            <Ionicons 
              name="images-outline" 
              size={24} 
              color={activeTab === 'media' ? '#0A66C2' : '#8e8e8e'} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'about' && styles.activeTab]}
            onPress={() => setActiveTab('about')}
          >
            <Ionicons 
              name="information-circle-outline" 
              size={24} 
              color={activeTab === 'about' ? '#0A66C2' : '#8e8e8e'} 
            />
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#262626',
  },
  moreButton: {
    padding: 4,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#262626',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    color: '#8e8e8e',
    marginBottom: 12,
  },
  bio: {
    fontSize: 15,
    color: '#262626',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#262626',
  },
  statLabel: {
    fontSize: 13,
    color: '#8e8e8e',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#efefef',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  followButton: {
    flex: 1,
    backgroundColor: '#0A66C2',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  messageButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbdbdb',
  },
  messageButtonText: {
    color: '#262626',
    fontSize: 15,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#efefef',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#0A66C2',
  },
  tabContent: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#8e8e8e',
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  mediaItem: {
    width: imageSize,
    height: imageSize,
    backgroundColor: '#f0f0f0',
  },
  aboutContent: {
    padding: 20,
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 15,
    color: '#262626',
    marginLeft: 12,
  },
});

export default UserProfileScreen;
