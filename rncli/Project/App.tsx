import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import Navigation from './src/components/Navigation';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {isLogin} from './src/redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Orientation from 'react-native-orientation-locker';

function App(): JSX.Element {
  React.useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  return (
    <Provider store={store}>
      <StatusBar barStyle="light-content" backgroundColor="#242526" />
      <Navigation />
    </Provider>
  );
}

export default App;
