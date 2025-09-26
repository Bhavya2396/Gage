import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MountainBackground from '@/components/backgrounds/MountainBackground';
import Logo from '@/components/ui/Logo';
import { cn } from '@/lib/utils';
import { fadeIn } from '@/design/animations';
import { useResponsive } from '@/hooks/useResponsive';
import { useActivityPoints } from '@/contexts/ActivityPointsContext';

interface StandardLayoutProps {
  children: React.ReactNode;
  isMountainFocused?: boolean;
  onMountainFocusChange?: (focused: boolean) => void;
  hideHeader?: boolean;
  customHeader?: React.ReactNode;
  timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night';
  showFooter?: boolean;
}

export const StandardLayout: React.FC<StandardLayoutProps> = ({
  children,
  isMountainFocused: propsMountainFocused,
  onMountainFocusChange,
  hideHeader = false,
  customHeader,
  timeOfDay,
  showFooter = true,
}) => {
  const location = useLocation();
  const { isMobile } = useResponsive();
  const { getProgressPercentage } = useActivityPoints();
  const [isMountainFocused, setIsMountainFocused] = React.useState(propsMountainFocused || false);
  
  // Update internal state when prop changes
  React.useEffect(() => {
    if (propsMountainFocused !== undefined) {
      setIsMountainFocused(propsMountainFocused);
    }
  }, [propsMountainFocused]);
  
  // Determine if current page should have focusable mountain
  const isFocusable = location.pathname === '/' || location.pathname === '/journey';
  
  // Determine if current page should show friends on mountain
  const showFriends = location.pathname === '/friends';
  
  // Determine if mountain should be blurred
  // Don't blur on mountain-focused pages or when explicitly focused
  const shouldBlurMountain = !(['/mountain', '/friends', '/calendar'].includes(location.pathname));

  // Handle mountain focus change
  const handleMountainFocus = React.useCallback(() => {
    const newFocused = !isMountainFocused;
    setIsMountainFocused(newFocused);
    if (onMountainFocusChange) {
      onMountainFocusChange(newFocused);
    }
  }, [isMountainFocused, onMountainFocusChange]);

  // Get the current time of day if not provided
  const getCurrentTimeOfDay = (): 'dawn' | 'day' | 'dusk' | 'night' => {
    if (timeOfDay) return timeOfDay;
    
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 8) return 'dawn';
    if (hours >= 8 && hours < 18) return 'day';
    if (hours >= 18 && hours < 21) return 'dusk';
    return 'night';
  };

  return (
    <div className="fixed inset-0 w-screen h-screen mobile-full-height overflow-hidden bg-bg-primary">
      {/* Mountain Background - present on all pages but with different states */}
      <MountainBackground 
        blurred={shouldBlurMountain && !isMountainFocused}
        focusable={isFocusable}
        showFriends={showFriends}
        progressPercentage={getProgressPercentage()}
        onFocus={handleMountainFocus}
        timeOfDay={getCurrentTimeOfDay()}
        className="absolute inset-0 w-full h-full"
      >
        {/* Content Container */}
        <div 
          className={cn(
            'w-full h-full overflow-auto scrollbar-thin scrollbar-thumb-glass-border scrollbar-track-transparent',
            isMountainFocused ? 'opacity-0 pointer-events-none' : 'opacity-100',
            'transition-opacity duration-300'
          )}
        >
          {/* Header Area - Logo or Custom Header */}
          {!hideHeader && (
            <motion.div 
              className="fixed top-0 left-0 right-0 z-50 p-4"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={fadeIn}
            >
              {customHeader || (
                <div className="flex justify-center">
                  <Logo size="lg" variant="glow" />
                </div>
              )}
            </motion.div>
          )}
          
          {/* Main Content - Full height scrollable container */}
          <div className={cn(
            'content-container min-h-full',
            isMobile ? 'p-3 pt-16 pb-24' : 'p-4 pt-16 pb-24', // Add padding top for logo and bottom for navigation
            hideHeader && 'pt-4' // Reduce top padding if header is hidden
          )}>
            <AnimatePresence mode="wait">
              {children}
            </AnimatePresence>
          </div>
          
          {/* Bottom Area - Footer or Navigation */}
          {showFooter && (
            <div className="fixed bottom-0 left-0 right-0 h-16 flex items-center justify-center px-4 z-40">
              <motion.div 
                className="bg-glass-background backdrop-blur-md border border-glass-border rounded-full px-4 py-2 shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <nav className="flex items-center justify-around space-x-8">
                  {/* Navigation items would go here */}
                  <div className="w-6 h-6 rounded-full bg-glass-highlight"></div>
                  <div className="w-6 h-6 rounded-full bg-glass-highlight"></div>
                  <div className="w-6 h-6 rounded-full bg-glass-highlight"></div>
                </nav>
              </motion.div>
            </div>
          )}
        </div>
      </MountainBackground>

      {/* Subtle cyan glow at the bottom of the screen */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-primary-cyan/10 to-transparent pointer-events-none z-0"></div>
    </div>
  );
};

export default StandardLayout;
