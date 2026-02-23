import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import servicesReducer from '../features/services/servicesSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    services: servicesReducer,
  },
});
