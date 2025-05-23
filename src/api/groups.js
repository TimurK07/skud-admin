import { fetchApi } from './api';

export const getGroups = async ({ name, page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams();
  
  if (name) params.append('name', name);
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  return fetchApi(`/api/groups?${params.toString()}`);
};

export const getGroupById = async (id) => {
  if (!id) {
    throw new Error('ID группы не указан');
  }
  
  return fetchApi(`/api/groups/${id}`);
};

export default {
  getGroups,
  getGroupById
};