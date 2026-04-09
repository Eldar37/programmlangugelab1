import { configureStore } from '@reduxjs/toolkit';
import { authMiddleware } from './authMiddleware';
import authReducer from '../features/auth/authSlice';
import counterReducer from '../features/counter/counterSlice';
import servicesReducer from '../features/services/servicesSlice';
import todosReducer from '../features/todos/todoSlice';
import { saveTodosState } from '../features/todos/todoStorage';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    counter: counterReducer,
    services: servicesReducer,
    todos: todosReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});

store.subscribe(() => {
  saveTodosState(store.getState().todos.items);
});
