import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useScroll } from 'framer-motion';
import MountainLoader from '@/components/mountain/MountainLoader';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/useResponsive';
import { fadeIn, parallaxLayers } from '@/design/animations';
import { shadows, colors } from '@/design/tokens';
import useScrollEffect from '@/hooks/useScrollEffect';
import { useActivityPoints } from '@/contexts/ActivityPointsContext';
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
  const [showJourneyTooltip, setShowJourneyTooltip] = useState(false);
  const { isMobile } = useResponsive();
  const { scrollY } = useScroll();
  const { activityPoints, getProgressPercentage, getCurrentPhase } = useActivityPoints();
  const { preferences, isReducedMotion, shouldShowFeature } = usePersonalization();
  
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
          showFriends={showFriends && shouldShowFeature('showFriendProgress')}
          timeOfDay={timeOfDay}
          weatherCondition={weatherCondition}
          alwaysShowIndicators={true}
          use3D={true} // Always use Spline 3D scene
          autoUpgradeTo3D={false} // No need for auto-upgrade since we're using Spline
          autoUpgradeDelay={0}
          ambientEffects={ambientEffects && shouldShowFeature('showWeatherEffects')}
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
      
      {/* Journey Landmarks - show key milestones on the mountain based on user preference */}
      {shouldShowFeature('showJourneyLandmarks') && (
        <div className="absolute top-0 left-0 w-full h-[60%] pointer-events-none z-5">
          {/* Base Camp - Foundation Phase */}
          <JourneyLandmark 
            name="Base Camp" 
            description={`Foundation Phase: ${activityPoints.phases[0].points}/${activityPoints.phases[0].totalPoints} points`}
            position={{ left: '15%', top: '85%' }} 
            color="#00CCFF"
            isCompleted={activityPoints.phases[0].completed}
            isActive={getCurrentPhase()?.name === 'Foundation Phase'}
            onClick={() => setShowJourneyTooltip(true)}
          />
          
          {/* Camp 1 - Development Phase */}
          <JourneyLandmark 
            name="Camp 1" 
            description={`Development Phase: ${activityPoints.phases[1].points}/${activityPoints.phases[1].totalPoints} points`}
            position={{ left: '40%', top: '50%' }} 
            color="#20B2AA"
            isCompleted={activityPoints.phases[1].completed}
            isActive={getCurrentPhase()?.name === 'Development Phase'}
            onClick={() => setShowJourneyTooltip(true)}
          />
          
          {/* Summit - Specialization Phase */}
          <JourneyLandmark 
            name="Summit" 
            description={`Specialization Phase: ${activityPoints.phases[2].points}/${activityPoints.phases[2].totalPoints} points`}
            position={{ left: '50%', top: '15%' }} 
            color="#4F86C6"
            isCompleted={activityPoints.phases[2].completed}
            isActive={getCurrentPhase()?.name === 'Specialization Phase'}
            onClick={() => setShowJourneyTooltip(true)}
          />
        </div>
      )}
      
      {/* Friends Indicators with enhanced visual treatment - respects user preferences */}
      {showFriends && shouldShowFeature('showFriendProgress') && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-5">
          <FriendIndicator name="Alex" position={{ left: '30%', top: '40%' }} color="#00CCFF" />
          <FriendIndicator name="Sarah" position={{ left: '60%', top: '35%' }} color="#20B2AA" />
          <FriendIndicator name="Mike" position={{ left: '45%', top: '55%' }} color="#4F86C6" />
        </div>
      )}
      
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
      
      {/* Journey Context Tooltip - positioned in the middle of the screen to avoid overlapping */}
      <AnimatePresence>
        {showJourneyTooltip && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[85%] max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="bg-glass-backgroundDark backdrop-blur-md border border-glass-border rounded-lg p-4 shadow-xl">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-cyan-500 to-primary-teal-500 flex items-center justify-center mr-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 10L10 3M10 3H4M10 3V9M21 14L14 21M14 21H20M14 21V15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm">{activityPoints.goalName}</h3>
                    <p className="text-alpine-mist text-xs">Your journey to the summit</p>
                  </div>
                </div>
                <button 
                  className="text-alpine-mist hover:text-white"
                  onClick={() => setShowJourneyTooltip(false)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div className="space-y-3 mb-3">
                {activityPoints.phases.map((phase, index) => {
                  const isCurrentPhase = getCurrentPhase()?.name === phase.name;
                  const progressPercentage = Math.round((phase.points / phase.totalPoints) * 100);
                  
                  return (
                    <div key={index} className={`p-3 rounded-lg ${isCurrentPhase ? 'bg-primary-cyan-500/20' : 'bg-glass-highlight bg-opacity-50'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white text-xs font-medium">{phase.name}</span>
                        <span className={`text-xs ${phase.completed ? 'text-primary-teal-500' : isCurrentPhase ? 'text-primary-cyan-500' : 'text-alpine-mist'}`}>
                          {phase.completed ? 'Completed' : `${progressPercentage}%`}
                        </span>
                      </div>
                      
                      <div className="relative h-1.5 bg-glass-background bg-opacity-30 rounded-full overflow-hidden">
                        <div 
                          className="absolute left-0 top-0 bottom-0 rounded-full"
                          style={{
                            width: `${progressPercentage}%`,
                            backgroundColor: phase.completed ? '#4ADE80' : isCurrentPhase ? '#00CCFF' : '#94A3B8'
                          }}
                        />
                      </div>
                      
                      {isCurrentPhase && (
                        <div className="mt-2 text-xs text-alpine-mist">
                          {phase.points} of {phase.totalPoints} points earned
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="text-xs text-alpine-mist border-t border-glass-border pt-3">
                {getCurrentPhase() ? (
                  <>Your current focus is on <span className="text-primary-cyan-500 font-medium">{getCurrentPhase()?.name}</span>. 
                  Keep going to reach the next milestone!</>
                ) : (
                  <>Congratulations! You've completed all phases of your journey to the summit!</>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// Enhanced Friend Indicator component
interface FriendIndicatorProps {
  name: string;
  position: { left: string; top: string };
  color: string;
}

const FriendIndicator: React.FC<FriendIndicatorProps> = ({ name, position, color }) => {
  const { isMobile } = useResponsive();
  
  return (
    <motion.div 
      className={cn(
        "absolute flex flex-col items-center",
        isMobile && "scale-75"
      )}
      style={position}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute w-6 h-6 rounded-full"
        style={{ backgroundColor: `${color}20` }}
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.4, 0.1, 0.4] 
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut"
        }}
      />
      
      {/* Pulse indicator */}
      <motion.div 
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}80` }}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7] 
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        }}
      />
      
      {/* Friend name tooltip */}
      <motion.div 
        className="mt-1 px-3 py-1.5 bg-glass-backgroundDark backdrop-blur-md border border-glass-border rounded-lg text-xs font-medium text-alpine-mist shadow-lg"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ boxShadow: `0 3px 8px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.1)` }}
      >
        {name}
      </motion.div>
    </motion.div>
  );
};

