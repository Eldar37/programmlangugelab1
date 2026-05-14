import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PostForm from '../components/PostForm';
import StateBox from '../components/StateBox';
import { useInitialData } from '../hooks/useInitialData';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import {
  selectPostById,
  selectPostsLoading,
  selectPostsSubmitting,
  updatePost,
} from '../redux/slices/postsSlice';
import { selectUsers } from '../redux/slices/usersSlice';

function EditPostPage() {
  useInitialData();
  const { postId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const post = useAppSelector((state) => selectPostById(state, postId));
  const users = useAppSelector(selectUsers);
  const loading = useAppSelector(selectPostsLoading);
  const submitting = useAppSelector(selectPostsSubmitting);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (values) => {
    setFormError('');

    try {
      await dispatch(updatePost({ id: post.id, changes: values })).unwrap();
      navigate('/posts');
    } catch (error) {
      setFormError(String(error));
    }
  };

  return (
    <div className="page">
      <PageHeader
        eyebrow="PUT"
        title="Edit post"
        text="Updating an API post sends a PUT request. Session-created posts use the same thunk and remain editable locally."
        action={
          <Link className="button button--secondary" to="/posts">
            Back to posts
          </Link>
        }
      />

      {loading && !post && <StateBox title="Loading post" text="Waiting for posts from the API." type="loading" />}

      {!loading && !post && (
        <StateBox title="Post not found" text="The requested post does not exist in Redux state." />
      )}

      {formError && <StateBox title="Update error" text={formError} type="error" />}

      {post && users.length > 0 && (
        <PostForm
          initialValues={post}
          users={users}
          submitLabel="Save changes"
          isSubmitting={submitting}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default EditPostPage;
