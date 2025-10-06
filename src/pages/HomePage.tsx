import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/layouts/MainLayout';
import BottomCard from '@/components/ui/BottomCard';
import SwipeDashboard from '@/components/home/SwipeDashboard';
import StickyHeader from '@/components/ui/StickyHeader';
import { useActivityPoints } from '@/contexts/ActivityPointsContext';
import { getRecoveryColor } from '@/lib/utils';
import { Sun, Cloud, CloudRain, Snowflake, Award, Zap, Heart, Thermometer } from 'lucide-react';

// Mountain journey visualization - simplified version with no plotting
const MountainIndicators: React.FC = () => {
  // Empty component as plotting was requested to be removed
  return null;
};

// Progress indicator component removed as requested

const HomePage: React.FC = () => {
  const { activityPoints, getProgressPercentage } = useActivityPoints();
  const [isMountainFocused, setIsMountainFocused] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [weather, setWeather] = useState<{
    temp: number;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  }>({
    temp: 28,
    condition: 'sunny'
  });
  const [recoveryScore, setRecoveryScore] = useState(78);
  
  // In a real app, we would fetch weather data from an API
  useEffect(() => {
    // Simulate weather API call
    const fetchWeather = async () => {
      // This would be a real API call in a production app
      const conditions = ['sunny', 'cloudy', 'rainy', 'snowy'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)] as 'sunny' | 'cloudy' | 'rainy' | 'snowy';
      const randomTemp = Math.floor(Math.random() * 30) + 5; // 5-35°C
      
      setWeather({
        temp: randomTemp,
        condition: randomCondition
      });
    };
    
    fetchWeather();
  }, []);
  
  useEffect(() => {
    // Short delay to ensure mountain is rendered first
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const weatherIcons = {
    sunny: <Sun className="text-primary-cyan-500" size={20} />,
    cloudy: <Cloud className="text-ui-text-muted" size={20} />,
    rainy: <CloudRain className="text-primary-teal-500" size={20} />,
    snowy: <Snowflake className="text-ui-text-white" size={20} />
  };

  // Main card content
  const mainCardContent = (
    <>
      {/* Header - Always visible */}
      <div className="flex justify-between items-center pb-4">
        <div className="flex items-center">
          {/* Animated gradient bar */}
          <motion.div 
            className="bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 w-1.5 h-12 rounded-full mr-3 opacity-80"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 48, opacity: 0.8 }}
            transition={{ duration: 0.8 }}
          />
          <div>
            <span className="text-xs uppercase tracking-wider text-ui-text-muted font-medium text-shadow-medium">YOUR JOURNEY</span>
            <motion.h2 
              className="text-lg font-bold text-ui-text-primary leading-tight text-shadow-ultra"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {activityPoints.goalName}
            </motion.h2>
          </div>
        </div>
        
        {/* Enhanced weather display */}
        <motion.div 
          className="flex items-center bg-ui-card backdrop-blur-md px-3 py-2 rounded-lg shadow-card-light"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="relative">
            {/* Weather icon with animation */}
            <motion.div
              animate={{ 
                y: [0, -2, 0, 2, 0],
                rotate: weather.condition === 'cloudy' ? [0, 5, 0, -5, 0] : 0
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="text-primary-cyan-500"
            >
              {weatherIcons[weather.condition]}
            </motion.div>
            
            {/* Animated weather effects */}
            {weather.condition === 'rainy' && (
              <motion.div 
                className="absolute -bottom-1 left-0 w-full flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div 
                      key={i}
                      className="w-0.5 h-2 bg-primary-cyan-500 rounded-full"
                      animate={{ 
                        y: [0, 5],
                        opacity: [1, 0]
                      }}
                      transition={{ 
                        duration: 1, 
                        repeat: Infinity, 
                        delay: i * 0.2,
                        ease: "easeIn"
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="ml-2 flex items-center">
            <Thermometer size={12} className="text-ui-text-accent mr-1 opacity-80 text-shadow-medium" />
            <span className="text-ui-text-primary font-semibold text-base text-shadow-ultra">{weather.temp}°C</span>
          </div>
        </motion.div>
      </div>
      
      {/* Enhanced visual vitals row with animated components */}
      <div className="flex justify-between items-center mt-3 py-4 border-t border-b border-glass-border">
        {/* Recovery score - Animated gauge */}
        <div className="flex flex-col items-center px-2">
          <div className="relative flex items-center justify-center">
            <svg width="50" height="50" viewBox="0 0 100 100">
              {/* Gauge background */}
              <path 
                d="M 50,50 m -45,0 a 45,45 0 1,1 90,0" 
                fill="none" 
                stroke="rgba(255,255,255,0.1)" 
                strokeWidth="10"
                strokeLinecap="round"
              />
              
              {/* Gauge colored segments */}
              <path 
                d="M 50,50 m -45,0 a 45,45 0 0,1 90,0" 
                fill="none" 
                stroke="url(#recoveryGradient)" 
                strokeWidth="10"
                strokeDasharray={`${recoveryScore * 1.42} 142`}
                strokeLinecap="round"
              >
                <animate 
                  attributeName="stroke-dasharray" 
                  from="0 142" 
                  to={`${recoveryScore * 1.42} 142`} 
                  dur="1.2s" 
                  fill="freeze" 
                />
              </path>
              
              {/* Gauge needle */}
              <motion.line 
                x1="50" 
                y1="50" 
                x2="50" 
                y2="15" 
                stroke={getRecoveryColor(recoveryScore)}
                strokeWidth="2"
                initial={{ transform: 'rotate(0deg)' }}
                animate={{ transform: `rotate(${(recoveryScore * 1.8) - 90}deg)` }}
                transition={{ delay: 0.3, duration: 1.5, type: 'spring', stiffness: 50 }}
                style={{ transformOrigin: 'center center' }}
              />
              
              {/* Gauge center */}
              <circle cx="50" cy="50" r="5" fill={getRecoveryColor(recoveryScore)} />
              
              {/* Gradient definition */}
              <defs>
                <linearGradient id="recoveryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF4B4B" />
                  <stop offset="50%" stopColor="#FFDE59" />
                  <stop offset="100%" stopColor="#4ADE80" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Recovery score with animation */}
            <motion.div 
              className="absolute bottom-0 bg-glass-background px-2 py-0.5 rounded-full"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <span className="text-sm font-bold" style={{ color: getRecoveryColor(recoveryScore) }}>
                {recoveryScore}
              </span>
            </motion.div>
          </div>
          <span className="text-xs text-ui-text-muted mt-2">Recovery</span>
        </div>
        
        {/* Progress - Visual circle */}
        <div className="flex flex-col items-center px-2">
          <div className="relative w-10 h-10">
            <svg width="40" height="40" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#00CCFF" 
                strokeWidth="10" 
                strokeDasharray={`${getProgressPercentage() * 2.83} 283`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              >
                <animate 
                  attributeName="stroke-dasharray" 
                  from="0 283" 
                  to={`${getProgressPercentage() * 2.83} 283`} 
                  dur="1s" 
                  fill="freeze" 
                />
              </circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Award className="text-primary-cyan-500" size={16} />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-ui-text-primary mt-1 text-shadow-ultra">{getProgressPercentage()}%</span>
            <span className="text-xs text-ui-text-muted font-medium text-shadow-medium">Progress</span>
          </div>
        </div>
        
        {/* Heart rate - Animated pulse */}
        <div className="flex flex-col items-center px-2">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <motion.div
              className="absolute w-10 h-10 rounded-full bg-primary-teal-500/10"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <Heart className="text-primary-teal-500 z-10" size={20} />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-ui-text-primary mt-1 text-shadow-ultra">68</span>
            <span className="text-xs text-ui-text-muted font-medium text-shadow-medium">BPM</span>
          </div>
        </div>
        
        {/* Daily load - Visual bar */}
        <div className="flex flex-col items-center px-2">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-6 bg-glass-background rounded-sm overflow-hidden flex flex-col-reverse">
                <motion.div 
                  className="w-full bg-gradient-to-t from-primary-cyan-500 to-primary-teal-500"
                  initial={{ height: 0 }}
                  animate={{ height: '70%' }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </div>
              <Zap className="text-primary-cyan-500 absolute" size={14} />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-ui-text-primary mt-1 text-shadow-ultra">340</span>
            <span className="text-xs text-ui-text-muted font-medium text-shadow-medium">Load</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <MainLayout isMountainFocused={isMountainFocused}>
      {/* Mountain location indicators - only show after delay */}
      {showContent && <MountainIndicators />}
      
      {/* Progress indicator removed as requested */}
      
      {/* Swipe-based dashboard */}
      {showContent && (
        <div className="fixed bottom-0 left-0 right-0 z-30">
          <SwipeDashboard />
        </div>
      )}
    </MainLayout>
  );
};

export default HomePage;