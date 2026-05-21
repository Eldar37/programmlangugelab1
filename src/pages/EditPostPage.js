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
        title="Редактирование публикации"
        text="Редактирование API-публикации отправляет PUT-запрос. Публикации, созданные в текущей сессии, изменяются тем же thunk и остаются локальными."
        action={
          <Link className="button button--secondary" to="/posts">
            Назад к публикациям
          </Link>
        }
      />

      {loading && !post && <StateBox title="Загрузка публикации" text="Ожидаем публикации из API." type="loading" />}

      {!loading && !post && (
        <StateBox title="Публикация не найдена" text="Запрошенной публикации нет в Redux state." />
      )}

      {formError && <StateBox title="Ошибка обновления" text={formError} type="error" />}

      {post && users.length > 0 && (
        <PostForm
          initialValues={post}
          users={users}
          submitLabel="Сохранить изменения"
          isSubmitting={submitting}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default EditPostPage;
