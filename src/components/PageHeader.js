function PageHeader({ eyebrow, title, text, action }) {
  return (
    <section className="page-header">
      <div>
        {eyebrow && <p className="page-header__eyebrow">{eyebrow}</p>}
        <h1 className="page-header__title">{title}</h1>
        {text && <p className="page-header__text">{text}</p>}
      </div>
      {action}
    </section>
  );
}

export default PageHeader;
