import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { colors, shadows, transitions } from '@/design/tokens';
import { buttonTap, buttonHover } from '@/design/animations';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  animate?: boolean;
  rounded?: 'full' | 'lg' | 'md' | 'none';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  isLoading = false,
  animate = true,
  rounded = 'lg',
  leftIcon,
  rightIcon,
  disabled,
  ...props
}, ref) => {
  // Define variant styles - updated for seamless glassmorphism
  const variants = {
    primary: 'bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 text-white shadow-card-medium hover:shadow-card-strong hover:from-primary-cyan-400 hover:to-primary-teal-400 transition-all duration-300',
    secondary: 'bg-ui-card backdrop-blur-md text-ui-text-primary hover:bg-ui-highlight transition-all duration-300',
    outline: 'bg-transparent text-primary-cyan-400 hover:bg-primary-cyan-500/20 transition-all duration-300',
    ghost: 'text-ui-text-primary hover:bg-ui-card hover:text-primary-cyan-400 transition-all duration-300',
    glass: 'backdrop-blur-md bg-ui-card-glass text-ui-text-white hover:bg-ui-highlight/80 shadow-card-light transition-all duration-300',
  };

  // Define size styles - updated for better proportions
  const sizes = {
    xs: 'text-xs py-1.5 px-3',
    sm: 'text-sm py-2 px-4',
    md: 'text-sm py-2.5 px-5',
    lg: 'text-base py-3 px-6',
    icon: icon ? 'p-2.5' : 'p-3',
  };
  
  // Define rounded styles - updated to match reference design
  const roundedStyles = {
    full: 'rounded-full',
    lg: 'rounded-xl',
    md: 'rounded-lg',
    none: 'rounded-none',
  };
  
  // Prefer leftIcon/rightIcon over icon with iconPosition
  const effectiveLeftIcon = leftIcon || (iconPosition === 'left' ? icon : null);
  const effectiveRightIcon = rightIcon || (iconPosition === 'right' ? icon : null);

  // Base component with conditional motion wrapper
  const ButtonComponent = animate ? motion.button : 'button';

  // Animation properties
  const motionProps = animate && !disabled && !isLoading
    ? {
        whileHover: buttonHover,
        whileTap: buttonTap,
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <ButtonComponent
      ref={ref}
      className={cn(
        'font-medium transition-all flex items-center justify-center',
        variants[variant],
        sizes[size],
        roundedStyles[rounded],
        fullWidth && 'w-full',
        (disabled || isLoading) && 'opacity-60 cursor-not-allowed pointer-events-none',
        className
      )}
      disabled={disabled || isLoading}
      {...motionProps}
      {...props}
    >
      {isLoading && (
        <motion.span 
          className="mr-2 inline-block"
          animate={{ rotate: 360 }}
          transition={{ 
            repeat: Infinity, 
            duration: 1, 
            ease: "linear" 
          }}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </motion.span>
      )}
      
      {effectiveLeftIcon && !isLoading && (
        <span className={cn("inline-flex", children ? "mr-2" : "")}>
          {effectiveLeftIcon}
        </span>
      )}
      
      {children}
      
      {effectiveRightIcon && !isLoading && (
        <span className={cn("inline-flex", children ? "ml-2" : "")}>
          {effectiveRightIcon}
        </span>
      )}
    </ButtonComponent>
  );
});

Button.displayName = 'Button';

export default Button;