import { fetchApi } from './api';

export const getUsers = async ({
  role,
  name,
  iin,
  email,
  phone,
  page = 1,
  limit = 10,
  q = '', 
} = {}) => {
  const params = new URLSearchParams();
  
  if (q) params.append('q', q);
  
  if (role) params.append('role', role);
  if (name) params.append('name', name);
  if (iin) params.append('iin', iin);
  if (email) params.append('email', email);
  if (phone) params.append('phone', phone);
  
  // Добавляем параметры пагинации
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  
  console.log('Отправляемый URL:', `/api/users?${params.toString()}`);
  console.log('Параметры запроса:', { page, limit, q, role, name, iin, email, phone });
  
  return fetchApi(`/api/users?${params.toString()}`);
};

export const getStudents = async ({ page = 1, limit = 10, q = '' } = {}) => {
  const searchQuery = q ? `${q} student` : 'student';
  return getUsers({ page, limit, q: searchQuery });
};

export const getStaff = async ({ page = 1, limit = 10, q = '' } = {}) => {
  const searchQuery = q ? `${q} staff` : 'staff';
  return getUsers({ page, limit, q: searchQuery });
};

export const getGuests = async ({ page = 1, limit = 10, q = '' } = {}) => {
  const searchQuery = q ? `${q} visitor` : 'visitor';
  const result = await getUsers({ page, limit, q: searchQuery });
  return result;
};

export const getUserById = async (id) => {
  if (!id) {
    throw new Error('ID пользователя не указан');
  }
  
  return fetchApi(`/api/users/${id}`);
};

export default {
  getUserById,
  getUsers,
  getStudents,
  getStaff,
  getGuests,
};
