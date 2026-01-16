import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '../components/BottomNavigation';
import { MediaPickerService } from '../utils/MediaPickerService';
import { useArticles } from '../context/ArticleContext';
import { useUser } from '../context/UserContext';

interface CreateArticleScreenProps {
  navigation?: any;
}

interface ArticleData {
  title: string;
  content: string;
  tags?: string[];
  coverImageUri?: string;
  isDraft?: boolean;
}

const CreateArticleScreen: React.FC<CreateArticleScreenProps> = ({ navigation }) => {
  const { addArticle } = useArticles();
  const { userState } = useUser();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [coverImageUri, setCoverImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get current user data from UserContext
  const currentUser = {
    id: userState.profile?.id || 'current_user',
    name: userState.profile?.fullName || 'User',
    title: userState.profile?.title || '',
    avatar: 'person-circle',
  };

  const extractTags = (text: string): string[] => {
    const tagRegex = /#[\w]+/g;
    const matches = (title + ' ' + text).match(tagRegex) || [];
    return [...new Set(matches.map(tag => tag.toLowerCase()))];
  };

  const validateArticle = (): boolean => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please add a title');
      return false;
    }
    if (!content.trim()) {
      Alert.alert('Error', 'Please add content to your article');
      return false;
    }
    if (title.length > 100) {
      Alert.alert('Error', 'Title cannot exceed 100 characters');
      return false;
    }
    if (content.length < 50) {
      Alert.alert('Error', 'Article content should be at least 50 characters');
      return false;
    }
    return true;
  };

  const handlePublish = async (isDraft: boolean = false) => {
    if (!validateArticle()) return;

    setIsLoading(true);

    try {
      // Don't save drafts to feed, only published articles
      if (!isDraft) {
        console.log('[CreateArticleScreen] Publishing article...');
        console.log('[CreateArticleScreen] Article data:', {
          user: currentUser,
          title: title.trim(),
          content: content.trim(),
          coverImage: coverImageUri || undefined,
        });
        await addArticle({
          user: currentUser,
          title: title.trim(),
          content: content.trim(),
          coverImage: coverImageUri || undefined,
        });
        console.log('[CreateArticleScreen] Article published successfully');
      } else {
        console.log('[CreateArticleScreen] Saving as draft (not added to feed)');
      }
      
      // Reset form
      setTitle('');
      setContent('');
      setCoverImageUri(null);
      setTags([]);
      
      Alert.alert(
        'Success', 
        isDraft ? 'Article saved as draft!' : 'Article published!', 
        [{ text: 'OK', onPress: () => navigation?.navigate('Home') }]
      );
    } catch (error) {
      console.error('Error publishing article:', error);
      Alert.alert('Error', 'Failed to publish article. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = () => {
    handlePublish(true);
  };

  const handleAddImage = async () => {
    const options = [
      { 
        text: 'Choose from Gallery', 
        onPress: async () => {
          const result = await MediaPickerService.pickImage();
          if (result) {
            setCoverImageUri(result.uri);
          }
        }
      },
      { 
        text: 'Take Photo', 
        onPress: async () => {
          const result = await MediaPickerService.takePhoto();
          if (result) {
            setCoverImageUri(result.uri);
          }
        }
      },
      { text: 'Cancel', style: 'cancel' as const }
    ];
    Alert.alert('Add Image', 'Choose an option', options);
  };

  const handleAddLink = () => {
    // TODO: Implement link insertion
    Alert.alert('Add Link', 'Link insertion coming soon!');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} disabled={isLoading}>
          <Ionicons name="close" size={28} color="#262626" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Write Article</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={handleSaveDraft} 
            disabled={isLoading}
            style={styles.draftButton}
          >
            <Text style={styles.draftText}>Draft</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePublish(false)} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#0A66C2" />
            ) : (
              <Text style={styles.publishButton}>Publish</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Title Input */}
        <View style={styles.section}>
          <TextInput
            style={styles.titleInput}
            placeholder="Article title..."
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            editable={!isLoading}
          />
        </View>

        {/* Cover Image Preview */}
        {coverImageUri && (
          <View style={styles.coverImageContainer}>
            <Image source={{ uri: coverImageUri }} style={styles.coverImage} />
            <TouchableOpacity 
              style={styles.removeCoverImage}
              onPress={() => setCoverImageUri(null)}
            >
              <Ionicons name="close-circle" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Content Input */}
        <View style={styles.section}>
          <TextInput
            style={styles.contentInput}
            placeholder="Share your insights and ideas..."
            placeholderTextColor="#999"
            multiline
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
            editable={!isLoading}
          />
        </View>

        {/* Formatting Options */}
        <View style={styles.formattingBar}>
          <TouchableOpacity style={styles.formatButton} disabled={isLoading}>
            <Ionicons name="text" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.formatButton} 
            onPress={handleAddImage}
            disabled={isLoading}
          >
            <Ionicons name="image-outline" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.formatButton}
            onPress={handleAddLink}
            disabled={isLoading}
          >
            <Ionicons name="link-outline" size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.formatButton} disabled={isLoading}>
            <Ionicons name="list-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Writing Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>✍️ Writing Tips</Text>
          <Text style={styles.tipText}>• Start with a compelling headline</Text>
          <Text style={styles.tipText}>• Break content into sections</Text>
          <Text style={styles.tipText}>• Add relevant images or media</Text>
          <Text style={styles.tipText}>• End with a call to action</Text>
          <Text style={styles.tipText}>• Use hashtags for better discoverability</Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="Create" navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#262626',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  draftButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  draftText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  publishButton: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0A66C2',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '700',
    color: '#262626',
  },
  contentInput: {
    fontSize: 16,
    color: '#262626',
    minHeight: 300,
    lineHeight: 24,
  },
  formattingBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  formatButton: {
    padding: 8,
  },
  coverImageContainer: {
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeCoverImage: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 14,
  },
  tipsContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#262626',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
});

export default CreateArticleScreen;
