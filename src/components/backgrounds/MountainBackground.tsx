import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useScroll } from 'framer-motion';
import MountainLoader from '@/components/mountain/MountainLoader';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/useResponsive';
import { fadeIn, parallaxLayers } from '@/design/animations';
import { shadows, colors } from '@/design/tokens';
import { usePersonalization } from '@/contexts/PersonalizationContext';

export interface MountainBackgroundProps {
  children?: React.ReactNode;
  blurred?: boolean;
  focusable?: boolean;
  progressPercentage?: number;
  showFriends?: boolean;
  className?: string;
  onFocus?: () => void;
  timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night';
  weatherCondition?: 'clear' | 'cloudy' | 'rainy' | 'snowy';
  parallaxEnabled?: boolean;
  ambientEffects?: boolean;
}

/**
 * Enhanced MountainBackground component with ambient effects
 * Features parallax, atmospheric effects, and improved interactions
 */
export const MountainBackground: React.FC<MountainBackgroundProps> = React.memo(({
  children,
  blurred = false, // Changed from true to false to remove blur
  focusable = false,
  progressPercentage = 50,
  showFriends = false,
  className,
  onFocus,
  timeOfDay,
  weatherCondition = 'clear',
  parallaxEnabled = true,
  ambientEffects = true,
}) => {
  // State
  const [isFocused, setIsFocused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { isMobile } = useResponsive();
  const { scrollY } = useScroll();
  const { isReducedMotion } = usePersonalization();
  
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Transform for parallax effect - subtle movement based on mouse position
  const parallaxX = useTransform(mouseX, [-300, 300], [15, -15]);
  const parallaxY = useTransform(mouseY, [-300, 300], [15, -15]);
  
  // Scroll-based transformations
  const scrollOpacity = useTransform(
    scrollY, 
    [0, 300], 
    [1, isFocused ? 1 : 0.9]
  );
  
  // Handle focus change
  const handleFocus = () => {
    if (focusable) {
      const newFocusState = !isFocused;
      setIsFocused(newFocusState);
      if (onFocus) onFocus();
      
      // Play haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(20);
      }
    }
  };
  
  // Track mouse position for parallax effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!parallaxEnabled || isMobile) return;
    
    const { clientX, clientY } = e;
    const container = containerRef.current;
    
    if (container) {
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left - rect.width / 2;
      const y = clientY - rect.top - rect.height / 2;
      
      setMousePosition({ x, y });
      mouseX.set(x);
      mouseY.set(y);
    }
  };
  
  // Reset parallax on mouse leave
  const handleMouseLeave = () => {
    if (!parallaxEnabled) return;
    
    setMousePosition({ x: 0, y: 0 });
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full h-full overflow-hidden', 
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Mountain Background with parallax effect */}
      <motion.div 
        className={cn(
          "absolute inset-0 w-full h-full",
          focusable && "cursor-pointer",
          "transition-opacity duration-300"
        )}
        onClick={handleFocus}
        style={{
          opacity: scrollOpacity,
          x: parallaxEnabled && !isMobile ? parallaxX : 0,
          y: parallaxEnabled && !isMobile ? parallaxY : 0,
        }}
      >
        <MountainLoader
          blurred={blurred} 
          interactive={isFocused}
          progressPercentage={progressPercentage}
          showFriends={false}
          timeOfDay={timeOfDay}
          weatherCondition={weatherCondition}
          alwaysShowIndicators={false}
          use3D={true} // Always use Spline 3D scene
          autoUpgradeTo3D={false} // No need for auto-upgrade since we're using Spline
          autoUpgradeDelay={0}
          ambientEffects={ambientEffects}
          reducedMotion={isReducedMotion()}
        />
      </motion.div>
      
      {/* Atmospheric Overlay - adds subtle visual texture */}
      {ambientEffects && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle gradient overlay based on time of day */}
          <div className={cn(
            "absolute inset-0 opacity-20",
            timeOfDay === 'dawn' && "bg-gradient-to-t from-amber-500/20 to-transparent",
            timeOfDay === 'day' && "bg-gradient-to-t from-sky-400/10 to-transparent",
            timeOfDay === 'dusk' && "bg-gradient-to-t from-orange-500/20 to-transparent",
            timeOfDay === 'night' && "bg-gradient-to-t from-indigo-900/30 to-transparent",
          )} />
          
          {/* Subtle noise texture for visual richness */}
          <div 
            className="absolute inset-0 mix-blend-soft-light opacity-[0.03]" 
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: '100px 100px'
            }} 
          />
          
          {/* Vignette effect */}
          <div className="absolute inset-0 opacity-40 pointer-events-none bg-gradient-radial from-transparent to-black" />
        </div>
      )}
      
      {/* Content Overlay - higher z-index to appear above landmarks */}
      <AnimatePresence mode="wait">
        {!isFocused && children && (
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-20 w-full h-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Focus interaction is still available but button removed */}
      
      
      {/* Focus Mode Indicator - shown when mountain is focused */}
      {isFocused && (
        <motion.div
          className="absolute top-6 left-6 z-50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            className="flex items-center px-3 py-2 bg-glass-backgroundDark backdrop-blur-md border border-glass-border rounded-lg text-alpine-mist text-sm"
            onClick={handleFocus}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(24, 27, 33, 0.9)' }}
            whileTap={{ scale: 0.98 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <path d="M19 12H5M5 12L12 5M5 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </motion.button>
        </motion.div>
      )}
      
    </div>
  );
});


export default MountainBackground;