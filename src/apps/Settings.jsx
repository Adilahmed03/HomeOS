import { useSettings } from '../core/SettingsContext';

const Settings = () => {
  const { settings, updateSetting, resetSettings } = useSettings();

  const bgClasses = settings.theme === 'dark' 
    ? 'bg-gray-900/60 backdrop-blur-md text-white'
    : 'bg-white/60 backdrop-blur-md text-gray-800';

  const sectionClasses = settings.theme === 'dark'
    ? 'bg-gray-800/40 border-gray-700/50'
    : 'bg-white/40 border-gray-200/50';

  const buttonBaseClasses = 'px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm';
  const getButtonClasses = (isActive) => {
    if (isActive) {
      return `${buttonBaseClasses} bg-blue-500/90 text-white shadow-lg`;
    }
    return settings.theme === 'dark'
      ? `${buttonBaseClasses} bg-gray-700/60 text-gray-200 hover:bg-gray-600/80 border border-gray-600/50`
      : `${buttonBaseClasses} bg-gray-200/60 text-gray-800 hover:bg-gray-300/80 border border-gray-300/50`;
  };

  return (
    <div className={`w-full h-full p-4 ${bgClasses} overflow-y-auto`}>
      <div className={`p-4 rounded-lg ${sectionClasses} border mb-6`}>
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className={`text-sm ${settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Customize your HomeOS experience
        </p>
      </div>

      {/* Theme Selection */}
      <div className={`mb-6 p-4 rounded-lg ${sectionClasses} border`}>
        <h2 className="text-lg font-semibold mb-3">Theme</h2>
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => updateSetting('theme', 'light')}
            className={getButtonClasses(settings.theme === 'light')}
          >
            ☀️ Light
          </button>
          <button 
            onClick={() => updateSetting('theme', 'dark')}
            className={getButtonClasses(settings.theme === 'dark')}
          >
            🌙 Dark
          </button>
          <button 
            onClick={() => updateSetting('theme', 'neon')}
            className={getButtonClasses(settings.theme === 'neon')}
          >
            ⚡ Neon
          </button>
        </div>
      </div>

      {/* Wallpaper Selection */}
      <div className={`mb-6 p-4 rounded-lg ${sectionClasses} border`}>
        <h2 className="text-lg font-semibold mb-3">Wallpaper</h2>
        
        {/* Custom Wallpaper Upload */}
        <div className="mb-4 p-3 border border-cyan-500/30 rounded-lg bg-cyan-500/10">
          <h3 className="text-md font-medium mb-2 text-cyan-300">Upload Custom Wallpaper</h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  updateSetting('wallpaper', `custom:${event.target.result}`);
                };
                reader.readAsDataURL(file);
              }
            }}
            className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30"
          />
        </div>
        
        {/* Predefined Image Wallpapers */}
        <div className="mb-4">
          <h3 className="text-md font-medium mb-3 text-cyan-300">Predefined Wallpapers</h3>
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => updateSetting('wallpaper', 'custom:https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=1080&fit=crop')}
              className={getButtonClasses(settings.wallpaper === 'custom:https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=1080&fit=crop')}
            >
              🌌 Space Nebula
            </button>
            <button 
              onClick={() => updateSetting('wallpaper', 'custom:https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop')}
              className={getButtonClasses(settings.wallpaper === 'custom:https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop')}
            >
              🪐 Deep Space
            </button>
            <button 
              onClick={() => updateSetting('wallpaper', 'custom:https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1920&h=1080&fit=crop')}
              className={getButtonClasses(settings.wallpaper === 'custom:https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1920&h=1080&fit=crop')}
            >
              ⭐ Galaxy View
            </button>
          </div>
        </div>
        
        {/* Gradient Wallpapers */}
        <div className="mb-4">
          <h3 className="text-md font-medium mb-3 text-cyan-300">Gradient Wallpapers</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => updateSetting('wallpaper', 'gradient-blue')}
              className={getButtonClasses(settings.wallpaper === 'gradient-blue')}
            >
              🌊 Cyber Blue
            </button>
            <button 
              onClick={() => updateSetting('wallpaper', 'gradient-purple')}
              className={getButtonClasses(settings.wallpaper === 'gradient-purple')}
            >
              🌸 Neon Purple
            </button>
            <button 
              onClick={() => updateSetting('wallpaper', 'gradient-green')}
              className={getButtonClasses(settings.wallpaper === 'gradient-green')}
            >
              🌿 Matrix Green
            </button>
            <button 
              onClick={() => updateSetting('wallpaper', 'gradient-orange')}
              className={getButtonClasses(settings.wallpaper === 'gradient-orange')}
            >
              🍊 Solar Orange
            </button>
            <button 
              onClick={() => updateSetting('wallpaper', 'solid-black')}
              className={getButtonClasses(settings.wallpaper === 'solid-black')}
            >
              ⚫ Deep Space
            </button>
            <button 
              onClick={() => updateSetting('wallpaper', 'pattern-circuit')}
              className={getButtonClasses(settings.wallpaper === 'pattern-circuit')}
            >
              🔷 Circuit Pattern
            </button>
          </div>
        </div>
      </div>

      {/* Taskbar Position */}
      <div className={`mb-6 p-4 rounded-lg ${sectionClasses} border`}>
        <h2 className="text-lg font-semibold mb-3">Taskbar Position</h2>
        <div className="flex space-x-3">
          <button 
            onClick={() => updateSetting('taskbarPosition', 'bottom')}
            className={getButtonClasses(settings.taskbarPosition === 'bottom')}
          >
            ⬇️ Bottom
          </button>
          <button 
            onClick={() => updateSetting('taskbarPosition', 'top')}
            className={getButtonClasses(settings.taskbarPosition === 'top')}
          >
            ⬆️ Top
          </button>
          <button 
            onClick={() => updateSetting('taskbarPosition', 'left')}
            className={getButtonClasses(settings.taskbarPosition === 'left')}
          >
            ⬅️ Left
          </button>
        </div>
      </div>

      {/* Clock Format */}
      <div className={`mb-6 p-4 rounded-lg ${sectionClasses} border`}>
        <h2 className="text-lg font-semibold mb-3">Clock Format</h2>
        <div className="flex space-x-3">
          <button 
            onClick={() => updateSetting('clockFormat', '12h')}
            className={getButtonClasses(settings.clockFormat === '12h')}
          >
            🕐 12 Hour
          </button>
          <button 
            onClick={() => updateSetting('clockFormat', '24h')}
            className={getButtonClasses(settings.clockFormat === '24h')}
          >
            🕐 24 Hour
          </button>
        </div>
      </div>

      {/* Animations Toggle */}
      <div className={`mb-6 p-4 rounded-lg ${sectionClasses} border`}>
        <h2 className="text-lg font-semibold mb-3">App Animations</h2>
        <div className="flex space-x-3">
          <button 
            onClick={() => updateSetting('animations', true)}
            className={getButtonClasses(settings.animations)}
          >
            ✨ Enable
          </button>
          <button 
            onClick={() => updateSetting('animations', false)}
            className={getButtonClasses(!settings.animations)}
          >
            🚫 Disable
          </button>
        </div>
      </div>

      {/* Clock Visibility */}
      <div className={`mb-6 p-4 rounded-lg ${sectionClasses} border`}>
        <h2 className="text-lg font-semibold mb-3">Display Clock</h2>
        <div className="flex space-x-3">
          <button 
            onClick={() => updateSetting('showClock', true)}
            className={getButtonClasses(settings.showClock)}
          >
            👁️ Show
          </button>
          <button 
            onClick={() => updateSetting('showClock', false)}
            className={getButtonClasses(!settings.showClock)}
          >
            🙈 Hide
          </button>
        </div>
      </div>

      {/* Reset Button */}
      <div className={`p-4 rounded-lg ${sectionClasses} border border-red-500/30`}>
        <h2 className="text-lg font-semibold mb-3 text-red-500">Reset Settings</h2>
        <button 
          onClick={resetSettings}
          className="bg-red-500/80 hover:bg-red-600/80 text-white px-6 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
        >
          🔄 Reset to Default
        </button>
      </div>
    </div>
  );
};

export default Settings;
