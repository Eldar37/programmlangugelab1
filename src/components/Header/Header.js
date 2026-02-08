import './Header.css';

const links = [
  { label: 'Home', href: '#' },
  { label: 'Product', href: '#product' },
  { label: 'About', href: '#about' },
  { label: 'Contacts', href: '#contacts' },
];

function Header() {
  return (
    <header className="header">
      <div className="header__row">
        <h1 className="header__brand">StartupLab</h1>
        <nav className="header__nav" aria-label="Main navigation">
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
