import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TravelLogs} from '../screens/TravelLogs/TravelLogs';
import {Chats} from '../screens/Chats/Chats';
import {MainTabsParamList} from '../types/navigation';

// Bottom Tab Navigator
export const BottomTabs = () => {
  const Tab = createBottomTabNavigator<MainTabsParamList>();

  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={{
        tabBarStyle: {backgroundColor: '#222'},
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#888',
        headerShown: false, // We'll use a custom header
      }}>
      <Tab.Screen
        name="TravelLogs"
        component={TravelLogs}
        options={{
          tabBarLabel: 'Travel Logs',
        }}
      />
      <Tab.Screen
        name="Chats"
        component={Chats}
        options={{
          tabBarLabel: 'Chats',
        }}
      />
    </Tab.Navigator>
  );
};
