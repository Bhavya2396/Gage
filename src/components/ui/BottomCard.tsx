import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate, useTransform } from 'framer-motion';
import { ChevronUp, ChevronDown, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/useResponsive';
import { fadeInUp } from '@/design/animations';
import { shadows } from '@/design/tokens';
import GlassCard from './GlassCard';

interface BottomCardProps {
  children: React.ReactNode;
  expandedContent?: React.ReactNode;
  className?: string;
  initialExpanded?: boolean;
  maxHeight?: string | number;
  draggable?: boolean;
  onDragEnd?: (isExpanded: boolean) => void;
  hideExpandIndicator?: boolean;
  variant?: 'default' | 'highlight' | 'frosted' | 'dark';
  onExpand?: (isExpanded: boolean) => void;
  title?: string;
  showFullScreenOption?: boolean;
  borderHighlight?: boolean;
  noise?: boolean;
}

/**
 * Enhanced BottomCard component with improved interactions
 * Features drag gestures, spring animations, and visual enhancements
 */
const BottomCard: React.FC<BottomCardProps> = ({
  children,
  expandedContent,
  className,
  initialExpanded = false,
  maxHeight,
  draggable = false,
  onDragEnd,
  hideExpandIndicator = false,
  variant = 'default',
  onExpand,
  title,
  showFullScreenOption = false,
  borderHighlight = true,
  noise = true,
}) => {
  // State
  const [expanded, setExpanded] = useState(initialExpanded);
  const [fullScreen, setFullScreen] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { isMobile } = useResponsive();
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for smooth animations
  const dragY = useMotionValue(0);
  const dragYProgress = useMotionValue(0);
  const smoothDragProgress = useSpring(dragYProgress, { 
    stiffness: 400, 
    damping: 30 
  });
  
  // Transform drag progress to visual cues
  const dragOpacity = useTransform(
    smoothDragProgress,
    [-0.5, 0, 0.5],
    [0.4, 1, 0.4]
  );
  
  const dragScale = useTransform(
    smoothDragProgress,
    [-0.8, 0, 0.8],
    [0.95, 1, 0.95]
  );
  
  const dragHeight = useTransform(
    smoothDragProgress,
    [-1, 0, 1],
    expanded ? ['90%', '100%', '40%'] : ['100%', '100%', '80%']
  );
  
  const dragShadow = useMotionTemplate`0 ${expanded ? -10 : 10}px 30px rgba(0,0,0,${
    useTransform(smoothDragProgress, [-1, 0, 1], [0.05, 0.1, 0.2])
  })`;
  
  // Calculate the appropriate max height for the expanded content
  const getMaxHeight = () => {
    if (fullScreen) return '100vh';
    if (maxHeight) return maxHeight;
    return isMobile ? 'calc(70vh - 120px)' : 'calc(80vh - 120px)';
  };
  
  // Toggle expanded state
  const toggleExpanded = () => {
    const newState = !expanded;
    setExpanded(newState);
    
    if (onExpand) {
      onExpand(newState);
    }
    
    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(5);
    }
  };
  
  // Toggle full screen
  const toggleFullScreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFullScreen(!fullScreen);
    
    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };
  
  // Handle drag state updates
  const updateDragProgress = (y: number) => {
    // Convert drag distance to progress value (-1 to 1)
    const height = cardRef.current?.clientHeight || 300;
    const progress = Math.max(Math.min(y / (height * 0.4), 1), -1);
    
    dragYProgress.set(progress);
    setDragProgress(progress);
  };
  
  // Handle keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleExpanded();
    } else if (e.key === 'Escape' && expanded) {
      setExpanded(false);
      if (onExpand) onExpand(false);
    }
  };
  
  // Effect for applying overflow styles to body when in fullscreen
  useEffect(() => {
    if (fullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [fullScreen]);

  return (
    <motion.div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-20 px-4 sm:px-6 pb-6 sm:pb-8",
        fullScreen && "inset-0 p-0",
      )}
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ paddingBottom: fullScreen ? 0 : undefined }}
    >
      <motion.div
        ref={cardRef}
        layout
        className={cn(
          "w-full mx-auto transition-all",
          !fullScreen && "max-w-2xl",
          className
        )}
        style={{
          height: isDragging ? dragHeight : undefined,
          scale: isDragging ? dragScale : 1,
          opacity: isDragging ? dragOpacity : 1,
          boxShadow: isDragging ? dragShadow : undefined,
        }}
        drag={draggable ? "y" : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDrag={(_, info) => updateDragProgress(info.offset.y)}
        onDragEnd={(_, info) => {
          setIsDragging(false);
          dragY.set(0);
          dragYProgress.set(0);
          
          if (onDragEnd) {
            const shouldExpand = info.offset.y < -20;
            const shouldCollapse = info.offset.y > 20;
            
            if (shouldExpand && !expanded) {
              setExpanded(true);
              onDragEnd(true);
            } else if (shouldCollapse && expanded) {
              setExpanded(false);
              onDragEnd(false);
            }
          }
        }}
      >
        <GlassCard
          variant={variant}
          className={cn(
            "w-full transition-all duration-300 backdrop-blur-md relative",
            expanded ? "rounded-xl" : "rounded-t-xl",
            fullScreen && "h-full rounded-none",
            "border-0"
          )}
          noPadding={false}
          borderHighlight={borderHighlight}
          noise={noise}
          elevation={3}
          glow={expanded}
          glowIntensity="subtle"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-expanded={expanded}
          overflow="hidden"
          tilt={false}
          onClick={!draggable ? toggleExpanded : undefined}
          interactive={!draggable}
        >
          {/* Drag handle indicator with pulse animation */}
          {!fullScreen && (
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
              <motion.div 
                className="w-10 h-1 bg-glass-border rounded-full opacity-50"
                animate={{ 
                  opacity: [0.3, 0.7, 0.3],
                  width: !draggable && !expanded ? ["30px", "40px", "30px"] : "40px"
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  repeatType: "mirror"
                }}
              />
            </div>
          )}
          
          {/* Title bar - only shown if title is provided */}
          {title && (
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
              <h3 className="text-sm font-medium text-alpine-mist">{title}</h3>
              
              {showFullScreenOption && (
                <button
                  className="p-1.5 rounded-md hover:bg-glass-active transition-colors"
                  onClick={toggleFullScreen}
                  aria-label={fullScreen ? "Exit full screen" : "Enter full screen"}
                >
                  {fullScreen ? (
                    <Minimize2 size={16} className="text-alpine-mist" />
                  ) : (
                    <Maximize2 size={16} className="text-alpine-mist" />
                  )}
                </button>
              )}
            </div>
          )}
          
          {/* Main content - Always visible */}
          <div className={cn("px-4 pt-6", title && "pt-2")}>
            {children}
          </div>
          
          {/* Expand/collapse indicator */}
          {expandedContent && !hideExpandIndicator && !fullScreen && (
            <div className="px-4 mt-4 flex justify-center items-center">
              <motion.div 
                className="flex items-center text-primary-cyan-500"
                animate={{ 
                  y: expanded ? [0, 3, 0] : [0, -3, 0]
                }}
                transition={{ repeat: Infinity, duration: 2, repeatType: "mirror" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={draggable ? toggleExpanded : undefined}
              >
                {expanded ? (
                  <>
                    <ChevronDown size={18} />
                    <span className="text-sm ml-1.5 font-medium">Collapse</span>
                  </>
                ) : (
                  <>
                    <ChevronUp size={18} />
                    <span className="text-sm ml-1.5 font-medium">Show more</span>
                  </>
                )}
              </motion.div>
            </div>
          )}
          
          {/* Expanded content */}
          {expandedContent && (
            <AnimatePresence mode="wait">
              {(expanded || fullScreen) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="px-4 mt-5 pb-4 overflow-auto scrollbar-thin scrollbar-thumb-glass-border scrollbar-track-transparent"
                  style={{ 
                    maxHeight: getMaxHeight(),
                    height: fullScreen ? 'calc(100vh - 200px)' : undefined 
                  }}
                >
                  {expandedContent}
                </motion.div>
              )}
            </AnimatePresence>
          )}
          
          {/* Drag gesture visual indicator */}
          {draggable && isDragging && (
            <motion.div 
              className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-xs text-alpine-mist/70">
                {dragProgress < -0.3 ? (
                  expanded ? 'Release to snap' : 'Release to expand'
                ) : dragProgress > 0.3 ? (
                  expanded ? 'Release to collapse' : 'Release to dismiss'
                ) : (
                  'Drag to adjust'
                )}
              </div>
            </motion.div>
          )}
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default BottomCard;