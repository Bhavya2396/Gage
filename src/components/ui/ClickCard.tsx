import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ClickCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

const ClickCard: React.FC<ClickCardProps> = ({
  children,
  onClick,
  className,
  icon,
  title,
  subtitle,
  variant = 'glass',
  size = 'md',
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-bg-secondary',
    outline: 'bg-transparent border border-glass-border',
    glass: 'bg-glass-background backdrop-blur-md border border-glass-border',
  };

  return (
    <motion.div
      onClick={onClick}
      className={cn(
        'rounded-xl shadow-lg cursor-pointer overflow-hidden transition-all',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: '0 0 20px rgba(0, 204, 255, 0.3)'
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* If there's a title/subtitle, show the header */}
      {(title || icon) && (
        <div className="flex items-center mb-3">
          {icon && <div className="mr-3">{icon}</div>}
          <div>
            {title && <h3 className="text-lg font-medium text-alpine-mist">{title}</h3>}
            {subtitle && <p className="text-sm text-text-secondary">{subtitle}</p>}
          </div>
        </div>
      )}
      
      {/* Card content */}
      {children}
    </motion.div>
  );
};

export default ClickCard;


