'use client';

import styles from './styles.module.css';

export default function LiveCard({ type, name, location }) {
  const badgeClass = type === 'enter' ? styles.badgeEnter : styles.badgeExit;
  const badgeText = type === 'enter' ? 'Вход' : 'Выход';

  return (
    <div className={styles.liveCard}>
      <div className={styles.cardHeader}>
        <div className={badgeClass}>{badgeText}</div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.personName}>{name}</div>
        <div className={styles.personLocation}>{location}</div>
      </div>
      <div className={styles.cardFooter}>
        <button className={styles.detailsButton}>Открыть</button>
      </div>
    </div>
  );
}