import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
  likes: number;
}

interface CommentsModalProps {
  visible: boolean;
  onClose: () => void;
  postId: string;
  commentCount: number;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  visible,
  onClose,
  postId,
  commentCount,
}) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: { name: 'Sarah Johnson', avatar: 'person-circle' },
      text: 'This is amazing! 🔥',
      timestamp: '2h ago',
      likes: 12,
    },
    {
      id: '2',
      user: { name: 'Mike Chen', avatar: 'person-circle' },
      text: 'Great content! Keep it up 👍',
      timestamp: '5h ago',
      likes: 8,
    },
    {
      id: '3',
      user: { name: 'Emily Davis', avatar: 'person-circle' },
      text: 'Love this! Where can I learn more?',
      timestamp: '1d ago',
      likes: 5,
    },
  ]);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        user: { name: 'You', avatar: 'person-circle' },
        text: newComment,
        timestamp: 'Just now',
        likes: 0,
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentAvatar}>
        <Ionicons name={item.user.avatar as any} size={32} color="#666" />
      </View>
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUser}>{item.user.name}</Text>
          <Text style={styles.commentTimestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.commentText}>{item.text}</Text>
        <View style={styles.commentActions}>
          <TouchableOpacity style={styles.commentAction}>
            <Ionicons name="heart-outline" size={14} color="#666" />
            <Text style={styles.commentActionText}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentAction}>
            <Text style={styles.commentActionText}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Comments ({comments.length})
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#262626" />
          </TouchableOpacity>
        </View>

        {/* Comments List */}
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.commentsList}
          showsVerticalScrollIndicator={false}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputAvatar}>
            <Ionicons name="person-circle" size={32} color="#666" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={handleAddComment}
            disabled={!newComment.trim()}
            style={styles.sendButton}
          >
            <Ionicons
              name="send"
              size={24}
              color={newComment.trim() ? '#0A66C2' : '#ccc'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
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
  closeButton: {
    padding: 4,
  },
  commentsList: {
    paddingVertical: 8,
  },
  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#262626',
    marginRight: 8,
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#8e8e8e',
  },
  commentText: {
    fontSize: 14,
    color: '#262626',
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 16,
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentActionText: {
    fontSize: 12,
    color: '#8e8e8e',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#efefef',
    backgroundColor: '#fff',
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#262626',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default CommentsModal;
