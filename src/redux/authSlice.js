import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    userId: null,
    decoded: null,
  },
  reducers: {
    setAuthState: (state, action) => {
      state.token = action.payload.token;
      state.userId = action.payload.userId;
      state.decoded = action.payload.decoded;
    },
    clearAuthState: (state) => {
      state.token = null;
      state.userId = null;
      state.decoded = null;
    },
  },
});

export const { setAuthState, clearAuthState } = authSlice.actions;

export default authSlice.reducer;
