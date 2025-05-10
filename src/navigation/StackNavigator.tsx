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
import {ChatScreen} from '../screens/Chats/ChatScreen';
import {NewChat} from '../screens/Chats/NewChat';
// import {fetchUsersFromFirebase} from '../utils/firebase/chatFirebase';
const Stack = createStackNavigator<RootStackParamList>();

export function StackNavigation() {
  const [isAuth, setIsAuth] = useState<boolean | null>(null); // null means "still checking"

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await isAuthenticated();
        // await fetchUsersFromFirebase('103208657539512899861');
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
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{
            headerTitle: '',
            headerStyle: {
              backgroundColor: '#333',
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name="NewChat"
          component={NewChat}
          options={{
            headerTitle: 'New Chat',
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
