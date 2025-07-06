import { useState, useEffect, useRef } from 'react';
import { useApps } from '../core/AppManager';
import { useSettings } from '../core/SettingsContext';
import { 
  PowerIcon, 
  CogIcon, 
  SunIcon, 
  MoonIcon,
  PhotoIcon,
  UserIcon,
  CommandLineIcon,
  CalculatorIcon,
  DocumentTextIcon,
  FolderIcon,
  GlobeAltIcon,
  QuestionMarkCircleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const StartMenu = ({ isOpen, onClose, position = { x: 0, y: 0 } }) => {
  const { openApp } = useApps();
  const { settings, updateSetting } = useSettings();
  const menuRef = useRef(null);
  const trashCount = 0; // Will be updated when we have storage system

  const apps = [
    { id: 'terminal', name: 'Terminal', icon: <CommandLineIcon className="w-6 h-6" />, emoji: '🖥️' },
    { id: 'calculator', name: 'Calculator', icon: <CalculatorIcon className="w-6 h-6" />, emoji: '🧮' },
    { id: 'notepad', name: 'Notepad', icon: <DocumentTextIcon className="w-6 h-6" />, emoji: '📝' },
    { id: 'file-manager', name: 'File Manager', icon: <FolderIcon className="w-6 h-6" />, emoji: '📁' },
    { id: 'browser', name: 'Browser', icon: <GlobeAltIcon className="w-6 h-6" />, emoji: '🌐' },
    { id: 'settings', name: 'Settings', icon: <CogIcon className="w-6 h-6" />, emoji: '⚙️' },
    { id: 'help', name: 'Help & About', icon: <QuestionMarkCircleIcon className="w-6 h-6" />, emoji: '❓' },
    { 
      id: 'trash', 
      name: `Trash${trashCount > 0 ? ` (${trashCount})` : ''}`, 
      icon: <TrashIcon className="w-6 h-6" />, 
      emoji: '🗑️' 
    }
  ];

  const wallpapers = [
    { id: 'gradient-blue', name: 'Cyber Blue', icon: '🌊' },
    { id: 'gradient-purple', name: 'Neon Purple', icon: '🌸' },
    { id: 'gradient-green', name: 'Matrix Green', icon: '🌿' },
    { id: 'gradient-orange', name: 'Solar Orange', icon: '🍊' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleAppClick = (appId) => {
    openApp(appId);
    onClose();
  };

  const handleThemeToggle = () => {
    updateSetting('theme', settings.theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to reload HomeOS?')) {
      window.location.reload();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      className="fixed z-[100] w-80 rounded-xl backdrop-blur-xl bg-gray-900/80 border border-cyan-500/30 shadow-2xl overflow-hidden"
      style={{
        left: position.x,
        bottom: window.innerHeight - position.y + 10,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 20px rgba(6, 182, 212, 0.2)'
      }}
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-cyan-500/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Welcome, Commander</h3>
            <p className="text-cyan-300 text-sm">HomeOS User</p>
          </div>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="p-4">
        <h4 className="text-cyan-300 text-sm font-semibold mb-3 uppercase tracking-wider">Applications</h4>
        <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app.id)}
              className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/50 hover:bg-cyan-500/20 transition-all duration-200 group border border-gray-700/50 hover:border-cyan-500/50"
            >
              <div className="text-xl group-hover:scale-110 transition-transform duration-200">
                {app.emoji}
              </div>
              <span className="text-white text-sm font-medium">{app.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Settings */}
      <div className="px-4 pb-4">
        <h4 className="text-cyan-300 text-sm font-semibold mb-3 uppercase tracking-wider">Quick Settings</h4>
        
        {/* Theme Toggle */}
        <div className="mb-3">
          <button
            onClick={handleThemeToggle}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-cyan-500/20 transition-all duration-200 border border-gray-700/50 hover:border-cyan-500/50"
          >
            <div className="flex items-center space-x-3">
              {settings.theme === 'dark' ? (
                <MoonIcon className="w-5 h-5 text-cyan-400" />
              ) : (
                <SunIcon className="w-5 h-5 text-yellow-400" />
              )}
              <span className="text-white text-sm">Theme</span>
            </div>
            <span className="text-cyan-300 text-sm capitalize">{settings.theme}</span>
          </button>
        </div>

        {/* Wallpaper Selector */}
        <div className="mb-3">
          <div className="text-white text-sm mb-2 flex items-center space-x-2">
            <PhotoIcon className="w-4 h-4 text-cyan-400" />
            <span>Wallpaper</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {wallpapers.map((wallpaper) => (
              <button
                key={wallpaper.id}
                onClick={() => updateSetting('wallpaper', wallpaper.id)}
                className={`p-2 rounded-lg transition-all duration-200 border ${
                  settings.wallpaper === wallpaper.id
                    ? 'bg-cyan-500/30 border-cyan-400 scale-110'
                    : 'bg-gray-800/50 border-gray-700/50 hover:border-cyan-500/50 hover:bg-cyan-500/10'
                }`}
                title={wallpaper.name}
              >
                <div className="text-lg">{wallpaper.icon}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-900/60 border-t border-cyan-500/30">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-all duration-200 border border-red-500/30 hover:border-red-400 group"
        >
          <PowerIcon className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform duration-200" />
          <span className="text-red-300 font-medium">Logout</span>
        </button>
      </div>

      {/* Glowing effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
      </div>
    </div>
  );
};

export default StartMenu;
