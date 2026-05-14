import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
  fetchPosts,
  selectPostsLoaded,
  selectPostsLoading,
} from '../redux/slices/postsSlice';
import {
  fetchUsers,
  selectUsersLoaded,
  selectUsersLoading,
} from '../redux/slices/usersSlice';

export function useInitialData() {
  const dispatch = useAppDispatch();
  const postsLoaded = useAppSelector(selectPostsLoaded);
  const postsLoading = useAppSelector(selectPostsLoading);
  const usersLoaded = useAppSelector(selectUsersLoaded);
  const usersLoading = useAppSelector(selectUsersLoading);

  useEffect(() => {
    if (!postsLoaded && !postsLoading) {
      dispatch(fetchPosts());
    }
  }, [dispatch, postsLoaded, postsLoading]);

  useEffect(() => {
    if (!usersLoaded && !usersLoading) {
      dispatch(fetchUsers());
    }
  }, [dispatch, usersLoaded, usersLoading]);
}
