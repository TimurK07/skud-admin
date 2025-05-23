'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './styles.module.css';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(formData);
      if (result.success) {
        router.push('/');
      } else {
        setError(result.message || 'Ошибка при авторизации. Пожалуйста, попробуйте снова.');
      }
    } catch (err) {
      setError('Ошибка при авторизации. Пожалуйста, попробуйте снова.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Авторизация</h1>
          <p className={styles.description}>Управление и просмотр аналитики системы контроля доступа</p>
        </div>


        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputContainer}>
            <input
              id="login"
              name="login"
              value={formData.login}
              onChange={handleChange}
              className={styles.input}
              placeholder="Логин"
              required
            />
          </div>

          <div className={styles.inputContainer}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="Пароль"
              required
            />
            <button 
              type="button" 
              className={styles.passwordToggle} 
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
            >
              <Image 
                src={showPassword ? "/assets/icons/eye-offа.svg" : "/assets/icons/eye.svg"} 
                alt={showPassword ? "Скрыть пароль" : "Показать пароль"}
                width={20} 
                height={20} 
              />
            </button>
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}