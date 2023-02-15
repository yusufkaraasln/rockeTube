import {createSlice} from '@reduxjs/toolkit';

import AsyncStorage from '@react-native-async-storage/async-storage';

const getUserInfo = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('userInfo');
    return JSON.parse(jsonValue);
  } catch (e) {
    console.log('Error getting user info from storage', e);
  }
};
console.log(getUserInfo()._j);
console.log(getUserInfo()._j);
console.log(getUserInfo()._j);
console.log(getUserInfo()._j);
console.log(getUserInfo()._j);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoading: false,
    error: null,
    splashLoading: false,
  },
  reducers: {
    loginProcess(state) {
      state.splashLoading = true;
    },
    isLogin(state, action) {
      state.splashLoading = false;
      state.user = action.payload;
    },

    success(state, action) {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    failure(state, action) {
      state.user = null;
      state.isLoading = false;
      state.error = action.payload;
    },

    logout(state) {
      state.splashLoading = false;
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {failure, loginProcess, logout, success, isLogin} =
  authSlice.actions;

export default authSlice.reducer;
