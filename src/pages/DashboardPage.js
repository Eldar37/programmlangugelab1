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
        eyebrow="Overview"
        title="PostDesk dashboard"
        text="A React application with Redux Toolkit, async thunks, REST API integration, CRUD operations, filtering, and explicit application states."
        action={
          <Link className="button button--primary" to="/posts/new">
            Create post
          </Link>
        }
      />

      <section className="metrics-grid">
        <MetricCard label="Total posts" value={stats.total} hint="Loaded from JSONPlaceholder" />
        <MetricCard label="Remote posts" value={stats.remote} hint="Original API data" />
        <MetricCard label="Local posts" value={stats.local} hint="Created during this session" />
        <MetricCard label="Authors" value={stats.authors} hint="Based on userId field" />
      </section>

      {loading && posts.length === 0 && (
        <StateBox title="Loading posts" text="The app is requesting data from the REST API." type="loading" />
      )}

      {error && (
        <StateBox
          title="Data loading error"
          text={error}
          type="error"
          action={
            <button className="button button--secondary" type="button" onClick={() => dispatch(fetchPosts())}>
              Retry
            </button>
          }
        />
      )}

      {!loading && !error && posts.length === 0 && (
        <StateBox title="No posts yet" text="Create the first post to fill the dashboard." />
      )}

      {latestPosts.length > 0 && (
        <section className="page">
          <div className="page-header">
            <div>
              <h2 className="panel__title">Latest posts</h2>
              <p className="page-header__text">Recent items from the Redux store.</p>
            </div>
            <Link className="button button--secondary" to="/posts">
              View all
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
