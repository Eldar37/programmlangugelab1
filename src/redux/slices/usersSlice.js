import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { usersApi } from '../../services/usersApi';

const initialState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

const getMessage = (error) => error?.message || 'Users request failed.';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    return usersApi.getUsers();
  } catch (error) {
    return rejectWithValue(getMessage(error));
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.error = action.payload || getMessage(action.error);
      });
  },
});

export const { clearUsersError } = usersSlice.actions;

export const selectUsers = (state) => state.users.items;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersLoaded = (state) => state.users.loaded;
export const selectUsersError = (state) => state.users.error;
export const selectUserById = (state, id) =>
  state.users.items.find((user) => Number(user.id) === Number(id)) || null;

export default usersSlice.reducer;
