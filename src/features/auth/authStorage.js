const AUTH_STORAGE_KEY = 'redux-minimal-auth';

const DEFAULT_AUTH_STATE = {
  users: [],
  currentUser: null,
};

const isBrowser = typeof window !== 'undefined';

export const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    login: user.login,
  };
};

export const loadAuthState = () => {
  if (!isBrowser) {
    return DEFAULT_AUTH_STATE;
  }

  try {
    const rawState = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawState) {
      return DEFAULT_AUTH_STATE;
    }

    const parsedState = JSON.parse(rawState);
    const users = Array.isArray(parsedState.users) ? parsedState.users : [];
    const currentUser = sanitizeUser(parsedState.currentUser);

    const hasCurrentUser = currentUser
      ? users.some((user) => user.login === currentUser.login)
      : false;

    return {
      users,
      currentUser: hasCurrentUser ? currentUser : null,
    };
  } catch (error) {
    return DEFAULT_AUTH_STATE;
  }
};

export const saveAuthState = ({ users, currentUser }) => {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      users,
      currentUser: sanitizeUser(currentUser),
    })
  );
};
