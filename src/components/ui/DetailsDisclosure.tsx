import React, { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DetailsDisclosureProps {
  summary: ReactNode;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'bordered' | 'ghost' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  iconType?: 'chevron' | 'plus' | 'arrow';
  animated?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

/**
 * Progressive disclosure component for revealing detailed information
 * Provides a clean, animated interface for showing/hiding content
 */
export const DetailsDisclosure: React.FC<DetailsDisclosureProps> = ({
  summary,
  children,
  className,
  defaultOpen = false,
  iconPosition = 'left',
  variant = 'default',
  size = 'md',
  iconType = 'chevron',
  animated = true,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) onToggle(newState);
  };

  // Size variants
  const sizeClasses = {
    sm: 'text-xs py-1.5',
    md: 'text-sm py-2',
    lg: 'text-base py-2.5',
  };

  // Variant styles
  const variantClasses = {
    default: 'bg-glass-background bg-opacity-70 backdrop-blur-sm border border-glass-border rounded-lg',
    bordered: 'border border-glass-border rounded-lg',
    ghost: 'hover:bg-white/5',
    minimal: '',
  };

  // Icon based on type and state
  const getIcon = () => {
    if (iconType === 'chevron') {
      return (
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} className="text-primary-cyan-500" />
        </motion.div>
      );
    }
    
    return (
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChevronDown size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} className="text-primary-cyan-500" />
      </motion.div>
    );
  };

  return (
    <div className={cn('overflow-hidden', className)}>
      {/* Summary/Header */}
      <div
        className={cn(
          'flex items-center justify-between cursor-pointer transition-colors',
          sizeClasses[size],
          variantClasses[variant],
          isOpen && 'border-b-0 rounded-b-none',
          variant === 'default' || variant === 'bordered' ? 'px-3' : 'px-1'
        )}
        onClick={handleToggle}
      >
        {/* Left icon */}
        {iconPosition === 'left' && (
          <div className="mr-2 flex-shrink-0">{getIcon()}</div>
        )}

        {/* Summary content */}
        <div className={cn('flex-1', iconPosition === 'right' ? 'text-left' : '')}>
          {typeof summary === 'string' ? (
            <div className="font-medium text-white">{summary}</div>
          ) : (
            summary
          )}
        </div>

        {/* Right icon */}
        {iconPosition === 'right' && (
          <div className="ml-2 flex-shrink-0">{getIcon()}</div>
        )}
      </div>

      {/* Content with animation */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={animated ? { opacity: 0, height: 0 } : undefined}
            animate={animated ? { opacity: 1, height: 'auto' } : undefined}
            exit={animated ? { opacity: 0, height: 0 } : undefined}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={cn(
              variant === 'default' || variant === 'bordered' 
                ? 'px-3 py-2 border border-t-0 border-glass-border rounded-b-lg' 
                : 'pt-1 pb-2 pl-7',
              variant === 'default' && 'bg-glass-background bg-opacity-70 backdrop-blur-sm'
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DetailsDisclosure;
