import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {AppHeader} from './Header/AppHeader';

export const Fallback = (): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007BFF" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

export const Header = (showLogout: boolean): React.JSX.Element => (
  <AppHeader showLogout={showLogout} />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#191919',
  },
  text: {
    color: 'white',
    marginTop: 10,
  },
});
