import { apiRequest } from './apiClient';

export const jobsApi = {
  getJobs() {
    return apiRequest('/posts');
  },

  createJob(job) {
    return apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(job),
    });
  },

  updateJob(id, job) {
    return apiRequest(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(job),
    });
  },

  deleteJob(id) {
    return apiRequest(`/posts/${id}`, {
      method: 'DELETE',
    });
  },
};
