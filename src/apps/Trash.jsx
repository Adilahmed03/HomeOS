import { useState, useEffect } from 'react';
import { 
  TrashIcon, 
  ArrowUturnLeftIcon, 
  XMarkIcon,
  FolderIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';

const Trash = () => {
  const [trashItems, setTrashItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Load trash items from localStorage
    const trash = JSON.parse(localStorage.getItem('homeos-trash') || '[]');
    setTrashItems(trash);
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const updateTrash = (newTrash) => {
    localStorage.setItem('homeos-trash', JSON.stringify(newTrash));
    setTrashItems(newTrash);
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === trashItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(trashItems.map(item => item.id));
    }
  };

  const restoreItems = () => {
    if (selectedItems.length === 0) return;

    const fileSystem = JSON.parse(localStorage.getItem('homeos-filesystem') || '{}');
    const itemsToRestore = trashItems.filter(item => selectedItems.includes(item.id));
    
    itemsToRestore.forEach(item => {
      const targetPath = item.originalPath;
      
      if (!fileSystem[targetPath]) {
        fileSystem[targetPath] = { folders: [], files: [] };
      }

      if (item.type === 'folder') {
        // Check if folder name already exists
        const existingFolder = fileSystem[targetPath].folders.find(f => f.name === item.name);
        if (!existingFolder) {
          fileSystem[targetPath].folders.push({
            name: item.name,
            type: 'folder'
          });
          
          // Restore the folder structure if it exists
          if (item.folderData) {
            fileSystem[item.fullPath] = item.folderData;
          }
        }
      } else {
        // Check if file name already exists
        const existingFile = fileSystem[targetPath].files.find(f => f.name === item.name);
        if (!existingFile) {
          fileSystem[targetPath].files.push({
            name: item.name,
            type: 'file',
            content: item.content || 'Restored file',
            created: item.created || new Date().toISOString()
          });
          
          // If restoring to Desktop, trigger desktop icon refresh
          if (targetPath === '/Desktop') {
            window.dispatchEvent(new CustomEvent('desktopFileCreated', {
              detail: { file: { name: item.name }, action: 'create' }
            }));
          }
        }
      }
    });

    // Remove restored items from trash
    const newTrash = trashItems.filter(item => !selectedItems.includes(item.id));
    
    // Save updated file system and trash to localStorage
    localStorage.setItem('homeos-filesystem', JSON.stringify(fileSystem));
    updateTrash(newTrash);
    
    setSelectedItems([]);
    showToast(`Restored ${itemsToRestore.length} item(s)`);
  };

  const deleteItemsPermanently = () => {
    if (selectedItems.length === 0) return;

    if (window.confirm(`Are you sure you want to permanently delete ${selectedItems.length} item(s)? This action cannot be undone.`)) {
      const newTrash = trashItems.filter(item => !selectedItems.includes(item.id));
      updateTrash(newTrash);
      setSelectedItems([]);
      showToast(`Permanently deleted ${selectedItems.length} item(s)`);
    }
  };

  const emptyTrash = () => {
    if (trashItems.length === 0) return;

    if (window.confirm(`Are you sure you want to empty the trash? This will permanently delete ${trashItems.length} item(s) and cannot be undone.`)) {
      updateTrash([]);
      setSelectedItems([]);
      showToast('Trash emptied');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };

  return (
    <div className="w-full h-full bg-gray-900/95 backdrop-blur-md border border-cyan-500/20 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 border-b border-red-500/30">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-400 to-pink-500 flex items-center justify-center">
            <TrashIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Trash ({trashItems.length})</h1>
            <p className="text-red-300">Deleted items • Can be restored or permanently deleted</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      {trashItems.length > 0 && (
        <div className="p-4 bg-gray-800/50 border-b border-gray-700/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSelectAll}
              className="px-3 py-2 text-sm text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/20 rounded-lg border border-cyan-500/30 hover:border-cyan-400 transition-all duration-200"
            >
              {selectedItems.length === trashItems.length ? 'Deselect All' : 'Select All'}
            </button>
            <span className="text-gray-400 text-sm">
              {selectedItems.length > 0 ? `${selectedItems.length} selected` : `${trashItems.length} items`}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {selectedItems.length > 0 && (
              <>
                <button
                  onClick={restoreItems}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600/80 hover:bg-green-500/80 text-white rounded-lg transition-all duration-200 border border-green-500/50 hover:border-green-400"
                >
                  <ArrowUturnLeftIcon className="w-4 h-4" />
                  <span>Restore</span>
                </button>
                <button
                  onClick={deleteItemsPermanently}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600/80 hover:bg-red-500/80 text-white rounded-lg transition-all duration-200 border border-red-500/50 hover:border-red-400"
                >
                  <XMarkIcon className="w-4 h-4" />
                  <span>Delete Forever</span>
                </button>
              </>
            )}
            <button
              onClick={emptyTrash}
              className="px-4 py-2 bg-red-700/80 hover:bg-red-600/80 text-white rounded-lg transition-all duration-200 border border-red-600/50 hover:border-red-500 text-sm"
            >
              Empty Trash
            </button>
          </div>
        </div>
      )}

      {/* Item List */}
      <div className="flex-1 overflow-y-auto">
        {trashItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center">
                <TrashIcon className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-300 mb-2">Trash is empty</h3>
              <p className="text-gray-500">Deleted files will appear here</p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {trashItems.map((item) => {
              const isSelected = selectedItems.includes(item.id);
              const ItemIcon = item.type === 'folder' ? FolderIcon : DocumentIcon;
              
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400/50'
                      : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50 hover:border-gray-600/50'
                  }`}
                  onClick={() => handleSelectItem(item.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectItem(item.id)}
                        className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-600 rounded focus:ring-cyan-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <ItemIcon className={`w-6 h-6 ${item.type === 'folder' ? 'text-blue-400' : 'text-orange-400'}`} />
                    </div>
                    <div>
                      <div className="text-white font-medium">{item.name}</div>
                      <div className="text-gray-400 text-sm">
                        {item.type === 'folder' ? 'Folder' : 'File'} • From {item.originalPath}
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm text-right">
                    <div>Deleted</div>
                    <div>{formatDate(item.deletedAt)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="absolute bottom-4 right-4 bg-green-500/90 backdrop-blur-md text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in border border-green-400/50">
          {toast}
        </div>
      )}
    </div>
  );
};

export default Trash;
