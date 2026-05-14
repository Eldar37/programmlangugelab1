import { resetFilters, setSearchFilter, setUserFilter } from '../redux/slices/postsSlice';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { selectPostsFilters } from '../redux/slices/postsSlice';
import { selectUsers } from '../redux/slices/usersSlice';

function PostFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectPostsFilters);
  const users = useAppSelector(selectUsers);

  return (
    <section className="toolbar" aria-label="Post filters">
      <label className="toolbar__field toolbar__field--wide">
        <span className="label">Search</span>
        <input
          className="input"
          value={filters.search}
          onChange={(event) => dispatch(setSearchFilter(event.target.value))}
          placeholder="Search by title or text"
        />
      </label>
      <label className="toolbar__field">
        <span className="label">Author</span>
        <select
          className="select"
          value={filters.userId}
          onChange={(event) => dispatch(setUserFilter(event.target.value))}
        >
          <option value="all">All authors</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        className="button button--secondary"
        onClick={() => dispatch(resetFilters())}
      >
        Reset
      </button>
    </section>
  );
}

export default PostFilters;
