import React, { ButtonHTMLAttributes, useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import useHaptics from '@/hooks/useHaptics';
import { useAnimation } from '@/contexts/AnimationContext';
import { colors, shadows } from '@/design/tokens';

interface InteractiveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'glass'
    | 'success'
    | 'warning'
    | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  isActive?: boolean;
  fullWidth?: boolean;
  elevation?: 0 | 1 | 2 | 3;
  rounded?: 'full' | 'lg' | 'md' | 'sm' | 'none';
  hapticFeedback?: boolean;
  pressAnimation?: 'scale' | 'sink' | 'bounce' | 'none';
  glow?: boolean;
  glowOnHover?: boolean;
  className?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  tooltipText?: string;
  textClassName?: string;
  iconClassName?: string;
}

/**
 * InteractiveButton component with enhanced haptic and visual feedback
 * Features physical interactions, animations, and accessibility improvements
 */
export const InteractiveButton = React.forwardRef<HTMLButtonElement, InteractiveButtonProps>(
  ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    isLoading = false,
    isActive = false,
    fullWidth = false,
    elevation = 2,
    rounded = 'md',
    hapticFeedback = true,
    pressAnimation = 'scale',
    glow = false,
    glowOnHover = false,
    disabled,
    onPress,
    onLongPress,
    tooltipText,
    textClassName,
    iconClassName,
    onClick,
    onMouseDown,
    onMouseUp,
    onTouchStart,
    onTouchEnd,
    ...props
  }, ref) => {
    // Hooks
    const { isReducedMotion } = useAnimation();
    const { selection, impact, success } = useHaptics();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isPressed, setIsPressed] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [rippleAnimation, setRippleAnimation] = useState<{
      x: number;
      y: number;
      size: number;
      visible: boolean;
    } | null>(null);
    
    // Long press handling
    const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
    const longPressThreshold = 500; // ms
    
    // Motion values for interactive effects
    const pressStrength = useMotionValue(0);
    const scale = useTransform(
      pressStrength, 
      [0, 1], 
      [1, pressAnimation === 'scale' ? 0.97 : pressAnimation === 'sink' ? 0.95 : 1]
    );
    const y = useTransform(
      pressStrength,
      [0, 1],
      [0, pressAnimation === 'sink' ? 2 : 0]
    );
    
    // Variant styles
    const variantClasses = {
      primary: 'bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 text-white',
      secondary: 'bg-glass-background border border-glass-border text-alpine-mist hover:bg-glass-active',
      outline: 'bg-transparent border border-primary-cyan-500 text-primary-cyan-500 hover:bg-primary-cyan-500/10',
      ghost: 'bg-transparent hover:bg-glass-highlight text-alpine-mist',
      glass: 'bg-glass-background backdrop-blur-md border border-glass-border text-alpine-mist hover:bg-glass-highlight/80',
      success: 'bg-gradient-to-r from-status-success-500 to-status-success-400 text-white',
      warning: 'bg-gradient-to-r from-status-warning-500 to-status-warning-400 text-white',
      danger: 'bg-gradient-to-r from-status-error-500 to-status-error-400 text-white',
    };
    
    // Size classes
    const sizeClasses = {
      xs: 'text-xs py-1 px-2 h-6',
      sm: 'text-xs py-1.5 px-3 h-7',
      md: 'text-sm py-2 px-4 h-9',
      lg: 'text-base py-2.5 px-5 h-10',
      xl: 'text-lg py-3 px-6 h-12',
    };
    
    // Radius classes
    const radiusClasses = {
      full: 'rounded-full',
      lg: 'rounded-lg',
      md: 'rounded-md',
      sm: 'rounded',
      none: 'rounded-none',
    };
    
    // Elevation shadows
    const elevationShadows = [
      'shadow-none',
      shadows.elevation[1],
      shadows.elevation[2],
      shadows.elevation[3]
    ];
    
    // Glow styles based on variant
    const getGlowColor = () => {
      switch (variant) {
        case 'primary':
          return colors.primary.cyan[400];
        case 'success':
          return colors.status.success[400];
        case 'warning':
          return colors.status.warning[400];
        case 'danger':
          return colors.status.error[400];
        default:
          return colors.primary.cyan[400];
      }
    };
    
    const glowStyle = glow || (glowOnHover && (isPressed || isActive)) 
      ? { boxShadow: `0 0 15px ${getGlowColor()}70` }
      : {};
    
    // Handle button press
    const handlePress = (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return;
      
      setIsPressed(true);
      pressStrength.set(1);
      
      // Provide haptic feedback
      if (hapticFeedback) {
        selection();
      }
      
      // Create ripple effect
      if (!isReducedMotion && 'clientX' in event) {
        const button = buttonRef.current;
        if (button) {
          const rect = button.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          const size = Math.max(rect.width, rect.height) * 2;
          
          setRippleAnimation({
            x,
            y,
            size,
            visible: true
          });
        }
      }
      
      // Start long press timer
      if (onLongPress) {
        longPressTimeout.current = setTimeout(() => {
          onLongPress();
          // Additional haptic feedback for long press
          if (hapticFeedback) {
            impact();
          }
        }, longPressThreshold);
      }
      
      if (onMouseDown) onMouseDown(event as React.MouseEvent<HTMLButtonElement>);
      if (onTouchStart) onTouchStart(event as React.TouchEvent<HTMLButtonElement>);
    };
    
    // Handle button release
    const handleRelease = (event: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return;
      
      setIsPressed(false);
      pressStrength.set(0);
      
      // Clear long press timer
      if (longPressTimeout.current) {
        clearTimeout(longPressTimeout.current);
        longPressTimeout.current = null;
      }
      
      // Hide ripple after animation
      if (rippleAnimation) {
        setTimeout(() => {
          setRippleAnimation(null);
        }, 600);
      }
      
      // Trigger click handler
      if (onClick && !disabled && !isLoading) {
        onClick(event as React.MouseEvent<HTMLButtonElement>);
      }
      
      // Trigger press handler
      if (onPress && !disabled && !isLoading) {
        onPress();
        
        // Success feedback for completed action
        if (hapticFeedback) {
          success();
        }
      }
      
      if (onMouseUp) onMouseUp(event as React.MouseEvent<HTMLButtonElement>);
      if (onTouchEnd) onTouchEnd(event as React.TouchEvent<HTMLButtonElement>);
    };
    
    // Handle tooltip
    const handleMouseEnter = () => {
      if (tooltipText) {
        setShowTooltip(true);
      }
    };
    
    const handleMouseLeave = () => {
      setShowTooltip(false);
      setIsPressed(false);
      pressStrength.set(0);
      
      // Clear long press timer
      if (longPressTimeout.current) {
        clearTimeout(longPressTimeout.current);
        longPressTimeout.current = null;
      }
    };
    
    // Cleanup
    useEffect(() => {
      return () => {
        if (longPressTimeout.current) {
          clearTimeout(longPressTimeout.current);
        }
      };
    }, []);
    
    // Loading spinner component
    const LoadingSpinner = () => (
      <svg 
        className="animate-spin mr-2 h-4 w-4" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    );

    return (
      <div className="relative inline-flex">
        <motion.button
          ref={(node) => {
            // Merge refs
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            if (buttonRef) {
              buttonRef.current = node;
            }
          }}
          className={cn(
            // Base styles
            'relative flex items-center justify-center font-medium transition-all overflow-hidden',
            // Variant
            variantClasses[variant],
            // Size
            sizeClasses[size],
            // Radius
            radiusClasses[rounded],
            // Width
            fullWidth ? 'w-full' : '',
            // State
            isActive && 'ring-2 ring-primary-cyan-400/30',
            (disabled || isLoading) && 'opacity-60 cursor-not-allowed pointer-events-none',
            // Custom class
            className
          )}
          style={{
            boxShadow: elevationShadows[elevation],
            ...glowStyle,
          }}
          disabled={disabled || isLoading}
          onMouseDown={handlePress}
          onMouseUp={handleRelease}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handlePress}
          onTouchEnd={handleRelease}
          // Motion specific props
          whileHover={isReducedMotion ? {} : { scale: 1.02 }}
          animate={{
            scale: scale.get(),
            y: y.get(),
            transition: { type: 'spring', stiffness: 500, damping: 30 }
          }}
          {...props}
        >
          {/* Loading spinner */}
          {isLoading && <LoadingSpinner />}
          
          {/* Left Icon */}
          {leftIcon && !isLoading && (
            <span className={cn("mr-2", iconClassName)}>
              {leftIcon}
            </span>
          )}
          
          {/* Button text */}
          <span className={textClassName}>
            {children}
          </span>
          
          {/* Right Icon */}
          {rightIcon && !isLoading && (
            <span className={cn("ml-2", iconClassName)}>
              {rightIcon}
            </span>
          )}
          
          {/* Ripple effect */}
          {rippleAnimation && !isReducedMotion && (
            <span
              className="absolute rounded-full bg-white/20 pointer-events-none"
              style={{
                left: rippleAnimation.x - rippleAnimation.size / 2,
                top: rippleAnimation.y - rippleAnimation.size / 2,
                width: rippleAnimation.size,
                height: rippleAnimation.size,
                opacity: rippleAnimation.visible ? 0.4 : 0,
                transform: rippleAnimation.visible ? 'scale(1)' : 'scale(0)',
                transition: 'transform 0.6s ease-out, opacity 0.6s ease-out',
              }}
            />
          )}
        </motion.button>
        
        {/* Tooltip */}
        {tooltipText && showTooltip && (
          <motion.div
            className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-glass-backgroundDark backdrop-blur-md px-2 py-1 rounded text-xs text-alpine-mist pointer-events-none border border-glass-border z-50"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {tooltipText}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-t-glass-backgroundDark border-l-transparent border-r-transparent" />
          </motion.div>
        )}
      </div>
    );
  }
);

InteractiveButton.displayName = 'InteractiveButton';

export default InteractiveButton;
