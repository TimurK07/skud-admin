import { fetchApi } from './api';

export const getDashboardStats = async () => {
  return fetchApi('/api/dashboard');
};

export default {
  getDashboardStats
};