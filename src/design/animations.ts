// Animation variants for consistent animations across the application

import { Variants } from 'framer-motion';

// Page transition animations
export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const pageSlideLeft: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const pageSlideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Basic fade in/out animation
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

// Fade in/out with y movement
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Fade in/out with x movement
export const fadeInRight: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

// Scale animation
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// Slide in/out from bottom
export const slideUp: Variants = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
};

// Slide in/out from right
export const slideRight: Variants = {
  initial: { x: '-100%' },
  animate: { x: 0 },
  exit: { x: '-100%' },
};

// Stagger children animations
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Card hover animation
export const cardHover = {
  rest: {
    scale: 1,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    transition: {
      duration: 0.2,
      type: 'tween',
      ease: 'easeOut',
    },
  },
  hover: {
    scale: 1.02,
    y: -5,
    boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    transition: {
      duration: 0.2,
      type: 'tween',
      ease: 'easeOut',
    },
  },
};

// Button animations
export const buttonTap = {
  tap: { scale: 0.98 },
};

// Button hover animation
export const buttonHover = {
  rest: {
    scale: 1,
    transition: {
      duration: 0.2,
      type: 'tween',
      ease: 'easeOut',
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      type: 'tween',
      ease: 'easeOut',
    },
  },
};

// Pulse animation
export const pulse: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

// Parallax effect for layers
export const parallaxLayers = (depth: number) => ({
  initial: { y: 0 },
  animate: {
    y: depth,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 30,
    },
  },
});

// Card tilt animation based on mouse position
export const cardTiltAnimation = (intensity: number = 1) => ({
  rest: { rotateX: 0, rotateY: 0 },
  hover: (mousePosition: { x: number; y: number }) => {
    const rotateX = (mousePosition.y - 0.5) * 10 * intensity;
    const rotateY = (mousePosition.x - 0.5) * -10 * intensity;
    return {
      rotateX,
      rotateY,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    };
  },
});

// Text reveal animation
export const textReveal: Variants = {
  initial: {
    y: '100%',
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1],
    },
  },
};

// Path drawing animation for SVGs
export const pathDraw: Variants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { type: 'spring', duration: 1.5, bounce: 0 },
      opacity: { duration: 0.2 },
    },
  },
};

// Floating animation
export const float: Variants = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'easeInOut',
    },
  },
};

// Shake animation
export const shake: Variants = {
  initial: { x: 0 },
  animate: {
    x: [-5, 5, -5, 5, 0],
    transition: {
      duration: 0.5,
    },
  },
};

export default {
  pageTransition,
  pageSlideLeft,
  pageSlideUp,
  fadeIn,
  fadeInUp,
  fadeInRight,
  scaleIn,
  slideUp,
  slideRight,
  staggerContainer,
  cardHover,
  buttonTap,
  buttonHover,
  pulse,
  parallaxLayers,
  cardTiltAnimation,
  textReveal,
  pathDraw,
  float,
  shake,
};