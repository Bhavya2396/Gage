import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { colors, shadows, borderRadius, transitions } from './tokens';

// Button variants
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  children,
  fullWidth = false,
  className,
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  // Variant classes
  const variantClasses = {
    primary: `bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 text-white shadow-md hover:shadow-lg`,
    secondary: `bg-glass-background border border-glass-border text-alpine-mist hover:bg-glass-highlight`,
    outline: `border border-glass-border text-alpine-mist bg-transparent hover:bg-glass-background`,
    ghost: `text-alpine-mist hover:bg-glass-background`,
    glass: `backdrop-blur-md bg-glass-background/70 border border-glass-border text-alpine-mist hover:bg-glass-highlight/80 shadow-md`,
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(
        'rounded-lg flex items-center justify-center font-medium transition',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth ? 'w-full' : '',
        isLoading ? 'opacity-70 cursor-wait' : '',
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 animate-spin">○</span>
      ) : (
        icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && !isLoading && <span className="ml-2">{icon}</span>}
    </motion.button>
  );
};

// Card components
interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  variant?: 'default' | 'glass' | 'solid' | 'highlight';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  onClick,
  interactive = false,
  variant = 'default',
}) => {
  // Variant classes
  const variantClasses = {
    default: 'bg-bg-secondary border border-glass-border',
    glass: 'backdrop-blur-md bg-glass-background/70 border border-glass-border',
    solid: 'bg-bg-tertiary border border-glass-border',
    highlight: 'bg-glass-background border border-primary-cyan-500/30',
  };

  return (
    <motion.div
      className={cn(
        'rounded-xl shadow-md overflow-hidden',
        variantClasses[variant],
        interactive ? 'cursor-pointer hover:shadow-lg transition-shadow' : '',
        className
      )}
      onClick={onClick}
      whileHover={interactive ? { y: -2 } : {}}
      whileTap={interactive ? { y: 0 } : {}}
    >
      {children}
    </motion.div>
  );
};

// Badge component
type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
}) => {
  // Variant classes
  const variantClasses = {
    default: 'bg-glass-background text-alpine-mist',
    success: 'bg-recovery-high/20 text-recovery-high',
    warning: 'bg-recovery-medium/20 text-recovery-medium',
    error: 'bg-recovery-low/20 text-recovery-low',
    info: 'bg-primary-cyan/20 text-primary-cyan',
  };

  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

// Progress indicator
interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'line' | 'circle';
  showValue?: boolean;
  color?: string;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'line',
  showValue = false,
  color,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  // Get appropriate color based on value
  const getColorByValue = () => {
    if (color) return color;
    if (percentage < 30) return colors.recovery.low;
    if (percentage < 70) return colors.recovery.medium;
    return colors.recovery.high;
  };
  
  const progressColor = getColorByValue();
  
  // Size classes for line variant
  const lineSizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
  // Size values for circle variant
  const circleSizeValues = {
    sm: { size: 32, strokeWidth: 3 },
    md: { size: 48, strokeWidth: 4 },
    lg: { size: 64, strokeWidth: 5 },
  };
  
  if (variant === 'circle') {
    const { size: circleSize, strokeWidth } = circleSizeValues[size];
    const radius = (circleSize / 2) - (strokeWidth / 2);
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    return (
      <div className={cn('relative inline-flex items-center justify-center', className)}>
        <svg width={circleSize} height={circleSize} viewBox={`0 0 ${circleSize} ${circleSize}`}>
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            fill="none"
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`}
            strokeLinecap="round"
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-alpine-mist text-xs font-semibold">{Math.round(percentage)}%</span>
          </div>
        )}
      </div>
    );
  }
  
  // Line variant
  return (
    <div className={cn('w-full overflow-hidden rounded-full bg-bg-tertiary', className)}>
      <div className="relative">
        <div className={cn('w-full bg-gray-800/30', lineSizeClasses[size])} />
        <div
          className={cn('absolute top-0 left-0 h-full rounded-full transition-all', lineSizeClasses[size])}
          style={{
            width: `${percentage}%`,
            backgroundColor: progressColor,
          }}
        />
      </div>
      {showValue && (
        <div className="mt-1 text-xs text-alpine-mist text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

// Section divider with optional label
interface DividerProps {
  label?: string;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ label, className }) => {
  if (label) {
    return (
      <div className={cn('flex items-center my-4', className)}>
        <div className="flex-1 h-px bg-glass-border"></div>
        <span className="px-3 text-xs text-alpine-dark uppercase">{label}</span>
        <div className="flex-1 h-px bg-glass-border"></div>
      </div>
    );
  }
  
  return <div className={cn('h-px w-full bg-glass-border my-4', className)} />;
};

// Tooltip component
interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300,
  className,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout | null>(null);
  
  const showTooltip = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };
  
  const hideTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };
  
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };
  
  return (
    <div className="relative inline-flex" onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
      {children}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            'absolute z-40 bg-glass-background backdrop-blur-md px-2 py-1 rounded-md text-xs shadow-lg whitespace-nowrap',
            positionClasses[position],
            className
          )}
        >
          {content}
        </motion.div>
      )}
    </div>
  );
};

// Avatar component with status indicator
interface AvatarProps {
  src?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  initials,
  size = 'md',
  status,
  className,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };
  
  const statusColors = {
    online: 'bg-recovery-high',
    offline: 'bg-alpine-dark',
    away: 'bg-recovery-medium',
    busy: 'bg-recovery-low',
  };
  
  return (
    <div className={cn('relative rounded-full overflow-hidden flex items-center justify-center', sizeClasses[size], className)}>
      {src ? (
        <img src={src} alt="Avatar" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-glass-background flex items-center justify-center text-alpine-mist font-medium">
          {initials || '?'}
        </div>
      )}
      
      {status && (
        <span className={cn(
          'absolute bottom-0 right-0 rounded-full ring-2 ring-bg-primary',
          statusColors[status],
          size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'
        )} />
      )}
    </div>
  );
};
