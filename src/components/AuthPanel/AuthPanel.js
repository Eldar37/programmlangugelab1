import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearAuthFeedback,
  loginRequested,
  registerRequested,
  selectAuthError,
  selectAuthMessage,
  selectHasUsers,
} from '../../features/auth/authSlice';
import './AuthPanel.css';

const EMPTY_LOGIN_FORM = {
  login: '',
  password: '',
};

const EMPTY_REGISTER_FORM = {
  name: '',
  login: '',
  password: '',
  confirmPassword: '',
};

function AuthPanel() {
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError);
  const message = useSelector(selectAuthMessage);
  const hasUsers = useSelector(selectHasUsers);
  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState(EMPTY_LOGIN_FORM);
  const [registerForm, setRegisterForm] = useState(EMPTY_REGISTER_FORM);

  const resetFeedback = () => {
    if (error || message) {
      dispatch(clearAuthFeedback());
    }
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    resetFeedback();
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    resetFeedback();
    setLoginForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    resetFeedback();
    setRegisterForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    dispatch(loginRequested(loginForm));
    setLoginForm((previous) => ({ ...previous, password: '' }));
  };

  const handleRegisterSubmit = (event) => {
    event.preventDefault();
    dispatch(registerRequested(registerForm));
    setRegisterForm((previous) => ({
      ...previous,
      password: '',
      confirmPassword: '',
    }));
  };

  return (
    <section className="auth-panel">
      <article className="auth-panel__intro">
        <p className="auth-panel__eyebrow">Auth</p>
        <h2>Регистрация и вход через Redux middleware</h2>
        <p>
          Сначала создайте пользователя, затем войдите по логину и паролю. Данные
          сохраняются локально в браузере.
        </p>
        <div className="auth-panel__note">
          {hasUsers
            ? 'Аккаунт уже можно проверить через форму входа.'
            : 'Пока нет зарегистрированных пользователей.'}
        </div>
      </article>

      <article className="auth-card">
        <div className="auth-card__tabs" role="tablist" aria-label="Формы авторизации">
          <button
            className={mode === 'login' ? 'is-active' : ''}
            onClick={() => handleModeChange('login')}
            type="button"
          >
            Вход
          </button>
          <button
            className={mode === 'register' ? 'is-active' : ''}
            onClick={() => handleModeChange('register')}
            type="button"
          >
            Регистрация
          </button>
        </div>

        {error ? <p className="auth-card__feedback auth-card__feedback--error">{error}</p> : null}
        {message ? (
          <p className="auth-card__feedback auth-card__feedback--success">{message}</p>
        ) : null}

        {mode === 'login' ? (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <label>
              Логин
              <input
                name="login"
                onChange={handleLoginChange}
                placeholder="Введите логин"
                type="text"
                value={loginForm.login}
              />
            </label>
            <label>
              Пароль
              <input
                name="password"
                onChange={handleLoginChange}
                placeholder="Введите пароль"
                type="password"
                value={loginForm.password}
              />
            </label>
            <button className="auth-form__submit" type="submit">
              Войти
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <label>
              Имя
              <input
                name="name"
                onChange={handleRegisterChange}
                placeholder="Введите имя"
                type="text"
                value={registerForm.name}
              />
            </label>
            <label>
              Логин
              <input
                name="login"
                onChange={handleRegisterChange}
                placeholder="Придумайте логин"
                type="text"
                value={registerForm.login}
              />
            </label>
            <label>
              Пароль
              <input
                name="password"
                onChange={handleRegisterChange}
                placeholder="Минимум 4 символа"
                type="password"
                value={registerForm.password}
              />
            </label>
            <label>
              Повторите пароль
              <input
                name="confirmPassword"
                onChange={handleRegisterChange}
                placeholder="Повторите пароль"
                type="password"
                value={registerForm.confirmPassword}
              />
            </label>
            <button className="auth-form__submit" type="submit">
              Зарегистрироваться
            </button>
          </form>
        )}
      </article>
    </section>
  );
}

export default AuthPanel;
