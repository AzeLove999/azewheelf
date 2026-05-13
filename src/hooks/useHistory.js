import { useState, useCallback, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

export function useHistory() {
  const [history, setHistory] = useState([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.history);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load history:', e);
    }
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.history, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save history:', e);
    }
  }, [history]);

  const addEntry = useCallback((entry) => {
    const newEntry = {
      ...entry,
      timestamp: Date.now(),
    };
    setHistory(prev => [newEntry, ...prev]);
  }, []);

  const addSeriesEntry = useCallback((results, totalCount) => {
    const newEntry = {
      isSeries: true,
      seriesCount: totalCount,
      items: results.map(r => ({ id: r.id, label: r.label })),
      label: results.map(r => r.label).join(', '),
      timestamp: Date.now(),
    };
    setHistory(prev => [newEntry, ...prev]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.history);
    } catch (e) { /* ignore */ }
  }, []);

  return { history, addEntry, addSeriesEntry, clearHistory };
}
