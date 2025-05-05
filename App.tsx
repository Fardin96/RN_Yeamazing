import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar, View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SignIn from './screens/Auth/SignIn';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {colors} from './assets/colors/colors';
import {RootStackParamList} from './types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

function Home(): React.JSX.Element {
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.BG_PRIMARY} />
      <AntDesign name="forward" size={30} color="#fff" />
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
});
