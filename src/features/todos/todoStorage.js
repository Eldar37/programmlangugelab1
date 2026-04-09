const TODO_STORAGE_KEY = 'redux-minimal-todos';

const DEFAULT_TODO_STATE = [];

const isBrowser = typeof window !== 'undefined';

const STATUS_FALLBACK = 'planned';
const ALLOWED_STATUSES = new Set(['planned', 'in-progress', 'done']);

const sanitizeTodo = (todo) => {
  if (!todo || typeof todo !== 'object') {
    return null;
  }

  const id = typeof todo.id === 'string' ? todo.id.trim() : '';
  const title = typeof todo.title === 'string' ? todo.title.trim() : '';
  const description =
    typeof todo.description === 'string' ? todo.description.trim() : '';
  const status = ALLOWED_STATUSES.has(todo.status)
    ? todo.status
    : STATUS_FALLBACK;
  const createdAt =
    typeof todo.createdAt === 'string' ? todo.createdAt : new Date().toISOString();
  const updatedAt =
    typeof todo.updatedAt === 'string' ? todo.updatedAt : createdAt;

  if (!id || !title || !description) {
    return null;
  }

  return {
    id,
    title,
    description,
    status,
    createdAt,
    updatedAt,
  };
};

export const loadTodosState = () => {
  if (!isBrowser) {
    return DEFAULT_TODO_STATE;
  }

  try {
    const rawState = window.localStorage.getItem(TODO_STORAGE_KEY);
    if (!rawState) {
      return DEFAULT_TODO_STATE;
    }

    const parsedState = JSON.parse(rawState);
    if (!Array.isArray(parsedState)) {
      return DEFAULT_TODO_STATE;
    }

    return parsedState.map(sanitizeTodo).filter(Boolean);
  } catch (error) {
    return DEFAULT_TODO_STATE;
  }
};

export const saveTodosState = (todos) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
};
