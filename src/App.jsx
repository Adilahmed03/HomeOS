import { useState, useEffect } from 'react';
import { AppProvider } from './core/AppManager';
import { SettingsProvider } from './core/SettingsContext';
import Desktop from './components/Desktop';
import BootScreen from './components/BootScreen';

function AppContent() {
  const [showBootScreen, setShowBootScreen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Show loading screen while app is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-2xl font-semibold">Loading HomeOS...</div>
      </div>
    );
  }

  // Show boot screen after loading
  if (showBootScreen) {
    return (
      <BootScreen 
        onComplete={() => setShowBootScreen(false)} 
      />
    );
  }
  
  // Show desktop after boot screen
  return (
    <SettingsProvider>
      <AppProvider>
        <Desktop />
      </AppProvider>
    </SettingsProvider>
  );
}

function App() {
  return <AppContent />;
}

export default App
