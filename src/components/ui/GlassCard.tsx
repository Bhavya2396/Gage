import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'highlight' | 'muted' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  onClick?: () => void;
  animate?: boolean;
  initial?: object;
  whileHover?: object;
  whileTap?: object;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  onClick,
  animate = true,
  initial,
  whileHover,
  whileTap,
  ...props
}) => {
  // Define variant styles
  const variants = {
    default: 'bg-glass border-glass-border',
    highlight: 'bg-glass border-accent-primary/30',
    muted: 'bg-glass/50 border-glass-border/50',
    accent: 'bg-glass border-accent-primary',
  };

  // Define size styles with responsive padding
  const sizes = {
    sm: 'p-2 sm:p-3',
    md: 'p-3 sm:p-4',
    lg: 'p-4 sm:p-5',
    xl: 'p-5 sm:p-6',
    full: 'p-4 sm:p-5 w-full',
  };

  // Define border radius based on size with mobile optimization
  const radius = {
    sm: 'rounded-md sm:rounded-lg',
    md: 'rounded-lg sm:rounded-xl',
    lg: 'rounded-xl sm:rounded-2xl',
    xl: 'rounded-2xl sm:rounded-3xl',
    full: 'rounded-xl sm:rounded-2xl',
  };

  // Base component with conditional motion wrapper
  const CardComponent = animate ? motion.div : 'div';

  // Animation properties
  const motionProps = animate
    ? {
        initial: initial || { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.3, ease: 'easeOut' },
        whileHover: whileHover || { scale: 1.02, boxShadow: '0 0 10px rgba(11, 197, 234, 0.2)' }, // Updated glow color
        whileTap: whileTap || { scale: 0.98 },
      }
    : {};

  return (
    <CardComponent
      className={cn(
        'backdrop-blur border shadow-md transition-all duration-300',
        variants[variant],
        sizes[size],
        radius[size],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default GlassCard;