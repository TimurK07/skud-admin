'use client';

import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import styles from './styles.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  const total = data ? data.reduce((sum, item) => sum + item.value, 0) : 0;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} человек (${percentage}%)`;
          }
        }
      }
    },
  };

  useEffect(() => {
    if (data && data.length > 0) {
      setChartData({
        labels: data.map(item => item.title),
        datasets: [
          {
            data: data.map(item => item.value),
            backgroundColor: data.map(item => item.color),
            borderColor: data.map(item => item.color),
            borderWidth: 1,
          },
        ],
      });
    }
  }, [data]);

  return (
    <div className={styles.pieChartContainer}>
      <div className={styles.chartWrapper}>
        <Pie data={chartData} options={options} />
      </div>
      <div className={styles.legendContainer}>
        {data && data.map((item, index) => {
          const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={index} className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: item.color }}></div>
              <div className={styles.legendTitle}>{item.title}</div>
              <div className={styles.legendText}></div>
              <div className={styles.legendValue}>{item.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} человек</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}