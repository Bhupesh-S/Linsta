import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Keyboard,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import MessageBubble from '../../components/messages/MessageBubble';

interface Message {
  id: string;
  text: string;
  time: string;
  sent: boolean;
}

interface Props {
  navigation?: any;
  route?: any;
}

const ChatScreen: React.FC<Props> = ({ navigation, route }) => {
  const { colors } = useTheme();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hey! How are you?', time: '2:10 PM', sent: false },
    { id: '2', text: "I'm good! Thanks for asking 😊", time: '2:11 PM', sent: true },
    { id: '3', text: 'Are you coming to the event tomorrow?', time: '2:12 PM', sent: false },
    { id: '4', text: 'Yes! See you at the event!', time: '2:14 PM', sent: true },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const chatName = route?.params?.chatName || 'Priya Sharma';
  const chatAvatar = route?.params?.chatAvatar || 'https://i.pravatar.cc/120';

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = () => {
    if (message.trim().length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      sent: true,
    };

    setMessages([...messages, newMessage]);
    setMessage('');
    Keyboard.dismiss();

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Simulate response
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thanks for your message! 👍',
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        sent: false,
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
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
          <TouchableOpacity
            onPress={() => navigation?.goBack?.()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Image source={{ uri: chatAvatar }} style={styles.headerAvatar} />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle} numberOfLines={1}>{chatName}</Text>
              <Text style={styles.headerSubtitle}>Active now</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Ionicons name="call-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Ionicons name="videocam-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Messages ScrollView */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              text={msg.text}
              time={msg.time}
              sent={msg.sent}
            />
          ))}

          {isTyping && (
            <View style={styles.typingContainer}>
              <View style={styles.typingBubble}>
                <View style={styles.typingDots}>
                  <View style={[styles.dot, styles.dot1]} />
                  <View style={[styles.dot, styles.dot2]} />
                  <View style={[styles.dot, styles.dot3]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Bar */}
        <View style={[styles.inputBar, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <TouchableOpacity style={styles.attachButton} activeOpacity={0.7}>
            <Ionicons name="add-circle" size={28} color="#0A66C2" />
          </TouchableOpacity>

          <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TextInput
              placeholder="Type a message..."
              placeholderTextColor={colors.textSecondary}
              value={message}
              onChangeText={setMessage}
              style={[styles.input, { color: colors.text }]}
              multiline
              maxLength={500}
              returnKeyType="send"
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
            />
            <TouchableOpacity style={styles.emojiButton} activeOpacity={0.7}>
              <Ionicons name="happy-outline" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleSend}
            style={[
              styles.sendButton,
              { backgroundColor: message.trim().length > 0 ? '#0A66C2' : colors.border }
            ]}
            activeOpacity={0.8}
            disabled={message.trim().length === 0}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF20',
    marginRight: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#FFFFFFCC',
    marginTop: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    padding: 6,
  },
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  typingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  typingBubble: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF',
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.6,
  },
  dot3: {
    opacity: 0.8,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  attachButton: {
    padding: 4,
    marginBottom: 4,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
    maxHeight: 100,
  },
  input: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    paddingVertical: 6,
  },
  emojiButton: {
    padding: 4,
    marginLeft: 4,
    marginBottom: 2,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
});

export default ChatScreen;
