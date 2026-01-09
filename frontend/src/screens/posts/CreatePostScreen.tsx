import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { postsApi } from '../../services/posts.api';

interface CreatePostScreenProps {
  navigation?: any;
}

const CreatePostScreen: React.FC<CreatePostScreenProps> = ({ navigation }) => {
  const [caption, setCaption] = useState('');
  const [mediaFiles, setMediaFiles] = useState<{ uri: string; type: 'image' | 'video'; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newMedia = result.assets.map((asset) => ({
          uri: asset.uri,
          type: (asset.type === 'video' ? 'video' : 'image') as 'image' | 'video',
          name: asset.fileName || `media_${Date.now()}.${asset.type === 'video' ? 'mp4' : 'jpg'}`,
        }));
        setMediaFiles([...mediaFiles, ...newMedia]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick media');
    }
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Camera permission is required to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setMediaFiles([
          ...mediaFiles,
          {
            uri: asset.uri,
            type: 'image',
            name: asset.fileName || `photo_${Date.now()}.jpg`,
          },
        ]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    if (!caption.trim()) {
      Alert.alert('Error', 'Please enter a caption');
      return;
    }

    setLoading(true);
    try {
      if (mediaFiles.length > 0) {
        await postsApi.createPostWithMedia(caption, mediaFiles);
      } else {
        await postsApi.createPost({ caption });
      }
      
      Alert.alert('Success', 'Post created successfully!');
      navigation?.goBack();
    } catch (error: any) {
      console.error('Create post error:', error);
      Alert.alert('Error', error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.headerButton}>
          <Ionicons name="close" size={28} color="#1D2226" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity
          onPress={handleCreatePost}
          style={[styles.postButton, (!caption.trim() || loading) && styles.postButtonDisabled]}
          disabled={!caption.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person-circle" size={48} color="#0A66C2" />
          </View>
          <Text style={styles.userName}>Share your thoughts...</Text>
        </View>

        {/* Caption Input */}
        <TextInput
          style={styles.captionInput}
          placeholder="What do you want to talk about?"
          placeholderTextColor="#999"
          value={caption}
          onChangeText={setCaption}
          multiline
          textAlignVertical="top"
        />

        {/* Media Preview */}
        {mediaFiles.length > 0 && (
          <View style={styles.mediaContainer}>
            {mediaFiles.map((media, index) => (
              <View key={index} style={styles.mediaItem}>
                <Image source={{ uri: media.uri }} style={styles.mediaImage} />
                <TouchableOpacity
                  style={styles.removeMediaButton}
                  onPress={() => removeMedia(index)}
                >
                  <Ionicons name="close-circle" size={24} color="#FF3250" />
                </TouchableOpacity>
                {media.type === 'video' && (
                  <View style={styles.videoIndicator}>
                    <Ionicons name="play-circle" size={32} color="#FFFFFF" />
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Media Options */}
        <View style={styles.mediaOptions}>
          <TouchableOpacity style={styles.mediaOption} onPress={pickImage}>
            <Ionicons name="images" size={24} color="#0A66C2" />
            <Text style={styles.mediaOptionText}>Photo/Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.mediaOption} onPress={takePhoto}>
            <Ionicons name="camera" size={24} color="#0A66C2" />
            <Text style={styles.mediaOptionText}>Camera</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D2226',
  },
  postButton: {
    backgroundColor: '#0A66C2',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D2226',
  },
  captionInput: {
    paddingHorizontal: 16,
    paddingTop: 8,
    fontSize: 16,
    color: '#1D2226',
    minHeight: 150,
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  mediaItem: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  removeMediaButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  videoIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -16 }, { translateY: -16 }],
  },
  mediaOptions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 16,
  },
  mediaOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F3F6F8',
    borderRadius: 8,
    gap: 8,
  },
  mediaOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A66C2',
  },
});

export default CreatePostScreen;
