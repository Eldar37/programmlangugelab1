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
        title="Posts"
        text="Browse, search, create, update, and delete posts stored in Redux after requests to JSONPlaceholder."
        action={
          <Link className="button button--primary" to="/posts/new">
            New post
          </Link>
        }
      />

      <PostFilters />

      {loading && posts.length === 0 && (
        <StateBox title="Loading posts" text="Fetching posts from the API." type="loading" />
      )}

      {error && (
        <StateBox
          title="Request error"
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
        <StateBox title="Empty state" text="There are no posts in the store." />
      )}

      {!loading && !error && posts.length > 0 && filteredPosts.length === 0 && (
        <StateBox title="Nothing found" text="Change search text or reset filters." />
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
