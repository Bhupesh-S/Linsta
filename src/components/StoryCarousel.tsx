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
  const latestUserStory = hasUserStories ? userStories[0] : null;

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
                <Ionicons name="add-circle" size={24} color="#0A66C2" />
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  storyItem: {
    alignItems: 'center',
    width: 76,
  },
  storyRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    padding: 3,
    borderWidth: 2.5,
    borderColor: '#E1306C',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#E1306C',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  activeStoryRing: {
    borderColor: '#0A66C2',
    ...Platform.select({
      ios: {
        shadowColor: '#0A66C2',
      },
    }),
  },
  addStoryRing: {
    borderColor: '#DBDBDB',
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
      },
    }),
  },
  storyAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
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
    bottom: 2,
    right: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyName: {
    fontSize: 12,
    color: '#1D2226',
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default StoryCarousel;

