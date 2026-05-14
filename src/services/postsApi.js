import { apiRequest } from './apiClient';

export const postsApi = {
  getPosts() {
    return apiRequest('/posts');
  },

  createPost(post) {
    return apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(post),
    });
  },

  updatePost(id, post) {
    return apiRequest(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(post),
    });
  },

  deletePost(id) {
    return apiRequest(`/posts/${id}`, {
      method: 'DELETE',
    });
  },
};
