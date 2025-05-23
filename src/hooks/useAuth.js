import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser, saveToken, getToken, removeToken } from '../api/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const result = await loginUser(credentials);
      if (result.success && result.data.token) {
        saveToken(result.data.token);
        setUser({ token: result.data.token });
        return { success: true };
      }
      return { success: false, message: 'Неизвестная ошибка' };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    router.push('/login');
  };

  return { user, loading, login, logout };
};
