import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {ChatState, Conversation, Message, UserStatus} from '../../types/chat';
import {
  fetchConversationsFromFirebase,
  fetchMessagesFromFirebase,
  sendMessageToFirebase,
  updateReadStatusInFirebase,
  updateUserStatusInFirebase,
  createConversation as createConversationInFirebase,
  fetchUsersFromFirebase,
  findExistingConversation,
} from '../../utils/firebase/chatFirebase';

const initialState: ChatState = {
  conversations: {},
  messages: {},
  activeConversationId: null,
  userStatuses: {},
  loading: false,
  error: null,
  users: [],
};

// Async thunks
export const fetchConversations = createAsyncThunk(
  'chats/fetchConversations',
  async (userId: string, {rejectWithValue}) => {
    try {
      return await fetchConversationsFromFirebase(userId);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch conversations');
    }
  },
);

export const fetchMessages = createAsyncThunk(
  'chats/fetchMessages',
  async (conversationId: string, {rejectWithValue}) => {
    try {
      return await fetchMessagesFromFirebase(conversationId);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch messages');
    }
  },
);

export const sendMessage = createAsyncThunk(
  'chats/sendMessage',
  async (
    {
      conversationId,
      senderId,
      text,
    }: {
      conversationId: string;
      senderId: string;
      text: string;
    },
    {rejectWithValue},
  ) => {
    try {
      return await sendMessageToFirebase({
        conversationId,
        senderId,
        text,
      });
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to send message');
    }
  },
);

export const markMessagesAsRead = createAsyncThunk(
  'chats/markMessagesAsRead',
  async (
    {
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    },
    {rejectWithValue},
  ) => {
    try {
      return await updateReadStatusInFirebase(conversationId, userId);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to mark messages as read');
    }
  },
);

export const updateUserStatus = createAsyncThunk(
  'chats/updateUserStatus',
  async (
    {
      userId,
      online,
    }: {
      userId: string;
      online: boolean;
    },
    {rejectWithValue},
  ) => {
    try {
      const status: UserStatus = {
        userId,
        online,
        lastSeen: Date.now(),
      };
      return await updateUserStatusInFirebase(status);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to update status');
    }
  },
);

export const createConversation = createAsyncThunk(
  'chats/createConversation',
  async (participants: string[], {rejectWithValue}) => {
    try {
      return await createConversationInFirebase(participants);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to create conversation');
    }
  },
);

export const fetchUsers = createAsyncThunk(
  'chats/fetchUsers',
  async (userId: string, {rejectWithValue}) => {
    try {
      return await fetchUsersFromFirebase(userId);
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch users');
    }
  },
);

export const findOrCreateConversation = createAsyncThunk(
  'chats/findOrCreateConversation',
  async (
    {
      currentUserId,
      selectedUserId,
    }: {currentUserId: string; selectedUserId: string},
    {dispatch, rejectWithValue},
  ) => {
    try {
      // Check if conversation already exists
      const existingConversationId = await findExistingConversation([
        currentUserId,
        selectedUserId,
      ]);

      if (existingConversationId) {
        // If it exists, set it as active and return it
        dispatch(setActiveConversation(existingConversationId));
        return {conversationId: existingConversationId, isNew: false};
      }

      // If it doesn't exist, create a new one
      const newConversation = await createConversationInFirebase([
        currentUserId,
        selectedUserId,
      ]);

      // Set it as active
      dispatch(setActiveConversation(newConversation.id));

      return {conversationId: newConversation.id, isNew: true};
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to find or create conversation');
    }
  },
);

const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    // Set the active conversation
    setActiveConversation(state, action: PayloadAction<string | null>) {
      state.activeConversationId = action.payload;
    },

    // Add or update a message (used when listening to real-time updates)
    upsertMessage(state, action: PayloadAction<Message>) {
      const message = action.payload;

      // Initialize message map for conversation if needed
      if (!state.messages[message.conversationId]) {
        state.messages[message.conversationId] = {};
      }

      // Add/update the message
      state.messages[message.conversationId][message.id] = message;
    },

    // Update user status (from real-time updates)
    updateUserPresence(state, action: PayloadAction<UserStatus>) {
      const status = action.payload;
      state.userStatuses[status.userId] = status;
    },

    // Update conversations from real-time listener
    updateConversations(state, action: PayloadAction<Conversation[]>) {
      const conversations = action.payload;
      conversations.forEach(conversation => {
        state.conversations[conversation.id] = conversation;
      });
    },
  },
  extraReducers: builder => {
    builder
      // Fetch conversations
      .addCase(fetchConversations.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;

        // Convert array to map for easier access
        const conversationsMap: Record<string, Conversation> = {};
        action.payload.forEach(conversation => {
          conversationsMap[conversation.id] = conversation;
        });
        state.conversations = conversationsMap;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch messages
      .addCase(fetchMessages.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        const {conversationId, messages} = action.payload;

        // Convert array to map for easier access
        const messagesMap: Record<string, Message> = {};
        messages.forEach(message => {
          messagesMap[message.id] = message;
        });
        state.messages[conversationId] = messagesMap;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        const message = action.payload;

        // Initialize message map if needed
        if (!state.messages[message.conversationId]) {
          state.messages[message.conversationId] = {};
        }

        // Add the message
        state.messages[message.conversationId][message.id] = message;

        // Update conversation's last message
        if (state.conversations[message.conversationId]) {
          state.conversations[message.conversationId].lastMessage = message;
          state.conversations[message.conversationId].updatedAt =
            message.timestamp;
        }
      })

      // Mark messages as read
      .addCase(markMessagesAsRead.fulfilled, (state, action) => {
        const {conversationId, messageIds} = action.payload;

        // Mark each message as read
        messageIds.forEach(messageId => {
          if (
            state.messages[conversationId] &&
            state.messages[conversationId][messageId]
          ) {
            state.messages[conversationId][messageId].read = true;
          }
        });

        // Reset unread count in conversation
        if (state.conversations[conversationId]) {
          state.conversations[conversationId].unreadCount = 0;
        }
      })

      // Update user status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const status = action.payload;
        state.userStatuses[status.userId] = status;
      })

      // Create conversation
      .addCase(createConversation.fulfilled, (state, action) => {
        const conversation = action.payload;
        state.conversations[conversation.id] = conversation;
        state.activeConversationId = conversation.id;
      })

      // Handle user fetching
      .addCase(fetchUsers.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Handle find or create conversation
      .addCase(findOrCreateConversation.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findOrCreateConversation.fulfilled, state => {
        state.loading = false;
      })
      .addCase(findOrCreateConversation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setActiveConversation,
  upsertMessage,
  updateUserPresence,
  updateConversations,
} = chatSlice.actions;

export default chatSlice.reducer;
