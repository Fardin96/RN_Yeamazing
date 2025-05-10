import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../assets/colors/colors';
import {useAppDispatch, useAppSelector} from '../../rtk/hooks';
import {findOrCreateConversation} from '../../rtk/slices/chatSlice';
import {NewChatNavigationProp} from '../../types/navigation';
import {USER_ID} from '../../assets/constants';
import {getLocalData} from '../../utils/functions/cachingFunctions';
import {fetchUsersFromFirebase} from '../../utils/firebase/chatFirebase';

export const NewChat = (): React.JSX.Element => {
  const navigation = useNavigation<NewChatNavigationProp>();
  const dispatch = useAppDispatch();

  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  // Redux state
  const loading = useAppSelector(state => state.chats.loading);
  const userStatuses = useAppSelector(state => state.chats.userStatuses);

  useEffect(() => {
    (async () => {
      const id = await getLocalData(USER_ID);
      setCurrentUserId(id);
    })();
  }, []);

  // Fetch users when component mounts
  useEffect(() => {
    (async () => {
      if (currentUserId) {
        const allUsers = await fetchUsersFromFirebase(currentUserId.toString());
        setUsers(allUsers);
      }
    })();
  }, [dispatch, currentUserId]);

  // Filter users based on search query
  const filteredUsers = users.filter(
    user =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Start or join a conversation with a user
  const handleSelectUser = async (userId: string) => {
    if (currentUserId) {
      try {
        // This will check if a conversation exists and create one if it doesn't
        const result = await dispatch(
          findOrCreateConversation({
            currentUserId: currentUserId.toString(),
            selectedUserId: userId,
          }),
        ).unwrap();

        // Navigate to the conversation screen
        navigation.navigate('ChatScreen', {
          conversationId: result.conversationId,
        });
      } catch (err) {
        setError('Failed to start conversation. Please try again.');
        console.error('Error starting conversation:', err);
      }
    }
  };

  // Render a user item
  const renderUserItem = ({item}) => {
    const isOnline = userStatuses[item.id]?.online || false;

    const activeStatus = isOnline
      ? {backgroundColor: '#4CAF50'}
      : {backgroundColor: '#757575'};

    return (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => handleSelectUser(item.id)}>
        <View style={styles.avatarContainer}>
          {item.photoUrl ? (
            <Image style={styles.userAvatar} source={{uri: item.photoUrl}} />
          ) : (
            <View style={styles.userAvatar}>
              <Text style={styles.userInitial}>
                {(item.name || 'User').charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={[styles.statusIndicator, activeStatus]} />
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name || 'Unknown User'}</Text>
          <Text style={styles.userEmail}>{item.email || ''}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search users..."
        placeholderTextColor="#999"
      />

      {error && <Text style={styles.errorText}>{error}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color={'white'} style={styles.loader} />
      ) : filteredUsers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'No users found matching your search'
              : 'No users available'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={item => item.id}
          renderItem={renderUserItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BG_PRIMARY,
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: 'white',
  },
  listContent: {
    paddingBottom: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#333',
    borderRadius: 8,
    marginBottom: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#333',
  },
  userInitial: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#ccc',
    fontSize: 14,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    marginBottom: 16,
    textAlign: 'center',
  },
});
