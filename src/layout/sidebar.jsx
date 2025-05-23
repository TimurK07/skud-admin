'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import styles from './styles.module.css';

const navItems = [
  { id: 'home', name: 'Главная', icon: '/assets/icons/sidebar/home.svg', path: '/' },
  { id: 'students', name: 'Студенты', icon: '/assets/icons/sidebar/user.svg', path: '/students' },
  { id: 'staff', name: 'Сотрудники', icon: '/assets/icons/sidebar/user.svg', path: '/staff' },
  { id: 'guests', name: 'Гости', icon: '/assets/icons/sidebar/user.svg', path: '/guests' },
  { id: 'analytics', name: 'Аналитика', icon: '/assets/icons/sidebar/analytics.svg', path: '/analytics' },
  { id: 'buildings', name: 'Корпуса', icon: '/assets/icons/sidebar/hull.svg', path: '/buildings' },
  { id: ' ', name: 'Группы', icon: '/assets/icons/sidebar/users.svg', path: '/groups' },
];

const adminItems = [
  { id: 'settings', name: 'Управление', icon: '/assets/icons/sidebar/settings.svg', path: '/settings' },
  { id: 'live', name: 'Live режим', icon: '/assets/icons/sidebar/live.svg', path: '/live' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            <img src="/assets/images/logo.png" width={32} height={32} alt="" />
          </div>
          <div className={styles.logoText}>СКУД</div>
        </div>
      </div>

      <nav>
        <div className={styles.navSection}>
          {navItems.map((item) => (
            <div key={item.id} className={styles.navItemOuter}>
              <Link
                href={item.path}
                className={`${styles.navItem} ${isActive(item.path) ? styles.navItemActive : ''}`}
              >
                <div className={styles.navItemInner}>
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={20}
                    height={20}
                    className={styles.navIcon}
                  />
                  <span className={styles.navText}>{item.name}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className={styles.navSection}>
          <div className={styles.sectionTitle}>Главный корпус:</div>
          {adminItems.map((item) => (
            <div key={item.id} className={styles.navItemOuter}>
              <Link
                href={item.path}
                className={`${styles.navItem} ${isActive(item.path) ? styles.navItemActive : ''}`}
              >
                <div className={styles.navItemInner}>
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={20}
                    height={20}
                    className={styles.navIcon}
                  />
                  <span className={styles.navText}>{item.name}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}