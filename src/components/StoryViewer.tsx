import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface Story {
  id: string;
  user: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  timestamp: string;
  content?: string;
  backgroundColor?: string;
}

interface StoryViewerProps {
  visible: boolean;
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  visible,
  stories,
  initialIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress] = useState(new Animated.Value(0));
  const [isLiked, setIsLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);

  const currentStory = stories[currentIndex];
  const STORY_DURATION = 5000; // 5 seconds per story

  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      startProgress();
    }
  }, [visible, initialIndex]);

  useEffect(() => {
    if (visible) {
      startProgress();
    }
  }, [currentIndex]);

  const startProgress = () => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        handleNext();
      }
    });
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsLiked(false);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsLiked(false);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSendComment = () => {
    if (comment.trim()) {
      // Handle comment submission
      console.log('Comment:', comment);
      setComment('');
      setShowCommentInput(false);
    }
  };

  if (!visible || !currentStory) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* Story Content */}
        <View
          style={[
            styles.storyContent,
            { backgroundColor: currentStory.backgroundColor || '#667eea' },
          ]}
        >
          {/* Progress Bars */}
          <View style={styles.progressContainer}>
            {stories.map((_, index) => (
              <View key={index} style={styles.progressBarBackground}>
                <Animated.View
                  style={[
                    styles.progressBar,
                    {
                      width:
                        index === currentIndex
                          ? progress.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0%', '100%'],
                            })
                          : index < currentIndex
                          ? '100%'
                          : '0%',
                    },
                  ]}
                />
              </View>
            ))}
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <View style={styles.avatarContainer}>
                <Ionicons name={currentStory.user.avatar as any} size={32} color="#fff" />
              </View>
              <View>
                <View style={styles.nameRow}>
                  <Text style={styles.userName}>{currentStory.user.name}</Text>
                  {currentStory.user.verified && (
                    <Ionicons name="checkmark-circle" size={14} color="#0095f6" />
                  )}
                </View>
                <Text style={styles.timestamp}>{currentStory.timestamp}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Story Content Text */}
          {currentStory.content && (
            <View style={styles.contentContainer}>
              <Text style={styles.contentText}>{currentStory.content}</Text>
            </View>
          )}

          {/* Navigation Areas */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={styles.navLeft}
              onPress={handlePrevious}
              activeOpacity={1}
            />
            <TouchableOpacity
              style={styles.navRight}
              onPress={handleNext}
              activeOpacity={1}
            />
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          {/* Like Button */}
          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={28}
              color={isLiked ? '#ed4956' : '#fff'}
            />
          </TouchableOpacity>

          {/* Comment Input */}
          {showCommentInput ? (
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Send a message..."
                placeholderTextColor="#8e8e8e"
                value={comment}
                onChangeText={setComment}
                autoFocus
              />
              <TouchableOpacity onPress={handleSendComment}>
                <Ionicons name="send" size={24} color="#0095f6" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.commentButton}
              onPress={() => setShowCommentInput(true)}
            >
              <Ionicons name="chatbubble-outline" size={28} color="#fff" />
            </TouchableOpacity>
          )}

          {/* Share Button */}
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="paper-plane-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  storyContent: {
    flex: 1,
    width: width,
    height: height,
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingTop: 50,
    gap: 4,
  },
  progressBarBackground: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  contentText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 32,
  },
  navigationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 100,
    flexDirection: 'row',
  },
  navLeft: {
    flex: 1,
  },
  navRight: {
    flex: 1,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
  commentButton: {
    flex: 1,
    padding: 8,
  },
  commentInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  commentInput: {
    flex: 1,
    fontSize: 15,
    color: '#fff',
  },
});

export default StoryViewer;
