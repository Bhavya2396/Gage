import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/layouts/MainLayout';
import { useActivityPoints } from '@/contexts/ActivityPointsContext';
import { getRecoveryColor } from '@/lib/utils';
import { Sun, Cloud, CloudRain, Snowflake, Award, Zap, Heart, Thermometer, Target, TrendingUp, Clock, Users } from 'lucide-react';

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
  
  // Simulate weather data
  useEffect(() => {
    const fetchWeather = async () => {
      const conditions = ['sunny', 'cloudy', 'rainy', 'snowy'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)] as 'sunny' | 'cloudy' | 'rainy' | 'snowy';
      const randomTemp = Math.floor(Math.random() * 30) + 5;
      
      setWeather({
        temp: randomTemp,
        condition: randomCondition
      });
    };
    
    fetchWeather();
  }, []);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const weatherIcons = {
    sunny: <Sun className="text-cyan-400" size={20} />,
    cloudy: <Cloud className="text-gray-400" size={20} />,
    rainy: <CloudRain className="text-teal-400" size={20} />,
    snowy: <Snowflake className="text-blue-300" size={20} />
  };

  return (
    <MainLayout isMountainFocused={isMountainFocused}>
      {/* Clean, minimal overlay content */}
      {showContent && (
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-6">
          {/* Top Section - Weather and Progress */}
          <div className="flex justify-between items-start">
            {/* Weather Display */}
            <motion.div 
              className="flex items-center space-x-3 bg-black/20 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="flex items-center space-x-2">
                {weatherIcons[weather.condition]}
                <div className="flex items-center space-x-1">
                  <Thermometer size={14} className="text-gray-300" />
                  <span className="text-white font-medium">{weather.temp}°C</span>
                </div>
              </div>
            </motion.div>

            {/* Progress Indicator */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <div className="w-16 h-16 relative">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#progressGradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${getProgressPercentage() * 2.51} 251`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00CCFF" />
                      <stop offset="100%" stopColor="#20B2AA" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{getProgressPercentage()}%</span>
                </div>
              </div>
              <p className="text-white/70 text-xs mt-1">Progress</p>
            </motion.div>
          </div>

          {/* Bottom Section - Clean Stats Display */}
          <motion.div 
            className="bg-black/20 backdrop-blur-md rounded-3xl p-6 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {/* Goal Display */}
            <div className="text-center mb-6">
              <motion.h1 
                className="text-2xl font-bold text-white mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                {activityPoints.goalName}
              </motion.h1>
              <p className="text-white/60 text-sm">Your fitness journey</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Recovery Score */}
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 relative">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="20"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="20"
                      stroke={getRecoveryColor(recoveryScore)}
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${recoveryScore * 1.26} 126`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{recoveryScore}</span>
                  </div>
                </div>
                <p className="text-white/70 text-xs">Recovery</p>
              </div>

              {/* Heart Rate */}
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <motion.div
                    className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Heart className="text-teal-400" size={16} />
                  </motion.div>
                </div>
                <p className="text-white font-bold text-sm">68</p>
                <p className="text-white/70 text-xs">BPM</p>
              </div>

              {/* Daily Load */}
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-t from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Zap className="text-white" size={16} />
                  </div>
                </div>
                <p className="text-white font-bold text-sm">340</p>
                <p className="text-white/70 text-xs">Load</p>
              </div>

              {/* Streak */}
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Target className="text-white" size={16} />
                  </div>
                </div>
                <p className="text-white font-bold text-sm">7</p>
                <p className="text-white/70 text-xs">Days</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-3">
              <motion.button
                className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-3 px-4 rounded-2xl font-medium text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Workout
              </motion.button>
              <motion.button
                className="flex-1 bg-white/10 backdrop-blur-md text-white py-3 px-4 rounded-2xl font-medium text-sm border border-white/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Stats
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </MainLayout>
  );
};

export default HomePage;