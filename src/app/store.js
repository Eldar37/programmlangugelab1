import { configureStore } from '@reduxjs/toolkit';
import { authMiddleware } from './authMiddleware';
import authReducer from '../features/auth/authSlice';
import counterReducer from '../features/counter/counterSlice';
import servicesReducer from '../features/services/servicesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    counter: counterReducer,
    services: servicesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});
