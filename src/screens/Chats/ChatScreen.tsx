import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {colors} from '../../assets/colors/colors';
import {useAppDispatch, useAppSelector} from '../../rtk/hooks';
import {
  fetchMessages,
  sendMessage,
  markMessagesAsRead,
  upsertMessage,
} from '../../rtk/slices/chatSlice';
import {subscribeToMessages} from '../../utils/firebase/chatFirebase';
import {format} from 'date-fns';
import {RootStackParamList} from '../../types/navigation';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>;

export const ChatScreen = (): React.JSX.Element => {
  const route = useRoute<ChatScreenRouteProp>();
  const {conversationId} = route.params;
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  // Local state
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Redux state
  const userId = useAppSelector(state => state.user.userId);
  const messagesObj = useAppSelector(
    state => state.chats.messages[conversationId] || {},
  );
  const messages = Object.values(messagesObj).sort(
    (a, b) => a.timestamp - b.timestamp,
  );
  const loading = useAppSelector(state => state.chats.loading);
  const conversation = useAppSelector(
    state => state.chats.conversations[conversationId],
  );

  // Get participant info for header
  const otherParticipantId = conversation?.participants.find(
    id => id !== userId,
  );

  // Fetch messages when the screen loads
  useEffect(() => {
    if (conversationId) {
      dispatch(fetchMessages(conversationId));
    }
  }, [conversationId, dispatch]);

  // Set up real-time message listener
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    if (conversationId) {
      unsubscribe = subscribeToMessages(conversationId, newMessages => {
        // Update each message in the store
        newMessages.forEach(message => {
          dispatch(upsertMessage(message));
        });
      });
    }

    // Clean up on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [conversationId, dispatch]);

  // Mark messages as read when the user opens the conversation
  useEffect(() => {
    if (conversationId && userId) {
      dispatch(markMessagesAsRead({conversationId, userId}));
    }
  }, [conversationId, userId, dispatch]);

  // Set up title in header
  useEffect(() => {
    navigation.setOptions({
      title: otherParticipantId || 'Chat',
    });
  }, [navigation, otherParticipantId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  }, [messages.length]);

  // Format timestamp
  const formatMessageTime = (timestamp: number) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() && conversationId && userId) {
      dispatch(
        sendMessage({
          conversationId,
          senderId: userId,
          text: newMessage.trim(),
        }),
      );
      setNewMessage('');
    }
  };

  // Render a message bubble
  const renderMessage = ({item}) => {
    const isCurrentUser = item.senderId === userId;

    return (
      <View
        style={[
          styles.messageBubble,
          isCurrentUser ? styles.sentMessage : styles.receivedMessage,
        ]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>
          {formatMessageTime(item.timestamp)}
          {isCurrentUser && (
            <Text style={styles.readStatus}>{item.read ? ' ✓✓' : ' ✓'}</Text>
          )}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      {loading && messages.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={'white'} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !newMessage.trim() && styles.disabledButton,
          ]}
          onPress={handleSendMessage}
          disabled={!newMessage.trim()}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BG_PRIMARY,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007BFF',
    borderBottomRightRadius: 4,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  messageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  readStatus: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#222',
  },
  input: {
    flex: 1,
    backgroundColor: '#333',
    color: 'white',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 12,
    backgroundColor: '#007BFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
