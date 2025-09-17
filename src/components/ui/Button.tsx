import React, { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  animate?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  animate = true,
  disabled,
  ...props
}) => {
  // Define variant styles
  const variants = {
    primary: 'bg-accent-primary text-bg-primary hover:bg-accent-primary/90',
    secondary: 'bg-accent-secondary text-text-primary hover:bg-accent-secondary/90',
    outline: 'bg-transparent border border-accent-primary text-accent-primary hover:bg-accent-primary/10',
    ghost: 'bg-glass-background bg-opacity-70 backdrop-blur-sm text-white border border-white/30 shadow-lg hover:text-white hover:bg-glass-background hover:bg-opacity-80 hover:border-white/50',
  };

  // Define size styles
  const sizes = {
    sm: 'text-xs py-2 px-3',
    md: 'text-sm py-2.5 px-4',
    lg: 'text-base py-3 px-5',
  };

  // Base component with conditional motion wrapper
  const ButtonComponent = animate ? motion.button : 'button';

  // Animation properties
  const motionProps = animate
    ? {
        whileHover: { scale: 1.03, boxShadow: '0 0 8px rgba(11, 197, 234, 0.3)' }, // Updated glow color
        whileTap: { scale: 0.97 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <ButtonComponent
      className={cn(
        'rounded-full font-medium transition-colors flex items-center justify-center',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled}
      {...motionProps}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </ButtonComponent>
  );
};

export default Button;