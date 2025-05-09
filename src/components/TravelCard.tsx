import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {TravelLog} from '../types/travelLog';

interface TravelCardProps {
  item: TravelLog;
  compact: boolean;
}

export const TravelCard = ({
  item,
  compact,
}: TravelCardProps): React.JSX.Element => {
  if (compact) {
    // Compact view - horizontal card with image on left
    return (
      <View style={styles.compactCard}>
        <Image source={{uri: item.imageUrl}} style={styles.compactImage} />

        <View style={styles.compactContent}>
          <Text style={styles.location} numberOfLines={1}>
            {item.location}
          </Text>
          <Text style={styles.date}>
            {new Date(item.dateTime).toLocaleDateString()}
          </Text>
          <Text style={styles.details} numberOfLines={2}>
            {item.details}
          </Text>
        </View>
      </View>
    );
  } else {
    // Standard view - vertical card with image on top
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
  }
};

const styles = StyleSheet.create({
  // Standard card styling (vertical card)
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

  // Compact card styling (horizontal card)
  compactCard: {
    backgroundColor: '#333',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    flexDirection: 'row',
    height: 100,
  },
  compactImage: {
    width: 100,
    height: '100%',
  },
  compactContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },

  // Common text styles
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
});
