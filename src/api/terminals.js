import { fetchApi } from './api';


export const getAllTerminals = async () => {
  return fetchApi('/api/terminals');
};


export const getTerminalById = async (id) => {
  if (!id) {
    throw new Error('ID терминала не указан');
  }
  
  return fetchApi(`/api/terminals/${id}`);
};

export default {
  getAllTerminals,
  getTerminalById
};
