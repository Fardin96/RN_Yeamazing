import 'react-native-gesture-handler';
import React from 'react';
import {
  StatusBar,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SignIn from './screens/Auth/SignIn';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {colors} from './assets/colors/colors';
import {RootStackParamList, SignInNavigationProp} from './types/navigation';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {convert} from './assets/dimensions/dimensions';
// import {FirebaseProvider} from './utils/firebase/context';

const Stack = createStackNavigator<RootStackParamList>();

function Home(): React.JSX.Element {
  const navigation = useNavigation<SignInNavigationProp>();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.BG_PRIMARY} />
      <AntDesign name="forward" size={30} color="#fff" />

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={async () => {
          await GoogleSignin.signOut();
          navigation.navigate('SignIn');
        }}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        id={undefined}
        initialRouteName="SignIn"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.BG_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutButton: {
    marginTop: convert(250),
    borderWidth: 3,
    borderColor: 'red',
    padding: 10,
    borderRadius: 10,
  },
  signOutButtonText: {
    color: 'white',
  },
});
