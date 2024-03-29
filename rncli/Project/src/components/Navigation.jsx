import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import {useDispatch, useSelector} from 'react-redux';
import {isLogin, loginProcess} from '../redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tabs from './Tabs';
import SingleVideo from './SingleVideo';
import SplashScreen from '../screens/Splash';
import Actor from '../screens/Actor';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const auth = useSelector(state => state.auth);

  const dispatch = useDispatch();

  const isLoggedIn = async () => {
    dispatch(loginProcess());
    try {
      const userInfo = await AsyncStorage.getItem('userInfo');
      if (userInfo) {
        dispatch(isLogin(JSON.parse(userInfo)));
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {auth.splashLoading ? (
          <Stack.Screen
            name="Splash Screen"
            component={SplashScreen}
            options={{headerShown: false}}
          />
        ) : auth.user ? (
          <>
            <Stack.Screen
              name="Tabs"
              component={Tabs}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Video"
              component={SingleVideo}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="Actor"
              component={Actor}
              options={{
                headerShown: false,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
