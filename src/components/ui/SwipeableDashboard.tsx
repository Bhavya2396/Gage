import React, { useState, useRef, useEffect } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/useResponsive';
import GlassCard from './GlassCard';
import EnhancedDashboard from '../home/EnhancedDashboard';

interface SwipeableDashboardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlight' | 'frosted' | 'dark';
}

/**
 * Swipeable Dashboard component with horizontal swipe navigation
 * Features swipe gestures to navigate between different dashboard views
 */
const SwipeableDashboard: React.FC<SwipeableDashboardProps> = ({
  children,
  className,
  variant = 'default',
}) => {
  const [currentView, setCurrentView] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const { isMobile } = useResponsive();
  
  // Motion values for smooth animations
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.3, 1, 0.3]);
  
  // Dashboard views
  const views = [
    {
      id: 'main',
      title: 'Overview',
      content: children,
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      content: <EnhancedDashboard />,
    },
    {
      id: 'analytics',
      title: 'Analytics',
      content: (
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-ui-text-primary mb-4 text-shadow-strong">Analytics</h3>
          <p className="text-ui-text-secondary text-shadow-medium">Coming soon...</p>
        </div>
      ),
    },
    {
      id: 'insights',
      title: 'Insights',
      content: (
        <div className="p-6 text-center">
          <h3 className="text-lg font-semibold text-ui-text-primary mb-4 text-shadow-strong">Insights</h3>
          <p className="text-ui-text-secondary text-shadow-medium">AI-powered insights coming soon...</p>
        </div>
      ),
    },
  ];

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    
    const threshold = 80;
    const velocity = info.velocity.x;
    const offset = info.offset.x;
    
    // Determine direction and next view
    if (Math.abs(velocity) > 300 || Math.abs(offset) > threshold) {
      if (velocity > 0 || offset > threshold) {
        // Swipe right - go to previous view
        setCurrentView(prev => Math.max(0, prev - 1));
      } else if (velocity < 0 || offset < -threshold) {
        // Swipe left - go to next view
        setCurrentView(prev => Math.min(views.length - 1, prev + 1));
      }
    }
    
    // Reset position with smooth animation
    x.set(0);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const goToView = (index: number) => {
    setCurrentView(index);
  };

  // Keyboard navigation for desktop
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        setCurrentView(prev => Math.max(0, prev - 1));
      } else if (event.key === 'ArrowRight') {
        setCurrentView(prev => Math.min(views.length - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [views.length]);

  return (
    <div className={cn("w-full h-full", className)}>
      {/* Swipeable content area */}
      <motion.div
        className="relative w-full h-full overflow-hidden"
        drag={isMobile ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{ x }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          className="w-full h-full"
          animate={{ 
            x: -currentView * 100 + "%",
            opacity: isDragging ? opacity : 1 
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {views.map((view, index) => (
            <motion.div
              key={view.id}
              className="absolute top-0 left-0 w-full h-full"
              style={{ x: index * 100 + "%" }}
            >
              <GlassCard
                variant={variant}
                className="w-full h-full"
                noPadding={false}
                elevation={2}
              >
                {view.content}
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Navigation indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {views.map((view, index) => (
          <button
            key={index}
            onClick={() => goToView(index)}
            className={cn(
              "flex flex-col items-center space-y-1 transition-all duration-300",
              "hover:scale-105"
            )}
          >
            <div
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === currentView
                  ? "bg-primary-cyan-500 scale-125 shadow-lg shadow-primary-cyan-500/50"
                  : "bg-ui-text-muted/50 hover:bg-ui-text-muted/70"
              )}
            />
            <span
              className={cn(
                "text-xs transition-all duration-300",
                index === currentView
                  ? "text-primary-cyan-400 text-shadow-light"
                  : "text-ui-text-muted/70"
              )}
            >
              {view.title}
            </span>
          </button>
        ))}
      </div>

      {/* Swipe instruction for mobile */}
      {isMobile && (
        <motion.div
          className="absolute top-4 right-4 text-xs text-ui-text-muted text-shadow-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          ← Swipe to navigate →
        </motion.div>
      )}
    </div>
  );
};

export default SwipeableDashboard;
