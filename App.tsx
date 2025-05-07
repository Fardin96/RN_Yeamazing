import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SignIn from './screens/Auth/SignIn';
import {Profile} from './screens/Profile/Profile';
import {AppHeader} from './components/Header/AppHeader';
import {BottomTabs} from './navigation/BottomTabs';
import {RootStackParamList} from './types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

const Header = (showLogout: boolean) => <AppHeader showLogout={showLogout} />;

export default function App(): React.ReactElement {
  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined} initialRouteName="SignIn">
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MainTabs"
          component={BottomTabs}
          options={{
            header: Header,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            header: Header(false),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
