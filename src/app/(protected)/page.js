'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { getToken } from '../../api/auth';
import { getDashboardStats } from '../../api/dashboard';
import { useLogs } from '../../contexts/LogsContext';
import MainLayout from '../../layout/MainLayout';
import StatCard from '../../components/StatCard/StatCard';
import PieChart from '../../components/PieChart/PieChart';
import LiveCard from './logs/LiveCard';
import styles from '../page.module.css';

export default function Home() {
  const router = useRouter();
  const { logs, fetchLogs, addLog } = useLogs();
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultChartData = [
    { title: 'Главный корпус', value: "-", color: '#8B5CF6' },
    { title: 'IT-HUB', value: "-", color: '#C4B5FD' },
    { title: 'Общежитие', value: "-", color: '#FAFAFA' },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        if (response.success) {
          setDashboardStats(response.data);
        }
      } catch (error) {
        console.error('Ошибка при получении данных дашборда:', error);
      } finally {
        setLoading(false);
      }
    };

    // Загружаем данные только один раз при монтировании компонента
    fetchLogs(6);
    fetchDashboardData();

    // Обновляем только данные дашборда периодически
    const dashboardInterval = setInterval(fetchDashboardData, 30000);
    
    return () => {
      clearInterval(dashboardInterval);
    };
  }, []);

  useEffect(() => {
    const socket = io('/', {
      path: '/api/socket.io',
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected');
    });

    socket.on('log:new', (newLog) => {
      console.log('📥 New log received via socket:', newLog);
      addLog(newLog);
    });

    socket.on('disconnect', () => {
      console.warn('⚠️ Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [addLog]);
  
  const chartData = dashboardStats ? [
    { title: 'Главный корпус', value: dashboardStats.byHull['Главный корпус'] || 0, color: '#8B5CF6' },
    { title: 'IT HUB', value: dashboardStats.byHull['IT HUB'] || 0, color: '#C4B5FD' },
    { title: 'Общежитие', value: dashboardStats.byHull['Общежитие'] || 0, color: '#FAFAFA' },
  ] : defaultChartData;

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
              count={dashboardStats ? dashboardStats.totalInside : "-"}
              unit="человек"
              icon="/assets/icons/sidebar/user.svg"
            />
            <StatCard
              title="Отсутствует"
              count={dashboardStats ? dashboardStats.totalAbsent : "-"}
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
            {logs.length > 0 ? (
              logs.map((log) => (
                <LiveCard key={log._id} log={log} />
              ))
            ) : (
              <div className={styles.noData}>Нет данных о последних событиях</div>
            )}
          </div>
        </div>

      </div>
    // </MainLayou  t>
  );
}
