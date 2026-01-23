import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { profileApi, UserProfileResponse } from '../services/profile.api';
import { postsApi, Post } from '../services/posts.api';
import { useAuth } from '../context/AuthContext';
import { useNetwork } from '../hooks/useNetwork';
import { NetworkStats } from '../types/network.types';

const { width } = Dimensions.get('window');
const COVER_HEIGHT = 150;
const PROFILE_SIZE = 110;

const ProfileScreen = ({ navigation }: any) => {
  const { user: authUser } = useAuth();
  const [profileData, setProfileData] = useState<UserProfileResponse | null>(null);
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const { getUserStats } = useNetwork();

  const userId = authUser?.id || '';

  // Safe navigation wrapper
  const safeNavigate = (screen: string, params?: any) => {
    try {
      (navigation as any).navigate(screen, params);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  useEffect(() => {
    loadProfile();
    loadPosts();
    loadStats();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await profileApi.getProfile();
      setProfileData(data);
    } catch (error: any) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      setPostsLoading(true);
      if (userId) {
        const posts = await postsApi.getUserPosts(userId, 20, 0);
        setUserPosts(posts);
      }
    } catch (error: any) {
      console.error('Failed to load posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const loadStats = async () => {
    if (!userId) return;
    const stats = await getUserStats(userId);
    if (stats) {
      setNetworkStats(stats);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadProfile(), loadPosts(), loadStats()]);
    setRefreshing(false);
  };

  const handleUploadCoverImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant photo library access');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        await profileApi.uploadCoverImage(result.assets[0].uri);
        await loadProfile();
        Alert.alert('Success', 'Cover image updated');
      } catch (error) {
        Alert.alert('Error', 'Failed to upload cover image');
      }
    }
  };

  const handleUploadProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant photo library access');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        await profileApi.uploadProfileImage(result.assets[0].uri);
        await loadProfile();
        Alert.alert('Success', 'Profile image updated');
      } catch (error) {
        Alert.alert('Error', 'Failed to upload profile image');
      }
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Cover Photo */}
      <TouchableOpacity onPress={handleUploadCoverImage} activeOpacity={0.9}>
        {profileData?.profile?.coverImageUrl ? (
          <Image
            source={{ uri: profileData.profile.coverImageUrl }}
            style={styles.coverImage}
          />
        ) : (
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.coverImage}
          >
            <Ionicons name="camera" size={32} color="rgba(255,255,255,0.7)" />
          </LinearGradient>
        )}
      </TouchableOpacity>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        {/* Profile Picture */}
        <TouchableOpacity onPress={handleUploadProfileImage} style={styles.profileImageContainer}>
          {profileData?.profile?.profileImageUrl ? (
            <Image
              source={{ uri: profileData.profile.profileImageUrl }}
              style={styles.profileImage}
            />
          ) : (
            <View style={[styles.profileImage, styles.profileImagePlaceholder]}>
              <Text style={styles.profileInitial}>
                {profileData?.user?.name?.[0]?.toUpperCase() || 'U'}
              </Text>
            </View>
          )}
          {profileData?.profile?.openToWork && (
            <View style={styles.openToWorkBadge}>
              <MaterialIcons name="work" size={16} color="#fff" />
            </View>
          )}
          <View style={styles.cameraIcon}>
            <Ionicons name="camera" size={16} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Edit Button */}
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile', { profileData })}
        >
          <Ionicons name="pencil" size={18} color="#0A66C2" />
        </TouchableOpacity>
      </View>

      {/* Name & Headline */}
      <View style={styles.nameSection}>
        <Text style={styles.name}>{profileData?.user?.name || 'User'}</Text>
        <Text style={styles.headline}>
          {profileData?.profile?.headline || 'Add a professional headline'}
        </Text>
        {profileData?.profile?.location && (
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color="#666" />
            <Text style={styles.location}>{profileData.profile.location}</Text>
          </View>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statItem}>
          <Text style={styles.statValue}>{userPosts.length}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </TouchableOpacity>
        <View style={styles.statDivider} />
        <TouchableOpacity 
          style={styles.statItem}
          onPress={() => navigation.navigate('Connections', { initialTab: 'followers' })}
        >
          <Text style={styles.statValue}>
            {networkStats?.followersCount?.toLocaleString() || 0}
          </Text>
          <Text style={styles.statLabel}>Followers</Text>
        </TouchableOpacity>
        <View style={styles.statDivider} />
        <TouchableOpacity 
          style={styles.statItem}
          onPress={() => navigation.navigate('Connections', { initialTab: 'following' })}
        >
          <Text style={styles.statValue}>
            {networkStats?.followingCount?.toLocaleString() || 0}
          </Text>
          <Text style={styles.statLabel}>Following</Text>
        </TouchableOpacity>
        <View style={styles.statDivider} />
        <TouchableOpacity 
          style={styles.statItem}
          onPress={() => navigation.navigate('Connections', { initialTab: 'connections' })}
        >
          <Text style={styles.statValue}>
            {networkStats?.connectionsCount?.toLocaleString() || 0}
          </Text>
          <Text style={styles.statLabel}>Connections</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Ionicons 
            name="grid" 
            size={20} 
            color={activeTab === 'posts' ? '#0A66C2' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
            Posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'about' && styles.activeTab]}
          onPress={() => setActiveTab('about')}
        >
          <Ionicons 
            name="information-circle" 
            size={20} 
            color={activeTab === 'about' ? '#0A66C2' : '#666'} 
          />
          <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>
            About
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPostsGrid = () => {
    if (postsLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0A66C2" />
        </View>
      );
    }

    if (userPosts.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="images-outline" size={64} color="#0A66C2" />
          </View>
          <Text style={styles.emptyText}>No posts yet</Text>
          <Text style={styles.emptySubtext}>Share your professional journey</Text>
          <TouchableOpacity style={styles.emptyButton} onPress={() => safeNavigate('CreatePost')}>
            <Ionicons name="add-circle" size={20} color="#fff" />
            <Text style={styles.emptyButtonText}>Create Post</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Group posts into rows of 3
    const rows = [];
    for (let i = 0; i < userPosts.length; i += 3) {
      rows.push(userPosts.slice(i, i + 3));
    }

    return (
      <View style={styles.postsGrid}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.postRow}>
            {row.map((post) => (
              <TouchableOpacity
                key={post._id}
                style={styles.postItem}
                onPress={() => safeNavigate('PostDetail', { postId: post._id })}
                activeOpacity={0.7}
              >
                {post.media && post.media.length > 0 ? (
                  imageErrors.has(post.media[0].mediaUrl) ? (
                    <View style={[styles.postImage, styles.postError]}>
                      <Ionicons name="image-outline" size={40} color="#999" />
                      <Text style={styles.errorText}>Failed to load</Text>
                    </View>
                  ) : (
                    <Image
                      source={{ uri: post.media[0].mediaUrl }}
                      style={styles.postImage}
                      resizeMode="cover"
                      onError={() => {
                        setImageErrors(prev => new Set(prev).add(post.media[0].mediaUrl));
                      }}
                    />
                  )
                ) : (
                  <View style={[styles.postImage, styles.postPlaceholder]}>
                    <Ionicons name="text" size={32} color="#999" />
                    <Text style={styles.captionPreview} numberOfLines={3}>
                      {post.caption}
                    </Text>
                  </View>
                )}
                {post.media && post.media.length > 1 && (
                  <View style={styles.multipleIndicator}>
                    <Ionicons name="copy-outline" size={14} color="#fff" />
                  </View>
                )}
                {(post.likeCount > 0 || post.commentCount > 0) && (
                  <View style={styles.postStats}>
                    {post.likeCount > 0 && (
                      <View style={styles.postStatItem}>
                        <Ionicons name="heart" size={12} color="#fff" />
                        <Text style={styles.postStatText}>{post.likeCount}</Text>
                      </View>
                    )}
                    {post.commentCount > 0 && (
                      <View style={styles.postStatItem}>
                        <Ionicons name="chatbubble" size={12} color="#fff" />
                        <Text style={styles.postStatText}>{post.commentCount}</Text>
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ))}
            {/* Fill remaining slots with empty views */}
            {row.length < 3 &&
              Array.from({ length: 3 - row.length }).map((_, index) => (
                <View key={`empty-${index}`} style={styles.postItem} />
              ))}
          </View>
        ))}
      </View>
    );
  };

  const renderAbout = () => (
    <View style={styles.aboutContainer}>
      {/* Personal Info */}
      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>Profile Information</Text>
        
        {/* Headline */}
        {profileData?.profile?.headline ? (
          <View style={styles.infoRow}>
            <MaterialIcons name="work-outline" size={20} color="#666" />
            <Text style={styles.infoText}>{profileData.profile.headline}</Text>
          </View>
        ) : (
          <View style={styles.infoRow}>
            <MaterialIcons name="work-outline" size={20} color="#ccc" />
            <Text style={styles.infoTextEmpty}>Add your professional headline</Text>
          </View>
        )}
        
        {/* Location */}
        {profileData?.profile?.location ? (
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={20} color="#666" />
            <Text style={styles.infoText}>{profileData.profile.location}</Text>
          </View>
        ) : (
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={20} color="#ccc" />
            <Text style={styles.infoTextEmpty}>Add your location</Text>
          </View>
        )}
        
        {/* Connections */}
        <View style={styles.infoRow}>
          <MaterialIcons name="people" size={20} color="#666" />
          <Text style={styles.infoText}>
            {networkStats?.followers || 0} followers · {networkStats?.following || 0} following
          </Text>
        </View>
        
        {/* Member Since */}
        {profileData?.createdAt && (
          <View style={styles.infoRow}>
            <MaterialIcons name="event" size={20} color="#666" />
            <Text style={styles.infoText}>
              Member since {new Date(profileData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
          </View>
        )}
        
        {/* Open to Work */}
        {profileData?.profile?.openToWork && (
          <View style={styles.openToWorkBanner}>
            <MaterialIcons name="work" size={18} color="#10A37F" />
            <Text style={styles.openToWorkText}>Open to work</Text>
          </View>
        )}
      </View>

      {/* Bio */}
      {profileData?.profile?.bio ? (
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>About</Text>
          <Text style={styles.aboutText}>{profileData.profile.bio}</Text>
        </View>
      ) : (
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>About</Text>
          <Text style={styles.aboutTextEmpty}>Tell us about yourself...</Text>
        </View>
      )}

      {/* Skills */}
      {profileData?.profile?.skills && profileData.profile.skills.length > 0 ? (
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            {profileData.profile.skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Skills</Text>
          <Text style={styles.aboutTextEmpty}>Add your skills to showcase your expertise</Text>
        </View>
      )}

      {/* Experience */}
      {profileData?.profile?.experience && profileData.profile.experience.length > 0 ? (
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Experience</Text>
          {profileData.profile.experience.map((exp, index) => (
            <View key={index} style={styles.experienceItem}>
              <View style={styles.experienceIcon}>
                <MaterialIcons name="work" size={20} color="#0A66C2" />
              </View>
              <View style={styles.experienceContent}>
                <Text style={styles.experienceTitle}>{exp.title}</Text>
                <Text style={styles.experienceCompany}>{exp.company}</Text>
                {exp.location && (
                  <Text style={styles.experienceLocation}>{exp.location}</Text>
                )}
                {(exp.startDate || exp.endDate) && (
                  <Text style={styles.experienceDate}>
                    {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                    {' - '}
                    {exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Experience</Text>
          <Text style={styles.aboutTextEmpty}>Add your work experience</Text>
        </View>
      )}

      {/* Education */}
      {profileData?.profile?.education && profileData.profile.education.length > 0 ? (
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Education</Text>
          {profileData.profile.education.map((edu, index) => (
            <View key={index} style={styles.experienceItem}>
              <View style={styles.experienceIcon}>
                <MaterialIcons name="school" size={20} color="#0A66C2" />
              </View>
              <View style={styles.experienceContent}>
                <Text style={styles.experienceTitle}>{edu.school}</Text>
                <Text style={styles.experienceCompany}>{edu.degree}</Text>
                {edu.field && (
                  <Text style={styles.experienceLocation}>{edu.field}</Text>
                )}
                {(edu.startDate || edu.endDate) && (
                  <Text style={styles.experienceDate}>
                    {edu.startDate ? new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric' }) : ''}
                    {' - '}
                    {edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric' }) : 'Present'}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Education</Text>
          <Text style={styles.aboutTextEmpty}>Add your educational background</Text>
        </View>
      )}

      {/* Website */}
      {profileData?.profile?.website && (
        <View style={styles.aboutSection}>
          <Text style={styles.aboutTitle}>Website</Text>
          <TouchableOpacity>
            <Text style={styles.websiteLink}>{profileData.profile.website}</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Edit Profile CTA */}
      <TouchableOpacity 
        style={styles.editProfileButton}
        onPress={() => safeNavigate('EditProfile')}
      >
        <MaterialIcons name="edit" size={20} color="#fff" />
        <Text style={styles.editProfileButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0A66C2" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        {activeTab === 'posts' ? renderPostsGrid() : renderAbout()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  header: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  coverImage: {
    width: '100%',
    height: COVER_HEIGHT,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginTop: -PROFILE_SIZE / 2,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: PROFILE_SIZE,
    height: PROFILE_SIZE,
    borderRadius: PROFILE_SIZE / 2,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#fff',
  },
  profileImagePlaceholder: {
    backgroundColor: '#0A66C2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  openToWorkBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    marginTop: 60,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0A66C2',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  nameSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  headline: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 12,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#eee',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  tabs: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#0A66C2',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#0A66C2',
  },
  postsGrid: {
    backgroundColor: '#fff',
  },
  postRow: {
    flexDirection: 'row',
    gap: 2,
  },
  postItem: {
    width: (width - 4) / 3,
    height: (width - 4) / 3,
    backgroundColor: '#f0f0f0',
    position: 'relative',
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
  },
  postPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fafafa',
  },
  postError: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  errorText: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  captionPreview: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  multipleIndicator: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  postStats: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 8,
  },
  postStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  postStatText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
    backgroundColor: '#fff',
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0EFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 24,
    backgroundColor: '#0A66C2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  aboutContainer: {
    backgroundColor: '#fff',
    padding: 16,
  },
  aboutSection: {
    marginBottom: 24,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  aboutTextEmpty: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  infoTextEmpty: {
    fontSize: 14,
    color: '#999',
    flex: 1,
    fontStyle: 'italic',
  },
  openToWorkBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E6F7F3',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  openToWorkText: {
    fontSize: 14,
    color: '#10A37F',
    fontWeight: '600',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#E0EFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 13,
    color: '#0A66C2',
    fontWeight: '500',
  },
  experienceItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  experienceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0EFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  experienceContent: {
    flex: 1,
  },
  experienceTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  experienceCompany: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  experienceLocation: {
    fontSize: 13,
    color: '#999',
  },
  experienceDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  websiteLink: {
    fontSize: 14,
    color: '#0A66C2',
    textDecorationLine: 'underline',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0A66C2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginTop: 8,
  },
  editProfileButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default ProfileScreen;
