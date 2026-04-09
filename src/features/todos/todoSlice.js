import { createSlice } from '@reduxjs/toolkit';
import { loadTodosState } from './todoStorage';

export const TODO_STATUS_OPTIONS = [
  { value: 'planned', label: 'К выполнению' },
  { value: 'in-progress', label: 'В работе' },
  { value: 'done', label: 'Готово' },
];

export const TODO_STATUS_LABELS = {
  planned: 'К выполнению',
  'in-progress': 'В работе',
  done: 'Готово',
};

const persistedTodos = loadTodosState();

const initialState = {
  items: persistedTodos,
  activeTodoId: persistedTodos[0]?.id ?? '',
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      state.items.unshift(action.payload);
      state.activeTodoId = action.payload.id;
    },
    setActiveTodo: (state, action) => {
      state.activeTodoId = action.payload;
    },
    updateTodo: (state, action) => {
      const { id, changes } = action.payload;
      const item = state.items.find((todo) => todo.id === id);

      if (item) {
        Object.assign(item, {
          ...changes,
          updatedAt: new Date().toISOString(),
        });
      }
    },
    deleteTodo: (state, action) => {
      const deletedId = action.payload;
      state.items = state.items.filter((todo) => todo.id !== deletedId);

      if (state.activeTodoId === deletedId) {
        state.activeTodoId = state.items[0]?.id ?? '';
      }
    },
  },
});

export const { addTodo, setActiveTodo, updateTodo, deleteTodo } =
  todoSlice.actions;

export const selectTodos = (state) => state.todos.items;
export const selectActiveTodoId = (state) => state.todos.activeTodoId;
export const selectTodoById = (state, todoId) =>
  state.todos.items.find((todo) => todo.id === todoId) ?? null;
export const selectActiveTodo = (state) =>
  selectTodoById(state, selectActiveTodoId(state));

export default todoSlice.reducer;
