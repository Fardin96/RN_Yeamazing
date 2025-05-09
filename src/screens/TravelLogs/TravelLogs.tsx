import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {colors} from '../../assets/colors/colors';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {AddTravelLogNavigationProp} from '../../types/navigation';
import {TravelLog} from '../../types/travelLog';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TravelCard} from '../../components/TravelCard';
import {fetchTravelLogs} from '../../rtk/slices/travelLogSlice';
import {useAppDispatch, useAppSelector} from '../../rtk/hooks';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export const TravelLogs = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<AddTravelLogNavigationProp>();
  const {logs, loading} = useAppSelector(state => state.travelLogs);

  const [compactView, setCompactView] = useState(false);

  // Load logs when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchTravelLogs());
    }, [dispatch]),
  );

  const toggleViewMode = () => {
    // Enable smooth animation when changing layout
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCompactView(!compactView);
  };

  const renderLogCard = ({item}: {item: TravelLog}) => {
    return <TravelCard item={item} compact={compactView} />;
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="white" style={styles.loader} />
      ) : logs.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No travel logs yet</Text>
          <Text style={styles.emptySubtext}>
            Add your first travel memory by tapping the button below
          </Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={logs}
          renderItem={renderLogCard}
          keyExtractor={item => item.id || item.createdAt.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Bottom Action Buttons */}
      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddTravelLog')}>
          <Text style={styles.buttonText}>Add Travel Log</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewToggleButton}
          onPress={toggleViewMode}>
          <Icon
            name={compactView ? 'view-module' : 'view-list'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BG_PRIMARY,
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtext: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 80, // Space for the button
  },

  // Bottom buttons container
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginRight: 10,
  },
  viewToggleButton: {
    backgroundColor: '#444',
    borderRadius: 8,
    padding: 16,
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
