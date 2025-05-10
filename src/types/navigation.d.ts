import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

// Main stack
export type RootStackParamList = {
  SignIn: undefined;
  MainTabs: undefined;
  Profile: undefined;
  AddTravelLog: undefined;
  NewChat: undefined;
  // Profile: undefined;
  // VideoPlayerScreen: {
  //   videoId: string;
  //   videoTitle: string;
  //   videoThumbnail: string;
  //   videoUrl: string;
  // };
  ChatScreen: {conversationId: string};
  NewChat: undefined;
};

// Bottom tab navigator params
export type MainTabsParamList = {
  TravelLogs: undefined;
  Chats: undefined;
  Profile: undefined;
};

// Navigation prop types for each screen
export type SignInNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SignIn'
>;
export type ProfileNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Profile'
>;

export type TravelLogsNavigationProp = BottomTabNavigationProp<
  MainTabsParamList,
  'TravelLogs'
>;
export type ChatsNavigationProp = BottomTabNavigationProp<
  MainTabsParamList,
  'Chats'
>;

// Route prop types
export type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;

export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

// Add new navigation prop types
export type AddTravelLogNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AddTravelLog'
>;

export type ChatScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChatScreen'
>;

export type NewChatNavigationProp = StackNavigationProp<
  RootStackParamList,
  'NewChat'
>;
