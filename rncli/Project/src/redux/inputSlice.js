import {createSlice} from '@reduxjs/toolkit';

const inputSlice = createSlice({
  name: 'input',
  initialState: {
    searchBar: false,
  },
  reducers: {
    searchBar(state, action) {
      state.searchBar = action.payload;
    },
  },
});

export const {searchBar} = inputSlice.actions;

export default inputSlice.reducer;
