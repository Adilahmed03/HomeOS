import { useState, useEffect } from 'react';
import { useApps } from '../core/AppManager';
import { useSettings } from '../core/SettingsContext';
import { Squares2X2Icon, PowerIcon, XMarkIcon } from '@heroicons/react/24/outline';
import StartMenu from './StartMenu';

const Taskbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [contextMenu, setContextMenu] = useState(null);
  const [showStartMenu, setShowStartMenu] = useState(false);
  // Removed auth dependencies
  const { openApps, focusApp, minimizeApp, closeApp } = useApps();
  const { settings } = useSettings();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  const formatTime = (date) => {
    const use24h = settings.clockFormat === '24h';
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: !use24h 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleStartClick = () => {
    console.log('Start button clicked');
            setShowStartMenu(!showStartMenu);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to reload HomeOS?')) {
      window.location.reload();
    }
  };

  const handleAppClick = (app) => {
    if (app.isFocused && !app.isMinimized) {
      minimizeApp(app.instanceId);
    } else {
      focusApp(app.instanceId);
    }
  };

  const handleAppRightClick = (e, app) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      app
    });
  };

  const getTaskbarClasses = () => {
    const baseClasses = 'fixed h-12 backdrop-blur-xl flex items-center justify-between px-4 z-50 border-cyan-500/20';
    const positionClasses = {
      'bottom': 'bottom-0 left-0 right-0 border-t',
      'top': 'top-0 left-0 right-0 border-b',
      'left': 'left-0 top-0 bottom-0 w-12 h-auto flex-col justify-start py-4 border-r',
    };
    
    const themeClasses = 'bg-black/40';
    const glowClasses = 'shadow-lg shadow-cyan-500/10';
    
    return `${baseClasses} ${positionClasses[settings.taskbarPosition] || positionClasses.bottom} ${themeClasses} ${glowClasses}`;
  };

  const isVertical = settings.taskbarPosition === 'left';
  
  return (
    <>
      <div className={getTaskbarClasses()}>
        {isVertical ? (
          // Vertical layout for left position
          <>
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleStartClick}
                className="p-2 bg-blue-600/80 hover:bg-blue-700/80 rounded-lg transition-colors duration-200 backdrop-blur-sm"
                title="Start"
              >
                <Squares2X2Icon className="w-5 h-5 text-white" />
              </button>
              
              {/* Open Apps - Vertical */}
              {openApps.map(app => (
                <button
                  key={app.instanceId}
                  onClick={() => handleAppClick(app)}
                  onContextMenu={(e) => handleAppRightClick(e, app)}
                  className={`p-2 rounded-lg transition-all duration-200 backdrop-blur-sm ${
                    app.isFocused && !app.isMinimized
                      ? 'bg-blue-600/80 shadow-lg transform scale-105' 
                      : app.isMinimized 
                        ? 'bg-gray-600/60' 
                        : 'bg-gray-700/60 hover:bg-gray-600/80'
                  }`}
                  title={app.name}
                >
                  <span className="text-lg">{app.icon}</span>
                </button>
              ))}
            </div>
            
            <div className="flex flex-col items-center space-y-2 mt-auto">
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                title="Logout"
              >
                <PowerIcon className={`w-5 h-5 ${settings.theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`} />
              </button>
            </div>
          </>
        ) : (
          // Horizontal layout for top/bottom positions
          <>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleStartClick}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600/80 hover:bg-blue-700/80 rounded-lg transition-colors duration-200 backdrop-blur-sm"
              >
                <Squares2X2Icon className="w-5 h-5 text-white" />
                <span className="text-white text-sm font-medium">Start</span>
              </button>
              
              <div className={`text-sm ${settings.theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>
                Welcome, Commander
              </div>
              
              {/* Open Apps - Horizontal */}
              <div className="flex space-x-2 ml-4">
                {openApps.map(app => (
                  <button
                    key={app.instanceId}
                    onClick={() => handleAppClick(app)}
                    onContextMenu={(e) => handleAppRightClick(e, app)}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-all duration-200 backdrop-blur-sm ${
                      app.isFocused && !app.isMinimized
                        ? 'bg-blue-600/80 shadow-lg transform scale-105' 
                        : app.isMinimized 
                          ? 'bg-gray-600/60' 
                          : 'bg-gray-700/60 hover:bg-gray-600/80'
                    }`}
                  >
                    <span className="text-sm">{app.icon}</span>
                    <span className={`text-xs ${settings.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{app.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {settings.showClock && (
                <div className={`text-sm font-medium text-right ${settings.theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  <div>{formatTime(currentTime)}</div>
                  <div className={`text-xs ${settings.theme === 'dark' ? 'text-white/70' : 'text-gray-600'}`}>{formatDate(currentTime)}</div>
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                title="Logout"
              >
                <PowerIcon className={`w-5 h-5 ${settings.theme === 'dark' ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`} />
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* Start Menu */}
      {showStartMenu && (
        <StartMenu
          isOpen={showStartMenu}
          onClose={() => setShowStartMenu(false)}
          position={{ x: 80, y: (settings.taskbarPosition === 'bottom' ? window.innerHeight : 0) }}
        />
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="fixed z-[60] bg-white/90 backdrop-blur-md border border-gray-300/50 rounded-lg shadow-xl py-2 min-w-[120px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => {
              closeApp(contextMenu.app.instanceId);
              setContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-500/20 hover:text-red-700 flex items-center space-x-2"
          >
            <XMarkIcon className="w-4 h-4" />
            <span>Close {contextMenu.app.name}</span>
          </button>
        </div>
      )}
    </>
  );
};

export default Taskbar;
