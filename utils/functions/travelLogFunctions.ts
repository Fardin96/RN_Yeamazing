import {Alert} from 'react-native';
import {getDb} from '../firebase/config';
import {TravelLog} from '../../types/travelLog';
import {getLocalData} from './cachingFunctions';
import {USER_ID} from '../../assets/constants';

export async function addTravelLog(
  imageUrl: string,
  location: string,
  dateTime: number,
  details: string,
): Promise<string | null> {
  try {
    const db = await getDb();
    const userId = await getLocalData(USER_ID);

    if (!userId) {
      Alert.alert('Error', 'User not logged in');
      return null;
    }

    const travelLog: TravelLog = {
      userId,
      imageUrl,
      location,
      dateTime,
      details,
      createdAt: Date.now(),
    };

    const docRef = await db.collection('TravelLogs').add(travelLog);
    console.log('Travel log added with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding travel log:', error);
    Alert.alert('Error', 'Could not save travel log');
    return null;
  }
}

export async function fetchTravelLogs(): Promise<TravelLog[]> {
  try {
    const db = await getDb();
    const userId = await getLocalData(USER_ID);

    if (!userId) {
      Alert.alert('Error', 'User not logged in');
      return [];
    }

    const snapshot = await db
      .collection('TravelLogs')
      .where('userId', '==', userId)
      .orderBy('dateTime', 'desc')
      .get();

    const logs: TravelLog[] = [];
    snapshot.forEach(doc => {
      logs.push({
        id: doc.id,
        ...(doc.data() as Omit<TravelLog, 'id'>),
      });
    });

    return logs;
  } catch (error) {
    console.error('Error fetching travel logs:', error);
    Alert.alert('Error', 'Could not fetch travel logs');
    return [];
  }
}
