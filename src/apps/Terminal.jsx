import { useState, useRef, useEffect } from 'react';
import { useApps } from '../core/AppManager';
import { useSettings } from '../core/SettingsContext';

const Terminal = () => {
  const { openApp } = useApps();
  const { settings } = useSettings();
  const [history, setHistory] = useState([
    'Welcome to HomeOS Terminal v2.0',
    'Type "help" for available commands.',
    ''
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    // Auto-focus the input when terminal opens
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom when new content is added
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (command) => {
    const cmd = command.trim();
    const cmdLower = cmd.toLowerCase();
    let output = '';

    switch (true) {
      case cmdLower === 'help':
        output = `Available commands:
  help          - Show this help message
  clear         - Clear the terminal
  whoami        - Show current username
  time          - Show current system time
  date          - Show current system date
  ls            - List files/folders in Desktop
  open [app]    - Launch app (notepad, calculator, browser, etc.)
  echo [text]   - Print the text back
  wallpaper     - Show current wallpaper setting
  pwd           - Show current directory
  version       - Show HomeOS version`;
        break;
        
      case cmdLower === 'clear':
        setHistory(['Welcome to HomeOS Terminal v2.0', 'Type "help" for available commands.', '']);
        return;
        
      case cmdLower === 'whoami':
        output = 'commander';
        break;
        
      case cmdLower === 'time':
        output = new Date().toLocaleTimeString();
        break;
        
      case cmdLower === 'date':
        output = new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        break;
        
      case cmdLower === 'ls':
        // Get files from localStorage
        const savedFiles = localStorage.getItem('desktop-files');
        if (savedFiles) {
          const files = JSON.parse(savedFiles);
          output = files.map(f => f.name).join('  ') || 'Empty directory';
        } else {
          output = 'Empty directory';
        }
        break;
        
      case cmdLower.startsWith('open '):
        const appName = cmd.substring(5).trim().toLowerCase();
        const appMap = {
          'notepad': 'notepad',
          'calculator': 'calculator',
          'terminal': 'terminal',
          'browser': 'browser',
          'file-explorer': 'file-explorer',
          'files': 'file-explorer',
          'settings': 'settings',
          'help': 'help',
          'trash': 'trash'
        };
        
        if (appMap[appName]) {
          openApp(appMap[appName]);
          output = `Launching ${appName}...`;
        } else {
          output = `App not found: ${appName}\nAvailable apps: notepad, calculator, browser, file-explorer, settings, help, trash`;
        }
        break;
        
      case cmdLower.startsWith('echo '):
        output = cmd.substring(5);
        break;
        
      case cmdLower === 'wallpaper':
        if (settings.wallpaper?.startsWith('custom:')) {
          output = 'Custom wallpaper is set';
        } else {
          const wallpaperNames = {
            'gradient-blue': 'Cyber Blue Gradient',
            'gradient-purple': 'Neon Purple Gradient',
            'gradient-green': 'Matrix Green Gradient',
            'gradient-orange': 'Solar Orange Gradient',
            'solid-black': 'Deep Space Black',
            'pattern-circuit': 'Circuit Pattern'
          };
          output = wallpaperNames[settings.wallpaper] || 'Default wallpaper';
        }
        break;
        
      case cmdLower === 'pwd':
        output = '/Users/commander/Desktop';
        break;
        
      case cmdLower === 'version':
        output = 'HomeOS v2.0.0 - Futuristic Desktop Environment\nBuilt with React + Vite + Tailwind CSS';
        break;
        
      case cmdLower === '':
        output = '';
        break;
        
      default:
        output = `Command not found: ${cmd}\nType "help" for available commands.`;
    }

    setHistory(prev => [
      ...prev,
      `$ ${command}`,
      ...(output ? output.split('\n') : []),
      ''
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentInput.trim()) {
      setCommandHistory(prev => [...prev, currentInput]);
      executeCommand(currentInput);
    } else {
      setHistory(prev => [...prev, '$ ']);
    }
    setCurrentInput('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      className="w-full h-full bg-black/95 backdrop-blur-md text-green-400 p-4 font-mono text-sm cursor-text overflow-hidden flex flex-col border border-cyan-500/20"
      onClick={handleTerminalClick}
    >
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto space-y-1"
      >
        {history.map((line, index) => (
          <div key={index} className={line.startsWith('$') ? 'text-white' : 'text-green-400'}>
            {line}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex items-center mt-2">
        <span className="text-white mr-2">$</span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-green-400 outline-none caret-green-400 placeholder-green-600"
          autoComplete="off"
          spellCheck={false}
          placeholder="Type a command..."
        />
      </form>
    </div>
  );
};

export default Terminal;