// Journey Landmark component for visualizing progress milestones
interface JourneyLandmarkProps {
  name: string;
  description: string;
  position: { left: string; top: string };
  color: string;
  isCompleted?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

const JourneyLandmark: React.FC<JourneyLandmarkProps> = ({ 
  name, 
  description, 
  position, 
  color, 
  isCompleted = false,
  isActive = false,
  onClick
}) => {
  const { isMobile } = useResponsive();
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Determine tooltip position based on screen position to avoid going off-screen
  const getTooltipPosition = () => {
    const posLeft = parseFloat(position.left);
    
    // If landmark is on the right side of the screen, position tooltip to the left
    if (posLeft > 70) {
      return {
        right: '100%',
        left: 'auto',
        marginRight: '10px',
        marginLeft: '0'
      };
    }
    
    // Default: position tooltip to the right
    return {
      left: '100%',
      right: 'auto',
      marginLeft: '10px',
      marginRight: '0'
    };
  };
  
  return (
    <motion.div 
      className={cn(
        "absolute flex flex-col items-center",
        isMobile && "scale-75",
        "pointer-events-auto" // Allow interactions
      )}
      style={position}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setShowTooltip(true)}
      onHoverEnd={() => setShowTooltip(false)}
      onClick={onClick}
    >
      {/* Landmark icon with status indicator */}
      <div className="relative">
        {/* Outer glow for active landmark */}
        {isActive && (
          <motion.div
            className="absolute w-10 h-10 rounded-full"
            style={{ backgroundColor: `${color}30` }}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.6, 0.2, 0.6] 
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut"
            }}
          />
        )}
        
        {/* Landmark icon */}
        <motion.div 
          className={cn(
            "w-6 h-6 rounded-full flex items-center justify-center",
            isCompleted ? "bg-white" : "bg-glass-highlight bg-opacity-70"
          )}
          style={{ 
            border: `2px solid ${color}`,
            boxShadow: isActive ? `0 0 15px ${color}80` : `0 0 5px ${color}40`
          }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          {isCompleted && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {!isCompleted && isActive && (
            <motion.div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: color }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </motion.div>
      </div>
      
      {/* Landmark name */}
      <div className="mt-1 px-2 py-0.5 bg-glass-backgroundDark backdrop-blur-md border border-glass-border rounded-md text-xs font-medium text-white shadow-lg">
        {name}
      </div>
      
      {/* Detailed tooltip - dynamically positioned to avoid going off-screen */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div 
            className="absolute px-3 py-2 bg-glass-backgroundDark backdrop-blur-md border border-glass-border rounded-lg text-xs text-white shadow-lg z-50 max-w-[180px]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{ 
              ...getTooltipPosition(),
              boxShadow: `0 3px 15px rgba(0,0,0,0.3), 0 1px 5px rgba(0,0,0,0.2), 0 0 0 1px ${color}30` 
            }}
          >
            <div className="font-medium mb-1" style={{ color }}>{name}</div>
            <div className="text-alpine-mist text-[10px] leading-tight">{description}</div>
            
            {isActive && (
              <div className="mt-1 pt-1 border-t border-glass-border text-[10px] text-primary-cyan-500 font-medium">
                You are here
              </div>
            )}
            {isCompleted && (
              <div className="mt-1 pt-1 border-t border-glass-border text-[10px] text-primary-teal-500 font-medium">
                Completed
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MountainBackground;