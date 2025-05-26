'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getGroupById } from '../../../../api/groups';
import Table from '../../../../components/Table/Table';
import styles from './styles.module.css';

export default function GroupDetailsPage({ params }) {
    const router = useRouter();
    const { id } = params;
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                setLoading(true);
                const response = await getGroupById(id);

                if (response.success) {
                    setGroup(response.data);
                } else {
                    setError('Не удалось загрузить данные группы');
                }
            } catch (err) {
                console.error('Ошибка при загрузке данных группы:', err);
                setError('Не удалось загрузить данные группы');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchGroupDetails();
        }
    }, [id]);

    const handleGoBack = () => {
        router.back();
    };

    const columns = [
        {
            key: 'id',
            title: 'ID',
            className: styles.idColumn
        },
        {
            key: 'name',
            title: 'ФИО',
            className: styles.nameColumn
        },
        {
            key: 'iin',
            title: 'ИИН',
            className: styles.iinColumn
        },
        {
            key: 'phone',
            title: 'Телефон',
            className: styles.phoneColumn
        },
        {
            key: 'email',
            title: 'Email',
            className: styles.emailColumn
        }
    ];

    const formatStudents = (students) => {
        if (!students || !Array.isArray(students)) return [];

        return students.map(student => ({
            id: student._id,
            name: student.name,
            iin: student.iin || '—',
            phone: student.phone || '—',
            email: student.email || '—',
            originalData: student
        }));
    };

    const handleRowClick = (student) => {
        console.log('Выбран студент:', student);
        router.push(`/students/${student.id}`);
    };

    const actionRenderer = (student) => (
        <button
            className={styles.menuButton}
            onClick={(e) => {
                e.stopPropagation();
                console.log('Действие для студента:', student);
            }}
        >
            ⋮
        </button>
    );

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

    if (!group) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>Группа не найдена</div>
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
                <h1 className={styles.title}>Группа: {group.name}</h1>
            </div>

            <div className={styles.infoCard}>
                <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Название:</div>
                    <div className={styles.infoValue}>{group.name}</div>
                </div>
                <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Количество студентов:</div>
                    <div className={styles.infoValue}>{group.studentCount}</div>
                </div>
            </div>

            <div className={styles.sectionTitle}>Студенты группы</div>

            <Table
                columns={columns}
                data={formatStudents(group.students)}
                selectable={true}
                onRowClick={handleRowClick}
                actionRenderer={actionRenderer}
                emptyMessage="В этой группе нет студентов"
                loading={false}
            />
        </div>
    );
}
