'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTerminalById } from '../../../../api/terminals';
import styles from './styles.module.css';

export default function TerminalDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [terminal, setTerminal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTerminal = async () => {
      try {
        setLoading(true);
        const response = await getTerminalById(params.id);

        if (response.success) {
          setTerminal(response.data);
        } else {
          setError('Не удалось загрузить данные терминала');
        }
      } catch (err) {
        console.error('Ошибка при загрузке данных терминала:', err);
        setError('Не удалось загрузить данные терминала');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTerminal();
    }
  }, [params.id]);

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loader}>Загрузка...</div>
      </div>
    );
  }

  if (error || !terminal) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handleGoBack}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M7.828 10.9997H20V12.9997H7.828L13.192 18.3637L11.778 19.7777L4 11.9997L11.778 4.22168L13.192 5.63568L7.828 10.9997Z" fill="#14151A" />
            </svg> Назад
          </button>
        </div>
        <div className={styles.error}>{error || 'Терминал не найден'}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleGoBack}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M7.828 10.9997H20V12.9997H7.828L13.192 18.3637L11.778 19.7777L4 11.9997L11.778 4.22168L13.192 5.63568L7.828 10.9997Z" fill="#14151A" />
          </svg> Назад
        </button>
        <h1 className={styles.title}>Терминал: {terminal.name}</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.infoCard}>
          <h2 className={styles.sectionTitle}>Основная информация</h2>

          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>Название:</div>
            <div className={styles.infoValue}>{terminal.name}</div>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>Местоположение:</div>
            <div className={styles.infoValue}>{terminal.location || '—'}</div>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>Корпус:</div>
            <div className={styles.infoValue}>{terminal.hull || '—'}</div>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>Статус:</div>
            <div className={`${styles.infoValue} ${terminal.isAlive ? styles.statusActive : styles.statusInactive}`}>
              {terminal.isAlive ? 'Активен' : 'Неактивен'}
            </div>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>ID:</div>
            <div className={styles.infoValue}>{terminal._id}</div>
          </div>

          {terminal.id !== undefined && (
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Внутренний ID:</div>
              <div className={styles.infoValue}>{terminal.id}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
