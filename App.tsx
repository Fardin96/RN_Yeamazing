import React from 'react';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './rtk/store/store';
import {StackNavigation} from './navigation/StackNavigator';
import {ThemeProvider} from './src/context/ThemeContext';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

// Initialize Google Sign-In
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID',
  offlineAccess: true,
});

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <StatusBar barStyle="light-content" backgroundColor="#191919" />
        <StackNavigation />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
