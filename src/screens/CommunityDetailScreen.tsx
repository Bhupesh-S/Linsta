import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type TabType = 'posts' | 'about' | 'members' | 'media';

interface CommunityDetailScreenProps {
  navigation?: any;
  route?: {
    params?: {
      community: {
        id: string;
        name: string;
        description: string;
        members: number;
        category: string;
        isJoined: boolean;
        coverImage?: string;
        posts?: number;
        moderators?: string[];
        rules?: string[];
        about?: string;
      };
    };
  };
}

export const CommunityDetailScreen: React.FC<CommunityDetailScreenProps> = ({ navigation, route }) => {
  const community = route?.params?.community;
  const [isJoined, setIsJoined] = useState(community?.isJoined || false);
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [searchQuery, setSearchQuery] = useState('');
  const [postText, setPostText] = useState('');

  if (!community) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Community not found</Text>
      </SafeAreaView>
    );
  }

  const handleJoinToggle = () => {
    setIsJoined(!isJoined);
  };

  const communityRules = community.rules || [
    'Be respectful and kind to all members',
    'No spam or self-promotion without permission',
    'Stay on topic and share relevant content',
    'No hate speech or harassment',
    'Respect privacy and confidentiality',
  ];

  const aboutText = community.about || community.description;

  const mockPosts = [
    {
      id: 'p1',
      author: {
        id: 'u1',
        name: 'Sarah Johnson',
        avatar: null,
        role: 'Senior Developer',
      },
      content: 'Just finished migrating our app to React Native 0.73! The performance improvements are amazing. Happy to share my experience if anyone needs help. 🚀',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 12,
      isLiked: false,
      images: [],
    },
    {
      id: 'p2',
      author: {
        id: 'u2',
        name: 'Mike Chen',
        avatar: null,
        role: 'Tech Lead',
      },
      content: 'Looking for best practices on state management in large React Native apps. What do you recommend: Redux, MobX, or Context API?',
      timestamp: '5 hours ago',
      likes: 18,
      comments: 34,
      isLiked: true,
      images: [],
    },
    {
      id: 'p3',
      author: {
        id: 'u3',
        name: 'Emma Wilson',
        avatar: null,
        role: 'Mobile Engineer',
      },
      content: 'Check out this amazing animation library I found! Perfect for React Native projects. Link in comments 👇',
      timestamp: '1 day ago',
      likes: 45,
      comments: 28,
      isLiked: false,
      images: [],
    },
  ];

  const mockMembers = [
    { id: 'm1', name: 'Sarah Johnson', role: 'Senior Developer', isModerator: true },
    { id: 'm2', name: 'Mike Chen', role: 'Tech Lead', isModerator: true },
    { id: 'm3', name: 'Emma Wilson', role: 'Mobile Engineer', isModerator: false },
    { id: 'm4', name: 'John Smith', role: 'Full Stack Developer', isModerator: false },
    { id: 'm5', name: 'Lisa Anderson', role: 'React Developer', isModerator: false },
    { id: 'm6', name: 'David Brown', role: 'Frontend Engineer', isModerator: false },
    { id: 'm7', name: 'Maria Garcia', role: 'Software Engineer', isModerator: false },
    { id: 'm8', name: 'James Taylor', role: 'Mobile Developer', isModerator: false },
  ];

  const mockMedia = [
    { id: 'media1', type: 'image', thumbnail: null, author: 'Sarah Johnson', timestamp: '2 days ago' },
    { id: 'media2', type: 'image', thumbnail: null, author: 'Mike Chen', timestamp: '3 days ago' },
    { id: 'media3', type: 'image', thumbnail: null, author: 'Emma Wilson', timestamp: '5 days ago' },
    { id: 'media4', type: 'image', thumbnail: null, author: 'John Smith', timestamp: '1 week ago' },
  ];

  const filteredMembers = mockMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPost = ({ item }: any) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postAvatar}>
          <Ionicons name="person-circle" size={40} color="#d1d5db" />
        </View>
        <View style={styles.postAuthorInfo}>
          <Text style={styles.postAuthor}>{item.author.name}</Text>
          <Text style={styles.postRole}>{item.author.role}</Text>
          <Text style={styles.postTime}>{item.timestamp}</Text>
        </View>
        <TouchableOpacity style={styles.postMenuButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>
      <Text style={styles.postContent}>{item.content}</Text>
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.postAction}>
          <Ionicons 
            name={item.isLiked ? "heart" : "heart-outline"} 
            size={20} 
            color={item.isLiked ? "#ef4444" : "#6b7280"} 
          />
          <Text style={[styles.postActionText, item.isLiked && styles.postActionTextActive]}>
            {item.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postAction}>
          <Ionicons name="chatbubble-outline" size={20} color="#6b7280" />
          <Text style={styles.postActionText}>{item.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postAction}>
          <Ionicons name="share-outline" size={20} color="#6b7280" />
          <Text style={styles.postActionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMember = ({ item }: any) => (
    <View style={styles.memberCard}>
      <View style={styles.memberAvatar}>
        <Ionicons name="person" size={24} color="#2563eb" />
      </View>
      <View style={styles.memberInfo}>
        <View style={styles.memberNameRow}>
          <Text style={styles.memberName}>{item.name}</Text>
          {item.isModerator && (
            <View style={styles.moderatorBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#059669" />
              <Text style={styles.moderatorBadgeText}>Mod</Text>
            </View>
          )}
        </View>
        <Text style={styles.memberRole}>{item.role}</Text>
      </View>
      <TouchableOpacity style={styles.memberConnectButton}>
        <Text style={styles.memberConnectButtonText}>Connect</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMedia = ({ item }: any) => (
    <TouchableOpacity style={styles.mediaItem}>
      <View style={styles.mediaPlaceholder}>
        <Ionicons name="image" size={32} color="#9ca3af" />
      </View>
      <Text style={styles.mediaAuthor} numberOfLines={1}>{item.author}</Text>
    </TouchableOpacity>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <View style={styles.tabContent}>
            {isJoined && (
              <View style={styles.createPostCard}>
                <View style={styles.createPostAvatar}>
                  <Ionicons name="person-circle" size={40} color="#d1d5db" />
                </View>
                <View style={styles.createPostInput}>
                  <TextInput
                    placeholder="Share something with the community..."
                    placeholderTextColor="#9ca3af"
                    multiline
                    value={postText}
                    onChangeText={setPostText}
                    style={styles.createPostTextInput}
                  />
                  <View style={styles.createPostActions}>
                    <TouchableOpacity style={styles.createPostActionButton}>
                      <Ionicons name="image-outline" size={20} color="#6b7280" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.createPostActionButton}>
                      <Ionicons name="videocam-outline" size={20} color="#6b7280" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.createPostActionButton}>
                      <Ionicons name="link-outline" size={20} color="#6b7280" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.createPostSubmitButton, !postText.trim() && styles.createPostSubmitButtonDisabled]}
                      disabled={!postText.trim()}
                    >
                      <Text style={styles.createPostSubmitButtonText}>Post</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
            <FlatList
              data={mockPosts}
              renderItem={renderPost}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        );

      case 'about':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.aboutText}>{aboutText}</Text>
            </View>

            <View style={styles.statsSection}>
              <View style={styles.statBox}>
                <Ionicons name="people-outline" size={24} color="#2563eb" />
                <Text style={styles.statValue}>{community.members.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Members</Text>
              </View>
              <View style={styles.statBox}>
                <Ionicons name="chatbubbles-outline" size={24} color="#059669" />
                <Text style={styles.statValue}>{community.posts || 234}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statBox}>
                <Ionicons name="flash-outline" size={24} color="#f59e0b" />
                <Text style={styles.statValue}>High</Text>
                <Text style={styles.statLabel}>Activity</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Community Rules</Text>
              {communityRules.map((rule, index) => (
                <View key={index} style={styles.ruleItem}>
                  <View style={styles.ruleNumber}>
                    <Text style={styles.ruleNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.ruleText}>{rule}</Text>
                </View>
              ))}
            </View>

            {community.moderators && community.moderators.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Moderators</Text>
                {community.moderators.map((mod, index) => (
                  <View key={index} style={styles.moderatorItem}>
                    <View style={styles.moderatorAvatar}>
                      <Ionicons name="person" size={20} color="#2563eb" />
                    </View>
                    <Text style={styles.moderatorName}>{mod}</Text>
                    <Ionicons name="shield-checkmark" size={16} color="#059669" />
                  </View>
                ))}
              </View>
            )}
          </View>
        );

      case 'members':
        return (
          <View style={styles.tabContent}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
              <TextInput
                placeholder="Search members..."
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#9ca3af" />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.membersCount}>
              {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'}
            </Text>
            <FlatList
              data={filteredMembers}
              renderItem={renderMember}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        );

      case 'media':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Photos & Videos</Text>
            <FlatList
              data={mockMedia}
              renderItem={renderMedia}
              keyExtractor={(item) => item.id}
              numColumns={3}
              scrollEnabled={false}
              columnWrapperStyle={styles.mediaGrid}
            />
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
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {community.name}
        </Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-outline" size={24} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <View style={styles.coverImage}>
            <Ionicons name="people" size={48} color="#2563eb" />
          </View>
        </View>

        {/* Community Info */}
        <View style={styles.infoSection}>
          <Text style={styles.communityName}>{community.name}</Text>
          <View style={styles.metaRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{community.category}</Text>
            </View>
            <Text style={styles.metaText}>
              {community.members.toLocaleString()} members
            </Text>
            {community.posts && (
              <>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.metaText}>{community.posts} posts</Text>
              </>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.joinButton, isJoined && styles.joinedButton]}
            onPress={handleJoinToggle}
          >
            <Ionicons 
              name={isJoined ? "checkmark-circle" : "add-circle"} 
              size={20} 
              color={isJoined ? "#059669" : "#fff"} 
              style={styles.buttonIcon}
            />
            <Text style={[styles.joinButtonText, isJoined && styles.joinedButtonText]}>
              {isJoined ? 'Joined' : 'Join Community'}
            </Text>
          </TouchableOpacity>
          {isJoined && (
            <TouchableOpacity style={styles.notifyButton}>
              <Ionicons name="notifications-outline" size={20} color="#2563eb" />
            </TouchableOpacity>
          )}
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>{aboutText}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statBox}>
            <Ionicons name="people-outline" size={24} color="#2563eb" />
            <Text style={styles.statValue}>{community.members.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="chatbubbles-outline" size={24} color="#059669" />
            <Text style={styles.statValue}>{community.posts || 234}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="flash-outline" size={24} color="#f59e0b" />
            <Text style={styles.statValue}>High</Text>
            <Text style={styles.statLabel}>Activity</Text>
          </View>
        </View>

        {/* Community Rules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Rules</Text>
          {communityRules.map((rule, index) => (
            <View key={index} style={styles.ruleItem}>
              <View style={styles.ruleNumber}>
                <Text style={styles.ruleNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </View>

        {/* Moderators Section */}
        {community.moderators && community.moderators.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Moderators</Text>
            {community.moderators.map((mod, index) => (
              <View key={index} style={styles.moderatorItem}>
                <View style={styles.moderatorAvatar}>
                  <Ionicons name="person" size={20} color="#2563eb" />
                </View>
                <Text style={styles.moderatorName}>{mod}</Text>
                <Ionicons name="shield-checkmark" size={16} color="#059669" />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginHorizontal: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 4,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  coverContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
  },
  coverImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  communityName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
  metaText: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
  },
  dot: {
    fontSize: 14,
    color: '#d1d5db',
    marginRight: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  joinButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  joinedButton: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#059669',
  },
  buttonIcon: {
    marginRight: 6,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  joinedButtonText: {
    color: '#059669',
  },
  notifyButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    borderRadius: 8,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  ruleItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  ruleNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ruleNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
  moderatorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  moderatorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  moderatorName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginTop: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
  tabContent: {
    paddingBottom: 20,
  },
  createPostCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
  },
  createPostAvatar: {
    marginRight: 12,
  },
  createPostInput: {
    flex: 1,
  },
  createPostTextInput: {
    fontSize: 15,
    color: '#111827',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  createPostActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  createPostActionButton: {
    padding: 8,
    marginRight: 8,
  },
  createPostSubmitButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 'auto',
  },
  createPostSubmitButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  createPostSubmitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  postCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  postHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  postAvatar: {
    marginRight: 12,
  },
  postAuthorInfo: {
    flex: 1,
  },
  postAuthor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  postRole: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  postTime: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  postMenuButton: {
    padding: 4,
  },
  postContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  postActionText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  postActionTextActive: {
    color: '#ef4444',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  membersCount: {
    fontSize: 13,
    color: '#6b7280',
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontWeight: '500',
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 1,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  moderatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 2,
  },
  moderatorBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
  },
  memberRole: {
    fontSize: 13,
    color: '#6b7280',
  },
  memberConnectButton: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  memberConnectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  mediaGrid: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  mediaItem: {
    flex: 1,
    margin: 4,
    aspectRatio: 1,
  },
  mediaPlaceholder: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaAuthor: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 4,
  },
});

export default CommunityDetailScreen;
