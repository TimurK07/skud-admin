'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Table from '../../../components/Table/Table';
import { getUsers } from '../../../api/users';
import styles from './styles.module.css';

export default function StaffPage() {
    const router = useRouter();
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });
    
    const fetchStaff = async () => {
        try {
            setLoading(true);
            const response = await getUsers({
                page: pagination.page,
                limit: pagination.limit,
                q: searchTerm,
                role: 'staff'
            });
            
            if (response.success) {
                const formattedStaff = response.data.map(staff => {
                    const department = staff.department || 'Не указан';
                    
                    const searchString = [
                        staff.name,
                        department,
                        staff.status,
                        staff.iin,
                        staff.phone,
                        staff.email
                    ].filter(Boolean).join(' ');
                    
                    return {
                        id: staff._id || staff.id,
                        name: staff.name,
                        group: department,
                        status: staff.status || 'Нет статуса',
                        lastSeen: staff.lastSeen || '',
                        searchString: searchString.toLowerCase(), 
                        originalData: staff
                    };
                });
                
                setStaff(formattedStaff);
                setPagination(prev => ({
                    ...prev,
                    total: response.pagination.total,
                    totalPages: response.pagination.totalPages
                }));
            }
        } catch (err) {
            console.error('Ошибка при загрузке сотрудников:', err);
            setError('Не удалось загрузить данные сотрудников');
        } finally {
            setLoading(false);
        }
    };

    // Обработчик поиска без задержки
    const handleSearch = (value) => {
        setSearchTerm(value);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    useEffect(() => {
        fetchStaff();
    }, [pagination.page, searchTerm]);

    const handlePageChange = (newPage) => {
        setPagination(prev => ({
            ...prev,
            page: newPage
        }));
    };

    // Получение статус-класса
    const getStatusClass = (status) => {
        switch (status) {
            case 'В колледже':
                return styles.statusActive;
            case 'Отсутствует':
                return styles.statusInactive;
            case 'Active':
                return styles.statusActive;
            case 'Archived':
                return styles.statusArchived;
            case 'Draft':
                return styles.statusDraft;
            default:
                return '';
        }
    };

    // Определение колонок таблицы
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
        // {
        //     key: 'group',
        //     title: 'Отдел',
        //     className: styles.groupColumn
        // }
        // {
        //     key: 'status',
        //     title: 'Статус',
        //     render: (student) => (
        //         <span className={getStatusClass(student.status)}>
        //             {student.status}
        //         </span>
        //     )
        // },
        // {
        //     key: 'lastSeen',
        //     title: 'Дата последнего входа'
        // }
    ];

    const actionRenderer = (staff) => (
        <button 
            className={styles.menuButton}
            onClick={(e) => {
                e.stopPropagation();
                console.log('Действие для сотрудника:', staff);
            }}
        >
            ⋮
        </button>
    );

    // Обработчик клика по строке таблицы
    const handleRowClick = (staff) => {
        console.log('Выбран сотрудник:', staff);
        router.push(`/staff/${staff.id}`);
    };


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Сотрудники</h1>
                {/* <button className={styles.addButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M7.33337 7.33334V3.33334H8.66671V7.33334H12.6667V8.66667H8.66671V12.6667H7.33337V8.66667H3.33337V7.33334H7.33337Z" fill="white" />
                    </svg>
                    Добавить
                </button> */}
            </div>

            <Table
                columns={columns}
                data={staff}
                selectable={true}
                onRowClick={handleRowClick}
                // actionRenderer={actionRenderer}
                searchable={true}
                searchPlaceholder="Поиск"
                onSearch={handleSearch} 
                serverSideSearch={true} 
                emptyMessage="Сотрудники не найдены"
                loading={loading} 
            />

            {pagination.totalPages > 1 && (
                <div className={styles.pagination}>
                    <button 
                        className={styles.paginationButton}
                        onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                        disabled={pagination.page === 1}
                    >
                        <span>←</span>
                    </button>
                    
                    {pagination.page > 3 && (
                        <>
                            <button 
                                className={`${styles.pageNumber} ${pagination.page === 1 ? styles.activePage : ''}`}
                                onClick={() => handlePageChange(1)}
                            >
                                1
                            </button>
                            {pagination.page > 4 && <span className={styles.ellipsis}>...</span>}
                        </>
                    )}
                    
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.page <= 3) {
                            pageNum = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                            pageNum = pagination.totalPages - 4 + i;
                        } else {
                            pageNum = pagination.page - 2 + i;
                        }
                        
                        if (pageNum < 1 || pageNum > pagination.totalPages) return null;
                        
                        return (
                            <button 
                                key={pageNum}
                                className={`${styles.pageNumber} ${pagination.page === pageNum ? styles.activePage : ''}`}
                                onClick={() => handlePageChange(pageNum)}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                    
                    {pagination.page < pagination.totalPages - 2 && (
                        <>
                            {pagination.page < pagination.totalPages - 3 && <span className={styles.ellipsis}>...</span>}
                            <button 
                                className={`${styles.pageNumber} ${pagination.page === pagination.totalPages ? styles.activePage : ''}`}
                                onClick={() => handlePageChange(pagination.totalPages)}
                            >
                                {pagination.totalPages}
                            </button>
                        </>
                    )}
                    
                    <button 
                        className={styles.paginationButton}
                        onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                        disabled={pagination.page === pagination.totalPages}
                    >
                        <span>→</span>
                    </button>
                </div>
            )}
        </div>
    );
}