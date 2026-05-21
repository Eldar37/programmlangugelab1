import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { deletePost, selectPostDeletingIds } from '../redux/slices/postsSlice';
import { selectUsers } from '../redux/slices/usersSlice';
import { getPostExcerpt, getUserName } from '../utils/posts';

function PostCard({ post }) {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const deletingIds = useAppSelector(selectPostDeletingIds);
  const isDeleting = deletingIds.includes(String(post.id));

  return (
    <article className="post-card">
      <div className="post-card__meta">
        <span>{getUserName(users, post.userId)}</span>
        <span>Публикация #{post.id}</span>
        {post.isLocal && <span className="badge badge--local">Локально</span>}
      </div>
      <h2 className="post-card__title">{post.title}</h2>
      <p className="post-card__body">{getPostExcerpt(post.body)}</p>
      <div className="button-row">
        <Link className="button button--secondary" to={`/posts/${post.id}/edit`}>
          Редактировать
        </Link>
        <button
          type="button"
          className="button button--danger"
          disabled={isDeleting}
          onClick={() => dispatch(deletePost(post.id))}
        >
          {isDeleting ? 'Удаление...' : 'Удалить'}
        </button>
      </div>
    </article>
  );
}

export default PostCard;
