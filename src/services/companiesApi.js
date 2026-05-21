import { apiRequest } from './apiClient';

export const companiesApi = {
  getCompanies() {
    return apiRequest('/users');
  },
};
