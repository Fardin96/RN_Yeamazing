import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {colors} from '../../assets/colors/colors';
import {useNavigation} from '@react-navigation/native';
import {ChatStackScreenNavigationProp} from '../../types/navigation';
import {format} from 'date-fns';
import {
  fetchConversationsFromFirebase,
  setupPresence,
  subscribeToConversations,
  getUserNameById,
} from '../../utils/firebase/chatFirebase';
import {USER_ID} from '../../assets/constants';
import {getLocalData} from '../../utils/functions/cachingFunctions';
import {Conversation} from '../../types/chat';

export const Chats = (): React.JSX.Element => {
  const navigation = useNavigation<ChatStackScreenNavigationProp>();

  // Local state
  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);

  // Function to get participant names
  const fetchUserNames = useCallback(
    async (convos: Conversation[]) => {
      if (!userId) return;

      const participantIds = new Set<string>();

      // Collect all unique participant IDs
      convos.forEach(convo => {
        convo.participants.forEach(participantId => {
          if (participantId !== userId) {
            participantIds.add(participantId);
          }
        });
      });

      // Fetch names for all participants
      const namesMap: Record<string, string> = {};
      for (const participantId of participantIds) {
        // Skip if we already have the name
        if (userNames[participantId]) continue;

        const name = await getUserNameById(participantId);
        namesMap[participantId] = name;
      }

      // Update state with new names
      setUserNames(prev => ({...prev, ...namesMap}));
    },
    [userId, userNames],
  );

  // Get user ID and load conversations
  useEffect(() => {
    const init = async () => {
      const id = await getLocalData(USER_ID);
      setUserId(id);

      if (id) {
        setLoading(true);
        try {
          // Fetch initial conversations
          const convos = await fetchConversationsFromFirebase(id);
          setConversations(convos);

          // Fetch user names for participants
          await fetchUserNames(convos);

          // Set up user presence
          setupPresence(id);

          // Subscribe to real-time updates
          const unsubscribe = subscribeToConversations(
            id,
            async updatedConvos => {
              setConversations(updatedConvos);
              await fetchUserNames(updatedConvos);
            },
          );

          // Cleanup subscription
          return () => unsubscribe();
        } catch (error) {
          console.error('Error fetching conversations:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    init();
  }, []);

  // Format the timestamp to a readable format
  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  // Get other participant name for display (assuming we're in a 1:1 chat)
  const getOtherParticipant = (participants: string[]) => {
    const otherUserId = participants.find(id => id !== userId);
    if (!otherUserId) return 'Unknown user';

    // Return the name if we have it, otherwise the ID
    return userNames[otherUserId] || otherUserId;
  };

  // Get the first letter of the participant's name for the avatar
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // Open a conversation when tapped
  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    navigation.navigate('ChatScreen', {conversationId});
  };

  // Create a new conversation
  const handleNewChat = () => {
    navigation.navigate('NewChat');
  };

  // Render a conversation list item
  const renderConversation = ({item}) => {
    const otherParticipant = getOtherParticipant(item.participants);
    const initial = getInitial(otherParticipant);

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => handleSelectConversation(item.id)}>
        <View style={styles.profileIcon}>
          <Text style={styles.profileInitial}>{initial}</Text>
        </View>

        <View style={styles.conversationDetails}>
          <View style={styles.headerRow}>
            <Text style={styles.participantName}>{otherParticipant}</Text>
            {item.lastMessage && (
              <Text style={styles.timestamp}>
                {formatTime(item.lastMessage.timestamp)}
              </Text>
            )}
          </View>

          <View style={styles.messageRow}>
            {item.lastMessage ? (
              <Text
                style={styles.lastMessage}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.lastMessage.text}
              </Text>
            ) : (
              <Text style={styles.noMessages}>No messages yet</Text>
            )}

            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator color={'white'} size="large" />
      ) : conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No conversations yet</Text>
          <TouchableOpacity
            style={styles.newChatButton}
            onPress={handleNewChat}>
            <Text style={styles.newChatButtonText}>Start a new chat</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={conversations.sort((a, b) => b.updatedAt - a.updatedAt)}
          keyExtractor={item => item.id}
          renderItem={renderConversation}
          contentContainerStyle={styles.listContent}
        />
      )}

      {conversations.length > 0 && (
        <TouchableOpacity style={styles.floatingButton} onPress={handleNewChat}>
          <Text style={styles.floatingButtonText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BG_PRIMARY,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  listContent: {
    padding: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#333',
    borderRadius: 8,
    alignItems: 'center',
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitial: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  conversationDetails: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  participantName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    color: '#999',
    fontSize: 12,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    color: '#ccc',
    fontSize: 14,
    flex: 1,
  },
  noMessages: {
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
  },
  unreadBadge: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  newChatButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
  },
  newChatButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
