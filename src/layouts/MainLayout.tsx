import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import MountainBackground from '@/components/backgrounds/MountainBackground';
import Logo from '@/components/ui/Logo';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  isMountainFocused?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, isMountainFocused: propsMountainFocused }) => {
  const location = useLocation();
  const [isMountainFocused, setIsMountainFocused] = useState(propsMountainFocused || false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile device
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
  
  // Update internal state when prop changes
  useEffect(() => {
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
  const handleMountainFocus = useCallback(() => {
    setIsMountainFocused(!isMountainFocused);
  }, [isMountainFocused]);

  return (
    <div className="fixed inset-0 w-screen h-screen mobile-full-height overflow-hidden bg-bg-primary">
      {/* Mountain Background - present on all pages but with different states */}
      <MountainBackground 
        blurred={shouldBlurMountain && !isMountainFocused}
        focusable={isFocusable}
        showFriends={showFriends}
        progressPercentage={65} // This would come from user data in a real app
        onFocus={handleMountainFocus}
        className="absolute inset-0 w-full h-full"
      >
        {/* Content Container */}
        <div 
          className={cn(
            'w-full h-full overflow-auto scrollbar-thin scrollbar-thumb-glass-border scrollbar-track-transparent',
            isMountainFocused ? 'opacity-0 pointer-events-none' : 'opacity-100'
          )}
        >
          {/* Logo Header - Centered at the top */}
          <div className="fixed top-4 left-0 right-0 flex justify-center z-50">
            <Logo size="xl" variant="glow" />
          </div>
          
          {/* Main Content - Full height scrollable container */}
          <div className={cn(
            'content-container min-h-full',
            isMobile ? 'p-3 pt-16 pb-24' : 'p-4 pt-16 pb-24' // Add padding top for logo and bottom for navigation
          )}>
            {children}
          </div>
        </div>
      </MountainBackground>

      {/* Subtle cyan glow at the bottom of the screen */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-accent-primary/10 to-transparent pointer-events-none z-0"></div>
    </div>
  );
};

export default MainLayout;