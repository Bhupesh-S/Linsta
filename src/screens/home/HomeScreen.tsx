import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  TouchableOpacity,
  ViewToken,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import StoryCarousel from '../../components/StoryCarousel';
import PostCard from '../../components/PostCard';
import VideoReel from '../../components/VideoReel';
import BottomNavigation from '../../components/BottomNavigation';
import StoryViewer from '../../components/StoryViewer';
import ReelViewer from '../../components/ReelViewer';
import CreateContentModal from '../../components/CreateContentModal';
import { mockStories, mockPosts } from '../../utils/mockData';
import { Post } from '../../utils/types';

interface HomeScreenProps {
  navigation?: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [activeReelId, setActiveReelId] = useState<string | null>(null);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [showReelViewer, setShowReelViewer] = useState(false);
  const [selectedReelIndex, setSelectedReelIndex] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Extract only reels from mockPosts
  const reelsList = useMemo(() => mockPosts.filter(post => post.isReel), []);

  const handleReelPress = (post: Post) => {
    const reelIndex = reelsList.findIndex(reel => reel.id === post.id);
    if (reelIndex !== -1) {
      setSelectedReelIndex(reelIndex);
      setShowReelViewer(true);
    }
  };

  const renderFeedItem = ({ item }: { item: any }) => {
    if (item.isReel) {
      return (
        <VideoReel 
          post={item} 
          isActive={activeReelId === item.id} 
          onReelPress={handleReelPress}
        />
      );
    }
    return <PostCard post={item} />;
  };

  // Track which items are currently viewable
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    // Find the first viewable reel
    const visibleReel = viewableItems.find(
      (item) => item.item.isReel && item.isViewable
    );

    if (visibleReel) {
      setActiveReelId(visibleReel.item.id);
    } else {
      setActiveReelId(null);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50, // Item must be 50% visible to be considered viewable
  };

  const handleStoryPress = (index: number) => {
    setSelectedStoryIndex(index);
    setShowStoryViewer(true);
  };

  const handleCreatePress = () => {
    setShowCreateModal(true);
  };

  const handleCreateStory = () => {
    Alert.alert('Create Story', 'Story creation coming soon!');
  };

  const handleCreatePost = () => {
    Alert.alert('Write Article', 'Article creation coming soon!');
  };

  const handleCreateEvent = () => {
    if (navigation) {
      navigation.navigate('CreateEvent');
    }
  };

  const handleCreateReel = () => {
    Alert.alert('Record Reel', 'Reel recording coming soon!');
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#0A66C2" translucent={false} />

      {/* Enhanced Header with Gradient */}
      <LinearGradient
        colors={['#0A66C2', '#378FE9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="logo-linkedin" size={32} color="#FFFFFF" />
            <Text style={styles.appName} numberOfLines={1} ellipsizeMode="clip">
              Linsta
            </Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation?.navigate?.('Notifications')}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={28} color="#FFFFFF" />
              <View style={styles.badge}>
                <Text style={styles.badgeText} numberOfLines={1}>5</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation?.navigate?.('Messages')}
              activeOpacity={0.7}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={28} color="#FFFFFF" />
              <View style={styles.badge}>
                <Text style={styles.badgeText} numberOfLines={1}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Stories */}
      <StoryCarousel stories={mockStories} onStoryPress={handleStoryPress} />

      {/* Feed with FlatList for smooth scrolling */}
      <FlatList
        data={mockPosts}
        renderItem={renderFeedItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedContent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        initialNumToRender={3}
        windowSize={5}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab="Home" 
        navigation={navigation} 
        onCreatePress={handleCreatePress}
      />

      {/* Story Viewer */}
      <StoryViewer
        visible={showStoryViewer}
        stories={mockStories}
        initialIndex={selectedStoryIndex}
        onClose={() => setShowStoryViewer(false)}
      />

      {/* Reel Viewer */}
      <ReelViewer
        visible={showReelViewer}
        reels={reelsList}
        initialIndex={selectedReelIndex}
        onClose={() => setShowReelViewer(false)}
      />

      {/* Create Content Modal */}
      <CreateContentModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateStory={handleCreateStory}
        onCreatePost={handleCreatePost}
        onCreateEvent={handleCreateEvent}
        onCreateReel={handleCreateReel}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  iconButton: {
    position: 'relative',
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3250',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#378FE9',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  feedContent: {
    paddingBottom: 90, // Increased to account for fixed bottom navigation
  },
});

export default HomeScreen;

