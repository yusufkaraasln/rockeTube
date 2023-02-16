import {configureStore} from '@reduxjs/toolkit';
import authReducer from './authSlice';
import inputReducer from './inputSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    input: inputReducer,
  },
});


