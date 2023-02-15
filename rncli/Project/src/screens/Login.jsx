import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Button,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {success, failure} from '../redux/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(null);
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  const handleLogin = async () => {
    console.log('Login request');
    setIsLoading(true);
    const data = {
      email: email,
      password: password,
    };

    try {
      const res = await axios.post(
        'http://192.168.205.96:5000/api/user/login',
        data,
      );
      dispatch(success(res.data.user));
      AsyncStorage.setItem('userInfo', JSON.stringify(res.data.user));

      console.log('Login successful');
    } catch (error) {
      console.log(error);
      dispatch(failure(error));
      console.log('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          width: 300,
          alignItems: 'center',
          flex: 2,
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: '#ffa31a',
            fontSize: 50,
            marginBottom: 20,
            fontWeight: '200',
            padding: 10,
            width: 300,
            textAlign: 'center',
            borderRadius: 10,
          }}>
          RockeTube
        </Text>
      </View>

      <View
        style={{
          width: 300,
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 20,
          flex: 2,
        }}>
        <TextInput
          placeholderTextColor={'gray'}
          style={styles.inputContainer.input}
          placeholder="E-Mail"
          onChangeText={text => {
            setEmail(text);
          }}
        />

        <TextInput
          placeholderTextColor={'gray'}
          style={styles.inputContainer.input}
          placeholder="Password"
          textContentType="password"
          secureTextEntry={true}
          onChangeText={text => {
            setPassword(text);
          }}
        />

        <View
          style={{
            width: 300,

            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: '#ffa31a',
            }}>
            Don't have an account?{' '}
          </Text>

          <TouchableOpacity>
            <Text
              style={{
                color: '#b6b6b6',
                marginLeft: 10,
                fontWeight: 'bold',
              }}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
        {auth.error && (
          <Text
            style={{
              marginTop: 30,
              color: 'red',
            }}>
            E-Mail or Password is incorrect
          </Text>
        )}
      </View>
      <View
        style={{
          width: 300,
          height: 50,
          alignItems: 'center',
          justifyContent: 'flex-start',
          flex: 1,
        }}>
        <TouchableOpacity
          onPress={() => {
            handleLogin();
          }}
          style={{
            flex: 1,
            alignItems: 'center',
          }}>
          <View style={styles.button}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.button.text}>Login</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242526',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  inputContainer: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',

    input: {
      height: 50,
      color: '#fff',
      width: 300,
      backgroundColor: '#3b3b3b',
      borderRadius: 10,

      borderWidth: 1,
      borderColor: 'transparent',
      padding: 10,
    },
  },
  button: {
    position: 'absolute',
    bottom: 20,
    marginTop: 75,
    height: 50,
    width: 300,
    backgroundColor: '#ffa31a',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    text: {
      color: '#fff',
      fontSize: 20,
    },
  },
});
