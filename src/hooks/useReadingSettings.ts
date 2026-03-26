import { useState, useEffect, useCallback } from 'react';
import type { ReadingSettings } from '@/types';

const STORAGE_KEY = 'wpm_reading_settings';

const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: 18,
  lineHeight: 1.5,
  textAlign: 'center'
};

export function useReadingSettings() {
  const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    }
  }, []);

  const updateSettings = useCallback((updates: Partial<ReadingSettings>) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      return newSettings;
    });
  }, []);

  const setFontSize = useCallback((size: number) => {
    updateSettings({ fontSize: Math.max(12, Math.min(32, size)) });
  }, [updateSettings]);

  const setLineHeight = useCallback((height: number) => {
    updateSettings({ lineHeight: Math.max(1.2, Math.min(3, height)) });
  }, [updateSettings]);

  const setTextAlign = useCallback((align: ReadingSettings['textAlign']) => {
    updateSettings({ textAlign: align });
  }, [updateSettings]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
  }, []);

  return {
    settings,
    setFontSize,
    setLineHeight,
    setTextAlign,
    updateSettings,
    resetSettings
  };
}
