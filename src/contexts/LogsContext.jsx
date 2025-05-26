'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getLogs, getLogById } from '../api/logs';

const LogsContext = createContext();

export const useLogs = () => {
  const context = useContext(LogsContext);
  if (!context) {
    throw new Error('useLogs должен использоваться внутри LogsProvider');
  }
  return context;
};

export function LogsProvider({ children }) {
  const [logs, setLogs] = useState([]);
  const [logDetails, setLogDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLogs = async (limit = 6) => {
    try {
      setLoading(true);
      const response = await getLogs({ limit });
      if (response.success) {
        setLogs(response.data || []);
      } else {
        setError('Не удалось загрузить логи');
      }
    } catch (err) {
      console.error('Ошибка при загрузке логов:', err);
      setError('Не удалось загрузить логи');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogById = async (id) => {
    if (logDetails[id]) {
      return logDetails[id];
    }

    try {
      setLoading(true);
      const response = await getLogById(id);
      if (response.success) {
        setLogDetails(prev => ({
          ...prev,
          [id]: response.data
        }));
        return response.data;
      } else {
        setError('Не удалось загрузить данные лога');
        return null;
      }
    } catch (err) {
      console.error(`Ошибка при загрузке лога с ID ${id}:`, err);
      setError('Не удалось загрузить данные лога');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addLog = (newLog) => {
    setLogs(prevLogs => {
      const exists = prevLogs.some(log => log._id === newLog._id);
      if (exists) {
        return prevLogs;
      }
      return [newLog, ...prevLogs].slice(0, 6);
    });

    setLogDetails(prev => ({
      ...prev,
      [newLog._id]: newLog
    }));
  };

  const value = {
    logs,
    logDetails,
    loading,
    error,
    fetchLogs,
    fetchLogById,
    addLog
  };

  return (
    <LogsContext.Provider value={value}>
      {children}
    </LogsContext.Provider>
  );
}

export default LogsContext;
