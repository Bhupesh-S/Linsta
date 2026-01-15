import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { Story } from '../utils/types';

interface StoryCarouselProps {
  stories: Story[];
  userStories?: Story[];
  onStoryPress?: (index: number) => void;
  onYourStoryPress?: () => void;
}

const StoryCarousel: React.FC<StoryCarouselProps> = ({ 
  stories, 
  userStories = [],
  onStoryPress,
  onYourStoryPress 
}) => {
  const hasUserStories = userStories.length > 0;
  const latestUserStory = hasUserStories ? userStories[userStories.length - 1] : null;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Your Story */}
        <TouchableOpacity 
          style={styles.storyItem}
          onPress={onYourStoryPress}
          activeOpacity={0.7}
        >
          <View style={[styles.storyRing, hasUserStories && styles.activeStoryRing]}>
            <View style={styles.storyAvatar}>
              {latestUserStory?.mediaUri ? (
                latestUserStory.mediaType === 'image' ? (
                  <Image 
                    source={{ uri: latestUserStory.mediaUri }} 
                    style={styles.avatarImage}
                  />
                ) : (
                  <Ionicons name="videocam" size={28} color="#0A66C2" />
                )
              ) : (
                <Ionicons name="add" size={28} color="#0A66C2" />
              )}
            </View>
            {!hasUserStories && (
              <View style={styles.addIconBadge}>
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </View>
            )}
          </View>
          <Text style={styles.storyName} numberOfLines={1} ellipsizeMode="tail">
            Your Story
          </Text>
        </TouchableOpacity>

        {/* Other Stories */}
        {stories.map((story, index) => (
          <TouchableOpacity
            key={story.id}
            style={styles.storyItem}
            onPress={() => onStoryPress?.(index)}
            activeOpacity={0.7}
          >
            <View style={styles.storyRing}>
              <View style={styles.storyAvatar}>
                <Ionicons name={story.user.avatar as any} size={28} color="#1D2226" />
              </View>
            </View>
            <Text style={styles.storyName} numberOfLines={1} ellipsizeMode="tail">
              {story.user.name.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#DBDBDB',
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 16,
  },
  storyItem: {
    alignItems: 'center',
    width: 80,
  },
  storyRing: {
    width: 74,
    height: 74,
    borderRadius: 37,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#DBDBDB',
  },
  activeStoryRing: {
    borderWidth: 3,
    borderColor: '#FF6B35', // Red-orange color similar to Instagram
  },
  addStoryRing: {
    borderColor: '#DBDBDB',
    borderWidth: 2,
  },
  storyAvatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  addIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0A66C2',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  storyName: {
    fontSize: 12,
    color: '#262626',
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '400',
    maxWidth: 80,
  },
});

export default StoryCarousel;
