'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getLogById } from '../../../../api/logs';
import { formatDate } from '../../../../utils/dateUtils';
import ErrorMessage from '../../../../components/ErrorMessage';
import styles from './styles.module.css';

export default function LogDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Используем useRef для отслеживания, был ли уже сделан запрос
  const requestMade = useRef(false);

  // Функция для загрузки данных лога
  const fetchLog = async () => {
    // Если запрос уже был сделан, не делаем его снова
    if (requestMade.current) return;
    
    try {
      setLoading(true);
      // Отмечаем, что запрос был сделан
      requestMade.current = true;
      
      const response = await getLogById(params.id);

      if (response.success) {
        setLog(response.data);
      } else {
        setError('Не удалось загрузить данные лога');
      }
    } catch (err) {
      console.error('Ошибка при загрузке данных лога:', err);
      setError('Не удалось загрузить данные лога');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchLog();
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

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <ErrorMessage 
            message={error} 
            type="error" 
            onRetry={() => {
              setError(null);
              setLoading(true);
              requestMade.current = false;
              fetchLog();
            }}
            onBack={handleGoBack}
            showBackButton={true}
          />
        </div>
      </div>
    );
  }

  if (!log) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <ErrorMessage 
            message="Лог не найден" 
            type="info"
            onBack={handleGoBack}
            showBackButton={true}
          />
        </div>
      </div>
    );
  }

  const isEnter = log.action === 'access_in';
  const actionText = isEnter ? 'Вход' : 'Выход';
  
  const formattedDate = formatDate(log.date);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleGoBack}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M7.828 10.9997H20V12.9997H7.828L13.192 18.3637L11.778 19.7777L4 11.9997L11.778 4.22168L13.192 5.63568L7.828 10.9997Z" fill="#14151A" />
          </svg> Назад
        </button>
        <h1 className={styles.title}>Детали события: {actionText}</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.infoCard}>
          <h2 className={styles.sectionTitle}>Основная информация</h2>

          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>Пользователь:</div>
            <div className={styles.infoValue}>{log.name}</div>
          </div>

          {log.group && (
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Группа:</div>
              <div className={styles.infoValue}>{log.group}</div>
            </div>
          )}

          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>Действие:</div>
            <div className={styles.infoValue}>{actionText}</div>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>Дата и время:</div>
            <div className={styles.infoValue}>{formattedDate}</div>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>Корпус:</div>
            <div className={styles.infoValue}>{log.hull || '—'}</div>
          </div>

          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>Результат:</div>
            <div className={`${styles.infoValue} ${log.result === 'success' ? styles.statusSuccess : styles.statusDenied}`}>
              {log.result === 'success' ? 'Доступ разрешен' : 'Доступ запрещен'}
            </div>
          </div>

          {log.payload && log.payload.terminalId && (
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Терминал:</div>
              <div className={styles.infoValue}>{log.payload.terminalId}</div>
            </div>
          )}

          {log.payload && log.payload.direction && (
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Направление:</div>
              <div className={styles.infoValue}>{log.payload.direction}</div>
            </div>
          )}

          <div className={styles.infoRow}>
            <div className={styles.infoLabel}>ID:</div>
            <div className={styles.infoValue}>{log._id}</div>
          </div>

          {log.payload && log.payload.snapshot && (
            <div className={styles.photoContainer}>
              <div className={styles.photoLabel}>Снимок:</div>
              <Image
                src={`https://kitvision.danya.tech:3003/${log.payload.snapshot}`}
                alt="Снимок события"
                width={400}
                height={300}
                className={styles.photo}
                unoptimized={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
