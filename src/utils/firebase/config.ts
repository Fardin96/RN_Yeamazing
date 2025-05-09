import {initializeApp, getApps} from '@react-native-firebase/app';
import {getFirestore} from '@react-native-firebase/firestore';
// import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBNS6UFkMEVuuV3C4soOPadAZf_TRZP7gM',
  authDomain: 'rn-yeamazing.firebaseapp.com',
  projectId: 'rn-yeamazing',
  storageBucket: 'rn-yeamazing.appspot.com',
  messagingSenderId: '1041095261200',
  appId: '1:1041095261200:android:1484e39d2241746fe05e95',
  measurementId: 'G-1234567890',
};

// Initialize Firebase and get Firestore instance
export async function getDb() {
  // If Firebase is not initialized, initialize it
  try {
    if (getApps().length === 0) {
      const app = await initializeApp(firebaseConfig);
      const db = getFirestore(app);

      return db;
    }
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }

  // If Firebase is already initialized, return the existing instance
  return getFirestore();
}
