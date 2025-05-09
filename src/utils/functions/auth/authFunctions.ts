import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {SignInResult} from '../../../types/userData';
import {clearAllLocalData, getLocalData} from '../cachingFunctions';
import {Alert} from 'react-native';
import {SignInNavigationProp} from '../../../types/navigation';
import {storeUserData} from '../user/userFunctions';
import {USER_ID} from '../../../assets/constants';

export async function signUp(): Promise<SignInResult> {
  try {
    // Check if Google Play Services are available
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    const signInResult: SignInResult = await GoogleSignin.signIn();

    // Check if response was cancelled
    if (signInResult.type === 'cancelled') {
      throw new Error('Sign in was cancelled!');
    }

    // Ensure we have the required token
    if (!signInResult.data || !signInResult.data.idToken) {
      throw new Error('No valid sign-in data received');
    }

    // storing in local storage & firestore DB
    await storeUserData(signInResult);

    return signInResult;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Google Sign-In Error:', error.message);

      if (error.message.includes('No ID token found')) {
        Alert.alert(
          'Failed to sign in. Please ensure your Google account is configured properly.',
        );
      }
    } else {
      console.error('An unexpected error occurred:', error);
    }

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
