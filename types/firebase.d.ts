declare module '@react-native-firebase/app' {
  export interface FirebaseOptionsTypes {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
  }
}
