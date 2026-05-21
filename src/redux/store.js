import { configureStore } from '@reduxjs/toolkit';
import companiesReducer from './slices/companiesSlice';
import jobsReducer from './slices/jobsSlice';

export const store = configureStore({
  reducer: {
    companies: companiesReducer,
    jobs: jobsReducer,
  },
});
