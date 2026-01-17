// CommunitiesListScreen - Browse and discover communities

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  isJoined: boolean;
  posts?: number;
}

interface CommunitiesListScreenProps {
  navigation?: any;
}

const categories = ['All', 'Technology', 'Business', 'Education', 'Sports', 'Arts', 'Science'];

const mockCommunities: Community[] = [
  {
    id: 'c1',
    name: 'React Native Developers',
    description: 'A community for React Native developers to share knowledge and collaborate',
    members: 12500,
    category: 'Technology',
    isJoined: true,
    posts: 234,
  },
  {
    id: 'c2',
    name: 'IIT Alumni Network',
    description: 'Connect with fellow IIT graduates from all campuses',
    members: 45000,
    category: 'Education',
    isJoined: false,
    posts: 1523,
  },
  {
    id: 'c3',
    name: 'Startup Founders India',
    description: 'Network of startup founders and entrepreneurs in India',
    members: 8900,
    category: 'Business',
    isJoined: true,
    posts: 456,
  },
  {
    id: 'c4',
    name: 'AI & Machine Learning',
    description: 'Discuss latest trends in AI, ML, and Deep Learning',
    members: 23400,
    category: 'Technology',
    isJoined: false,
    posts: 892,
  },
  {
    id: 'c5',
    name: 'Product Managers India',
    description: 'Community for product managers to share best practices',
    members: 15600,
    category: 'Business',
    isJoined: false,
    posts: 678,
  },
  {
    id: 'c6',
    name: 'Digital Marketing Hub',
    description: 'Learn and share digital marketing strategies',
    members: 19200,
    category: 'Business',
    isJoined: false,
    posts: 543,
  },
  {
    id: 'c7',
    name: 'Data Science Community',
    description: 'For data scientists and analysts to collaborate',
    members: 28500,
    category: 'Technology',
    isJoined: true,
    posts: 1234,
  },
  {
    id: 'c8',
    name: 'UI/UX Designers',
    description: 'Share design inspiration and feedback',
    members: 16700,
    category: 'Arts',
    isJoined: false,
    posts: 789,
  },
];

export const CommunitiesListScreen: React.FC<CommunitiesListScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [communities, setCommunities] = useState(mockCommunities);

  const handleCommunityPress = (community: Community) => {
    if (navigation) {
      navigation.navigate('CommunityDetail', { community });
    }
  };

  const handleJoinToggle = (communityId: string) => {
    setCommunities(prev =>
      prev.map(c =>
        c.id === communityId ? { ...c, isJoined: !c.isJoined } : c
      )
    );
  };

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = 
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || community.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderCommunity = ({ item }: { item: Community }) => (
    <TouchableOpacity
      style={styles.communityCard}
      onPress={() => handleCommunityPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.communityHeader}>
        <View style={styles.communityIcon}>
          <Ionicons name="people" size={32} color="#2563eb" />
        </View>
        <View style={styles.communityInfo}>
          <Text style={styles.communityName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.communityMetaRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{item.category}</Text>
            </View>
            <Text style={styles.communityMeta}>
              {item.members.toLocaleString()} members
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.communityDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.communityFooter}>
        <TouchableOpacity
          style={[
            styles.joinButton,
            item.isJoined && styles.joinedButton,
          ]}
          onPress={(e) => {
            e.stopPropagation();
            handleJoinToggle(item.id);
          }}
        >
          <Ionicons
            name={item.isJoined ? 'checkmark-circle' : 'add-circle-outline'}
            size={18}
            color={item.isJoined ? '#059669' : '#fff'}
            style={styles.buttonIcon}
          />
          <Text
            style={[
              styles.joinButtonText,
              item.isJoined && styles.joinedButtonText,
            ]}
          >
            {item.isJoined ? 'Joined' : 'Join'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Ionicons name="chevron-forward" size={16} color="#2563eb" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Communities</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="add-circle-outline" size={24} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          placeholder="Search communities..."
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

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category && styles.categoryChipTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredCommunities.length} {filteredCommunities.length === 1 ? 'community' : 'communities'}
        </Text>
        <TouchableOpacity style={styles.sortButton}>
          <Ionicons name="swap-vertical" size={16} color="#6b7280" />
          <Text style={styles.sortButtonText}>Sort</Text>
        </TouchableOpacity>
      </View>

      {/* Communities List */}
      <FlatList
        data={filteredCommunities}
        renderItem={renderCommunity}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginHorizontal: 12,
  },
  iconButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#2563eb',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  listContent: {
    padding: 16,
  },
  communityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  communityHeader: {
    flexDirection: 'row',
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
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  communityMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563eb',
  },
  communityMeta: {
    fontSize: 13,
    color: '#6b7280',
  },
  communityDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6b7280',
    marginBottom: 12,
  },
  communityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  joinedButtonText: {
    color: '#059669',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
    marginRight: 4,
  },
});

export default CommunitiesListScreen;
