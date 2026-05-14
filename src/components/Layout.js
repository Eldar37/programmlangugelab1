import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/posts', label: 'Posts' },
  { to: '/posts/new', label: 'Create' },
  { to: '/users', label: 'Authors' },
  { to: '/documentation', label: 'Docs' },
];

function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar__inner">
          <NavLink to="/" className="brand">
            <span className="brand__name">PostDesk</span>
            <span className="brand__caption">React + Redux Toolkit exam project</span>
          </NavLink>
          <nav className="nav" aria-label="Main navigation">
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
