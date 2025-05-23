'use client';

import Image from 'next/image';
import styles from './styles.module.css';

export default function PieChart({ data }) {
  // Общая сумма для расчета процентов
  const total = data ? data.reduce((sum, item) => sum + item.value, 0) : 0;

  return (
    <div className={styles.pieChartContainer}>
      <div className={styles.chartWrapper}>
        <Image 
          src="/assets/images/chart.png" 
          alt="Круговая диаграмма" 
          width={240} 
          height={240}
          className={styles.chartImage}
        />
      </div>
      <div className={styles.legendContainer}>
        {data && data.map((item, index) => (
          <div key={index} className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: item.color }}></div>
            <div className={styles.legendTitle}>{item.title}</div>
            <div className={styles.legendText}></div>
            <div className={styles.legendValue}>{item.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} человек</div>
          </div>
        ))}
      </div>
    </div>
  );
}