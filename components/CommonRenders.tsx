import {AppHeader} from './Header/AppHeader';
import {ActivityIndicator, View, StyleSheet} from 'react-native';

export const Header = (showLogout: boolean): React.ReactElement => (
  <AppHeader showLogout={showLogout} />
);

export const Fallback = (): React.ReactElement => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
