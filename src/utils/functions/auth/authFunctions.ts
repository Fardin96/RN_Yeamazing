import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {SignInResult} from '../../../types/userData';
import {
  clearAllLocalData,
  getLocalData,
  setLocalData,
} from '../cachingFunctions';
import {
  AUTH_TOKEN,
  USER_EMAIL,
  USER_ID,
  USER_IMG,
  USER_NAME,
} from '../../../assets/constants';
import {addUser} from '../firestoreFunctions';
import {Alert} from 'react-native';
import {SignInNavigationProp} from '../../../types/navigation';

async function storeUserData(signInResult: SignInResult): Promise<void> {
  if (!signInResult.data) {
    return;
  }

  await setLocalData(AUTH_TOKEN, signInResult.data.idToken || '');
  await setLocalData(USER_IMG, signInResult.data.user.photo || '');
  await setLocalData(USER_NAME, signInResult.data.user.name || '');
  await setLocalData(USER_ID, signInResult.data.user.id || '');
  await setLocalData(USER_EMAIL, signInResult.data.user.email || '');

  // storing in DB
  await addUser(
    signInResult.data.idToken || '',
    signInResult.data.user.id || '',
    signInResult.data.user.name || '',
    signInResult.data.user.email || '',
    signInResult.data.user.photo || '',
  );
}

export async function onGoogleButtonPress(
  navigation: SignInNavigationProp,
): Promise<void> {
  try {
    // Check if Google Play Services are available
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

    // Attempt to sign in
    const signInResult: SignInResult = await GoogleSignin.signIn();

    // Check if response was cancelled
    if (signInResult.type === 'cancelled') {
      throw new Error('Sign in was cancelled');
    }

    // Ensure we have the required token
    if (!signInResult?.data?.idToken) {
      throw new Error('No ID token found');
    }

    if (!signInResult.data) {
      throw new Error('No data found in signInResult');
    }

    await storeUserData(signInResult);

    // Navigate to MainTabs instead of Home
    navigation.replace('MainTabs');
  } catch (error: unknown) {
    // Narrow down the error type
    if (error instanceof Error) {
      console.error('Google Sign-In Error:', error.message);

      // Handle specific errors
      if (error.message.includes('No ID token found')) {
        Alert.alert(
          'Failed to sign in. Please ensure your Google account is configured properly.',
        );
      }
    } else {
      // Handle unexpected error types
      console.error('An unexpected error occurred:', error);
    }

    // Optionally re-throw the error if necessary
    throw error;
  }
}

export async function signOut(navigation: SignInNavigationProp): Promise<void> {
  Alert.alert('Sign out?', 'Are you sure you want to sign out?', [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    {
      text: 'Sign out',
      onPress: () => {
        GoogleSignin.signOut();
        clearAllLocalData();
        navigation.navigate('SignIn');
      },
    },
  ]);
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getLocalData(USER_ID);
  console.log('user', user);

  if (typeof user === 'string') {
    return true;
  }

  return false;
}
