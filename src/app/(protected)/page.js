'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '../../api/auth';
import MainLayout from '../../layout/MainLayout';
import StatCard from '../../components/StatCard/StatCard';
import PieChart from '../../components/PieChart/PieChart';
import LiveCard from '../../components/LiveCard/LiveCard';
import styles from '../page.module.css';

export default function Home() {
  const router = useRouter();

  const chartData = [
    { title: 'Главный корпус', value: 4532, color: '#8B5CF6' },
    { title: 'IT-HUB', value: 3567, color: '#C4B5FD' },
    { title: 'Общежитие', value: 1793, color: '#EDE9FE' },
  ];
  
  const liveData = [
    { id: 1, type: 'enter', name: 'Иванов И.И.', location: 'IT-HUB - ПО-228' },
    { id: 2, type: 'exit', name: 'Иванов И.И.', location: 'IT-HUB - ПО-228' },
    { id: 3, type: 'enter', name: 'Иванов И.И.', location: 'IT-HUB - ПО-228' },
    { id: 4, type: 'enter', name: 'Иванов И.И.', location: 'IT-HUB - ПО-228' },
    { id: 5, type: 'enter', name: 'Иванов И.И.', location: 'IT-HUB - ПО-228' },
    { id: 6, type: 'enter', name: 'Иванов И.И.', location: 'IT-HUB - ПО-228' },
  ];

  useEffect(() => {
    const token = getToken();

    // if (token) {
    //   router.push('/protected');
    // } else {
    //   router.push('/login');
    // }
  }, [router]);

  return (
    // <MainLayou>
      <div className={styles.dashboard}>
        <div className={styles.statsContainer}>
          <h1 className={styles.title}>Главная</h1>

          <div className={styles.statsRow}>
            <StatCard
              title="В колледже"
              count={8568}
              unit="человек"
              icon="/assets/icons/sidebar/user.svg"
            />
            <StatCard
              title="Отсутствует"
              count={4520}
              unit="человек"
              icon="/assets/icons/sidebar/user.svg"
            />
          </div>
        </div>

        <div className={styles.analyticsContainer}>
          <h1 className={styles.title}>Сводка по корпусам</h1>

          <div className={styles.analyticsRow}>
              <PieChart data={chartData}/>
          </div>
        </div>

        <div className={styles.liveContainer}>
          <h1 className={styles.title}>Live-режим</h1>

          <div className={styles.liveRow}>
            {liveData.slice(0, 6).map((item) => (
              <LiveCard
                key={item.id}
                type={item.type}
                name={item.name}
                location={item.location}
              />
            ))}
          </div>
        </div>

      </div>
    // </MainLayou  t>
  );
}
