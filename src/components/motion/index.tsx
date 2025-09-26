import React, { ReactNode, forwardRef } from 'react';
import { motion, useReducedMotion, MotionProps, Variants } from 'framer-motion';
import { useAnimation } from '@/contexts/AnimationContext';
import { fadeIn, fadeInUp, scaleIn } from '@/design/animations';

// Common properties shared across all motion components
interface BaseMotionProps extends MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  as?: React.ElementType;
  noAnimation?: boolean;
}

// Fade animation component
interface FadeProps extends BaseMotionProps {
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
}

/**
 * Fade - Component for consistent fade animations
 * Uses the app's animation context for reduced motion and timing
 */
export const Fade = forwardRef<HTMLDivElement, FadeProps>(({
  children,
  className,
  delay = 0,
  duration,
  direction = 'none',
  distance = 20,
  as = 'div',
  noAnimation = false,
  ...props
}, ref) => {
  const { isReducedMotion, globalAnimationSpeed } = useAnimation();
  const shouldReduceMotion = useReducedMotion() || isReducedMotion;
  
  // Select the appropriate animation variant
  let variants: Variants;
  if (shouldReduceMotion || noAnimation) {
    variants = {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 }
    };
  } else {
    switch (direction) {
      case 'up':
        variants = {
          initial: { opacity: 0, y: distance },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: distance / 2 }
        };
        break;
      case 'down':
        variants = {
          initial: { opacity: 0, y: -distance },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -distance / 2 }
        };
        break;
      case 'left':
        variants = {
          initial: { opacity: 0, x: distance },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: distance / 2 }
        };
        break;
      case 'right':
        variants = {
          initial: { opacity: 0, x: -distance },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -distance / 2 }
        };
        break;
      default:
        variants = {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 }
        };
    }
  }
  
  // Calculate adjusted duration based on global speed
  const adjustedDuration = duration !== undefined 
    ? duration / globalAnimationSpeed 
    : undefined;
  
  // Create component with appropriate HTML element
  const Component = motion[as as keyof typeof motion];
  
  return (
    <Component
      ref={ref}
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ 
        duration: adjustedDuration || 0.3,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0] 
      }}
      {...props}
    >
      {children}
    </Component>
  );
});

Fade.displayName = 'Fade';

// Scale animation component
interface ScaleProps extends BaseMotionProps {
  scaleFrom?: number;
}

/**
 * Scale - Component for consistent scale animations
 */
export const Scale = forwardRef<HTMLDivElement, ScaleProps>(({
  children,
  className,
  delay = 0,
  duration,
  scaleFrom = 0.95,
  as = 'div',
  noAnimation = false,
  ...props
}, ref) => {
  const { isReducedMotion, globalAnimationSpeed } = useAnimation();
  const shouldReduceMotion = useReducedMotion() || isReducedMotion;
  
  // Define variants
  const variants: Variants = shouldReduceMotion || noAnimation
    ? {
        initial: { opacity: 1, scale: 1 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 1, scale: 1 }
      }
    : {
        initial: { opacity: 0, scale: scaleFrom },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: scaleFrom * 0.95 }
      };
  
  // Calculate adjusted duration based on global speed
  const adjustedDuration = duration !== undefined 
    ? duration / globalAnimationSpeed 
    : undefined;
  
  // Create component with appropriate HTML element
  const Component = motion[as as keyof typeof motion];
  
  return (
    <Component
      ref={ref}
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ 
        duration: adjustedDuration || 0.3,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0] 
      }}
      {...props}
    >
      {children}
    </Component>
  );
});

Scale.displayName = 'Scale';

// Slide animation component
interface SlideProps extends BaseMotionProps {
  direction: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}

/**
 * Slide - Component for consistent sliding animations
 */
export const Slide = forwardRef<HTMLDivElement, SlideProps>(({
  children,
  className,
  delay = 0,
  duration,
  direction = 'up',
  distance = 100,
  as = 'div',
  noAnimation = false,
  ...props
}, ref) => {
  const { isReducedMotion, globalAnimationSpeed } = useAnimation();
  const shouldReduceMotion = useReducedMotion() || isReducedMotion;
  
  // Define directional variants
  let variants: Variants;
  
  if (shouldReduceMotion || noAnimation) {
    variants = {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 }
    };
  } else {
    switch (direction) {
      case 'up':
        variants = {
          initial: { y: distance },
          animate: { y: 0 },
          exit: { y: distance }
        };
        break;
      case 'down':
        variants = {
          initial: { y: -distance },
          animate: { y: 0 },
          exit: { y: -distance }
        };
        break;
      case 'left':
        variants = {
          initial: { x: distance },
          animate: { x: 0 },
          exit: { x: distance }
        };
        break;
      case 'right':
        variants = {
          initial: { x: -distance },
          animate: { x: 0 },
          exit: { x: -distance }
        };
        break;
    }
  }
  
  // Calculate adjusted duration based on global speed
  const adjustedDuration = duration !== undefined 
    ? duration / globalAnimationSpeed 
    : undefined;
  
  // Create component with appropriate HTML element
  const Component = motion[as as keyof typeof motion];
  
  return (
    <Component
      ref={ref}
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ 
        type: 'spring',
        stiffness: 300,
        damping: 30,
        delay,
        duration: adjustedDuration
      }}
      {...props}
    >
      {children}
    </Component>
  );
});

