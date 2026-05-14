import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="not-found">
      <p className="page-header__eyebrow">404</p>
      <h1 className="page-header__title">Page not found</h1>
      <p className="page-header__text">The route does not exist in this React application.</p>
      <div className="button-row">
        <Link className="button button--primary" to="/">
          Go to dashboard
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
