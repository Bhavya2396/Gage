import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/layouts/MainLayout';
import { useActivityPoints } from '@/contexts/ActivityPointsContext';
import { getRecoveryColor } from '@/lib/utils';
import { 
  Heart, 
  Zap, 
  Target, 
  TrendingUp, 
  Play, 
  BarChart3, 
  Thermometer, 
  Sun,
  Cloud,
  CloudRain,
  Snowflake
} from 'lucide-react';

const HomePage: React.FC = () => {
  const { activityPoints, getProgressPercentage } = useActivityPoints();
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
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const weatherIcons = {
    sunny: <Sun className="text-yellow-400" size={16} />,
    cloudy: <Cloud className="text-gray-400" size={16} />,
    rainy: <CloudRain className="text-blue-400" size={16} />,
    snowy: <Snowflake className="text-blue-300" size={16} />
  };

  return (
    <MainLayout>
      {showContent && (
        <div className="absolute inset-0 z-10 overflow-hidden">
          {/* Floating Cards positioned around the mountain */}
          
          {/* Top Left - Weather Card */}
          <motion.div
            className="absolute top-8 left-8 w-20 h-20 bg-black/30 backdrop-blur-lg rounded-2xl border border-white/20 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            {weatherIcons[weather.condition]}
            <span className="text-white font-bold text-sm mt-1">{weather.temp}°</span>
          </motion.div>

          {/* Top Right - Progress Card */}
          <motion.div
            className="absolute top-8 right-8 w-20 h-20 bg-black/30 backdrop-blur-lg rounded-2xl border border-white/20 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="w-8 h-8 relative">
              <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="6"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  stroke="url(#progressGradient)"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${getProgressPercentage() * 2.2} 220`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00CCFF" />
                    <stop offset="100%" stopColor="#20B2AA" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="text-white font-bold text-xs mt-1">{getProgressPercentage()}%</span>
          </motion.div>

          {/* Left Side - Recovery Card */}
          <motion.div
            className="absolute left-8 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-black/30 backdrop-blur-lg rounded-2xl border border-white/20 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0, x: -50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.8, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05, x: -5 }}
          >
            <Heart className="text-green-400" size={20} />
            <span className="text-white font-bold text-xs mt-1">{recoveryScore}</span>
          </motion.div>

          {/* Right Side - Heart Rate Card */}
          <motion.div
            className="absolute right-8 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-black/30 backdrop-blur-lg rounded-2xl border border-white/20 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.8, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05, x: 5 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Heart className="text-red-400" size={20} />
            </motion.div>
            <span className="text-white font-bold text-xs mt-1">68</span>
          </motion.div>

          {/* Bottom Left - Load Card */}
          <motion.div
            className="absolute bottom-32 left-8 w-16 h-16 bg-black/30 backdrop-blur-lg rounded-2xl border border-white/20 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05, y: 5 }}
          >
            <Zap className="text-yellow-400" size={20} />
            <span className="text-white font-bold text-xs mt-1">340</span>
          </motion.div>

          {/* Bottom Right - Streak Card */}
          <motion.div
            className="absolute bottom-32 right-8 w-16 h-16 bg-black/30 backdrop-blur-lg rounded-2xl border border-white/20 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05, y: 5 }}
          >
            <Target className="text-orange-400" size={20} />
            <span className="text-white font-bold text-xs mt-1">7</span>
          </motion.div>

          {/* Center Bottom - Main Action Card */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-80 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/30 p-6"
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.7, duration: 1, type: "spring", stiffness: 150 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            {/* Goal Display */}
            <div className="text-center mb-6">
              <motion.h1 
                className="text-xl font-bold text-white mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.5 }}
              >
                {activityPoints.goalName}
              </motion.h1>
              <p className="text-white/60 text-sm">Your fitness journey</p>
            </div>

            {/* Quick Stats Row */}
            <div className="flex justify-center space-x-6 mb-6">
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1 flex items-center justify-center">
                  <Heart className="text-green-400" size={16} />
                </div>
                <span className="text-white font-bold text-sm">{recoveryScore}</span>
                <p className="text-white/60 text-xs">Recovery</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1 flex items-center justify-center">
                  <TrendingUp className="text-cyan-400" size={16} />
                </div>
                <span className="text-white font-bold text-sm">{getProgressPercentage()}%</span>
                <p className="text-white/60 text-xs">Progress</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1 flex items-center justify-center">
                  <Zap className="text-yellow-400" size={16} />
                </div>
                <span className="text-white font-bold text-sm">340</span>
                <p className="text-white/60 text-xs">Load</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <motion.button
                className="flex-1 bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-3 px-4 rounded-2xl font-medium text-sm flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play size={16} />
                <span>Start Workout</span>
              </motion.button>
              <motion.button
                className="flex-1 bg-white/10 backdrop-blur-md text-white py-3 px-4 rounded-2xl font-medium text-sm flex items-center justify-center space-x-2 border border-white/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <BarChart3 size={16} />
                <span>View Stats</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </MainLayout>
  );
};

export default HomePage;