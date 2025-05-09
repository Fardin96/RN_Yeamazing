import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SignInNavigationProp} from '../../types/navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import {logoutUser} from '../../rtk/slices/userSlice';
import {useAppDispatch, useAppSelector} from '../../rtk/hooks';

interface AppHeaderProps {
  showLogout?: boolean;
}

export const AppHeader = ({
  showLogout = true,
}: AppHeaderProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<SignInNavigationProp>();
  const user = useAppSelector(state => state.user);

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  async function handleLogout(): Promise<void> {
    await dispatch(logoutUser());
    navigation.navigate('SignIn');
  }

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Travel Diary</Text>

      <View style={styles.actions}>
        {showLogout && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" color="red" size={24} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.profileIcon}
          onPress={handleProfilePress}>
          <Image
            source={{uri: user.photoUrl}}
            style={styles.profileIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#333',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    paddingHorizontal: 10,
    marginRight: 10,
  },
  logoutText: {
    color: 'white',
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
