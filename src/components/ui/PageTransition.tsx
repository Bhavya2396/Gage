import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  pageTransition, 
  pageSlideLeft, 
  pageSlideUp,
  fadeIn,
  scaleIn
} from '@/design/animations';

interface PageTransitionProps {
  children: ReactNode;
  variant?: 'default' | 'slide' | 'slideUp' | 'scale' | 'none';
  duration?: number;
}

/**
 * PageTransition - Provides consistent page transition animations
 * Automatically selects appropriate animation based on route or override with variant prop
 */
const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  variant,
  duration = 0.3
}) => {
  const location = useLocation();
  
  // Determine animation based on route pattern if no variant is specified
  const getAnimationVariant = () => {
    // If variant is explicitly provided, use it
    if (variant === 'none') return null;
    if (variant === 'default') return fadeIn;
    if (variant === 'slide') return pageSlideLeft;
    if (variant === 'slideUp') return pageSlideUp;
    if (variant === 'scale') return scaleIn;
    
    // Otherwise, determine by route
    const path = location.pathname;
    
    if (path.includes('onboarding')) {
      return pageSlideLeft;
    } else if (path === '/workout' || path === '/workout-complete') {
      return pageSlideUp;
    } else if (path === '/food' || path === '/nutrition') {
      return scaleIn;
    } else if (path === '/health' || path === '/health/trends') {
      return pageSlideUp;
    } else if (path === '/friends') {
      return pageSlideLeft;
    } else {
      // Default animation for other routes
      return fadeIn;
    }
  };
  
  const animationVariant = getAnimationVariant();
  
  // If no animation is desired, just render children
  if (!animationVariant) {
    return <>{children}</>;
  }
  
  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={animationVariant}
      transition={{ 
        type: 'tween', 
        ease: 'easeInOut', 
        duration
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;