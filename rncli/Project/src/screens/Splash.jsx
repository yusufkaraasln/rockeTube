import React from 'react';
import {ActivityIndicator, View} from 'react-native';

const SplashScreen = () => {
  return (
    <View
      style={{flex: 1, justifyContent: 'center', backgroundColor: '#242526'}}>
      <ActivityIndicator size="large" color="#ffa31a" />
    </View>
  );
};

export default SplashScreen;