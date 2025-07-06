import DesktopIcons from './DesktopIcons';
import Taskbar from './Taskbar';
import Window from './Window';
import { useApps } from '../core/AppManager';
import { useSettings } from '../core/SettingsContext';

const Desktop = () => {
  const { openApps } = useApps();
  const { settings } = useSettings();

  const getWallpaperClass = () => {
    if (settings.wallpaper?.startsWith('custom:')) {
      return 'bg-cover bg-center bg-no-repeat';
    }
    
    switch (settings.wallpaper) {
      case 'gradient-purple':
        return 'bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800';
      case 'gradient-green':
        return 'bg-gradient-to-br from-green-600 via-teal-600 to-green-800';
      case 'gradient-orange':
        return 'bg-gradient-to-br from-orange-600 via-red-600 to-orange-800';
      case 'solid-black':
        return 'bg-black';
      case 'pattern-circuit':
        return 'bg-gray-900';
      case 'gradient-blue':
      default:
        return 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800';
    }
  };

  const getThemeClass = () => {
    return settings.theme === 'light' ? 'text-gray-800' : 'text-white';
  };

  const getDesktopPadding = () => {
    switch (settings.taskbarPosition) {
      case 'top':
        return 'pt-12';
      case 'left':
        return 'pl-12';
      case 'bottom':
      default:
        return 'pb-12';
    }
  };

  const customWallpaperStyle = settings.wallpaper?.startsWith('custom:') 
    ? { backgroundImage: `url("${settings.wallpaper.substring(7)}")` }
    : {};

  const getPatternOverlay = () => {
    if (settings.wallpaper === 'pattern-circuit') {
      return (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='circuit' x='0' y='0' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M10 10h80v80h-80z' fill='none' stroke='%2300ffff' stroke-width='0.5' opacity='0.3'/%3E%3Ccircle cx='10' cy='10' r='2' fill='%2300ffff' opacity='0.5'/%3E%3Ccircle cx='90' cy='10' r='2' fill='%2300ffff' opacity='0.5'/%3E%3Ccircle cx='10' cy='90' r='2' fill='%2300ffff' opacity='0.5'/%3E%3Ccircle cx='90' cy='90' r='2' fill='%2300ffff' opacity='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23circuit)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }} />
        </div>
      );
    }
    
    return (
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }} />
      </div>
    );
  };

  return (
    <div 
      className={`relative w-full h-screen overflow-hidden ${getWallpaperClass()} ${getThemeClass()} ${getDesktopPadding()}`}
      style={customWallpaperStyle}
    >
      {/* Desktop Background Pattern */}
      {getPatternOverlay()}
      
      {/* Open Windows */}
      {openApps.map(app => (
        <Window key={app.instanceId} app={app} />
      ))}
      
      {/* Desktop Icons */}
      <DesktopIcons />
      
      {/* Taskbar */}
      <Taskbar />
    </div>
  );
};

export default Desktop;
