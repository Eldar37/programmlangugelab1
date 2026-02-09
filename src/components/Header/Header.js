import './Header.css';

const links = [
  { label: 'Главная', href: '#home' },
  { label: 'Продукты', href: '#product' },
  { label: 'О нас', href: '#about' },
  { label: 'Контакты', href: '#contacts' },
];

function Header() {
  return (
    <header className="header">
      <div className="header__row">
        <h1 className="header__brand">Eldarado</h1>
        <nav className="header__nav" aria-label="Основная навигация">
          {links.map((link) => (
            <a className="header__link" href={link.href} key={link.label}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
