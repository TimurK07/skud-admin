'use client';

import React from 'react';
import Image from 'next/image';
import styles from './styles.module.css';

export default function ErrorMessage({ message, type = 'error', onRetry, onClose, onBack, showBackButton = false }) {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return '/assets/icons/warning.svg';
      case 'info':
        return '/assets/icons/info.svg';
      case 'error':
      default:
        return '/assets/icons/error.svg';
    }
  };

  return (
    <div className={`${styles.container} ${styles[type]}`}>
      <div className={styles.iconContainer}>
        <Image 
          src={getIcon()}
          alt={type}
          width={24}
          height={24}
          className={styles.icon}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
        {onRetry && (
          <button 
            className={styles.retryButton} 
            onClick={onRetry}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px' }}>
              <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Повторить
          </button>
        )}
        {showBackButton && onBack && (
          <button 
            className={styles.backButton} 
            onClick={onBack}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px' }}>
              <path d="M10 19L3 12M3 12L10 5M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Назад
          </button>
        )}
      </div>
      {onClose && (
        <button 
          className={styles.closeButton} 
          onClick={onClose}
          aria-label="Закрыть"
        >
          ✕
        </button>
      )}
    </div>
  );
}
