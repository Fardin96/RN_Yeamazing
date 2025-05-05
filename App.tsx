import AntDesign from 'react-native-vector-icons/AntDesign';
import {View, StatusBar, StyleSheet} from 'react-native';

export default function App(): React.ReactElement {
  return (
    <View style={styles.root}>
      <StatusBar barStyle={'light-content'} backgroundColor={'#000'} />
      <AntDesign name="forward" size={30} color={'#fff'} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
