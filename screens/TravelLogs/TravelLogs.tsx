import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import {colors} from '../../assets/colors/colors';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {AddTravelLogNavigationProp} from '../../types/navigation';
import {fetchTravelLogs} from '../../utils/functions/travelLogFunctions';
import {TravelLog} from '../../types/travelLog';

export const TravelLogs = (): React.JSX.Element => {
  const navigation = useNavigation<AddTravelLogNavigationProp>();
  const [logs, setLogs] = useState<TravelLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTravelLogs = async () => {
    setLoading(true);
    const fetchedLogs = await fetchTravelLogs();
    setLogs(fetchedLogs);
    setLoading(false);
  };

  // Load logs when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadTravelLogs();
    }, []),
  );

  const renderLogCard = ({item}: {item: TravelLog}) => {
    return (
      <View style={styles.card}>
        <Image source={{uri: item.imageUrl}} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.location}>{item.location}</Text>
          <Text style={styles.date}>
            {new Date(item.dateTime).toLocaleDateString()}
          </Text>
          <Text style={styles.details} numberOfLines={2}>
            {item.details}
          </Text>
        </View>
      </View>
    );
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
          data={logs}
          renderItem={renderLogCard}
          keyExtractor={item => item.id || item.createdAt.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTravelLog')}>
        <Text style={styles.addButtonText}>Add Travel Log</Text>
      </TouchableOpacity>
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
  card: {
    backgroundColor: '#333',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 16,
  },
  location: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    color: '#999',
    fontSize: 14,
    marginBottom: 8,
  },
  details: {
    color: 'white',
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
