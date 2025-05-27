'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserById } from '../../../../api/users';
import styles from './styles.module.css';
import Image from 'next/image';
import React from 'react';

export default function StaffDetailsPage({ params }) {
    const router = useRouter();
    const resolvedParams = React.use(params);
    const { id } = resolvedParams;
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStaffDetails = async () => {
            try {
                setLoading(true);
                const response = await getUserById(id);

                if (response.success) {
                    setStaff(response.data);
                } else {
                    setError('Не удалось загрузить данные сотрудника');
                }
            } catch (err) {
                console.error('Ошибка при загрузке данных сотрудника:', err);
                setError('Не удалось загрузить данные сотрудника');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchStaffDetails();
        }
    }, [id]);

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
                <div className={styles.error}>{error}</div>
                <button className={styles.backButton} onClick={handleGoBack}>
                    Вернуться назад
                </button>
            </div>
        );
    }

    if (!staff) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>Сотрудник не найден</div>
                <button className={styles.backButton} onClick={handleGoBack}>
                    Вернуться назад
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={handleGoBack}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M7.828 10.9997H20V12.9997H7.828L13.192 18.3637L11.778 19.7777L4 11.9997L11.778 4.22168L13.192 5.63568L7.828 10.9997Z" fill="#14151A" />
                    </svg> Назад
                </button>
                <h1 className={styles.title}>Сотрудник: {staff.name}</h1>
            </div>

            <div className={styles.content}>
                <div className={styles.profileSection}>
                    <div className={styles.photoContainer}>
                        {staff.photoUrl ? (
                            <Image
                                src={`https://kitvision.danya.tech:3003${staff.photoUrl}`}
                                alt={staff.name}
                                width={200}
                                height={200}
                                className={styles.photo}
                                unoptimized={true}
                            />
                        ) : (
                            <div className={styles.photoPlaceholder}>
                                <span>{staff.name.charAt(0)}</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.infoCard}>
                        <h2 className={styles.sectionTitle}>Основная информация</h2>

                        <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>ФИО:</div>
                            <div className={styles.infoValue}>{staff.name}</div>
                        </div>

                        <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>ИИН:</div>
                            <div className={styles.infoValue}>{staff.iin || '—'}</div>
                        </div>

                        <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>Дата рождения:</div>
                            <div className={styles.infoValue}>{staff.dob || '—'}</div>
                        </div>

                        <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>Телефон:</div>
                            <div className={styles.infoValue}>{staff.phone || '—'}</div>
                        </div>

                        <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>Email:</div>
                            <div className={styles.infoValue}>{staff.email || '—'}</div>
                        </div>

                        {/* <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>Должность:</div>
                            <div className={styles.infoValue}>{staff.position || '—'}</div>
                        </div>
                        
                        <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>Отдел:</div>
                            <div className={styles.infoValue}>{staff.department || '—'}</div>
                        </div>
                        
                        <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>Текущий корпус:</div>
                            <div className={styles.infoValue}>{staff.currentHull || '—'}</div>
                        </div>
                        
                        <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>Время входа:</div>
                            <div className={styles.infoValue}>{staff.checkInTime || '—'}</div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
