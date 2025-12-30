import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
            <Ionicons name={post.user.avatar as any} size={24} color="#262626" />
          </View>
          <View style={styles.userDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{post.user.name}</Text>
              {post.user.verified && (
                <Ionicons name="checkmark-circle" size={14} color="#0095f6" />
              )}
            </View>
            <Text style={styles.userTitle}>{post.user.title}</Text>
            <Text style={styles.timestamp}>{post.timestamp}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#262626" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Text style={styles.content}>{post.content}</Text>

      {/* Image */}
      {post.image && (
        <View style={styles.imageContainer}>
          <Ionicons name={post.image as any} size={100} color="#fff" />
        </View>
      )}

      {/* Engagement Stats */}
      <View style={styles.engagementStats}>
        <View style={styles.leftStats}>
          <Ionicons name="heart" size={14} color="#ed4956" />
          <Text style={styles.statsText}> {post.likes}</Text>
        </View>
        <View style={styles.rightStats}>
          <Text style={styles.statsText}>{post.comments} comments</Text>
          <Text style={styles.statsText}>{post.shares} shares</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={24} color="#262626" />
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#262626" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="paper-plane-outline" size={24} color="#262626" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  userInfo: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#dbdbdb',
  },
  userDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
    marginRight: 4,
  },
  userTitle: {
    fontSize: 12,
    color: '#8e8e8e',
    marginTop: 1,
  },
  timestamp: {
    fontSize: 11,
    color: '#8e8e8e',
    marginTop: 1,
  },
  menuButton: {
    padding: 4,
  },
  content: {
    fontSize: 14,
    lineHeight: 18,
    color: '#262626',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#5b4ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  engagementStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#efefef',
  },
  leftStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 12,
    color: '#8e8e8e',
    marginRight: 12,
  },
  rightStats: {
    flexDirection: 'row',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 4,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  actionText: {
    fontSize: 13,
    color: '#262626',
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default PostCard;
