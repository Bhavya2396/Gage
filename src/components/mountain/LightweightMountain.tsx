import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { colors } from '@/design/tokens';
import { fadeIn, cloudAnimation, rainAnimation } from '@/design/animations';
import { useResponsive } from '@/hooks/useResponsive';

interface LightweightMountainProps {
  progressPercentage?: number;
  blurred?: boolean;
  className?: string;
  timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night';
  weatherCondition?: 'clear' | 'cloudy' | 'rainy' | 'snowy';
  ambientEffects?: boolean;
}

/**
 * Enhanced LightweightMountain - A simplified, yet visually rich mountain visualization
 * Features dynamic effects, responsive animations, and atmospheric elements
 */
const LightweightMountain: React.FC<LightweightMountainProps> = ({
  progressPercentage = 0,
  blurred = false,
  className = '',
  timeOfDay = 'day',
  weatherCondition = 'clear',
  ambientEffects = true,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useResponsive();
  
  // Dynamic lighting effect
  const [lightPosition, setLightPosition] = useState({ x: 50, y: 30 });
  
  // Motion values for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Update light position for day/night cycle
  useEffect(() => {
    let position = { x: 50, y: 30 }; // Default position
    
    switch(timeOfDay) {
      case 'dawn':
        position = { x: 20, y: 20 };
        break;
      case 'day':
        position = { x: 50, y: 10 };
        break;
      case 'dusk':
        position = { x: 80, y: 20 };
        break;
      case 'night':
        position = { x: 50, y: -10 }; // Light from above (moon)
        break;
    }
    
    setLightPosition(position);
  }, [timeOfDay]);
  
  // Handle mouse move for interactive lighting
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !ambientEffects) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Limit movement range for subtle effect
    const limitedX = 50 + (x - 50) * 0.1;
    const limitedY = 30 + (y - 30) * 0.1;
    
    setMousePosition({ x, y });
    mouseX.set(x - 50);
    mouseY.set(y - 50);
    
    // Only update light position during day and dusk
    if (timeOfDay === 'day' || timeOfDay === 'dusk') {
      setLightPosition({ x: limitedX, y: limitedY });
    }
  };
  
  // Simple gradient backgrounds based on time of day
  const getBackgroundGradient = () => {
    switch (timeOfDay) {
      case 'dawn':
        return 'from-orange-300 via-pink-300 to-purple-400';
      case 'day':
        return 'from-blue-300 via-blue-400 to-blue-600';
      case 'dusk':
        return 'from-orange-400 via-red-400 to-purple-500';
      case 'night':
        return 'from-indigo-800 via-purple-900 to-black';
      default:
        return 'from-blue-300 via-blue-400 to-blue-600';
    }
  };
  
  // Get mountain colors based on time of day with lighting effect
  const getMountainColors = () => {
    let lightFactor = 1.0;
    let lightAngle = 135; // Default light angle
    
    // Adjust lighting based on time of day
    switch (timeOfDay) {
      case 'dawn':
        lightFactor = 0.8;
        lightAngle = 110;
        break;
      case 'day':
        lightFactor = 1.0;
        lightAngle = 135;
        break;
      case 'dusk':
        lightFactor = 0.85;
        lightAngle = 160;
        break;
      case 'night':
        lightFactor = 0.5;
        lightAngle = 135;
        break;
    }
    
    return {
      back: `linear-gradient(${lightAngle}deg, rgba(75, 85, 99, ${lightFactor}) 0%, rgba(31, 41, 55, ${lightFactor}) 100%)`,
      main: `linear-gradient(${lightAngle}deg, rgba(107, 114, 128, ${lightFactor}) 0%, rgba(55, 65, 81, ${lightFactor}) 100%)`,
      front: `linear-gradient(${lightAngle}deg, rgba(156, 163, 175, ${lightFactor}) 0%, rgba(75, 85, 99, ${lightFactor}) 100%)`,
    };
  };
  
  const mountainColors = getMountainColors();

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden",
        className
      )}
      onMouseMove={ambientEffects ? handleMouseMove : undefined}
    >
      {/* Background gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-b transition-colors duration-1000",
        getBackgroundGradient()
      )} />
      
      {/* Dynamic lighting effect - subtle radial gradient that follows mouse or sun position */}
      {ambientEffects && (
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none transition-opacity duration-500"
          style={{
            background: timeOfDay === 'night' 
              ? `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 60%)` 
              : `radial-gradient(circle at ${lightPosition.x}% ${lightPosition.y}%, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0) 60%)`
          }}
        />
      )}
      
      {/* Weather effects based on condition */}
      {weatherCondition === 'cloudy' && (
        <div className="absolute inset-0 z-10">
          {/* Multiple cloud layers with different speeds */}
          {ambientEffects ? (
            <>
              <motion.div 
                className="absolute left-1/4 top-1/4 w-32 h-10 bg-white opacity-40 rounded-full blur-md"
                animate={{ 
                  x: [0, 20, 0],
                  y: [0, -2, 0],
                }}
                transition={{ repeat: Infinity, duration: 60, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute right-1/3 top-1/5 w-24 h-8 bg-white opacity-30 rounded-full blur-md"
                animate={{ 
                  x: [0, -15, 0],
                  y: [0, 3, 0],
                }}
                transition={{ repeat: Infinity, duration: 45, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute left-1/2 top-2/5 w-40 h-12 bg-white opacity-20 rounded-full blur-md"
                animate={{ 
                  x: [0, 10, 0],
                  y: [0, -4, 0],
                }}
                transition={{ repeat: Infinity, duration: 75, ease: "easeInOut" }}
              />
            </>
          ) : (
            <>
              <div className="absolute left-1/4 top-1/4 w-32 h-10 bg-white rounded-full opacity-40 blur-md" />
              <div className="absolute right-1/3 top-1/5 w-24 h-8 bg-white rounded-full opacity-30 blur-md" />
              <div className="absolute left-1/2 top-2/5 w-40 h-12 bg-white rounded-full opacity-20 blur-md" />
            </>
          )}
        </div>
      )}
      
      {weatherCondition === 'rainy' && ambientEffects && (
        <div className="absolute inset-0 z-10">
          {/* Rain drops with animation */}
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-10 bg-white opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                height: `${5 + Math.random() * 15}px`,
              }}
              animate={{
                y: ['0%', '1000%'],
                opacity: [0.3, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 0.7 + Math.random() * 0.5,
                delay: Math.random() * 2,
                ease: "linear"
              }}
            />
          ))}
          
          {/* Subtle cloud overlay */}
          <div className="absolute inset-0 bg-gray-500/10" />
        </div>
      )}
      
      {weatherCondition === 'snowy' && ambientEffects && (
        <div className="absolute inset-0 z-10">
          {/* Snowflakes with realistic motion */}
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-5px`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
              }}
              animate={{
                y: ['0%', '1000%'],
                x: [
                  `${Math.random() * 10 - 5}px`,
                  `${Math.random() * 20 - 10}px`,
                  `${Math.random() * 10 - 5}px`
                ],
                rotate: [0, 180, 360]
              }}
              transition={{
                repeat: Infinity,
                duration: 3 + Math.random() * 5,
                delay: Math.random() * 3,
                ease: "linear"
              }}
            />
          ))}
          
          {/* Subtle fog overlay */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[0.5px]" />
        </div>
      )}
      
      {/* Mountain silhouettes with parallax effect */}
      <div className="absolute inset-0 flex items-end justify-center">
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="relative w-full h-3/4"
        >
          {/* Mountain layers with parallax movement */}
          <div className="absolute bottom-0 left-0 w-full h-full">
            {/* Back mountain */}
            <motion.div 
              className="absolute bottom-0 left-1/4 w-1/2 h-5/6 opacity-60 transition-all duration-1000"
              style={{
                background: mountainColors.back,
                clipPath: 'polygon(0% 100%, 20% 30%, 40% 40%, 60% 20%, 80% 35%, 100% 100%)',
                x: ambientEffects && !isMobile ? mouseX.get() * -0.02 : 0,
                y: ambientEffects && !isMobile ? mouseY.get() * -0.01 : 0,
              }}
            />
            
            {/* Main mountain */}
            <motion.div 
              className="absolute bottom-0 left-1/3 w-1/3 h-full opacity-80 transition-all duration-1000"
              style={{
                background: mountainColors.main,
                clipPath: 'polygon(0% 100%, 30% 40%, 50% 10%, 70% 35%, 100% 100%)',
                x: ambientEffects && !isMobile ? mouseX.get() * -0.01 : 0,
                y: ambientEffects && !isMobile ? mouseY.get() * -0.005 : 0,
              }}
            />
            
            {/* Front mountain */}
            <div 
              className="absolute bottom-0 left-2/5 w-1/5 h-4/5 transition-all duration-1000"
              style={{
                background: mountainColors.front,
                clipPath: 'polygon(0% 100%, 40% 30%, 60% 15%, 80% 40%, 100% 100%)',
              }}
            />
          </div>
          
          {/* Progress indicator with enhanced visuals */}
          {progressPercentage > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            >
              {/* Glowing outer ring */}
              <motion.div
                className="absolute -inset-1 rounded-full opacity-50"
                style={{ 
                  background: `radial-gradient(circle, ${colors.primary.cyan[300]} 0%, transparent 70%)` 
                }}
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut"
                }}
              />
              
              {/* Inner pulse indicator */}
              <motion.div 
                className="w-4 h-4 rounded-full shadow-lg"
                style={{ 
                  backgroundColor: colors.primary.cyan[500],
                  boxShadow: `0 0 10px ${colors.primary.cyan[400]}, 0 0 5px ${colors.primary.cyan[300]}` 
                }}
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
              
              {/* Progress percentage */}
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-glass-backgroundDark backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-medium border border-glass-border shadow-lg"
              >
                {Math.round(progressPercentage)}%
              </motion.div>
            </motion.div>
          )}
          
          {/* Simple stars for night mode with subtle twinkle effect */}
          {timeOfDay === 'night' && ambientEffects && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 50 }).map((_, i) => {
                const size = 0.5 + Math.random() * 1.5;
                return (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 50}%`,
                      width: `${size}px`,
                      height: `${size}px`,
                      backgroundColor: i % 5 === 0 ? '#E0E5ED' : '#FFFFFF',
                    }}
                    animate={{
                      opacity: [0.3, 0.8, 0.3],
                      scale: i % 7 === 0 ? [1, 1.3, 1] : 1
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2 + Math.random() * 4,
                      delay: Math.random() * 2,
                      ease: "easeInOut"
                    }}
                  />
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
      
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
      
      {/* Subtle noise texture for visual richness */}
      {ambientEffects && (
        <div 
          className="absolute inset-0 mix-blend-soft-light opacity-[0.03] pointer-events-none z-5" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }} 
        />
      )}
      
      {/* Blur overlay removed */}
    </div>
  );
};

export default LightweightMountain;