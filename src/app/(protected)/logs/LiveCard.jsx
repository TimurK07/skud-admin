'use client';

import { useRouter } from 'next/navigation';
import { formatDate } from '../../../utils/dateUtils';
import styles from './styles.module.css';

export default function LiveCard({ log = {}, type, name, location }) {
  const router = useRouter();
  
  if (!log || Object.keys(log).length === 0) {
    log = {
      action: type === 'enter' ? 'access_in' : 'access_out',
      name: name || 'Неизвестный пользователь',
      hull: location || '',
      date: new Date(),
      result: 'success'
    };
  }
  
  const isEnter = (log.action === 'access_in');
  const badgeClass = isEnter ? styles.badgeEnter : styles.badgeExit;
  const badgeText = isEnter ? 'Вход' : 'Выход';
  
  const formattedDate = formatDate(log.date);
  
  const handleOpenDetails = () => {
    if (log._id) {
      router.push(`/logs/${log._id}`);
    }
  };

  return (
    <div className={styles.liveCard}>
      <div className={styles.cardHeader}>
        <div className={badgeClass}>{badgeText}</div>
        <div className={styles.cardDate}>{formattedDate}</div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.personName}>{log.name}</div>
        <div className={styles.personInfo}>
          {log.group && <span className={styles.personGroup}>{log.group}</span>}
          {log.hull && <span className={styles.personLocation}>{log.hull}</span>}
        </div>
        <div className={`${styles.accessResult} ${log.result === 'success' ? styles.accessSuccess : styles.accessDenied}`}>
          {log.result === 'success' ? 'Доступ разрешен' : 'Доступ запрещен'}
        </div>
      </div>
      <div className={styles.cardFooter}>
        <button className={styles.detailsButton} onClick={handleOpenDetails}>Открыть подробности</button>
      </div>
    </div>
  );
}