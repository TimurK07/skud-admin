'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '../../api/auth';
import styles from './styles.module.css';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Используем useEffect для установки начального состояния загрузки
  const [isLoading, setIsLoading] = useState(false); // Изначально false для серверного рендеринга

  useEffect(() => {
    // Устанавливаем загрузку только на клиенте
    setIsLoading(true);
    
    const checkAuth = () => {
      const token = getToken();
      
      if (!token) {
        router.push('/login');
        return;
      }
      
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Отображаем загрузчик только на клиенте и только после монтирования
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Показываем загрузчик только после монтирования компонента
  if (isMounted && isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  // На сервере всегда показываем детей
  if (!isMounted) {
    return children;
  }

  return isAuthenticated ? children : null;
}
