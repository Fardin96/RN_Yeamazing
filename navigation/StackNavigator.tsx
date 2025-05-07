import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import SignIn from '../screens/Auth/SignIn';
import {BottomTabs} from './BottomTabs';
import {Profile} from '../screens/Profile/Profile';
import {AppHeader} from '../components/Header/AppHeader';

const Stack = createStackNavigator();

const Header = (showLogout: boolean): React.ReactElement => (
  <AppHeader showLogout={showLogout} />
);

export const StackNavigation = (): React.ReactElement => {
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};
