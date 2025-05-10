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
import {
  fetchMessagesFromFirebase,
  sendMessageToFirebase,
  updateReadStatusInFirebase,
  subscribeToMessages,
  getUserNameById,
} from '../../utils/firebase/chatFirebase';
import {format} from 'date-fns';
import {RootStackParamList} from '../../types/navigation';
import {Message} from '../../types/chat';
import {USER_ID} from '../../assets/constants';
import {getLocalData} from '../../utils/functions/cachingFunctions';
import {getDb} from '../../utils/firebase/config';
import {doc, getDoc} from '@react-native-firebase/firestore';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>;

export const ChatScreen = (): React.JSX.Element => {
  const route = useRoute<ChatScreenRouteProp>();
  const {conversationId} = route.params;
  const navigation = useNavigation();

  // Local state
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [otherUserName, setOtherUserName] = useState<string>('Chat');
  const flatListRef = useRef<FlatList>(null);

  // Get the current user ID from local storage
  useEffect(() => {
    const getUserId = async () => {
      const id = await getLocalData(USER_ID);
      setUserId(id);
    };
    getUserId();
  }, []);

  // Fetch messages when the screen loads and user ID is available
  useEffect(() => {
    if (!conversationId || !userId) return;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const result = await fetchMessagesFromFirebase(conversationId);
        setMessages(result.messages.sort((a, b) => a.timestamp - b.timestamp));

        // Mark messages as read
        await updateReadStatusInFirebase(conversationId, userId);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [conversationId, userId]);

  // Set up real-time message listener
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    if (conversationId) {
      unsubscribe = subscribeToMessages(conversationId, newMessages => {
        // Sort messages by timestamp
        setMessages(newMessages.sort((a, b) => a.timestamp - b.timestamp));
      });
    }

    // Clean up on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [conversationId]);

  // Load conversation details to get participant info
  useEffect(() => {
    const loadConversationDetails = async () => {
      if (!conversationId || !userId) return;

      try {
        // Fetch the conversation to get participants
        const db = await getDb();
        const docRef = doc(db, 'conversations', conversationId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const conversationData = docSnap.data();
          const otherParticipantId = conversationData.participants.find(
            (id: string) => id !== userId,
          );

          if (otherParticipantId) {
            // Get the other user's name
            const name = await getUserNameById(otherParticipantId);
            setOtherUserName(name);

            // Update the header title
            navigation.setOptions({
              title: name,
            });
          }
        }
      } catch (error) {
        console.error('Error loading conversation details:', error);
      }
    };

    loadConversationDetails();
  }, [conversationId, userId, navigation]);

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
  const handleSendMessage = async () => {
    if (newMessage.trim() && conversationId && userId) {
      try {
        setNewMessage('');

        await sendMessageToFirebase({
          conversationId,
          senderId: userId,
          text: newMessage.trim(),
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
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
