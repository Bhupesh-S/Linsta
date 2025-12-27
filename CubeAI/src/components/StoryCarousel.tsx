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
}

const StoryCarousel: React.FC<StoryCarouselProps> = ({ stories }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {stories.map((story) => (
          <TouchableOpacity key={story.id} style={styles.storyItem}>
            <View
              style={[
                styles.avatarContainer,
                story.isOwn && styles.ownStoryAvatar,
              ]}
            >
              <Ionicons
                name={story.user.avatar as any}
                size={32}
                color={story.isOwn ? '#0095f6' : '#262626'}
              />
            </View>
            <Text style={styles.userName} numberOfLines={1}>
              {story.user.name}
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
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#dbdbdb',
  },
  scrollContent: {
    paddingHorizontal: 8,
  },
  storyItem: {
    alignItems: 'center',
    marginHorizontal: 6,
    width: 70,
  },
  avatarContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#c13584',
    marginBottom: 4,
    position: 'relative',
  },
  ownStoryAvatar: {
    borderColor: '#dbdbdb',
    borderWidth: 2,
  },
  userName: {
    fontSize: 11,
    color: '#262626',
    textAlign: 'center',
    marginTop: 2,
  },
});

export default StoryCarousel;
