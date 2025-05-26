'use client';

import { useState, useEffect } from 'react';
import styles from './styles.module.css';

export default function Table({
  columns,
  data,
  selectable = false,
  onRowClick,
  actionRenderer,
  searchable = false,
  searchPlaceholder = 'Поиск',
  searchKeys = [],
  emptyMessage = 'Нет данных для отображения',
  onSearch = null, // Обработчик серверного поиска
  serverSideSearch = false, // Флаг для серверного поиска
  loading = false // Состояние загрузки
}) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  // Улучшенная функция поиска, которая может искать по вложенным объектам и подстрокам
  const searchInItem = (item, term) => {
    // Если нет ключей для поиска, ищем по всем полям
    if (searchKeys.length === 0) {
      return Object.values(item).some(value => {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.toLowerCase().includes(term.toLowerCase());
        if (typeof value === 'number') return value.toString().includes(term);
        if (typeof value === 'object') return searchInObject(value, term);
        return false;
      });
    }

    // Ищем по указанным ключам
    return searchKeys.some(key => {
      const value = item[key];
      if (value === null || value === undefined) return false;
      if (typeof value === 'string') return value.toLowerCase().includes(term.toLowerCase());
      if (typeof value === 'number') return value.toString().includes(term);
      if (typeof value === 'object') return searchInObject(value, term);
      return false;
    });
  };

  // Поиск внутри объекта
  const searchInObject = (obj, term) => {
    if (!obj) return false;
    return Object.values(obj).some(value => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string') return value.toLowerCase().includes(term.toLowerCase());
      if (typeof value === 'number') return value.toString().includes(term);
      if (typeof value === 'object') return searchInObject(value, term);
      return false;
    });
  };

  // Обработчик изменения поискового запроса - мгновенный поиск
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Если используется серверный поиск, вызываем обработчик немедленно
    if (serverSideSearch && onSearch) {
      onSearch(value);
    }
  };

  // Обновляем фильтрованные данные при изменении данных или поискового запроса
  useEffect(() => {
    // Если используется серверный поиск, просто обновляем данные
    if (serverSideSearch) {
      setFilteredData(data);
      return;
    }

    // Клиентский поиск
    if (searchable && searchTerm) {
      const filtered = data.filter(item => searchInItem(item, searchTerm));
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [data, searchTerm, searchable, searchKeys, serverSideSearch]);

  // Обработчик выбора элемента
  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Обработчик выбора всех элементов
  const handleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredData.map(item => item.id));
    }
  };

  return (
    <div className={styles.tableScrollWrapper}>
      <div className={styles.tableWrapper}>
        {searchable && (
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder={searchPlaceholder}
              className={styles.searchInput}
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {loading && <div className={styles.searchSpinner}></div>}
          </div>
        )}

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {selectable && (
                  <th className={styles.checkboxColumn}>
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th key={column.key} className={column.className}>{column.title}</th>
                ))}
                {actionRenderer && <th></th>}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr
                    key={item.id ? `row-${item.id}` : `row-index-${index}`}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={onRowClick ? styles.clickableRow : ''}
                  >
                    {selectable && (
                      <td className={styles.checkboxColumn} onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                        />
                      </td>
                    )}
                    {columns.map((column, colIndex) => (
                      <td key={item.id ? `${item.id}-${column.key}` : `cell-${index}-${colIndex}`} className={column.cellClassName}>
                        {column.render ? column.render(item) : (item[column.key] !== undefined && typeof item[column.key] !== 'object' ? item[column.key] : '—')}
                      </td>
                    ))}
                    {actionRenderer && (
                      <td className={styles.actionColumn} onClick={(e) => e.stopPropagation()}>
                        {actionRenderer(item)}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr key="no-data-row">
                  <td colSpan={columns.length + (selectable ? 1 : 0) + (actionRenderer ? 1 : 0)} className={styles.emptyMessage}>
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}