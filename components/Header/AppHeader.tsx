import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SignInNavigationProp} from '../../types/navigation';
import {signOut} from '../../utils/functions/auth/authFunctions';

interface AppHeaderProps {
  showLogout?: boolean;
}

export const AppHeader = ({
  showLogout = true,
}: AppHeaderProps): React.JSX.Element => {
  const navigation = useNavigation<SignInNavigationProp>();

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Travel Diary</Text>

      <View style={styles.actions}>
        {showLogout && (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => signOut(navigation)}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.profileIcon}
          onPress={handleProfilePress}>
          <Text style={styles.profileText}>P</Text>
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
