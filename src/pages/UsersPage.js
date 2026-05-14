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
        title="Authors"
        text="Authors are loaded from the users endpoint and connected with posts through userId."
      />

      {loading && users.length === 0 && (
        <StateBox title="Loading authors" text="The app is requesting users from the API." type="loading" />
      )}

      {error && <StateBox title="Authors error" text={error} type="error" />}

      {!loading && !error && users.length === 0 && (
        <StateBox title="No authors" text="The API returned an empty author list." />
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
                  <strong>{count}</strong> posts in current Redux state
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
