import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserStories } from '../services/stories.api';

interface StoryCarouselProps {
  stories: UserStories[];
  onStoryPress?: (index: number) => void;
  onAddStory?: () => void;
}

const StoryCarousel: React.FC<StoryCarouselProps> = ({ stories, onStoryPress, onAddStory }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Your Story / Add Story */}
        <TouchableOpacity 
          style={styles.storyItem}
          onPress={onAddStory}
          activeOpacity={0.7}
        >
          <View style={[styles.storyRing, styles.addStoryRing]}>
            <View style={styles.storyAvatar}>
              <Ionicons name="add" size={28} color="#0A66C2" />
            </View>
          </View>
          <Text style={styles.storyName} numberOfLines={1} ellipsizeMode="tail">
            Your Story
          </Text>
        </TouchableOpacity>

        {/* Other Stories */}
        {stories.map((userStory, index) => (
          <TouchableOpacity
            key={userStory.user.id}
            style={styles.storyItem}
            onPress={() => onStoryPress?.(index)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.storyRing,
              userStory.stories.some(s => !s.hasViewed) && styles.unviewedRing
            ]}>
              <View style={styles.storyAvatar}>
                <Ionicons name="person-circle" size={28} color="#1D2226" />
              </View>
            </View>
            <Text style={styles.storyName} numberOfLines={1} ellipsizeMode="tail">
              {userStory.user.name.split(' ')[0]}
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
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#999',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },  unviewedRing: {
    borderColor: '#E1306C',
    ...Platform.select({
      ios: {
        shadowColor: '#E1306C',
      },
      android: {
        elevation: 4,
      },
    }),
  },  addStoryRing: {
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

