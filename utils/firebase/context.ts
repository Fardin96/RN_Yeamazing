import React, {createContext, useContext, ReactNode} from 'react';
import {getFirestore} from '@react-native-firebase/firestore';
import {useEffect, useState} from 'react';

// Define the context type
type FirebaseContextType = {
  db: any | null;
};

// Create context with proper type and default value
const FirebaseContext = createContext<FirebaseContextType>({db: null});

type ProviderProps = {
  children: ReactNode;
};

export const FirebaseProvider = ({
  children,
}: ProviderProps): React.ReactElement => {
  const [db, setDb] = useState<any>(null);

  useEffect(() => {
    const firestore = getFirestore();
    setDb(firestore);
  }, []);

  return (
    <FirebaseContext.Provider value={{db}}>
      {db ? children : null}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
