'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllTerminals } from '../../../api/terminals';
import styles from './styles.module.css';

export default function TerminalsPage() {
  const router = useRouter();
  const [terminals, setTerminals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTerminals = async () => {
      try {
        setLoading(true);
        const response = await getAllTerminals();

        if (response.success) {
          setTerminals(response.data);
        } else {
          setError('Не удалось загрузить терминалы');
        }
      } catch (err) {
        console.error('Ошибка при загрузке терминалов:', err);
        setError('Не удалось загрузить терминалы');
      } finally {
        setLoading(false);
      }
    };

    fetchTerminals();
  }, []);

  const handleTerminalClick = (terminal) => {
    router.push(`/terminals/${terminal._id}`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loader}>Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Терминалы</h1>
        {/* <button className={styles.addButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M7.33337 7.33334V3.33334H8.66671V7.33334H12.6667V8.66667H8.66671V12.6667H7.33337V8.66667H3.33337V7.33334H7.33337Z" fill="white" />
          </svg>
          Добавить
        </button> */}
      </div>

      {terminals.length === 0 ? (
        <div className={styles.error}>Терминалы не найдены</div>
      ) : (
        <div>
          {terminals.map((terminal) => (
            <div 
              key={terminal._id} 
              className={styles.terminalCard}
              onClick={() => handleTerminalClick(terminal)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.terminalInfo}>
                <div className={styles.terminalName}>{terminal.name}</div>
                <div className={styles.terminalLocation}>Местоположение: {terminal.location || '—'}</div>
                <div className={styles.terminalHull}>Корпус: {terminal.hull || '—'}</div>
              </div>
              <div className={styles.terminalStatus}>
                <div className={`${styles.statusIndicator} ${terminal.isAlive ? styles.statusActive : styles.statusInactive}`}></div>
                <div className={`${styles.statusText} ${terminal.isAlive ? styles.statusTextActive : styles.statusTextInactive}`}>
                  {terminal.isAlive ? 'Активен' : 'Неактивен'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}