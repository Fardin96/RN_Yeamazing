import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TravelLogs} from '../screens/TravelLogs/TravelLogs';
import {Chats} from '../screens/Chats/Chats';
import {MainTabsParamList} from '../types/navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

export function TravelPinIcon(color: string, size: number): React.ReactElement {
  return <Entypo name="location" color={color} size={size} />;
}

export function ChatIcon(color: string, size: number): React.ReactElement {
  return <Icon name="chatbubbles" color={color} size={size} />;
}

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
          tabBarIcon: ({color, size}) => TravelPinIcon(color, size),
        }}
      />
      <Tab.Screen
        name="Chats"
        component={Chats}
        options={{
          tabBarLabel: 'Chats',
          tabBarIcon: ({color, size}) => ChatIcon(color, size),
        }}
      />
    </Tab.Navigator>
  );
};
