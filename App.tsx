import React from 'react';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './src/rtk/store/store';
import {StackNavigation} from './src/navigation/StackNavigator';
import {ThemeProvider} from './src/context/ThemeContext';

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
