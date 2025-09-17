import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Mountain3D from '@/components/mountain/Mountain3D';
import { cn } from '@/lib/utils';

interface MountainBackgroundProps {
  children?: React.ReactNode;
  blurred?: boolean;
  focusable?: boolean;
  progressPercentage?: number;
  showFriends?: boolean;
  className?: string;
  onFocus?: () => void;
  timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night';
}

export const MountainBackground: React.FC<MountainBackgroundProps> = React.memo(({
  children,
  blurred = true,
  focusable = false,
  progressPercentage = 50,
  showFriends = false,
  className,
  onFocus,
  timeOfDay
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check initially
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleFocus = () => {
    if (focusable) {
      setIsFocused(!isFocused);
      if (onFocus) onFocus();
    }
  };

  return (
                  <div
                className={cn('relative w-full h-full overflow-hidden', className)}
                style={{ backdropFilter: 'none' }}>
      {/* Mountain Background */}
      <div 
        className="absolute inset-0 w-full h-full cursor-pointer" 
        onClick={handleFocus}
      >
        <Mountain3D
          blurred={false} // Never blur the mountain
          interactive={isFocused}
          progressPercentage={progressPercentage}
          showFriends={showFriends}
          timeOfDay={timeOfDay}
          alwaysShowIndicators={true}
        />
      </div>
      
      {/* Content Overlay */}
      <AnimatePresence>
        {!isFocused && children && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full h-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mountain is now clickable - no separate button needed */}
      
      {/* Friends Indicators (only shown when showFriends is true) */}
      {showFriends && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {/* Friend indicators will be rendered here */}
          <div className={`absolute left-[30%] top-[40%] flex flex-col items-center ${isMobile ? 'scale-75' : ''}`}>
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            <div className="mt-1 px-2 py-1 bg-black/50 rounded text-xs text-white">Alex</div>
          </div>
          
          <div className={`absolute left-[60%] top-[35%] flex flex-col items-center ${isMobile ? 'scale-75' : ''}`}>
            <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse"></div>
            <div className="mt-1 px-2 py-1 bg-black/50 rounded text-xs text-white">Sarah</div>
          </div>
          
          <div className={`absolute left-[45%] top-[55%] flex flex-col items-center ${isMobile ? 'scale-75' : ''}`}>
            <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
            <div className="mt-1 px-2 py-1 bg-black/50 rounded text-xs text-white">Mike</div>
          </div>
        </div>
      )}
    </div>
  );
});

export default MountainBackground;