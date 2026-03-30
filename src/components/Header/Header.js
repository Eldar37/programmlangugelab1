import { useDispatch, useSelector } from 'react-redux';
import { logoutRequested, selectCurrentUser } from '../../features/auth/authSlice';
import './Header.css';

const links = [
  { label: 'Главная', href: '#home' },
  { label: 'Продукты', href: '#product' },
  { label: 'Автор', href: '#author' },
  { label: 'Контакты', href: '#contacts' },
];

function Header() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  return (
    <header className="header">
      <div className="header__row">
        <h1 className="header__brand">Eldarado</h1>
        <div className="header__menu">
          <nav className="header__nav" aria-label="Основная навигация">
            {links.map((link) => (
              <a className="header__link" href={link.href} key={link.label}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="header__auth">
            <span className="header__user">
              {currentUser ? `Пользователь: ${currentUser.login}` : 'Гость'}
            </span>
            {currentUser ? (
              <button
                className="header__button"
                onClick={() => dispatch(logoutRequested())}
                type="button"
              >
                Выйти
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
