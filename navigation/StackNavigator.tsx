import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SignIn from '../screens/Auth/SignIn';
import {BottomTabs} from './BottomTabs';
import {Profile} from '../screens/Profile/Profile';
import {RootStackParamList} from '../types/navigation';
import {AppHeader} from '../components/Header/AppHeader';
import {AddTravelLog} from '../screens/TravelLogs/AddTravelLog';

const Stack = createStackNavigator<RootStackParamList>();

const Header = (showLogout: boolean): React.ReactElement => (
  <AppHeader showLogout={showLogout} />
);

export const StackNavigation = () => {
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
            header: () => Header(true),
          }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{
            header: () => Header(false),
          }}
        />
        <Stack.Screen
          name="AddTravelLog"
          component={AddTravelLog}
          options={{
            headerTitle: 'Add Travel Log',
            headerStyle: {
              backgroundColor: '#333',
            },
            headerTintColor: 'white',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
