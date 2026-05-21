import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PostCard from '../components/PostCard';
import PostFilters from '../components/PostFilters';
import StateBox from '../components/StateBox';
import { useInitialData } from '../hooks/useInitialData';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import {
  fetchPosts,
  selectFilteredPosts,
  selectPosts,
  selectPostsError,
  selectPostsLoading,
} from '../redux/slices/postsSlice';

function PostsPage() {
  useInitialData();
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPosts);
  const filteredPosts = useAppSelector(selectFilteredPosts);
  const loading = useAppSelector(selectPostsLoading);
  const error = useAppSelector(selectPostsError);

  return (
    <div className="page">
      <PageHeader
        eyebrow="CRUD"
        title="Публикации"
        text="Просмотр, поиск, создание, редактирование и удаление публикаций, которые хранятся в Redux после запросов к JSONPlaceholder."
        action={
          <Link className="button button--primary" to="/posts/new">
            Новая публикация
          </Link>
        }
      />

      <PostFilters />

      {loading && posts.length === 0 && (
        <StateBox title="Загрузка публикаций" text="Получаем публикации из API." type="loading" />
      )}

      {error && (
        <StateBox
          title="Ошибка запроса"
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
        <StateBox title="Пустой список" text="В Redux store пока нет публикаций." />
      )}

      {!loading && !error && posts.length > 0 && filteredPosts.length === 0 && (
        <StateBox title="Ничего не найдено" text="Измените текст поиска или сбросьте фильтры." />
      )}

      {filteredPosts.length > 0 && (
        <section className="post-grid">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      )}
    </div>
  );
}

export default PostsPage;
