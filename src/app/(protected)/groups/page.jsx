'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Table from '../../../components/Table/Table';
import { getGroups } from '../../../api/groups';
import styles from './styles.module.css';

export default function GroupsPage() {
    const router = useRouter();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const response = await getGroups({
                page: pagination.page,
                limit: pagination.limit,
                name: searchTerm
            });

            if (response.success) {
                const formattedGroups = response.data.map(group => {
                    return {
                        id: group._id,
                        name: group.name,
                        studentCount: group.studentCount || 0,
                        searchString: group.name.toLowerCase(),
                        originalData: group
                    };
                });

                setGroups(formattedGroups);
                setPagination(prev => ({
                    ...prev,
                    total: response.pagination.total,
                    totalPages: response.pagination.totalPages
                }));
            }
        } catch (err) {
            console.error('Ошибка при загрузке групп:', err);
            setError('Не удалось загрузить данные групп');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    useEffect(() => {
        fetchGroups();
    }, [pagination.page, searchTerm]);

    const handlePageChange = (newPage) => {
        setPagination(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const columns = [
        {
            key: 'id',
            title: 'ID',
            className: styles.idColumn
        },
        {
            key: 'name',
            title: 'Название группы',
            className: styles.nameColumn
        },
        {
            key: 'studentCount',
            title: 'Количество студентов',
            className: styles.countColumn
        }
    ];

    const actionRenderer = (group) => (
        <button
            className={styles.menuButton}
            onClick={(e) => {
                e.stopPropagation();
                console.log('Действие для группы:', group);
            }}
        >
            ⋮
        </button>
    );

    const handleRowClick = (group) => {
        console.log('Выбрана группа:', group);
        router.push(`/groups/${group.id}`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Группы</h1>
            </div>

            <Table
                columns={columns}
                data={groups}
                selectable={true}
                onRowClick={handleRowClick}
                // actionRenderer={actionRenderer}
                searchable={true}
                searchPlaceholder="Поиск по названию"
                onSearch={handleSearch}
                serverSideSearch={true}
                emptyMessage="Группы не найдены"
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

                    {(() => {
                        const pageButtons = [];
                        const maxVisiblePages = 5;
                        let startPage, endPage;

                        if (pagination.totalPages <= maxVisiblePages) {
                            startPage = 1;
                            endPage = pagination.totalPages;
                        } else {
                            if (pagination.page <= Math.ceil(maxVisiblePages / 2)) {
                                startPage = 1;
                                endPage = maxVisiblePages;
                            } else if (pagination.page + Math.floor(maxVisiblePages / 2) >= pagination.totalPages) {
                                startPage = pagination.totalPages - maxVisiblePages + 1;
                                endPage = pagination.totalPages;
                            } else {
                                startPage = pagination.page - Math.floor(maxVisiblePages / 2);
                                endPage = pagination.page + Math.floor(maxVisiblePages / 2);
                            }
                        }

                        if (startPage > 1) {
                            pageButtons.push(
                                <button
                                    key="1"
                                    className={`${styles.pageNumber} ${pagination.page === 1 ? styles.activePage : ''}`}
                                    onClick={() => handlePageChange(1)}
                                >
                                    1
                                </button>
                            );
                            if (startPage > 2) {
                                pageButtons.push(<span key="ellipsis1" className={styles.ellipsis}>...</span>);
                            }
                        }

                        for (let i = startPage; i <= endPage; i++) {
                            pageButtons.push(
                                <button
                                    key={i}
                                    className={`${styles.pageNumber} ${pagination.page === i ? styles.activePage : ''}`}
                                    onClick={() => handlePageChange(i)}
                                >
                                    {i}
                                </button>
                            );
                        }

                        if (endPage < pagination.totalPages) {
                            if (endPage < pagination.totalPages - 1) {
                                pageButtons.push(<span key="ellipsis2" className={styles.ellipsis}>...</span>);
                            }
                            pageButtons.push(
                                <button
                                    key={pagination.totalPages}
                                    className={`${styles.pageNumber} ${pagination.page === pagination.totalPages ? styles.activePage : ''}`}
                                    onClick={() => handlePageChange(pagination.totalPages)}
                                >
                                    {pagination.totalPages}
                                </button>
                            );
                        }

                        return pageButtons;
                    })()}

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