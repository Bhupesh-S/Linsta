import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Post } from '../utils/types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Ionicons name={post.user.avatar as any} size={24} color="#1D2226" />
          </View>
          <View style={styles.userDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
                {post.user.name}
              </Text>
              {post.user.verified && (
                <Ionicons name="checkmark-circle" size={16} color="#0A66C2" />
              )}
            </View>
            <Text style={styles.userTitle} numberOfLines={1} ellipsizeMode="tail">
              {post.user.title}
            </Text>
            <Text style={styles.timestamp} numberOfLines={1}>
              {post.timestamp}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.menuButton} activeOpacity={0.6}>
          <Ionicons name="ellipsis-horizontal" size={22} color="#666666" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Text style={styles.content} numberOfLines={10} ellipsizeMode="tail">
        {post.content}
      </Text>

      {/* Image */}
      {post.image && (
        <View style={styles.imageContainer}>
          <Ionicons name={post.image as any} size={100} color="#FFFFFF" />
        </View>
      )}

      {/* Engagement Stats */}
      <View style={styles.engagementStats}>
        <View style={styles.leftStats}>
          <View style={styles.likeIcon}>
            <Ionicons name="heart" size={14} color="#FFFFFF" />
          </View>
          <Text style={styles.statsText} numberOfLines={1}> {post.likes}</Text>
        </View>
        <View style={styles.rightStats}>
          <Text style={styles.statsText} numberOfLines={1}>{post.comments} comments</Text>
          <Text style={styles.statsText} numberOfLines={1}>{post.shares} shares</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.6}>
          <Ionicons name="heart-outline" size={24} color="#666666" />
          <Text style={styles.actionText} numberOfLines={1}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.6}>
          <Ionicons name="chatbubble-outline" size={24} color="#666666" />
          <Text style={styles.actionText} numberOfLines={1}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.6}>
          <Ionicons name="paper-plane-outline" size={24} color="#666666" />
          <Text style={styles.actionText} numberOfLines={1}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderRadius: 8,
    marginHorizontal: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  userInfo: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  userDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1D2226',
    maxWidth: '80%',
  },
  userTitle: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E8E',
    marginTop: 2,
  },
  menuButton: {
    padding: 8,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1D2226',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#5B4CCC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  engagementStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  leftStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ED4956',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 13,
    color: '#666666',
    marginRight: 16,
  },
  rightStats: {
    flexDirection: 'row',
    gap: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 4,
    paddingBottom: 12,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
  },
});

export default PostCard;

