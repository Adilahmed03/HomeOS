import { createContext, useContext, useState } from 'react';

// Import all apps
import Notepad from '../apps/Notepad';
import Calculator from '../apps/Calculator';
import Terminal from '../apps/Terminal';
import Browser from '../apps/Browser';
import Settings from '../apps/Settings';
import Help from '../apps/Help';
import Trash from '../apps/Trash';

const AppContext = createContext();

export const useApps = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApps must be used within an AppProvider');
  }
  return context;
};

// App registry
const APP_REGISTRY = {
  notepad: {
    id: 'notepad',
    name: 'Notepad',
    component: Notepad,
    defaultSize: { width: 600, height: 400 },
    icon: '📝'
  },
  calculator: {
    id: 'calculator',
    name: 'Calculator',
    component: Calculator,
    defaultSize: { width: 300, height: 400 },
    icon: '🧮'
  },
  terminal: {
    id: 'terminal',
    name: 'Terminal',
    component: Terminal,
    defaultSize: { width: 700, height: 500 },
    icon: '💻'
  },
  browser: {
    id: 'browser',
    name: 'Browser',
    component: Browser,
    defaultSize: { width: 800, height: 600 },
    icon: '🌐'
  },
  settings: {
    id: 'settings',
    name: 'Settings',
    component: Settings,
    defaultSize: { width: 500, height: 400 },
    icon: '⚙️'
  },
  help: {
    id: 'help',
    name: 'Help & About',
    component: Help,
    defaultSize: { width: 700, height: 600 },
    icon: '❓'
  },
  trash: {
    id: 'trash',
    name: 'Trash',
    component: Trash,
    defaultSize: { width: 600, height: 500 },
    icon: '🗑️'
  }
};

export const AppProvider = ({ children }) => {
  const [openApps, setOpenApps] = useState([]);

  const openApp = (appId, data = null) => {
    // Check if app is already open
    const existingApp = openApps.find(app => app.id === appId);
    if (existingApp) {
      // Focus the existing window and update data if provided
      focusApp(existingApp.instanceId);
      if (data && appId === 'notepad') {
        // Update notepad with new file data
        setOpenApps(prev => prev.map(app => 
          app.instanceId === existingApp.instanceId 
            ? { ...app, data }
            : app
        ));
      }
      return;
    }

    const appConfig = APP_REGISTRY[appId];
    if (!appConfig) {
      console.error(`App ${appId} not found in registry`);
      return;
    }

    // Calculate position to avoid overlaps
    const offset = openApps.length * 30;
    const baseX = 50 + offset;
    const baseY = 50 + offset;
    
    // Keep within reasonable bounds
    const maxOffset = 300;
    const x = baseX > maxOffset ? 50 + (offset % maxOffset) : baseX;
    const y = baseY > maxOffset ? 50 + (offset % maxOffset) : baseY;

    const newApp = {
      ...appConfig,
      instanceId: `${appId}-${Date.now()}`,
      position: { x, y },
      size: appConfig.defaultSize,
      isMinimized: false,
      isFocused: true,
      data: data
    };

    // Unfocus all other apps
    setOpenApps(prev => [
      ...prev.map(app => ({ ...app, isFocused: false })),
      newApp
    ]);
  };

  const closeApp = (instanceId) => {
    setOpenApps(prev => prev.filter(app => app.instanceId !== instanceId));
  };

  const focusApp = (instanceId) => {
    setOpenApps(prev => prev.map(app => ({
      ...app,
      isFocused: app.instanceId === instanceId,
      isMinimized: app.instanceId === instanceId ? false : app.isMinimized
    })));
  };

  const minimizeApp = (instanceId) => {
    setOpenApps(prev => prev.map(app =>
      app.instanceId === instanceId
        ? { ...app, isMinimized: true, isFocused: false }
        : app
    ));
  };

  const moveApp = (instanceId, newPosition) => {
    setOpenApps(prev => prev.map(app =>
      app.instanceId === instanceId
        ? { ...app, position: newPosition }
        : app
    ));
  };

  const resizeApp = (instanceId, newSize) => {
    setOpenApps(prev => prev.map(app =>
      app.instanceId === instanceId
        ? { ...app, size: newSize }
        : app
    ));
  };

  const value = {
    openApps,
    openApp,
    closeApp,
    focusApp,
    minimizeApp,
    moveApp,
    resizeApp,
    getAppRegistry: () => APP_REGISTRY
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
