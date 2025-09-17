import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  
  // Different animation variants for different route patterns
  const getAnimationVariant = () => {
    const path = location.pathname;
    
    if (path.includes('onboarding')) {
      return {
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -100 }
      };
    } else if (path === '/workout' || path === '/workout-complete') {
      return {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -50 }
      };
    } else if (path === '/food') {
      return {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.05 }
      };
    } else if (path === '/health' || path === '/health/trends') {
      return {
        initial: { opacity: 0, y: -50 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 50 }
      };
    } else if (path === '/friends') {
      return {
        initial: { opacity: 0, x: -100 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 100 }
      };
    } else {
      // Default animation for other routes
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      };
    }
  };
  
  const variant = getAnimationVariant();
  
  return (
    <motion.div
      key={location.pathname}
      initial={variant.initial}
      animate={variant.animate}
      exit={variant.exit}
      transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;




