import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Story } from '../utils/types';

interface StoryCarouselProps {
  stories: Story[];
  onStoryPress?: (index: number) => void;
}

const StoryCarousel: React.FC<StoryCarouselProps> = ({ stories, onStoryPress }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Your Story */}
        <View style={styles.storyItem}>
          <View style={[styles.storyRing, styles.addStoryRing]}>
            <View style={styles.storyAvatar}>
              <Ionicons name="add" size={24} color="#0a66c2" />
            </View>
          </View>
          <Text style={styles.storyName}>Your Story</Text>
        </View>

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
                <Ionicons name={story.user.avatar as any} size={24} color="#262626" />
              </View>
            </View>
            <Text style={styles.storyName} numberOfLines={1}>
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
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  storyItem: {
    alignItems: 'center',
    marginHorizontal: 6,
    width: 70,
  },
  storyRing: {
    width: 66,
    height: 66,
    borderRadius: 33,
    padding: 2,
    borderWidth: 2,
    borderColor: '#e1306c',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  addStoryRing: {
    borderColor: '#dbdbdb',
    borderWidth: 1,
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  storyName: {
    fontSize: 12,
    color: '#262626',
    marginTop: 2,
    textAlign: 'center',
  },
});

export default StoryCarousel;
