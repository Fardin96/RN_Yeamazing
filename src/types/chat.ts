// Chat feature type definitions
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: number;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[]; // Array of user IDs
  lastMessage?: Message;
  unreadCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface UserStatus {
  userId: string;
  online: boolean;
  lastSeen: number;
}

// Redux state structure
export interface ChatState {
  conversations: Record<string, Conversation>;
  messages: Record<string, Record<string, Message>>; // conversationId -> messageId -> Message
  activeConversationId: string | null;
  userStatuses: Record<string, UserStatus>;
  loading: boolean;
  error: string | null;
  users: any[];
}
