import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Conversation, Message, User } from '../utils/messageTypes';

interface MessageContextType {
  conversations: Conversation[];
  sendMessage: (conversationId: string, text: string) => Promise<void>;
  getConversation: (id: string) => Conversation | undefined;
  markAsRead: (conversationId: string) => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

const MESSAGES_STORAGE_KEY = '@linsta_messages';

// Mock conversations for demonstration
const mockConversations: Conversation[] = [
  {
    id: 'conv_1',
    participant: {
      id: 'user_1',
      name: 'Priya Sharma',
      avatar: 'person-circle',
      status: 'Active now',
    },
    messages: [
      {
        id: 'msg_1',
        conversationId: 'conv_1',
        senderId: 'user_1',
        senderName: 'Priya Sharma',
        text: 'Hey! How are you?',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: true,
      },
      {
        id: 'msg_2',
        conversationId: 'conv_1',
        senderId: 'current_user',
        senderName: 'You',
        text: "I'm good! Thanks for asking 😊",
        timestamp: new Date(Date.now() - 3540000).toISOString(),
        read: true,
      },
      {
        id: 'msg_3',
        conversationId: 'conv_1',
        senderId: 'user_1',
        senderName: 'Priya Sharma',
        text: 'Are you coming to the event tomorrow?',
        timestamp: new Date(Date.now() - 3480000).toISOString(),
        read: true,
      },
      {
        id: 'msg_4',
        conversationId: 'conv_1',
        senderId: 'current_user',
        senderName: 'You',
        text: 'Yes! See you at the event!',
        timestamp: new Date(Date.now() - 3420000).toISOString(),
        read: true,
      },
    ],
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 3420000).toISOString(),
  },
  {
    id: 'conv_2',
    participant: {
      id: 'user_2',
      name: 'Rahul Kumar',
      avatar: 'person-circle',
      status: 'Active 2h ago',
    },
    messages: [
      {
        id: 'msg_5',
        conversationId: 'conv_2',
        senderId: 'user_2',
        senderName: 'Rahul Kumar',
        text: 'Did you see the latest article?',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        read: false,
      },
    ],
    unreadCount: 1,
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const stored = await AsyncStorage.getItem(MESSAGES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setConversations(parsed);
      } else {
        // Use mock data on first load
        setConversations(mockConversations);
        await AsyncStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(mockConversations));
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations(mockConversations);
    }
  };

  const sendMessage = async (conversationId: string, text: string) => {
    try {
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        conversationId,
        senderId: 'current_user',
        senderName: 'You',
        text,
        timestamp: new Date().toISOString(),
        read: true,
      };

      const updatedConversations = conversations.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: newMessage,
            updatedAt: newMessage.timestamp,
          };
        }
        return conv;
      });

      // Sort by most recent
      updatedConversations.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      setConversations(updatedConversations);
      await AsyncStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updatedConversations));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getConversation = (id: string): Conversation | undefined => {
    return conversations.find(conv => conv.id === id);
  };

  const markAsRead = async (conversationId: string) => {
    try {
      const updatedConversations = conversations.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            unreadCount: 0,
            messages: conv.messages.map(msg => ({ ...msg, read: true })),
          };
        }
        return conv;
      });

      setConversations(updatedConversations);
      await AsyncStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updatedConversations));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  return (
    <MessageContext.Provider value={{ conversations, sendMessage, getConversation, markAsRead }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
