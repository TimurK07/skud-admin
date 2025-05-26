'use client';

import Image from 'next/image';
import styles from './styles.module.css';

export default function StatCard({ title, count, unit, icon }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <div className={styles.titleContainer}>
          <div className={styles.titleIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3.33333 2V12.6667H14V14H2V2H3.33333ZM13.5287 4.19533L14.4713 5.138L10.6667 8.94267L8.66667 6.94333L5.80467 9.80467L4.862 8.862L8.66667 5.05733L10.6667 7.05667L13.5287 4.19533Z" fill="#0F1324" fillOpacity="0.6" />
            </svg>
          </div>
          <div className={styles.statCaption}>{title}</div>
        </div>
        <div className={styles.copyIcon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9.16667 5.83335H10.8333V14.1667H9.16667V5.83335ZM12.5 9.16669H14.1667V14.1667H12.5V9.16669ZM5.83333 10.8334H7.5V14.1667H5.83333V10.8334ZM12.5 3.33335H4.16667V16.6667H15.8333V6.66669H12.5V3.33335ZM2.5 2.49335C2.5 2.03669 2.8725 1.66669 3.3325 1.66669H13.3333L17.5 5.83335V17.4942C17.5008 17.6036 17.48 17.7121 17.4388 17.8135C17.3976 17.9149 17.3369 18.0072 17.2601 18.0852C17.1832 18.1631 17.0918 18.2251 16.991 18.2677C16.8902 18.3103 16.7819 18.3326 16.6725 18.3334H3.3275C3.10865 18.3318 2.89918 18.2443 2.74435 18.0896C2.58951 17.9349 2.50175 17.7255 2.5 17.5067V2.49335Z" fill="#0F1324" fillOpacity="0.6" />
          </svg>
        </div>
      </div>
      <div className={styles.statContent}>
        <div className={styles.statInfo}>
          <span className={styles.statCount}>{count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}</span>
          <span className={styles.statUnit}>{unit}</span>
        </div>
      </div>
    </div>
  );
}