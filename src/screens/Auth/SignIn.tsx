import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {colors} from '../../assets/colors/colors';
import {SignInNavigationProp} from '../../types/navigation';
import {useNavigation} from '@react-navigation/native';
import {FIREBASE_WEB_CLIENT_ID} from '@env';
import {onGoogleButtonPress} from '../../utils/functions/auth/authFunctions';

function SignIn(): React.JSX.Element {
  const navigation = useNavigation<SignInNavigationProp>();

  // Initialize Google Sign-In
  useEffect(() => {
    const webClientId = FIREBASE_WEB_CLIENT_ID || '';

    GoogleSignin.configure({
      webClientId,
      offlineAccess: true,
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
