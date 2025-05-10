import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  orderBy,
  increment,
} from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import {Message, Conversation, UserStatus} from '../../types/chat';
import {getDb} from './config';

// Collection names
const CONVERSATIONS = 'conversations';
const MESSAGES = 'messages';
const USER_STATUS = 'status';

/**
 * Fetch all conversations for a user
 */
export const fetchConversationsFromFirebase = async (
  userId: string,
): Promise<Conversation[]> => {
  const db = getFirestore();
  const q = query(
    collection(db, CONVERSATIONS),
    where('participants', 'array-contains', userId),
    orderBy('updatedAt', 'desc'),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(item => ({
    id: item.id,
    ...(item.data() as Omit<Conversation, 'id'>),
  }));
};

/**
 * Subscribe to real-time conversation updates
 */
export const subscribeToConversations = (
  userId: string,
  callback: (conversations: Conversation[]) => void,
): (() => void) => {
  const db = getFirestore();
  const q = query(
    collection(db, CONVERSATIONS),
    where('participants', 'array-contains', userId),
    orderBy('updatedAt', 'desc'),
  );

  return onSnapshot(q, snapshot => {
    const conversations = snapshot.docs.map(item => ({
      id: item.id,
      ...(item.data() as Omit<Conversation, 'id'>),
    }));
    callback(conversations);
  });
};

/**
 * Fetch messages for a conversation
 */
export const fetchMessagesFromFirebase = async (
  conversationId: string,
): Promise<{conversationId: string; messages: Message[]}> => {
  const db = getFirestore();
  const q = query(
    collection(db, MESSAGES),
    where('conversationId', '==', conversationId),
    orderBy('timestamp', 'asc'),
  );

  const snapshot = await getDocs(q);
  const messages = snapshot.docs.map(item => ({
    id: item.id,
    ...(item.data() as Omit<Message, 'id'>),
  }));

  return {conversationId, messages};
};

/**
 * Subscribe to real-time message updates
 */
export const subscribeToMessages = (
  conversationId: string,
  callback: (messages: Message[]) => void,
): (() => void) => {
  const db = getFirestore();
  const q = query(
    collection(db, MESSAGES),
    where('conversationId', '==', conversationId),
    orderBy('timestamp', 'asc'),
  );

  return onSnapshot(q, snapshot => {
    const messages = snapshot.docs.map(item => ({
      id: item.id,
      ...(item.data() as Omit<Message, 'id'>),
    }));
    callback(messages);
  });
};

/**
 * Send a new message
 */
export const sendMessageToFirebase = async (
  messageData: Omit<Message, 'id' | 'timestamp' | 'read'>,
): Promise<Message> => {
  const db = getFirestore();

  // Create the complete message object
  const newMessage = {
    ...messageData,
    timestamp: Date.now(),
    read: false,
  };

  // Add message to Firestore
  const docRef = await addDoc(collection(db, MESSAGES), newMessage);

  // Update the conversation with the last message
  const conversationRef = doc(db, CONVERSATIONS, messageData.conversationId);
  await updateDoc(conversationRef, {
    lastMessage: {...newMessage, id: docRef.id},
    updatedAt: newMessage.timestamp,
    // Increment unread count for other participants only
    unreadCount: increment(1),
  });

  // Return the complete message with ID
  return {
    ...newMessage,
    id: docRef.id,
  };
};

/**
 * Mark messages as read
 */
export const updateReadStatusInFirebase = async (
  conversationId: string,
  userId: string,
): Promise<{conversationId: string; messageIds: string[]}> => {
  const db = getFirestore();

  // Find unread messages not sent by the current user
  const q = query(
    collection(db, MESSAGES),
    where('conversationId', '==', conversationId),
    where('senderId', '!=', userId),
    where('read', '==', false),
  );

  const snapshot = await getDocs(q);
  const messageIds: string[] = [];

  // Update each message's read status
  const updatePromises = snapshot.docs.map(async item => {
    await updateDoc(item.ref, {read: true});
    messageIds.push(item.id);
  });

  await Promise.all(updatePromises);

  // Reset unread count for the conversation
  if (messageIds.length > 0) {
    const conversationRef = doc(db, CONVERSATIONS, conversationId);
    await updateDoc(conversationRef, {unreadCount: 0});
  }

  return {conversationId, messageIds};
};

/**
 * Set up user online presence
 */
export const setupPresence = async (userId: string): Promise<void> => {
  try {
    // Get database reference
    const db = database();
    const userStatusRef = db.ref(`${USER_STATUS}/${userId}`);

    // Set the user as online
    await userStatusRef.set({
      online: true,
      lastSeen: Date.now(),
    });

    // Set up disconnection handler
    userStatusRef.onDisconnect().set({
      online: false,
      lastSeen: Date.now(),
    });
  } catch (error) {
    console.error('Error setting up presence:', error);
  }
};

/**
 * Update user status manually
 */
export const updateUserStatusInFirebase = async (
  status: UserStatus,
): Promise<UserStatus> => {
  try {
    const db = database();
    const userStatusRef = db.ref(`${USER_STATUS}/${status.userId}`);

    await userStatusRef.set({
      online: status.online,
      lastSeen: status.lastSeen,
    });

    return status;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

/**
 * Subscribe to user status updates
 */
export const subscribeToUserStatus = (
  userIds: string[],
  callback: (statuses: UserStatus[]) => void,
): (() => void) => {
  try {
    const db = database();
    const statusRef = db.ref(USER_STATUS);

    return statusRef.on(
      'value',
      snapshot => {
        const data = snapshot.val() || {};
        const statuses: UserStatus[] = userIds.map(userId => ({
          userId,
          online: data[userId]?.online || false,
          lastSeen: data[userId]?.lastSeen || 0,
        }));

        callback(statuses);
      },
      error => {
        console.error('Error in status subscription:', error);
      },
    );
  } catch (error) {
    console.error('Error setting up status subscription:', error);
    // Return a no-op function as fallback
    return () => {};
  }
};

/**
 * Create a new conversation
 */
export const createConversation = async (
  participants: string[],
): Promise<Conversation> => {
  const db = getFirestore();

  const newConversation: Omit<Conversation, 'id'> = {
    participants,
    unreadCount: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const docRef = await addDoc(collection(db, CONVERSATIONS), newConversation);

  return {
    id: docRef.id,
    ...newConversation,
  };
};

/**
 * Fetch all users except the current user
 */
export const fetchUsersFromFirebase = async (
  currentUserId: string,
): Promise<any[]> => {
  try {
    const db = await getDb();
    const usersCollection = collection(db, 'Users');
    const usersSnapshot = await getDocs(usersCollection);

    // console.log(
    //   '+-------------------FETCH_USERS_FROM_FIREBASE-------------------+',
    // );
    // console.log(
    //   usersSnapshot.docs
    //     .filter(item => item.data().userId !== currentUserId)
    //     .map(item => ({
    //       id: item.data().userId,
    //       ...item.data(),
    //     })),
    // );

    // Filter out the current user and map to a user object
    return usersSnapshot.docs
      .filter(item => item.data().userId !== currentUserId)
      .map(item => ({
        id: item.data().userId,
        ...item.data(),
      }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Check if a conversation already exists between two users
 */
export const findExistingConversation = async (
  userIds: string[],
): Promise<string | null> => {
  try {
    const db = getFirestore();
    // Find conversations where both users are participants
    const q = query(
      collection(db, CONVERSATIONS),
      where('participants', 'array-contains', userIds[0]),
    );

    const snapshot = await getDocs(q);

    // Check each conversation to see if the other user is a participant
    const existingConversation = snapshot.docs.find(item => {
      const data = item.data();
      return data.participants.includes(userIds[1]);
    });

    return existingConversation ? existingConversation.id : null;
  } catch (error) {
    console.error('Error finding existing conversation:', error);
    throw error;
  }
};

/**
 * Fetch a user's name by their ID
 */
export const getUserNameById = async (userId: string): Promise<string> => {
  try {
    const db = getFirestore();
    const usersCollection = collection(db, 'Users');
    const q = query(usersCollection, where('userId', '==', userId));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return 'Unknown User';
    }

    const userData = snapshot.docs[0].data();
    return userData.name || 'Unknown User';
  } catch (error) {
    console.error('Error fetching user name:', error);
    return 'Unknown User';
  }
};
