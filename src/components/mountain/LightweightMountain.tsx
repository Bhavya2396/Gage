import React from 'react';
import { motion } from 'framer-motion';

interface LightweightMountainProps {
  progressPercentage?: number;
  blurred?: boolean;
  className?: string;
  timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night';
}

const LightweightMountain: React.FC<LightweightMountainProps> = ({
  progressPercentage = 0,
  blurred = false,
  className = '',
  timeOfDay = 'day'
}) => {
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

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${getBackgroundGradient()}`} />
      
      {/* Simple mountain silhouette using CSS */}
      <div className="absolute inset-0 flex items-end justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative w-full h-3/4"
        >
          {/* Mountain layers for depth */}
          <div className="absolute bottom-0 left-0 w-full h-full">
            {/* Back mountain */}
            <div 
              className="absolute bottom-0 left-1/4 w-1/2 h-5/6 opacity-60"
              style={{
                background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
                clipPath: 'polygon(0% 100%, 20% 30%, 40% 40%, 60% 20%, 80% 35%, 100% 100%)'
              }}
            />
            
            {/* Main mountain */}
            <div 
              className="absolute bottom-0 left-1/3 w-1/3 h-full opacity-80"
              style={{
                background: 'linear-gradient(135deg, #4b5563 0%, #374151 100%)',
                clipPath: 'polygon(0% 100%, 30% 40%, 50% 10%, 70% 35%, 100% 100%)'
              }}
            />
            
            {/* Front mountain */}
            <div 
              className="absolute bottom-0 left-2/5 w-1/5 h-4/5"
              style={{
                background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                clipPath: 'polygon(0% 100%, 40% 30%, 60% 15%, 80% 40%, 100% 100%)'
              }}
            />
          </div>
          
          {/* Progress indicator if provided */}
          {progressPercentage > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <div className="w-4 h-4 bg-accent-primary rounded-full shadow-lg animate-pulse" />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium">
                {Math.round(progressPercentage)}%
              </div>
            </motion.div>
          )}
          
          {/* Simple stars for night mode */}
          {timeOfDay === 'night' && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 50}%`,
                    animationDelay: `${Math.random() * 3}s`
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Blur overlay if needed */}
      {blurred && (
        <div className="absolute inset-0 backdrop-blur-sm bg-black/20" />
      )}
    </div>
  );
};

export default LightweightMountain;
