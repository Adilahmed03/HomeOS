import { useState } from 'react';
import { 
  InformationCircleIcon,
  CommandLineIcon,
  CogIcon,
  GlobeAltIcon,
  HeartIcon,
  ComputerDesktopIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const Help = () => {
  const [activeTab, setActiveTab] = useState('about');

  const commands = [
    { command: 'help', description: 'Show available commands' },
    { command: 'clear', description: 'Clear the terminal screen' },
    { command: 'whoami', description: 'Show current username' },
    { command: 'time', description: 'Show current system time' },
    { command: 'date', description: 'Show current system date' },
    { command: 'ls', description: 'List files/folders in Desktop' },
    { command: 'open [app]', description: 'Launch app (notepad, calculator, etc.)' },
    { command: 'echo [text]', description: 'Print the text back' },
    { command: 'wallpaper', description: 'Show current wallpaper setting' },
    { command: 'pwd', description: 'Show current directory path' },
    { command: 'version', description: 'Show HomeOS version info' },
  ];

  const shortcuts = [
    { key: 'Ctrl + Alt + T', description: 'Open Terminal' },
    { key: 'Ctrl + Alt + C', description: 'Open Calculator' },
    { key: 'Ctrl + Alt + N', description: 'Open Notepad' },
    { key: 'Ctrl + Alt + F', description: 'Open File Explorer' },
    { key: 'Ctrl + Alt + B', description: 'Open Browser' },
    { key: 'Ctrl + Alt + S', description: 'Open Settings' },
    { key: 'Alt + Tab', description: 'Switch between open applications' },
    { key: 'Win/Cmd + Space', description: 'Open Start Menu' },
  ];

  const features = [
    {
      icon: <CommandLineIcon className="w-6 h-6" />,
      title: 'Enhanced Terminal',
      description: 'Full-featured terminal with app launching, file system operations, and system commands'
    },
    {
      icon: <GlobeAltIcon className="w-6 h-6" />,
      title: 'Web Browser',
      description: 'Secure HTTPS browsing with integrated search using DuckDuckGo'
    },
    {
      icon: <TrashIcon className="w-6 h-6" />,
      title: 'Trash System',
      description: 'Safe file deletion with restore capability - files can be recovered before permanent deletion'
    },
    {
      icon: <CogIcon className="w-6 h-6" />,
      title: 'Customization',
      description: 'Multiple themes, wallpapers, and layout options to personalize your experience'
    },
  ];

  const TabButton = ({ id, label, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        isActive
          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
          : 'bg-gray-800/50 text-gray-300 border border-gray-700/50 hover:bg-cyan-500/10 hover:border-cyan-500/30'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full h-full bg-gray-900/90 backdrop-blur-md text-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-cyan-500/30">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
            <InformationCircleIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Help & About</h1>
            <p className="text-cyan-300">HomeOS Documentation & System Information</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 py-4 border-b border-gray-700/50">
        <div className="flex space-x-3">
          <TabButton
            id="about"
            label="About"
            isActive={activeTab === 'about'}
            onClick={setActiveTab}
          />
          <TabButton
            id="commands"
            label="Terminal Commands"
            isActive={activeTab === 'commands'}
            onClick={setActiveTab}
          />
          <TabButton
            id="shortcuts"
            label="Keyboard Shortcuts"
            isActive={activeTab === 'shortcuts'}
            onClick={setActiveTab}
          />
          <TabButton
            id="features"
            label="Features"
            isActive={activeTab === 'features'}
            onClick={setActiveTab}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">H</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                HomeOS
              </h2>
              <p className="text-xl text-gray-300 mb-4">Futuristic Browser-Based Desktop Environment</p>
              <div className="text-sm text-gray-400">
                <p>Version 2.0.0 - Phase 6 Complete</p>
                <p>Built with React + Vite + Tailwind CSS</p>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-cyan-300 mb-3">System Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Platform:</span>
                  <span className="ml-2 text-white">Web Browser</span>
                </div>
                <div>
                  <span className="text-gray-400">Framework:</span>
                  <span className="ml-2 text-white">React 19.1.0</span>
                </div>
                <div>
                  <span className="text-gray-400">Build Tool:</span>
                  <span className="ml-2 text-white">Vite 7.0.0</span>
                </div>
                <div>
                  <span className="text-gray-400">Styling:</span>
                  <span className="ml-2 text-white">Tailwind CSS</span>
                </div>
                <div>
                  <span className="text-gray-400">Storage:</span>
                  <span className="ml-2 text-white">Local Storage</span>
                </div>
                <div>
                  <span className="text-gray-400">Icons:</span>
                  <span className="ml-2 text-white">Heroicons</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-cyan-300 mb-3">Developer</h3>
              <div className="flex items-center space-x-3">
                <HeartIcon className="w-5 h-5 text-red-400" />
                <span className="text-gray-300">Created with passion by the HomeOS Development Team</span>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                A modern, browser-based desktop environment designed for productivity and customization.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'commands' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-6">
              <CommandLineIcon className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-semibold text-cyan-300">Terminal Commands</h3>
            </div>
            <div className="grid gap-3">
              {commands.map((cmd, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <code className="text-cyan-300 font-mono text-sm bg-gray-900/50 px-2 py-1 rounded">
                      {cmd.command}
                    </code>
                    <span className="text-gray-300 text-sm ml-4">{cmd.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'shortcuts' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-6">
              <ComputerDesktopIcon className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-semibold text-cyan-300">Keyboard Shortcuts</h3>
            </div>
            <div className="grid gap-3">
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <kbd className="text-cyan-300 font-mono text-sm bg-gray-900/50 px-3 py-1 rounded border border-gray-600">
                      {shortcut.key}
                    </kbd>
                    <span className="text-gray-300 text-sm ml-4">{shortcut.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <CogIcon className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-semibold text-cyan-300">Key Features</h3>
            </div>
            <div className="grid gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-cyan-400 mt-1">{feature.icon}</div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg p-6 border border-cyan-500/30">
              <h4 className="text-lg font-semibold text-cyan-300 mb-3">What's New in Phase 6</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Complete Trash system with restore functionality</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Enhanced Terminal with app launching and system commands</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Draggable desktop icons with position persistence</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Dynamic desktop file integration</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Custom wallpaper upload with Base64 storage</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Fully resizable windows with edge handles</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-cyan-400 mt-1">•</span>
                  <span>Improved browser with DuckDuckGo search integration</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Help;
