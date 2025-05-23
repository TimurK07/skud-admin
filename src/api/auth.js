
import { fetchApi } from './api';

export const loginUser = async (credentials) => {
  try {
    return await fetchApi('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        login: credentials.login,
        password: credentials.password,
      }),
    });
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const saveToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};
