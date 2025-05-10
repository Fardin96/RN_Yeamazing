import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './rtk/store/store';
import {StackNavigation} from './navigation/StackNavigator';
import {ThemeProvider} from './context/ThemeContext';
import {Fallback} from './components/CommonRenders';
import {setActiveStatus} from './rtk/slices/chatSlice';
import {AppState, AppStateStatus} from 'react-native';

const App = () => {
  // Handle app state changes for user active status
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        store.dispatch(setActiveStatus(true));
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        store.dispatch(setActiveStatus(false));
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={<Fallback />} persistor={persistor}>
        <ThemeProvider>
          <StatusBar barStyle="light-content" backgroundColor="#191919" />
          <StackNavigation />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
