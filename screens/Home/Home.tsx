import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../assets/colors/colors';
import {SignInNavigationProp} from '../../types/navigation';
import {useNavigation} from '@react-navigation/native';
import {convert} from '../../assets/dimensions/dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {signOut} from '../../utils/functions/auth/authFunctions';

export function Home(): React.ReactElement {
  const navigation = useNavigation<SignInNavigationProp>();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.BG_PRIMARY} />
      <AntDesign name="forward" size={30} color="#fff" />

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={() => signOut(navigation)}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.BG_PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutButton: {
    marginTop: convert(250),
    borderWidth: 3,
    borderColor: 'red',
    padding: 10,
    borderRadius: 10,
  },
  signOutButtonText: {
    color: 'white',
  },
});
