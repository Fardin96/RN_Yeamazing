import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../../assets/colors/colors';

export const Profile = (): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.BG_PRIMARY,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});
