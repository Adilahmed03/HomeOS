import { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  CalculatorIcon, 
  CommandLineIcon, 
  GlobeAltIcon, 
  FolderOpenIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { useApps } from '../core/AppManager';

const DesktopIcons = () => {
  const { openApp } = useApps();
  const [iconPositions, setIconPositions] = useState({});
  const [draggedIcon, setDraggedIcon] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [desktopFiles, setDesktopFiles] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  
  const apps = [
    {
      name: 'Notepad',
      icon: DocumentTextIcon,
      id: 'notepad',
      emoji: '📝'
    },
    {
      name: 'Calculator',
      icon: CalculatorIcon,
      id: 'calculator',
      emoji: '🧮'
    },
    {
      name: 'Terminal',
      icon: CommandLineIcon,
      id: 'terminal',
      emoji: '💻'
    },
    {
      name: 'Browser',
      icon: GlobeAltIcon,
      id: 'browser',
      emoji: '🌐'
    },
    {
      name: 'File Manager',
      icon: FolderOpenIcon,
      id: 'file-manager',
      emoji: '📁'
    },
    {
      name: 'Settings',
      icon: CogIcon,
      id: 'settings',
      emoji: '⚙️'
    },
    {
      name: 'Help & About',
      icon: QuestionMarkCircleIcon,
      id: 'help',
      emoji: '❓'
    },
    {
      name: 'Trash',
      icon: TrashIcon,
      id: 'trash',
      emoji: '🗑️'
    }
  ];
  
  // Load saved positions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('desktop-icon-positions');
    if (saved) {
      setIconPositions(JSON.parse(saved));
    } else {
      // Set default positions
      const defaultPositions = {};
      apps.forEach((app, index) => {
        defaultPositions[app.id] = {
          x: 20,
          y: 20 + (index * 100)
        };
      });
      setIconPositions(defaultPositions);
    }
  }, []);
  
  // Load desktop files from localStorage
  useEffect(() => {
    const savedFiles = localStorage.getItem('desktop-files');
    if (savedFiles) {
      setDesktopFiles(JSON.parse(savedFiles));
    }
  }, []);
  
  // Listen for desktop file changes
  useEffect(() => {
    const handleDesktopFileChange = (event) => {
      const { file, action } = event.detail;
      if (action === 'create') {
        setDesktopFiles(prev => [...prev, file]);
        // Add position for new file
        const fileKey = `file-${file.name}`;
        setIconPositions(prev => ({
          ...prev,
          [fileKey]: {
            x: 120,
            y: 20 + (Object.keys(prev).length * 100)
          }
        }));
      } else if (action === 'delete') {
        setDesktopFiles(prev => prev.filter(f => f.name !== file.name));
      }
    };
    
    window.addEventListener('desktopFileCreated', handleDesktopFileChange);
    return () => window.removeEventListener('desktopFileCreated', handleDesktopFileChange);
  }, []);
  
  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu(null);
    };
    
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);
  
  // Save positions to localStorage
  const savePositions = (positions) => {
    localStorage.setItem('desktop-icon-positions', JSON.stringify(positions));
  };
  
  const handleRightClick = (e, itemId, itemType) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      itemId,
      itemType
    });
  };
  
  const handleDeleteFile = (fileName) => {
    // Remove from desktop files
    setDesktopFiles(prev => prev.filter(f => f.name !== fileName));
    
    // Remove from saved files
    const savedFiles = JSON.parse(localStorage.getItem('homeos-saved-files') || '{}');
    delete savedFiles[fileName];
    localStorage.setItem('homeos-saved-files', JSON.stringify(savedFiles));
    
    // Update desktop files in localStorage
    const updatedFiles = desktopFiles.filter(f => f.name !== fileName);
    localStorage.setItem('desktop-files', JSON.stringify(updatedFiles));
    
    setContextMenu(null);
  };

  const handleIconClick = (appId) => {
    // Prevent opening if we were dragging
    if (draggedIcon) {
      return;
    }
    
    if (appId.startsWith('file-')) {
      // Handle desktop file click - open with Notepad
      const fileName = appId.replace('file-', '');
      const file = desktopFiles.find(f => f.name === fileName);
      
      // Open notepad with file data
      openApp('notepad', { file: file });
    } else {
      // Handle app click - open the corresponding app
      openApp(appId);
    }
  };
  
  const handleMouseDown = (e, appId) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Only start dragging on mouse move, not immediately
    const startX = e.clientX;
    const startY = e.clientY;
    
    const handleStartDrag = (moveEvent) => {
      const moved = Math.abs(moveEvent.clientX - startX) > 5 || Math.abs(moveEvent.clientY - startY) > 5;
      if (moved) {
        setDraggedIcon(appId);
        setDragOffset({
          x: moveEvent.clientX - rect.left,
          y: moveEvent.clientY - rect.top
        });
        document.removeEventListener('mousemove', handleStartDrag);
      }
    };
    
    const handleMouseUpEarly = () => {
      document.removeEventListener('mousemove', handleStartDrag);
      document.removeEventListener('mouseup', handleMouseUpEarly);
    };
    
    document.addEventListener('mousemove', handleStartDrag);
    document.addEventListener('mouseup', handleMouseUpEarly);
  };
  
  const handleMouseMove = (e) => {
    if (draggedIcon) {
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      };
      
      // Keep within viewport bounds
      newPosition.x = Math.max(0, Math.min(newPosition.x, window.innerWidth - 80));
      newPosition.y = Math.max(0, Math.min(newPosition.y, window.innerHeight - 80));
      
      setIconPositions(prev => ({
        ...prev,
        [draggedIcon]: newPosition
      }));
    }
  };
  
  const handleMouseUp = () => {
    if (draggedIcon) {
      savePositions(iconPositions);
      setDraggedIcon(null);
    }
  };
  
  // Add global event listeners for drag
  useEffect(() => {
    if (draggedIcon) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedIcon, dragOffset, iconPositions]);

  return (
    <>
      {/* App Icons */}
      {apps.map((app) => {
        const IconComponent = app.icon;
        const position = iconPositions[app.id] || { x: 20, y: 20 };
        
        return (
          <div
            key={app.id}
            className={`absolute flex flex-col items-center p-3 rounded-lg cursor-pointer select-none transition-all duration-200 ${
              draggedIcon === app.id 
                ? 'scale-110 z-50 bg-cyan-500/30 backdrop-blur-md border border-cyan-400/50 shadow-lg shadow-cyan-500/30' 
                : 'hover:bg-white/10 hover:backdrop-blur-sm hover:scale-105 z-10'
            } group`}
            style={{
              left: position.x,
              top: position.y,
              cursor: draggedIcon === app.id ? 'grabbing' : 'grab'
            }}
            onClick={() => handleIconClick(app.id)}
            onMouseDown={(e) => handleMouseDown(e, app.id)}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-2 rounded-xl">
                <IconComponent className="w-12 h-12 text-cyan-300 group-hover:text-cyan-200 transition-colors duration-200" />
                <div className="absolute bottom-1 right-1 text-lg">{app.emoji}</div>
              </div>
            </div>
            <span className="text-white text-xs mt-1 text-center font-medium group-hover:text-cyan-200 transition-colors duration-200 max-w-16 truncate">
              {app.name}
            </span>
          </div>
        );
      })}
      
      {/* Desktop File Icons */}
      {desktopFiles.map((file) => {
        const fileKey = `file-${file.name}`;
        const position = iconPositions[fileKey] || { x: 120, y: 20 };
        
        return (
          <div
            key={fileKey}
            className={`absolute flex flex-col items-center p-3 rounded-lg cursor-pointer select-none transition-all duration-200 ${
              draggedIcon === fileKey 
                ? 'scale-110 z-50 bg-cyan-500/30 backdrop-blur-md border border-cyan-400/50 shadow-lg shadow-cyan-500/30' 
                : 'hover:bg-white/10 hover:backdrop-blur-sm hover:scale-105 z-10'
            } group`}
            style={{
              left: position.x,
              top: position.y,
              cursor: draggedIcon === fileKey ? 'grabbing' : 'grab'
            }}
            onClick={() => handleIconClick(fileKey)}
            onMouseDown={(e) => handleMouseDown(e, fileKey)}
            onContextMenu={(e) => handleRightClick(e, file.name, 'file')}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative p-2 rounded-xl">
                <DocumentTextIcon className="w-12 h-12 text-orange-300 group-hover:text-orange-200 transition-colors duration-200" />
                <div className="absolute bottom-1 right-1 text-lg">📄</div>
              </div>
            </div>
            <span className="text-white text-xs mt-1 text-center font-medium group-hover:text-orange-200 transition-colors duration-200 max-w-16 truncate">
              {file.name}
            </span>
          </div>
        );
      })}
      
      {/* Context Menu */}
      {contextMenu && (
        <div 
          className="fixed z-[200] bg-gray-900/95 backdrop-blur-md border border-cyan-500/30 rounded-lg shadow-xl py-2 min-w-[140px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => {
              if (contextMenu.itemType === 'file') {
                const file = desktopFiles.find(f => f.name === contextMenu.itemId);
                if (file) {
                  openApp('notepad', { file: file });
                }
              }
              setContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-300 flex items-center space-x-2 transition-all duration-200"
          >
            <FolderOpenIcon className="w-4 h-4" />
            <span>Open</span>
          </button>
          <div className="border-t border-gray-700 my-1"></div>
          <button
            onClick={() => {
              if (contextMenu.itemType === 'file') {
                handleDeleteFile(contextMenu.itemId);
              }
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-red-500/20 hover:text-red-300 flex items-center space-x-2 transition-all duration-200"
          >
            <TrashIcon className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </>
  );
};

export default DesktopIcons;
