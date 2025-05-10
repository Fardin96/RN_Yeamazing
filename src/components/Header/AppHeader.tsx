import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SignInNavigationProp} from '../../types/navigation';
import Icon from 'react-native-vector-icons/AntDesign';
// import {useAppSelector} from '../../rtk/hooks';
import {signOut} from '../../utils/functions/auth/authFunctions';
import {AppHeaderProps} from '../../types/appHeader';
import {getLocalData} from '../../utils/functions/cachingFunctions';
import {USER_IMG} from '../../assets/constants';

export const AppHeader = ({
  showLogout = true,
}: AppHeaderProps): React.JSX.Element => {
  const [photoUrl, setPhotoUrl] = useState('');
  const navigation = useNavigation<SignInNavigationProp>();

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  useEffect(() => {
    (async () => {
      const photo = await getLocalData(USER_IMG);
      setPhotoUrl(photo);
    })();
  }, []);

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Travel Diary</Text>

      <View style={styles.actions}>
        {showLogout && (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => signOut(navigation)}>
            <Icon name="logout" color="red" size={24} />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.profileIcon}
          onPress={handleProfilePress}>
          <Image
            source={{uri: photoUrl}}
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
