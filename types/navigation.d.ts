import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

// Main stack that includes auth flow and app content
export type RootStackParamList = {
  SignIn: undefined;
  MainTabs: undefined;
  Profile: undefined;
  // Profile: undefined;
  // VideoPlayerScreen: {
  //   videoId: string;
  //   videoTitle: string;
  //   videoThumbnail: string;
  //   videoUrl: string;
  // };
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

// export type VideoPlayerScreenRouteProp = RouteProp<
//   RootStackParamList,
//   'VideoPlayerScreen'
// >;

export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;
