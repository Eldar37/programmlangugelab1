import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import PostForm from '../components/PostForm';
import StateBox from '../components/StateBox';
import { useInitialData } from '../hooks/useInitialData';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { createPost, selectPostsSubmitting } from '../redux/slices/postsSlice';
import { selectUsers, selectUsersError, selectUsersLoading } from '../redux/slices/usersSlice';

function CreatePostPage() {
  useInitialData();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const users = useAppSelector(selectUsers);
  const usersLoading = useAppSelector(selectUsersLoading);
  const usersError = useAppSelector(selectUsersError);
  const submitting = useAppSelector(selectPostsSubmitting);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (values) => {
    setFormError('');

    try {
      await dispatch(createPost(values)).unwrap();
      navigate('/posts');
    } catch (error) {
      setFormError(String(error));
    }
  };

  return (
    <div className="page">
      <PageHeader
        eyebrow="POST"
        title="Create post"
        text="The form sends a POST request through createAsyncThunk and writes the response into Redux state."
      />

      {usersLoading && users.length === 0 && (
        <StateBox title="Loading authors" text="Authors are loading before the form opens." type="loading" />
      )}

      {usersError && <StateBox title="Authors error" text={usersError} type="error" />}
      {formError && <StateBox title="Create error" text={formError} type="error" />}

      {users.length > 0 && (
        <PostForm
          users={users}
          submitLabel="Create post"
          isSubmitting={submitting}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default CreatePostPage;
