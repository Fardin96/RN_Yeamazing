import React, {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignIn from '../screens/Auth/SignIn';
import {BottomTabs} from './BottomTabs';
import {Profile} from '../screens/Profile/Profile';
import {RootStackParamList} from '../types/navigation';
import {AddTravelLog} from '../screens/TravelLogs/AddTravelLog';
import {NavigationContainer} from '@react-navigation/native';
import {isAuthenticated} from '../utils/functions/auth/authFunctions';
import {Fallback, Header} from '../components/CommonRenders';

const Stack = createStackNavigator<RootStackParamList>();

export function StackNavigation() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null); // null means "still checking"

  useEffect(() => {
    // Check authentication on component mount
    const checkAuth = async () => {
      try {
        const authStatus = await isAuthenticated();
        setIsAuth(authStatus);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuth(false); // Default to not authenticated on error
      }
    };

    checkAuth();
  }, []);

  // Show loading indicator while checking authentication
  if (isAuth === null) {
    return <Fallback />;
  }

  // Once we know the auth status, render appropriate navigator
  return (
    <NavigationContainer fallback={<Fallback />}>
      <Stack.Navigator
        id={undefined}
        initialRouteName={isAuth ? 'MainTabs' : 'SignIn'}>
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
}
