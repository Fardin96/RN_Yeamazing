import React, {useEffect} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {colors} from '../../assets/colors/colors';
import {SignInResult} from '../../types/userData';
import {
  AUTH_TOKEN,
  USER_EMAIL,
  USER_ID,
  USER_IMG,
  USER_NAME,
} from '../../assets/constants';
import {SignInNavigationProp} from '../../types/navigation';
import {useNavigation} from '@react-navigation/native';
import {setLocalData} from '../../utils/functions/cachingFunctions';
import {addUser} from '../../utils/functions/firestoreFunctions';
import {FIREBASE_WEB_CLIENT_ID} from '@env';

async function storeUserData(signInResult: SignInResult): Promise<void> {
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

async function onGoogleButtonPress(
  navigation: SignInNavigationProp,
): Promise<void> {
  try {
    // Check if Google Play Services are available
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

    const signInResult = await GoogleSignin.signIn();

    console.log(
      '+--------------------------SIGN IN RESULT--------------------------',
    );
    console.log(signInResult);

    if (signInResult.type === 'cancelled') {
      throw new Error('Sign in was cancelled');
    }

    if (!signInResult?.data?.idToken) {
      throw new Error('No ID token found');
    }

    if (!signInResult.data) {
      throw new Error('No data found in signInResult');
    }

    await storeUserData(signInResult);
    navigation.navigate('Home');
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
      console.error('An unexpected error occurred:', error);
    }

    throw error;
  }
}

function SignIn(): React.JSX.Element {
  const navigation = useNavigation<SignInNavigationProp>();

  useEffect(() => {
    const webClientId = FIREBASE_WEB_CLIENT_ID || '';

    GoogleSignin.configure({
      webClientId,
    });
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => onGoogleButtonPress(navigation)}>
        <Text style={styles.txt}>Sign-In with Google</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default SignIn;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.BG_PRIMARY,
  },

  btn: {
    height: 75,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'red',
  },

  txt: {
    color: 'white',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
