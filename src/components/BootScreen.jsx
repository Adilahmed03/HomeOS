import { useState, useEffect } from 'react';

const BootScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const bootMessages = [
    "Initializing HomeOS...",
    "Loading quantum modules...",
    "Establishing neural networks...",
    "Calibrating holographic interface...",
    "System ready. Welcome, Commander."
  ];

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onComplete(), 800);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  useEffect(() => {
    let messageIndex = 0;
    let charIndex = 0;

    const typeText = () => {
      if (messageIndex < bootMessages.length) {
        const message = bootMessages[messageIndex];
        
        if (charIndex < message.length) {
          setCurrentText(message.substring(0, charIndex + 1));
          charIndex++;
          setTimeout(typeText, 50);
        } else {
          // Move to next message after a pause
          setTimeout(() => {
            messageIndex++;
            charIndex = 0;
            if (messageIndex < bootMessages.length) {
              setCurrentText('');
              typeText();
            } else {
              setIsTyping(false);
            }
          }, 800);
        }
      }
    };

    typeText();
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 animated-grid"
        />
      </div>

      {/* Glowing orb */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-80 animate-pulse blur-sm" />
        <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 animate-ping" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* HomeOS Logo */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            HomeOS
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full" />
        </div>

        {/* Typing text */}
        <div className="mb-12 h-8">
          <p className="text-cyan-300 text-xl font-mono">
            {currentText}
            {isTyping && <span className="animate-pulse">|</span>}
          </p>
        </div>

        {/* Progress bar */}
        <div className="relative">
          <div className="w-96 h-3 bg-gray-800 rounded-full border border-cyan-500/30 mx-auto overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full transition-all duration-100 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
          <p className="text-cyan-400 text-sm mt-2 font-mono">{progress}%</p>
        </div>

        {/* Scanning lines effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 animate-scan" />
        </div>
      </div>

    </div>
  );
};

export default BootScreen;
