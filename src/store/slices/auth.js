import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  refreshToken: null, 
  account: null,
  info: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthTokens(state, action) {
      state.refreshToken = action.payload.refreshToken;
      state.token = action.payload.token;
    },
    setAccount(state, action) {
      state.account = action.payload;
    },
    setInfo(state, action) {
      state.info = action.payload;
    },
    updateUserInfo(state, action) {
      state.info = action.payload;
    },
    logout(state) {
      state.account = null;
      state.info = null;
      state.refreshToken = null;
      state.token = null;
    }
  }
});

export const accountId = (state) => state.auth.account.id;

export default authSlice;
