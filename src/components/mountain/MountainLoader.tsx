import React, { lazy, Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LightweightMountain from './LightweightMountain';
import { fadeIn } from '@/design/animations';

// Lazy load the heavy Mountain3D component
const Mountain3D = lazy(() => import('./Mountain3D'));

interface MountainLoaderProps {
  progressPercentage?: number;
  blurred?: boolean;
  interactive?: boolean;
  timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night';
  weatherCondition?: 'clear' | 'cloudy' | 'rainy' | 'snowy';
  showFriends?: boolean;
  className?: string;
  alwaysShowIndicators?: boolean;
  showPlottingAnimation?: boolean;
  showJourneyAnimation?: boolean;
  onPlottingComplete?: () => void;
  onJourneyComplete?: () => void;
  use3D?: boolean;
  autoUpgradeTo3D?: boolean;
  autoUpgradeDelay?: number;
  ambientEffects?: boolean;
  reducedMotion?: boolean;
}

/**
 * Enhanced MountainLoader component
 * Intelligently loads appropriate mountain visualization with ambient effects
 */
const MountainLoader: React.FC<MountainLoaderProps> = ({
  progressPercentage = 0,
  blurred = false,
  interactive = false,
  timeOfDay = 'day',
  weatherCondition = 'clear',
  showFriends = false,
  className,
  alwaysShowIndicators = false,
  showPlottingAnimation = false,
  showJourneyAnimation = false,
  onPlottingComplete,
  onJourneyComplete,
  use3D = false,
  autoUpgradeTo3D = false,
  autoUpgradeDelay = 2000,
  ambientEffects = true,
  reducedMotion = false,
}) => {
  const [shouldLoad3D, setShouldLoad3D] = useState(use3D);
  const [loadAttempted, setLoadAttempted] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transitionReady, setTransitionReady] = useState(false);

  // Auto upgrade to 3D after delay if enabled
  useEffect(() => {
    if (autoUpgradeTo3D && !shouldLoad3D && !loadAttempted && !loadFailed) {
      const timer = setTimeout(() => {
        setTransitionReady(true);
        
        // Short delay after transition ready before attempting 3D load
        setTimeout(() => {
          setShouldLoad3D(true);
          setLoadAttempted(true);
        }, 300);
      }, autoUpgradeDelay);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [autoUpgradeTo3D, autoUpgradeDelay, shouldLoad3D, loadAttempted, loadFailed]);
  
  // Update when use3D prop changes
  useEffect(() => {
    setShouldLoad3D(use3D);
    if (use3D) {
      setLoadAttempted(true);
      setTransitionReady(true);
    }
  }, [use3D]);

  // Reset loading state after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle load errors
  const handleLoadError = () => {
    console.warn("Failed to load 3D mountain, falling back to lightweight");
    setShouldLoad3D(false);
    setLoadFailed(true);
  };
  
  // Handle load complete
  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative w-full h-full">
      {/* Loading indicator for smoother transitions */}
      <AnimatedLoadingIndicator 
        isVisible={isLoading} 
        timeOfDay={timeOfDay}
        reducedMotion={reducedMotion}
      />
      
      {/* Lightweight mountain view */}
      {(!shouldLoad3D || loadFailed) && (
        <motion.div
          initial={{ opacity: transitionReady ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          <LightweightMountain
            progressPercentage={progressPercentage}
            blurred={blurred}
            className={className}
            timeOfDay={timeOfDay}
            weatherCondition={weatherCondition}
            ambientEffects={ambientEffects}
          />
        </motion.div>
      )}
      
      {/* 3D mountain view with suspense fallback */}
      {shouldLoad3D && !loadFailed && (
        <Suspense 
          fallback={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full"
            >
              <LightweightMountain
                progressPercentage={progressPercentage}
                blurred={blurred}
                className={className}
                timeOfDay={timeOfDay}
                weatherCondition={weatherCondition}
                ambientEffects={ambientEffects}
              />
            </motion.div>
          }
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <ErrorBoundary onError={handleLoadError}>
              <Mountain3D 
                progressPercentage={progressPercentage}
                blurred={blurred}
                interactive={interactive}
                timeOfDay={timeOfDay}
                weatherCondition={weatherCondition}
                showFriends={showFriends}
                className={className}
                alwaysShowIndicators={alwaysShowIndicators}
                showPlottingAnimation={showPlottingAnimation}
                showJourneyAnimation={showJourneyAnimation}
                onPlottingComplete={onPlottingComplete}
                onJourneyComplete={onJourneyComplete}
                onLoadComplete={handleLoadComplete}
                ambientEffects={ambientEffects}
              />
            </ErrorBoundary>
          </motion.div>
        </Suspense>
      )}
    </div>
  );
};

// Animated loading indicator for smoother transitions
const AnimatedLoadingIndicator: React.FC<{ 
  isVisible: boolean;
  timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night';
  reducedMotion?: boolean;
}> = ({ isVisible, timeOfDay = 'day', reducedMotion = false }) => {
  if (!isVisible) return null;
  
  // Select gradient based on time of day
  const getBgGradient = () => {
    switch(timeOfDay) {
      case 'dawn': return 'bg-gradient-to-b from-orange-300 via-pink-300 to-purple-400';
      case 'day': return 'bg-gradient-to-b from-blue-300 via-blue-400 to-blue-600';
      case 'dusk': return 'bg-gradient-to-b from-orange-400 via-red-400 to-purple-500';
      case 'night': return 'bg-gradient-to-b from-indigo-800 via-purple-900 to-black';
      default: return 'bg-gradient-to-b from-blue-300 via-blue-400 to-blue-600';
    }
  };

  return (
    <motion.div 
      className={`absolute inset-0 z-50 flex items-center justify-center ${getBgGradient()}`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-xl bg-black/20 backdrop-blur-md text-white flex flex-col items-center"
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path 
            d="M8 3L12 7M12 7L16 3M12 7V21" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ 
              duration: reducedMotion ? 0 : 1, 
              repeat: Infinity,
              repeatDelay: reducedMotion ? 1 : 0 
            }}
          />
        </svg>
        <motion.p 
          className="mt-3 text-sm font-medium"
          animate={{ opacity: reducedMotion ? 1 : [0.7, 1, 0.7] }}
          transition={{ 
            duration: reducedMotion ? 0 : 1.5, 
            repeat: reducedMotion ? 0 : Infinity 
          }}
        >
          Loading Terrain
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

// Simple error boundary for catching 3D loading/rendering errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("Error loading 3D mountain:", error);
    this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return null; // The parent will render the fallback
    }
    return this.props.children;
  }
}

export default MountainLoader;