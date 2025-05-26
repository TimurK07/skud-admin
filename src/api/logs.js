import { fetchApi } from './api';


export const getLogs = async ({ page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  return fetchApi(`/api/logs?${params.toString()}`);
};


export const getAllLogs = async () => {
  return fetchApi('/api/logs');
};

export const getLogById = async (id) => {
  if (!id) {
    throw new Error('ID лога не указан');
  }
  
  return fetchApi(`/api/logs/${id}`);
};

export default {
  getLogs,
  getAllLogs,
  getLogById
};
