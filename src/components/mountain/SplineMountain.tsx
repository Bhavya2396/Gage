import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/useResponsive';

interface SplineMountainProps {
  progressPercentage?: number;
  className?: string;
  timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night';
  weatherCondition?: 'clear' | 'cloudy' | 'rainy' | 'snowy';
  ambientEffects?: boolean;
  interactive?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

/**
 * SplineMountain - A 3D mountain visualization using Spline
 * Features dynamic effects, responsive design, and atmospheric elements
 */
const SplineMountain: React.FC<SplineMountainProps> = ({
  progressPercentage = 0,
  className = '',
  timeOfDay = 'day',
  weatherCondition = 'clear',
  ambientEffects = true,
  interactive = false,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { isMobile } = useResponsive();
  
  // Handle Spline load
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };
  
  // Handle Spline error
  const handleError = (error: Error) => {
    setHasError(true);
    onError?.(error);
  };
  
  // Get background gradient based on time of day
  const getBackgroundGradient = () => {
    switch (timeOfDay) {
      case 'dawn':
        return 'from-amber-900/20 via-orange-800/10 to-sky-900/30';
      case 'day':
        return 'from-sky-900/30 via-blue-800/20 to-indigo-900/40';
      case 'dusk':
        return 'from-orange-900/30 via-red-800/20 to-purple-900/40';
      case 'night':
        return 'from-indigo-900/50 via-purple-900/30 to-slate-900/60';
      default:
        return 'from-sky-900/30 via-blue-800/20 to-indigo-900/40';
    }
  };
  
  // Get weather overlay based on condition
  const getWeatherOverlay = () => {
    if (!ambientEffects) return null;
    
    switch (weatherCondition) {
      case 'cloudy':
        return (
          <div className="absolute inset-0 pointer-events-none">
            <motion.div 
              className="absolute top-1/4 left-1/4 w-32 h-10 bg-white/20 rounded-full blur-md"
              animate={{ 
                x: [0, 20, 0],
                y: [0, -2, 0],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ repeat: Infinity, duration: 60, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute top-1/5 right-1/3 w-24 h-8 bg-white/15 rounded-full blur-md"
              animate={{ 
                x: [0, -15, 0],
                y: [0, 3, 0],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ repeat: Infinity, duration: 45, ease: "easeInOut" }}
            />
          </div>
        );
      case 'rainy':
        return (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-8 bg-cyan-400/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, 100],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1 + Math.random() * 0.5,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        );
      case 'snowy':
        return (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, 100],
                  x: [0, Math.random() * 20 - 10],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };
  
  // Loading fallback
  if (hasError) {
    return (
      <div className={cn(
        "w-full h-full flex items-center justify-center",
        className
      )}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center">
            <span className="text-2xl">🏔️</span>
          </div>
          <p className="text-sm text-gray-400">3D scene unavailable</p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={cn(
        "relative w-full h-full overflow-hidden",
        className
      )}
    >
      {/* Background gradient - adjusted for lower camera angle */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-b transition-colors duration-1000",
        getBackgroundGradient()
      )} 
      style={{
        background: 'linear-gradient(to bottom, rgba(135, 206, 235, 0.4) 0%, rgba(100, 149, 237, 0.3) 25%, rgba(25, 25, 112, 0.5) 100%)'
      }} />
      
      {/* Spline 3D Scene - Adjusted camera angle */}
      <div className="absolute inset-0 w-full h-full" style={{ perspective: '1000px' }}>
        <div 
          className="w-full h-full"
          style={{
            transform: 'scale(1.8) translateY(-10%) translateX(2%) rotateX(8deg) rotateY(-3deg)',
            transformOrigin: 'center center',
            transformStyle: 'preserve-3d'
          }}
        >
          <Spline
            scene="https://prod.spline.design/f-qFANpTJ4bTeNKt/scene.splinecode"
            onLoad={handleLoad}
            onError={handleError}
            style={{
              width: '100%',
              height: '100%',
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out'
            }}
          />
        </div>
      </div>
      
      {/* Loading indicator */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}
      
      {/* Weather effects overlay */}
      {getWeatherOverlay()}
      
      
      {/* Atmospheric fog/haze effect */}
      {ambientEffects && (timeOfDay === 'dawn' || timeOfDay === 'dusk') && (
        <div className="absolute inset-0 pointer-events-none opacity-15 z-10">
          <div 
            className={cn(
              "absolute inset-0 mix-blend-soft-light",
              timeOfDay === 'dawn' ? "bg-orange-200" : "bg-purple-200"
            )}
          />
        </div>
      )}
      
      {/* Subtle vignette effect */}
      {ambientEffects && (
        <div className="absolute inset-0 pointer-events-none opacity-40 z-5 bg-gradient-radial from-transparent to-black" />
      )}
    </div>
  );
};

export default SplineMountain;
