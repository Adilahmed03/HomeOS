import { useState, useEffect } from 'react';
import { DocumentIcon, FolderOpenIcon } from '@heroicons/react/24/outline';

const Notepad = ({ appData }) => {
  
  // Initialize with file data if provided, otherwise default content
  const [text, setText] = useState(() => {
    if (appData?.file?.content !== undefined) {
      return appData.file.content;
    }
    return 'Welcome to HomeOS Notepad!\n\nStart typing your notes here...';
  });
  
  const [filename, setFilename] = useState(() => {
    if (appData?.file?.name) {
      return appData.file.name;
    }
    return 'Untitled.txt';
  });
  
  const [filePath, setFilePath] = useState(() => {
    // Try to determine file path - default to Desktop for new files
    return '/Desktop';
  });
  
  const [lastSaved, setLastSaved] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveFilename, setSaveFilename] = useState('');
  const [isNewFile, setIsNewFile] = useState(true);

  // Auto-save to localStorage whenever text changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('notepad-content', text);
      setLastSaved(new Date().toLocaleTimeString());
    }, 1000); // Save after 1 second of no typing

    return () => clearTimeout(timeoutId);
  }, [text]);

  // Update content when appData changes (no confirmation popup)
  useEffect(() => {
    if (appData?.file?.content !== undefined) {
      setText(appData.file.content);
      setFilename(appData.file.name);
      setIsNewFile(false);
    }
  }, [appData]);

  const handleSave = () => {
    if (filename === 'Untitled.txt' || isNewFile) {
      // Show save dialog for naming the file
      setSaveFilename(filename.replace('.txt', ''));
      setShowSaveDialog(true);
    } else {
      // Save directly if already named
      saveToFile(filename);
    }
  };

  const saveToFile = (fileName) => {
    const finalFilename = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;
    
    // Save to file system
    const fileSystem = JSON.parse(localStorage.getItem('homeos-filesystem') || '{}');
    if (!fileSystem['/Desktop']) {
      fileSystem['/Desktop'] = { folders: [], files: [] };
    }
    
    const newFile = {
      name: finalFilename,
      type: 'file',
      content: text,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    };
    
    // Update or create file in file system
    const existingIndex = fileSystem['/Desktop'].files.findIndex(f => f.name === finalFilename);
    if (existingIndex >= 0) {
      fileSystem['/Desktop'].files[existingIndex] = newFile;
    } else {
      fileSystem['/Desktop'].files.push(newFile);
    }
    
    localStorage.setItem('homeos-filesystem', JSON.stringify(fileSystem));
    
    // Also save to desktop files for desktop icons
    const desktopFiles = JSON.parse(localStorage.getItem('desktop-files') || '[]');
    const desktopIndex = desktopFiles.findIndex(f => f.name === finalFilename);
    if (desktopIndex >= 0) {
      desktopFiles[desktopIndex] = newFile;
    } else {
      desktopFiles.push(newFile);
    }
    localStorage.setItem('desktop-files', JSON.stringify(desktopFiles));
    
    // Trigger desktop refresh
    window.dispatchEvent(new CustomEvent('desktopFileCreated', {
      detail: { file: newFile, action: 'create' }
    }));
    
    // Update current filename
    setFilename(finalFilename);
    setIsNewFile(false);
    setLastSaved(new Date().toLocaleTimeString());
    setShowSaveDialog(false);
  };

  const handleSaveDialogSubmit = () => {
    if (saveFilename.trim()) {
      saveToFile(saveFilename.trim());
    }
  };

  const handleOpen = () => {
    // Simple message since File Explorer handles file opening
    alert('Use the File Explorer to browse and open files. Files will open directly in Notepad when clicked.');
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="w-full h-full bg-gray-900/95 backdrop-blur-md flex flex-col border border-cyan-500/20 relative">
      {/* Menu Bar */}
      <div className="bg-gray-800/80 backdrop-blur-md px-4 py-2 border-b border-cyan-500/30 flex items-center space-x-4">
        <button
          onClick={handleOpen}
          className="flex items-center space-x-1 px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-500/20 rounded-lg border border-cyan-500/30 hover:border-cyan-400 transition-all duration-200"
        >
          <FolderOpenIcon className="w-4 h-4" />
          <span>Open</span>
        </button>
        <button
          onClick={handleSave}
          className="flex items-center space-x-1 px-3 py-2 text-sm text-cyan-300 hover:bg-cyan-500/20 rounded-lg border border-cyan-500/30 hover:border-cyan-400 transition-all duration-200"
        >
          <DocumentIcon className="w-4 h-4" />
          <span>Save</span>
        </button>
        <div className="flex-1" />
        <div className="text-xs text-gray-400">
          {text.length} characters
        </div>
        {lastSaved && (
          <div className="text-xs text-green-400">
            Saved at {lastSaved}
          </div>
        )}
      </div>
      
      {/* Text Editor */}
      <textarea
        value={text}
        onChange={handleTextChange}
        className="flex-1 p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed bg-transparent text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 rounded-none"
        placeholder="Start typing..."
        spellCheck={false}
      />
      
      {/* Status Bar */}
      <div className="bg-gray-800/80 backdrop-blur-md px-4 py-2 border-t border-cyan-500/30 flex items-center justify-between text-xs text-gray-400">
        <span className="text-cyan-300">{filename}</span>
        <span>{text.split('\n').length} lines, {text.length} characters</span>
      </div>
      
      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900/95 backdrop-blur-md border border-cyan-500/30 rounded-lg p-6 min-w-[300px]">
            <h3 className="text-lg font-semibold text-white mb-4">Save File</h3>
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">Filename:</label>
              <input
                type="text"
                value={saveFilename}
                onChange={(e) => setSaveFilename(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/80 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="Enter filename"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveDialogSubmit();
                  }
                }}
              />
              <p className="text-xs text-gray-400 mt-1">.txt extension will be added automatically</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSaveDialogSubmit}
                className="px-4 py-2 bg-cyan-600/80 hover:bg-cyan-500/80 text-white rounded-lg transition-all duration-200 border border-cyan-500/50"
              >
                Save
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 bg-gray-600/80 hover:bg-gray-500/80 text-white rounded-lg transition-all duration-200 border border-gray-500/50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notepad;
