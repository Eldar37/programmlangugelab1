import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Главная', end: true },
  { to: '/posts', label: 'Публикации' },
  { to: '/posts/new', label: 'Создать' },
  { to: '/users', label: 'Авторы' },
  { to: '/documentation', label: 'Документация' },
];

function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar__inner">
          <NavLink to="/" className="brand">
            <span className="brand__name">PostDesk</span>
            <span className="brand__caption">Экзаменационный проект React + Redux Toolkit</span>
          </NavLink>
          <nav className="nav" aria-label="Основная навигация">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? 'nav__link active' : 'nav__link'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
