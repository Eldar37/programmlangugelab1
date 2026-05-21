import { Link } from 'react-router-dom';
import MetricCard from '../components/MetricCard';
import PageHeader from '../components/PageHeader';
import PostCard from '../components/PostCard';
import StateBox from '../components/StateBox';
import { useInitialData } from '../hooks/useInitialData';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import {
  fetchPosts,
  selectPostStats,
  selectPosts,
  selectPostsError,
  selectPostsLoading,
} from '../redux/slices/postsSlice';

function DashboardPage() {
  useInitialData();
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPosts);
  const stats = useAppSelector(selectPostStats);
  const loading = useAppSelector(selectPostsLoading);
  const error = useAppSelector(selectPostsError);
  const latestPosts = posts.slice(0, 4);

  return (
    <div className="page">
      <PageHeader
        eyebrow="Обзор"
        title="Панель PostDesk"
        text="React-приложение с Redux Toolkit, асинхронными thunk-запросами, REST API, CRUD-операциями, фильтрацией и явными состояниями интерфейса."
        action={
          <Link className="button button--primary" to="/posts/new">
            Создать публикацию
          </Link>
        }
      />

      <section className="metrics-grid">
        <MetricCard label="Всего публикаций" value={stats.total} hint="Загружены из JSONPlaceholder" />
        <MetricCard label="API-публикации" value={stats.remote} hint="Исходные данные сервера" />
        <MetricCard label="Локальные" value={stats.local} hint="Созданы в текущей сессии" />
        <MetricCard label="Авторы" value={stats.authors} hint="Подсчет по полю userId" />
      </section>

      {loading && posts.length === 0 && (
        <StateBox title="Загрузка публикаций" text="Приложение запрашивает данные из REST API." type="loading" />
      )}

      {error && (
        <StateBox
          title="Ошибка загрузки данных"
          text={error}
          type="error"
          action={
            <button className="button button--secondary" type="button" onClick={() => dispatch(fetchPosts())}>
              Повторить
            </button>
          }
        />
      )}

      {!loading && !error && posts.length === 0 && (
        <StateBox title="Публикаций пока нет" text="Создайте первую публикацию, чтобы заполнить главную страницу." />
      )}

      {latestPosts.length > 0 && (
        <section className="page">
          <div className="page-header">
            <div>
              <h2 className="panel__title">Последние публикации</h2>
              <p className="page-header__text">Недавние элементы из Redux store.</p>
            </div>
            <Link className="button button--secondary" to="/posts">
              Смотреть все
            </Link>
          </div>
          <div className="post-grid">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default DashboardPage;
