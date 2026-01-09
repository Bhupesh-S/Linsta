import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Post } from '../utils/types';
import { postsApi, Post as BackendPost } from '../services/posts.api';

interface PostCardProps {
  post: Post | BackendPost;
  onLikeUpdated?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLikeUpdated }) => {
  // Check if post is from backend (has _id) or mock (has id)
  const isBackendPost = '_id' in post;
  const [likeCount, setLikeCount] = useState(isBackendPost ? (post as BackendPost).likeCount : (post as Post).likes);
  const [isLiked, setIsLiked] = useState(isBackendPost ? (post as BackendPost).userLiked : false);
  const [isLiking, setIsLiking] = useState(false);

  // Debug: Log media data
  if (isBackendPost) {
    const backendPost = post as BackendPost;
    console.log('📸 Post media data:', {
      postId: backendPost._id,
      hasMedia: !!backendPost.media,
      mediaCount: backendPost.media?.length || 0,
      mediaUrls: backendPost.media?.map(m => m.mediaUrl) || []
    });
  }

  // Get post data based on type
  const userName = isBackendPost ? (post as BackendPost).author?.name : (post as Post).user.name;
  const userTitle = isBackendPost ? (post as BackendPost).author?.email : (post as Post).user.title;
  const content = isBackendPost ? (post as BackendPost).caption : (post as Post).content;
  const timestamp = isBackendPost ? new Date((post as BackendPost).createdAt).toLocaleDateString() : (post as Post).timestamp;
  const commentCount = isBackendPost ? (post as BackendPost).commentCount : (post as Post).comments;
  const postId = isBackendPost ? (post as BackendPost)._id : (post as Post).id;

  const handleLike = async () => {
    if (!isBackendPost || isLiking) return;

    setIsLiking(true);
    try {
      if (isLiked) {
        const result = await postsApi.unlikePost(postId);
        setLikeCount(result.likeCount);
        setIsLiked(false);
        console.log('❤️ Post unliked');
      } else {
        const result = await postsApi.likePost(postId);
        setLikeCount(result.likeCount);
        setIsLiked(true);
        console.log('💙 Post liked');
      }
      onLikeUpdated?.();
    } catch (error) {
      console.error('❌ Like error:', error);
      Alert.alert('Error', 'Failed to update like');
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={40} color="#0A66C2" />
          </View>
          <View style={styles.userDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
                {userName}
              </Text>
            </View>
            <Text style={styles.userTitle} numberOfLines={1} ellipsizeMode="tail">
              {userTitle}
            </Text>
            <Text style={styles.timestamp} numberOfLines={1}>
              {timestamp}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.menuButton} activeOpacity={0.6}>
          <Ionicons name="ellipsis-horizontal" size={22} color="#666666" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Text style={styles.content} numberOfLines={10} ellipsizeMode="tail">
        {content}
      </Text>

      {/* Media Images */}
      {isBackendPost && (post as BackendPost).media && (post as BackendPost).media!.length > 0 && (
        <View style={styles.mediaContainer}>
          {(post as BackendPost).media!.map((mediaItem, index) => {
            if (mediaItem.mediaType === 'image') {
              return (
                <Image
                  key={mediaItem._id}
                  source={{ uri: mediaItem.mediaUrl }}
                  style={styles.postImage}
                  resizeMode="cover"
                  onError={(error) => {
                    console.error('❌ Image load error:', mediaItem.mediaUrl, error.nativeEvent.error);
                  }}
                  onLoad={() => {
                    console.log('✅ Image loaded:', mediaItem.mediaUrl);
                  }}
                />
              );
            }
            return null;
          })}
        </View>
      )}

      {/* Engagement Stats */}
      <View style={styles.engagementStats}>
        <View style={styles.leftStats}>
          <View style={styles.likeIcon}>
            <Ionicons name="heart" size={14} color="#FFFFFF" />
          </View>
          <Text style={styles.statsText} numberOfLines={1}> {likeCount}</Text>
        </View>
        <View style={styles.rightStats}>
          <Text style={styles.statsText} numberOfLines={1}>{commentCount} comments</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          activeOpacity={0.6}
          onPress={handleLike}
          disabled={isLiking}
        >
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={24} 
            color={isLiked ? "#FF3250" : "#666666"} 
          />
          <Text style={[styles.actionText, isLiked && styles.actionTextLiked]} numberOfLines={1}>
            {isLiked ? 'Liked' : 'Like'}
          </Text>
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
  mediaContainer: {
    width: '100%',
    marginBottom: 8,
  },
  postImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#F0F0F0',
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
  actionTextLiked: {
    color: '#FF3250',
  },
});

export default PostCard;

