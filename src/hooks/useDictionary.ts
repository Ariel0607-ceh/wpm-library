import { useState, useEffect, useCallback } from 'react';
import type { DictionaryEntry } from '@/types';

const STORAGE_KEY = 'wpm_dictionary';

const SAMPLE_DICTIONARY: DictionaryEntry[] = [
  { id: '1', word: 'baginda', meaning: 'kata ganti diri untuk raja atau sultan', addedBy: 'system', createdAt: new Date().toISOString() },
  { id: '2', word: 'bendahara', meaning: 'menteri atau pegawai tinggi kerajaan', addedBy: 'system', createdAt: new Date().toISOString() },
  { id: '3', word: 'laksamana', meaning: 'panglima tentera laut', addedBy: 'system', createdAt: new Date().toISOString() },
  { id: '4', word: 'hikayat', meaning: 'kisah atau cerita', addedBy: 'system', createdAt: new Date().toISOString() },
  { id: '5', word: 'kesultanan', meaning: 'negeri yang diperintah oleh sultan', addedBy: 'system', createdAt: new Date().toISOString() },
  { id: '6', word: 'pahlawan', meaning: 'orang yang gagah berani', addedBy: 'system', createdAt: new Date().toISOString() },
  { id: '7', word: 'silat', meaning: 'seni mempertahankan diri tradisional Melayu', addedBy: 'system', createdAt: new Date().toISOString() },
  { id: '8', word: 'sultan', meaning: 'raja atau pemerintah dalam kerajaan Melayu', addedBy: 'system', createdAt: new Date().toISOString() },
  { id: '9', word: 'tentera', meaning: 'pasukan bersenjata', addedBy: 'system', createdAt: new Date().toISOString() },
  { id: '10', word: 'tuah', meaning: 'nasib baik atau keberuntungan', addedBy: 'system', createdAt: new Date().toISOString() }
];

export function useDictionary() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch {
        setEntries(SAMPLE_DICTIONARY);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DICTIONARY));
      }
    } else {
      setEntries(SAMPLE_DICTIONARY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DICTIONARY));
    }
    setIsLoading(false);
  }, []);

  const saveEntries = useCallback((newEntries: DictionaryEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  }, []);

  const addEntry = useCallback((word: string, meaning: string, addedBy: string) => {
    const existing = entries.find(e => e.word.toLowerCase() === word.toLowerCase());
    if (existing) {
      return null;
    }
    
    const newEntry: DictionaryEntry = {
      id: Date.now().toString(),
      word: word.toLowerCase(),
      meaning,
      addedBy,
      createdAt: new Date().toISOString()
    };
    const updated = [...entries, newEntry];
    saveEntries(updated);
    return newEntry;
  }, [entries, saveEntries]);

  const updateEntry = useCallback((id: string, meaning: string) => {
    const updated = entries.map(e => 
      e.id === id ? { ...e, meaning } : e
    );
    saveEntries(updated);
  }, [entries, saveEntries]);

  const deleteEntry = useCallback((id: string) => {
    const updated = entries.filter(e => e.id !== id);
    saveEntries(updated);
  }, [entries, saveEntries]);

  const getMeaning = useCallback((word: string): string | null => {
    const entry = entries.find(e => e.word.toLowerCase() === word.toLowerCase().replace(/[^a-zA-Z]/g, ''));
    return entry?.meaning || null;
  }, [entries]);

  const searchEntries = useCallback((query: string) => {
    if (!query.trim()) return entries;
    const lowerQuery = query.toLowerCase();
    return entries.filter(e => 
      e.word.toLowerCase().includes(lowerQuery) || 
      e.meaning.toLowerCase().includes(lowerQuery)
    );
  }, [entries]);

  return {
    entries,
    isLoading,
    addEntry,
    updateEntry,
    deleteEntry,
    getMeaning,
    searchEntries
  };
}
