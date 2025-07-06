import { useEffect, useState } from 'react';

const LogoutScreen = ({ onComplete }) => {
  const [opacity, setOpacity] = useState(1);
  const [text, setText] = useState('');
  const [showText, setShowText] = useState(false);

  const logoutMessage = "Session Terminated. See you soon, Commander.";

  useEffect(() => {
    // Start blur and fade effect
    setTimeout(() => {
      setOpacity(0.3);
      setTimeout(() => {
        setShowText(true);
        // Type out the text
        let charIndex = 0;
        const typeInterval = setInterval(() => {
          if (charIndex < logoutMessage.length) {
            setText(logoutMessage.substring(0, charIndex + 1));
            charIndex++;
          } else {
            clearInterval(typeInterval);
            // Complete logout after text is done
            setTimeout(() => {
              onComplete();
            }, 2000);
          }
        }, 80);
      }, 500);
    }, 100);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Blurred background overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-indigo-900/50 transition-all duration-1000 backdrop-blur-md"
        style={{ opacity }}
      />
      
      {/* Matrix-like rain effect */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 w-0.5 bg-gradient-to-b from-cyan-400 to-transparent animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${Math.random() * 100 + 50}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      {showText && (
        <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
          {/* Logout icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
          </div>

          {/* Typing text */}
          <div className="mb-8">
            <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-mono">
              {text}
              <span className="animate-pulse text-cyan-400">|</span>
            </p>
          </div>

          {/* Glowing line */}
          <div className="w-64 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto animate-pulse" />
          
          {/* Scanning effect */}
          <div className="mt-8 relative">
            <div className="w-full h-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-ping" />
            </div>
          </div>
        </div>
      )}

      {/* Glitch effect overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-0.5 bg-cyan-400 opacity-0 animate-pulse" style={{
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`
        }} />
      </div>
    </div>
  );
};

export default LogoutScreen;
