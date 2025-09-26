import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { useActivityPoints } from '@/contexts/ActivityPointsContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { fadeInDown, fadeIn } from '@/design/animations';
import { Progress } from '@/design/components';
import { useResponsive } from '@/hooks/useResponsive';

interface StickyHeaderProps {
  title?: string;
  showProgress?: boolean;
  className?: string;
  showBackButton?: boolean;
  backPath?: string;
  onBackClick?: () => void;
  rightContent?: React.ReactNode;
  transparent?: boolean;
}

/**
 * StickyHeader - Appears when scrolling down the page
 * Can show title, progress, and navigation controls
 */
const StickyHeader: React.FC<StickyHeaderProps> = ({
  title,
  showProgress = true,
  className = '',
  showBackButton = false,
  backPath = '/',
  onBackClick,
  rightContent,
  transparent = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { activityPoints, getProgressPercentage } = useActivityPoints();
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  
  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle back button click
  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(backPath);
    }
  };
  
  // Calculate progress
  const progressPercentage = getProgressPercentage();
  
  return (
    <AnimatePresence>
      {isScrolled && (
        <motion.div
          className={cn(
            'fixed top-0 left-0 right-0 z-40',
            className
          )}
          variants={fadeInDown}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Backdrop blur */}
          {!transparent && (
            <div className="absolute inset-0 bg-bg-primary/50 backdrop-blur-md z-0"></div>
          )}
          
          {/* Content */}
          <div className="relative z-10 px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Left side - Title and back button */}
              <div className="flex items-center">
                {showBackButton && (
                  <button
                    onClick={handleBackClick}
                    className="mr-3 p-1.5 rounded-full bg-glass-background border border-glass-border text-alpine-mist"
                  >
                    <ArrowLeft size={isMobile ? 16 : 18} />
                  </button>
                )}
                
                {title && (
                  <h1 className="text-lg font-medium text-alpine-mist truncate max-w-[200px]">
                    {title}
                  </h1>
                )}
              </div>
              
              {/* Right side - Progress or custom content */}
              {rightContent ? (
                rightContent
              ) : (
                showProgress && (
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    <motion.div 
                      className="flex items-center bg-glass-background px-3 py-1.5 rounded-full border border-glass-border shadow-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Award className="text-primary-cyan mr-2" size={16} />
                      <span className="text-sm font-medium text-alpine-mist">
                        {activityPoints.currentPoints} / {activityPoints.totalPointsRequired}
                      </span>
                      {isExpanded ? (
                        <ChevronUp size={16} className="ml-1 text-alpine-mist/70" />
                      ) : (
                        <ChevronDown size={16} className="ml-1 text-alpine-mist/70" />
                      )}
                    </motion.div>
                  </div>
                )
              )}
            </div>
            
            {/* Expanded details */}
            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.div
                  className="mt-2 bg-glass-background backdrop-blur-md rounded-lg p-3 border border-glass-border"
                  variants={fadeIn}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-alpine-mist">Progress to Summit</span>
                    <span className="text-xs font-medium text-alpine-mist">{progressPercentage}%</span>
                  </div>
                  
                  {/* Progress bar */}
                  <Progress 
                    value={progressPercentage} 
                    size="md"
                    variant="line"
                    colorByValue
                  />
                  
                  {/* Points breakdown */}
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <ProgressStat label="Daily" value="+45" />
                    <ProgressStat label="Weekly" value="+210" />
                    <ProgressStat 
                      label="Remaining" 
                      value={activityPoints.totalPointsRequired - activityPoints.currentPoints} 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Bottom border/shadow */}
            {!transparent && (
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-glass-border to-transparent"></div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper component for stats
const ProgressStat = ({ label, value }: { label: string, value: string | number }) => (
  <div className="text-center">
    <div className="text-xs text-alpine-mist/70">{label}</div>
    <div className="text-sm font-medium text-alpine-mist">{value}</div>
  </div>
);

export default StickyHeader;