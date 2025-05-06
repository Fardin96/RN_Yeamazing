// import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  SignIn: undefined;
  // Profile: undefined;
  // VideoPlayerScreen: {
  //   videoId: string;
  //   videoTitle: string;
  //   videoThumbnail: string;
  //   videoUrl: string;
  // };
};

// export type VideoPlayerScreenRouteProp = RouteProp<
//   RootStackParamList,
//   'VideoPlayerScreen'
// >;

export type HomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

// export type ProfileScreenNavigationProp = StackNavigationProp<
//   RootStackParamList,
//   'Profile'
// >;

export type SignInNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SignIn'
>;
