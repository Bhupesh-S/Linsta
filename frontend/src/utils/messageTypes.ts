export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  status?: string;
}

export interface Conversation {
  id: string;
  participant: User;
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}
