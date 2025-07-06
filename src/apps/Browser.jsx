import { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline';

const Browser = () => {
  const [url, setUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNavigate = () => {
    if (!url.trim()) return;
    
    let targetUrl = url.trim();
    
    // Check if it's a search query (doesn't contain dots or starts with known search terms)
    if (!targetUrl.includes('.') && !targetUrl.startsWith('http')) {
      // Use DuckDuckGo for search
      targetUrl = `https://duckduckgo.com/?q=${encodeURIComponent(targetUrl)}`;
    } else if (!targetUrl.startsWith('https://') && !targetUrl.startsWith('http://')) {
      // Auto-prepend https:// for URLs
      targetUrl = `https://${targetUrl}`;
    } else if (targetUrl.startsWith('http://')) {
      setError('Only HTTPS URLs are allowed for security');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setCurrentUrl(targetUrl);
    
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNavigate();
    }
  };

  const handleIframeError = () => {
    setError('This site can\'t be loaded - CORS policy or site restrictions prevent embedding.');
    setIsLoading(false);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setError('');
  };

  const handleRefresh = () => {
    if (currentUrl) {
      setIsLoading(true);
      setError('');
      // Force iframe reload by updating the src
      const iframe = document.querySelector(`iframe[src="${currentUrl}"]`);
      if (iframe) {
        iframe.src = iframe.src;
      }
    }
  };

  const handleHome = () => {
    setUrl('https://www.google.com');
    setCurrentUrl('https://www.google.com');
    setIsLoading(true);
    setError('');
  };

  return (
    <div className="w-full h-full bg-gray-900/50 overflow-hidden flex flex-col">
      {/* Navigation Bar */}
      <div className="bg-gray-800/80 px-4 py-3 border-b border-cyan-500/30 flex items-center space-x-3 backdrop-blur-md">
        <button className="p-1 hover:bg-gray-200 rounded" disabled>
          <ArrowLeftIcon className="w-4 h-4 text-gray-400" />
        </button>
        <button className="p-1 hover:bg-gray-200 rounded" disabled>
          <ArrowRightIcon className="w-4 h-4 text-gray-400" />
        </button>
        <button 
          className="p-1 hover:bg-cyan-500/20 rounded border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 transition-all duration-200"
          onClick={handleRefresh}
          disabled={!currentUrl || isLoading}
        >
          <ArrowPathIcon className="w-4 h-4" />
        </button>
        <button 
          className="p-1 hover:bg-cyan-500/20 rounded border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 transition-all duration-200"
          onClick={handleHome}
        >
          <HomeIcon className="w-4 h-4" />
        </button>
        
        <div className="flex-1 flex items-center bg-gray-900/50 border border-cyan-500/30 rounded-lg px-3 py-1 backdrop-blur-sm">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 outline-none text-sm bg-transparent text-white placeholder-gray-400"
            placeholder="Search or enter URL..."
          />
          <button
            onClick={handleNavigate}
            className="ml-2 px-3 py-1 bg-cyan-600/80 hover:bg-cyan-500/80 text-white text-sm rounded-lg transition-all duration-200 border border-cyan-500/50"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Go'}
          </button>
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 bg-gray-900/50 overflow-hidden">
        {error ? (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-medium text-red-600 mb-2">Error</h3>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => setError('')}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading webpage...</p>
            </div>
          </div>
        ) : currentUrl ? (
          <iframe
            src={currentUrl}
            className="w-full h-full border-0"
            onError={handleIframeError}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            title="Browser Content"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <div className="text-6xl mb-4">🌐</div>
              <h3 className="text-xl font-medium text-white mb-2">HomeOS Browser</h3>
              <p className="text-gray-300 mb-4">Search the web or enter a URL</p>
              <p className="text-sm text-gray-400">Search queries use DuckDuckGo • Only HTTPS URLs supported</p>
              <div className="mt-6 text-left">
                <p className="text-sm text-gray-300 mb-2">Try these examples:</p>
                <div className="space-y-1 text-xs text-cyan-400">
                  <div>• "artificial intelligence" (search)</div>
                  <div>• github.com (website)</div>
                  <div>• wikipedia.org (website)</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browser;
