import PageHeader from '../components/PageHeader';
import StateBox from '../components/StateBox';
import { useInitialData } from '../hooks/useInitialData';
import { useAppSelector } from '../hooks/useRedux';
import { selectPosts } from '../redux/slices/postsSlice';
import { selectUsers, selectUsersError, selectUsersLoading } from '../redux/slices/usersSlice';

function UsersPage() {
  useInitialData();
  const users = useAppSelector(selectUsers);
  const posts = useAppSelector(selectPosts);
  const loading = useAppSelector(selectUsersLoading);
  const error = useAppSelector(selectUsersError);

  return (
    <div className="page">
      <PageHeader
        eyebrow="GET"
        title="Авторы"
        text="Авторы загружаются из endpoint users и связываются с публикациями через поле userId."
      />

      {loading && users.length === 0 && (
        <StateBox title="Загрузка авторов" text="Приложение запрашивает пользователей из API." type="loading" />
      )}

      {error && <StateBox title="Ошибка авторов" text={error} type="error" />}

      {!loading && !error && users.length === 0 && (
        <StateBox title="Авторов нет" text="API вернул пустой список авторов." />
      )}

      {users.length > 0 && (
        <section className="users-grid">
          {users.map((user) => {
            const count = posts.filter((post) => Number(post.userId) === Number(user.id)).length;

            return (
              <article className="user-card" key={user.id}>
                <h2 className="user-card__name">{user.name}</h2>
                <p className="user-card__line">{user.email}</p>
                <p className="user-card__line">{user.company?.name}</p>
                <p className="user-card__line">
                  <strong>{count}</strong> публикаций в текущем Redux state
                </p>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}

export default UsersPage;
