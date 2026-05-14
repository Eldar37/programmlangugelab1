import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { postsApi } from '../../services/postsApi';
import { createClientId, isRemotePostId, normalizePost, wait } from '../../utils/posts';

const initialFilters = {
  search: '',
  userId: 'all',
};

const initialState = {
  items: [],
  loading: false,
  loaded: false,
  submitting: false,
  deletingIds: [],
  error: null,
  filters: initialFilters,
  lastSync: null,
};

const getMessage = (error) => error?.message || 'Request failed. Please try again.';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (_, { rejectWithValue }) => {
  try {
    const posts = await postsApi.getPosts();
    return posts.map((post) => normalizePost(post));
  } catch (error) {
    return rejectWithValue(getMessage(error));
  }
});

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (values, { rejectWithValue }) => {
    try {
      const payload = normalizePost({
        ...values,
        id: undefined,
        userId: Number(values.userId),
      });
      const response = await postsApi.createPost(payload);

      return normalizePost({
        ...payload,
        ...response,
        id: createClientId(),
        isLocal: true,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      return rejectWithValue(getMessage(error));
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, changes }, { getState, rejectWithValue }) => {
    try {
      const currentPost = selectPostById(getState(), id);

      if (!currentPost) {
        return rejectWithValue('Post was not found.');
      }

      const nextPost = normalizePost({
        ...currentPost,
        ...changes,
        id,
        userId: Number(changes.userId ?? currentPost.userId),
        updatedAt: new Date().toISOString(),
      });

      if (isRemotePostId(id)) {
        const response = await postsApi.updatePost(id, {
          id: Number(id),
          userId: nextPost.userId,
          title: nextPost.title,
          body: nextPost.body,
        });

        return normalizePost({
          ...nextPost,
          ...response,
          id,
        });
      }

      await wait(250);
      return nextPost;
    } catch (error) {
      return rejectWithValue(getMessage(error));
    }
  }
);

export const deletePost = createAsyncThunk('posts/deletePost', async (id, { rejectWithValue }) => {
  try {
    if (isRemotePostId(id)) {
      await postsApi.deletePost(id);
    } else {
      await wait(250);
    }

    return id;
  } catch (error) {
    return rejectWithValue(getMessage(error));
  }
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
    },
    setUserFilter: (state, action) => {
      state.filters.userId = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
    },
    clearPostsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.items = action.payload;
        state.lastSync = new Date().toISOString();
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.error = action.payload || getMessage(action.error);
      })
      .addCase(createPost.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.submitting = false;
        state.items.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || getMessage(action.error);
      })
      .addCase(updatePost.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.submitting = false;
        const index = state.items.findIndex((post) => String(post.id) === String(action.payload.id));

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || getMessage(action.error);
      })
      .addCase(deletePost.pending, (state, action) => {
        state.error = null;
        state.deletingIds.push(String(action.meta.arg));
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.deletingIds = state.deletingIds.filter((item) => item !== String(action.payload));
        state.items = state.items.filter((post) => String(post.id) !== String(action.payload));
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.deletingIds = state.deletingIds.filter((item) => item !== String(action.meta.arg));
        state.error = action.payload || getMessage(action.error);
      });
  },
});

export const { setSearchFilter, setUserFilter, resetFilters, clearPostsError } =
  postsSlice.actions;

export const selectPostsState = (state) => state.posts;
export const selectPosts = (state) => state.posts.items;
export const selectPostsLoading = (state) => state.posts.loading;
export const selectPostsLoaded = (state) => state.posts.loaded;
export const selectPostsSubmitting = (state) => state.posts.submitting;
export const selectPostsError = (state) => state.posts.error;
export const selectPostDeletingIds = (state) => state.posts.deletingIds;
export const selectPostsFilters = (state) => state.posts.filters;
export const selectPostById = (state, id) =>
  state.posts.items.find((post) => String(post.id) === String(id)) || null;

export const selectFilteredPosts = createSelector(
  [selectPosts, selectPostsFilters],
  (posts, filters) => {
    const search = filters.search.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesSearch =
        !search ||
        post.title.toLowerCase().includes(search) ||
        post.body.toLowerCase().includes(search);
      const matchesUser = filters.userId === 'all' || Number(post.userId) === Number(filters.userId);

      return matchesSearch && matchesUser;
    });
  }
);

export const selectPostStats = createSelector([selectPosts], (posts) => ({
  total: posts.length,
  local: posts.filter((post) => post.isLocal).length,
  remote: posts.filter((post) => !post.isLocal).length,
  authors: new Set(posts.map((post) => post.userId)).size,
}));

export default postsSlice.reducer;
