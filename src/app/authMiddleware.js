import {
  authFailed,
  loginRequested,
  loginSucceeded,
  logoutRequested,
  logoutSucceeded,
  registerRequested,
  registerSucceeded,
} from '../features/auth/authSlice';
import { sanitizeUser, saveAuthState } from '../features/auth/authStorage';

const normalizeLogin = (value) => value.trim().toLowerCase();

const createUserId = () => `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export const authMiddleware = (store) => (next) => (action) => {
  if (registerRequested.match(action)) {
    next(action);

    const name = action.payload?.name?.trim() ?? '';
    const login = action.payload?.login?.trim() ?? '';
    const password = action.payload?.password ?? '';
    const confirmPassword = action.payload?.confirmPassword ?? '';
    const state = store.getState().auth;

    if (!name || !login || !password || !confirmPassword) {
      store.dispatch(authFailed('Заполните все поля регистрации.'));
      return;
    }

    if (password.length < 4) {
      store.dispatch(authFailed('Пароль должен содержать минимум 4 символа.'));
      return;
    }

    if (password !== confirmPassword) {
      store.dispatch(authFailed('Пароли не совпадают.'));
      return;
    }

    const hasSameLogin = state.users.some(
      (user) => normalizeLogin(user.login) === normalizeLogin(login)
    );

    if (hasSameLogin) {
      store.dispatch(authFailed('Пользователь с таким логином уже существует.'));
      return;
    }

    const user = {
      id: createUserId(),
      name,
      login,
      password,
    };
    const users = [...state.users, user];

    saveAuthState({
      users,
      currentUser: state.currentUser,
    });
    store.dispatch(
      registerSucceeded({
        users,
        user: sanitizeUser(user),
      })
    );
    return;
  }

  if (loginRequested.match(action)) {
    next(action);

    const login = action.payload?.login?.trim() ?? '';
    const password = action.payload?.password ?? '';
    const state = store.getState().auth;

    if (!login || !password) {
      store.dispatch(authFailed('Введите логин и пароль.'));
      return;
    }

    const user = state.users.find(
      (item) => normalizeLogin(item.login) === normalizeLogin(login)
    );

    if (!user || user.password !== password) {
      store.dispatch(authFailed('Неверный логин или пароль.'));
      return;
    }

    const currentUser = sanitizeUser(user);

    saveAuthState({
      users: state.users,
      currentUser,
    });
    store.dispatch(loginSucceeded({ user: currentUser }));
    return;
  }

  if (logoutRequested.match(action)) {
    next(action);

    const state = store.getState().auth;

    saveAuthState({
      users: state.users,
      currentUser: null,
    });
    store.dispatch(logoutSucceeded());
    return;
  }

  return next(action);
};
