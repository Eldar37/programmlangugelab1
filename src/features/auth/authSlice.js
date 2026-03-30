import { createSlice } from '@reduxjs/toolkit';
import { loadAuthState } from './authStorage';

const persistedAuthState = loadAuthState();

const initialState = {
  users: persistedAuthState.users,
  currentUser: persistedAuthState.currentUser,
  error: '',
  message: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerRequested: (state) => {
      state.error = '';
      state.message = '';
    },
    registerSucceeded: (state, action) => {
      state.users = action.payload.users;
      state.message = `Пользователь ${action.payload.user.login} зарегистрирован. Теперь войдите.`;
      state.error = '';
    },
    loginRequested: (state) => {
      state.error = '';
      state.message = '';
    },
    loginSucceeded: (state, action) => {
      state.currentUser = action.payload.user;
      state.message = `Вы вошли как ${action.payload.user.login}.`;
      state.error = '';
    },
    logoutRequested: () => {},
    logoutSucceeded: (state) => {
      state.currentUser = null;
      state.message = 'Вы вышли из аккаунта.';
      state.error = '';
    },
    authFailed: (state, action) => {
      state.error = action.payload;
      state.message = '';
    },
    clearAuthFeedback: (state) => {
      state.error = '';
      state.message = '';
    },
  },
});

export const {
  registerRequested,
  registerSucceeded,
  loginRequested,
  loginSucceeded,
  logoutRequested,
  logoutSucceeded,
  authFailed,
  clearAuthFeedback,
} = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthMessage = (state) => state.auth.message;
export const selectHasUsers = (state) => state.auth.users.length > 0;

export default authSlice.reducer;
