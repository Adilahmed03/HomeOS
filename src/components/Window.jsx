import { useState, useRef, useEffect } from 'react';
import { XMarkIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useApps } from '../core/AppManager';

const Window = ({ app }) => {
  const { closeApp, focusApp, minimizeApp, moveApp, resizeApp } = useApps();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls')) return;
    
    setIsDragging(true);
    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    focusApp(app.instanceId);
  };


  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection(null);
  };

  const handleResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection('se');
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: app.size.width,
      height: app.size.height
    });
    focusApp(app.instanceId);
  };

  const handleEdgeResizeStart = (e, direction) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: app.size.width,
      height: app.size.height
    });
    focusApp(app.instanceId);
  };

  const handleResizeMove = (e) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;
    
    let newWidth = resizeStart.width;
    let newHeight = resizeStart.height;
    
    if (resizeDirection === 'se' || resizeDirection === 'right') {
      newWidth = Math.max(300, resizeStart.width + deltaX);
    }
    if (resizeDirection === 'se' || resizeDirection === 'bottom') {
      newHeight = Math.max(200, resizeStart.height + deltaY);
    }
    
    resizeApp(app.instanceId, { width: newWidth, height: newHeight });
  };

  // Add event listeners for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newPosition = {
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        };
        
        // Keep window within viewport
        newPosition.x = Math.max(0, Math.min(newPosition.x, window.innerWidth - app.size.width));
        newPosition.y = Math.max(0, Math.min(newPosition.y, window.innerHeight - app.size.height));
        
        moveApp(app.instanceId, newPosition);
      } else if (isResizing) {
        handleResizeMove(e);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeDirection(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragOffset, resizeStart, app.instanceId, app.size, moveApp, resizeApp]);

  if (app.isMinimized) {
    return null;
  }

  const AppComponent = app.component;

  return (
    <div
      ref={windowRef}
      className={`absolute border border-cyan-500/30 rounded-lg shadow-2xl bg-gray-900/95 backdrop-blur-md overflow-hidden ${
        app.isFocused ? 'z-50 border-cyan-400/50 shadow-cyan-500/20' : 'z-40 border-gray-600/30'
      } transition-all duration-200`}
      style={{
        left: app.position.x,
        top: app.position.y,
        width: app.size.width,
        height: app.size.height,
        cursor: isDragging ? 'grabbing' : 'default',
        boxShadow: app.isFocused 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 20px rgba(6, 182, 212, 0.3)'
          : '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}
      onClick={() => focusApp(app.instanceId)}
    >
      {/* Window Title Bar */}
      <div
        className={`flex items-center justify-between px-4 py-3 ${
          app.isFocused 
            ? 'bg-gradient-to-r from-cyan-600/80 to-blue-600/80 backdrop-blur-md border-b border-cyan-400/30' 
            : 'bg-gradient-to-r from-gray-700/80 to-gray-600/80 backdrop-blur-md border-b border-gray-500/30'
        } text-white cursor-grab select-none`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm">{app.icon}</span>
          <span className="text-sm font-medium">{app.name}</span>
        </div>
        
        <div className="window-controls flex items-center space-x-2">
          <button
            onClick={() => minimizeApp(app.instanceId)}
            className="w-5 h-5 bg-yellow-500/80 hover:bg-yellow-400 rounded-full flex items-center justify-center transition-all duration-200 border border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-500/30"
            title="Minimize"
          >
            <MinusIcon className="w-3 h-3 text-white" />
          </button>
          <button
            onClick={() => closeApp(app.instanceId)}
            className="w-5 h-5 bg-red-500/80 hover:bg-red-400 rounded-full flex items-center justify-center transition-all duration-200 border border-red-400/50 hover:shadow-lg hover:shadow-red-500/30"
            title="Close"
          >
            <XMarkIcon className="w-3 h-3 text-white" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="w-full h-full" style={{ height: 'calc(100% - 40px)' }}>
        <AppComponent appData={app.data} />
      </div>
      
      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-cyan-500/50 hover:bg-cyan-400/70 transition-colors backdrop-blur-sm"
        onMouseDown={handleResizeStart}
        style={{
          clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)'
        }}
        title="Resize"
      />
      
      {/* Edge resize handles */}
      <div className="absolute right-0 top-2 bottom-2 w-1 cursor-ew-resize" onMouseDown={(e) => handleEdgeResizeStart(e, 'right')} />
      <div className="absolute bottom-0 left-2 right-2 h-1 cursor-ns-resize" onMouseDown={(e) => handleEdgeResizeStart(e, 'bottom')} />
    </div>
  );
};

export default Window;
