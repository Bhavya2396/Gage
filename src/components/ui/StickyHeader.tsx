import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ChevronDown, ChevronUp } from 'lucide-react';
import { useActivityPoints } from '@/contexts/ActivityPointsContext';

interface StickyHeaderProps {
  title?: string;
  showProgress?: boolean;
  className?: string;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({
  title,
  showProgress = true,
  className = '',
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { activityPoints, getProgressPercentage } = useActivityPoints();
  
  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Calculate progress
  const progressPercentage = getProgressPercentage();
  
  return (
    <AnimatePresence>
      {isScrolled && (
        <motion.div
          className={`fixed top-0 left-0 right-0 z-40 ${className}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop blur */}
          <div className="absolute inset-0 bg-bg-primary/50 backdrop-blur-md z-0"></div>
          
          {/* Content */}
          <div className="relative z-10 px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Title or logo */}
              <div className="flex items-center">
                {title && (
                  <h1 className="text-lg font-medium text-alpine-mist">{title}</h1>
                )}
              </div>
              
              {/* Progress indicator */}
              {showProgress && (
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <div className="flex items-center bg-glass-background px-3 py-1.5 rounded-full border border-glass-border shadow-sm">
                    <Award className="text-cyan-primary mr-2" size={16} />
                    <span className="text-sm font-medium text-alpine-mist">
                      {activityPoints.currentPoints} / {activityPoints.targetPoints}
                    </span>
                    {isExpanded ? (
                      <ChevronUp size={16} className="ml-1 text-alpine-mist/70" />
                    ) : (
                      <ChevronDown size={16} className="ml-1 text-alpine-mist/70" />
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Expanded details */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  className="mt-2 bg-glass-background bg-opacity-30 rounded-lg p-3"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-alpine-mist">Progress</span>
                    <span className="text-xs text-alpine-mist">{progressPercentage}%</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-glass-border rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-primary to-teal-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.8, type: 'spring' }}
                    />
                  </div>
                  
                  {/* Points breakdown */}
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-xs text-alpine-mist/70">Daily</div>
                      <div className="text-sm font-medium text-alpine-mist">+45</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-alpine-mist/70">Weekly</div>
                      <div className="text-sm font-medium text-alpine-mist">+210</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-alpine-mist/70">Remaining</div>
                      <div className="text-sm font-medium text-alpine-mist">{activityPoints.targetPoints - activityPoints.currentPoints}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Bottom border/shadow */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-glass-border to-transparent"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyHeader;
