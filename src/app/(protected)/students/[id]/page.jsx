'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserById } from '../../../../api/users';
import styles from './styles.module.css';
import Image from 'next/image';
import React from 'react';

export default function StudentDetailsPage({ params }) {
    const router = useRouter();
    const resolvedParams = React.use(params);
    const { id } = resolvedParams;
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                setLoading(true);
                const response = await getUserById(id);

                if (response.success) {
                    setStudent(response.data);
                } else {
                    setError('Не удалось загрузить данные студента');
                }
            } catch (err) {
                console.error('Ошибка при загрузке данных студента:', err);
                setError('Не удалось загрузить данные студента');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchStudentDetails();
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

    if (!student) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>Студент не найден</div>
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
                <h1 className={styles.title}>Студент: {student.name}</h1>
            </div>

            <div className={styles.content}>
                <div className={styles.profileSection}>
                    <div className={styles.photoContainer}>
                        {student.photoUrl ? (
                            <Image
                                src={`http://192.168.10.13:3003${student.photoUrl}`}
                                alt={student.name}
                                width={200}
                                height={200}
                                className={styles.photo}
                                unoptimized={true}
                            />
                        ) : (
                            <div className={styles.photoPlaceholder}>
                                <span>{student.name.charAt(0)}</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.infoCard}>
                        <h2 className={styles.sectionTitle}>Основная информация</h2>

                        <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>ФИО:</div>
                            <div className={styles.infoValue}>{student.name}</div>
                        </div>

                        <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>ИИН:</div>
                            <div className={styles.infoValue}>{student.iin || '—'}</div>
                        </div>

                        <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>Дата рождения:</div>
                            <div className={styles.infoValue}>{student.dob || '—'}</div>
                        </div>

                        <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>Телефон:</div>
                            <div className={styles.infoValue}>{student.phone || '—'}</div>
                        </div>

                        <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>Email:</div>
                            <div className={styles.infoValue}>{student.email || '—'}</div>
                        </div>

                        {student.group && (
                            <div className={styles.infoRow}>
                                <div className={styles.infoLabel}>Группа:</div>
                                <div className={styles.infoValue}>
                                    <span
                                        className={styles.groupLink}
                                        onClick={() => router.push(`/groups/${student.group._id}`)}
                                    >
                                        {student.group.name}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>Текущий корпус:</div>
                            <div className={styles.infoValue}>{student.currentHull || '—'}</div>
                        </div>
                        
                        <div className={styles.infoRow}>
                            <div className={styles.infoLabel}>Время входа:</div>
                            <div className={styles.infoValue}>{student.checkInTime || '—'}</div>
                        </div> */}
                    </div>
                </div>

                {student.parents && student.parents.length > 0 && (
                    <div className={styles.parentsSection}>
                        <h2 className={styles.sectionTitle}>Родители</h2>

                        {student.parents.map((parent, index) => (
                            <div key={index} className={styles.parentCard}>
                                <div className={styles.infoRow}>
                                    <div className={styles.infoLabel}>ФИО:</div>
                                    <div className={styles.infoValue}>{parent.name || '—'}</div>
                                </div>

                                <div className={styles.infoRow}>
                                    <div className={styles.infoLabel}>Телефон:</div>
                                    <div className={styles.infoValue}>{parent.phone || '—'}</div>
                                </div>

                                {parent.telegramId && (
                                    <div className={styles.infoRow}>
                                        <div className={styles.infoLabel}>Telegram ID:</div>
                                        <div className={styles.infoValue}>{parent.telegramId}</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
