import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="not-found">
      <p className="page-header__eyebrow">404</p>
      <h1 className="page-header__title">Страница не найдена</h1>
      <p className="page-header__text">Такого маршрута нет в этом React-приложении.</p>
      <div className="button-row">
        <Link className="button button--primary" to="/">
          На главную
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
