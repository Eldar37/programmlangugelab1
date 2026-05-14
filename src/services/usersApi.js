import { apiRequest } from './apiClient';

export const usersApi = {
  getUsers() {
    return apiRequest('/users');
  },
};
