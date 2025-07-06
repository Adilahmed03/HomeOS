import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

const getSettingsFromStorage = () => {
  const saved = localStorage.getItem('homeos_settings');
  return saved ? JSON.parse(saved) : {
    theme: 'dark',
    wallpaper: 'gradient-blue',
    showClock: true,
    taskbarPosition: 'bottom',
    clockFormat: '12h',
    animations: true,
  };
};

const saveSettingsToStorage = (settings) => {
  localStorage.setItem('homeos_settings', JSON.stringify(settings));
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(getSettingsFromStorage);

  const updateSetting = (key, value) => {
    const newSettings = {
      ...settings,
      [key]: value
    };
    setSettings(newSettings);
    saveSettingsToStorage(newSettings);
  };

  const resetSettings = () => {
    const defaultSettings = {
      theme: 'dark',
      wallpaper: 'gradient-blue',
      showClock: true,
      taskbarPosition: 'bottom',
      clockFormat: '12h',
      animations: true,
    };
    setSettings(defaultSettings);
    saveSettingsToStorage(defaultSettings);
  };

  const value = {
    settings,
    updateSetting,
    resetSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