Slide.displayName = 'Slide';

// Staggered children container
interface StaggerContainerProps extends BaseMotionProps {
  staggerDelay?: number;
  staggerDirection?: 1 | -1;
}

/**
 * StaggerContainer - Component for creating staggered animations of children
 */
export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(({
  children,
  className,
  delay = 0,
  staggerDelay = 0.05,
  staggerDirection = 1,
  as = 'div',
  noAnimation = false,
  ...props
}, ref) => {
  const { isReducedMotion } = useAnimation();
  const shouldReduceMotion = useReducedMotion() || isReducedMotion;
  
  // Define container variants
  const variants: Variants = shouldReduceMotion || noAnimation
    ? {
        initial: {},
        animate: {},
        exit: {}
      }
    : {
        initial: {},
        animate: {
          transition: {
            delayChildren: delay,
            staggerChildren: staggerDelay,
            staggerDirection
          }
        },
        exit: {
          transition: {
            staggerChildren: staggerDelay / 2,
            staggerDirection: staggerDirection * -1
          }
        }
      };
  
  // Create component with appropriate HTML element
  const Component = motion[as as keyof typeof motion];
  
  return (
    <Component
      ref={ref}
      className={className}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      {...props}
    >
      {children}
    </Component>
  );
});

StaggerContainer.displayName = 'StaggerContainer';

// Staggered child item
interface StaggerItemProps extends BaseMotionProps {
  index?: number;
}

/**
 * StaggerItem - Component to be used as children of StaggerContainer
 */
export const StaggerItem = forwardRef<HTMLDivElement, StaggerItemProps>(({
  children,
  className,
  as = 'div',
  index,
  noAnimation = false,
  ...props
}, ref) => {
  const { isReducedMotion } = useAnimation();
  const shouldReduceMotion = useReducedMotion() || isReducedMotion;
  
  // Define item variants
  const variants: Variants = shouldReduceMotion || noAnimation
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 }
      }
    : {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 5 }
      };
  
  // Create component with appropriate HTML element
  const Component = motion[as as keyof typeof motion];
  
  return (
    <Component
      ref={ref}
      className={className}
      variants={variants}
      transition={{ 
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
      custom={index}
      {...props}
    >
      {children}
    </Component>
  );
});

StaggerItem.displayName = 'StaggerItem';

// Attention-grabbing element
interface AttentionProps extends BaseMotionProps {
  type?: 'pulse' | 'bounce' | 'wiggle' | 'shake' | 'glow';
  intensity?: 'subtle' | 'normal' | 'strong';
  repeat?: number | boolean;
}

/**
 * Attention - Component for creating attention-grabbing animations
 */
export const Attention = forwardRef<HTMLDivElement, AttentionProps>(({
  children,
  className,
  type = 'pulse',
  intensity = 'normal',
  repeat = Infinity,
  as = 'div',
  noAnimation = false,
  ...props
}, ref) => {
  const { isReducedMotion, globalAnimationSpeed } = useAnimation();
  const shouldReduceMotion = useReducedMotion() || isReducedMotion || noAnimation;
  
  // Define intensity factors
  const intensityFactors = {
    subtle: 0.5,
    normal: 1,
    strong: 1.5
  };
  
  const factor = intensityFactors[intensity];
  
  // Define animation variants based on type
  let animate = {};
  
  if (!shouldReduceMotion) {
    switch (type) {
      case 'pulse':
        animate = {
          scale: [1, 1 + (0.05 * factor), 1],
          opacity: [1, 1 + (0.1 * factor), 1],
        };
        break;
      case 'bounce':
        animate = {
          y: [0, -(5 * factor), 0],
        };
        break;
      case 'wiggle':
        animate = {
          rotate: [0, 2 * factor, -2 * factor, 1 * factor, 0],
        };
        break;
      case 'shake':
        animate = {
          x: [0, 3 * factor, -3 * factor, 3 * factor, -3 * factor, 0],
        };
        break;
      case 'glow':
        animate = {
          boxShadow: [
            '0 0 0 rgba(0, 204, 255, 0)',
            `0 0 ${8 * factor}px rgba(0, 204, 255, 0.6)`,
            '0 0 0 rgba(0, 204, 255, 0)',
          ],
        };
        break;
    }
  }
  
  // Create component with appropriate HTML element
  const Component = motion[as as keyof typeof motion];
  
  return (
    <Component
      ref={ref}
      className={className}
      animate={animate}
      transition={{ 
        duration: 2 / globalAnimationSpeed,
        repeat: shouldReduceMotion ? 0 : repeat,
        repeatType: 'loop',
        ease: 'easeInOut'
      }}
      {...props}
    >
      {children}
    </Component>
  );
});

Attention.displayName = 'Attention';

// Export all components
export const MotionComponents = {
  Fade,
  Scale,
  Slide,
  StaggerContainer,
  StaggerItem,
  Attention,
};

export default MotionComponents;
