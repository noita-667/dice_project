import { useState, useCallback } from 'react';
import type { RollEntry } from '../types/dice';

export function useRollHistory() {
  const [history, setHistory] = useState<RollEntry[]>([]);

  const addEntry = useCallback((entry: Omit<RollEntry, 'id' | 'timestamp'>) => {
    const newEntry: RollEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setHistory((prev) => [newEntry, ...prev]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addEntry, clearHistory };
}