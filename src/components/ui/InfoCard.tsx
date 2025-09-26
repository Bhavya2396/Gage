import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeInUp } from '@/design/animations';
import GlassCard from './GlassCard';

interface InfoCardProps {
  title: string;
  value: ReactNode;
  icon?: ReactNode;
  description?: string;
  trend?: {
    value: number;
    label?: string;
    isPositive?: boolean;
  };
  footer?: ReactNode;
  variant?: 'default' | 'highlight' | 'muted' | 'frosted' | 'dark';
  trendDirection?: 'up' | 'down' | 'neutral';
  iconBackground?: string;
  onClick?: () => void;
  className?: string;
  valueSize?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  chart?: ReactNode;
}

/**
 * InfoCard component for displaying metrics and data points
 * Features a consistent layout with optional icon, trend indicator, and chart
 */
const InfoCard: React.FC<InfoCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  footer,
  variant = 'default',
  trendDirection,
  iconBackground,
  onClick,
  className,
  valueSize = 'lg',
  isLoading = false,
  chart,
}) => {
  // Auto-detect trend direction if not explicitly provided
  const actualTrendDirection = trendDirection || 
    (trend?.value ? (trend.value > 0 ? 'up' : trend.value < 0 ? 'down' : 'neutral') : undefined);
  
  // Define value size classes
  const valueSizeClasses = {
    sm: 'text-lg sm:text-xl font-semibold',
    md: 'text-xl sm:text-2xl font-semibold',
    lg: 'text-2xl sm:text-3xl font-bold',
    xl: 'text-3xl sm:text-4xl font-bold',
  };
  
  // Get trend color
  const getTrendColor = () => {
    if (!actualTrendDirection) return 'text-alpine-mist';
    return actualTrendDirection === 'up' 
      ? 'text-status-success-400' 
      : actualTrendDirection === 'down' 
        ? 'text-status-error-400' 
        : 'text-alpine-mist';
  };
  
  // Get trend icon
  const getTrendIcon = () => {
    if (!actualTrendDirection || actualTrendDirection === 'neutral') {
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 10H4V14H8V10ZM14 10H10V14H14V10ZM20 10H16V14H20V10Z" fill="currentColor" />
        </svg>
      );
    }
    
    return actualTrendDirection === 'up' ? (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" fill="currentColor" />
      </svg>
    ) : (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 18L18.29 15.71L13.41 10.83L9.41 14.83L2 7.41L3.41 6L9.41 12L13.41 8L19.71 14.29L22 12V18H16Z" fill="currentColor" />
      </svg>
    );
  };

  return (
    <GlassCard
      variant={variant}
      className={cn('overflow-hidden', className)}
      interactive={!!onClick}
      onClick={onClick}
      borderHighlight
      noise
      elevation={1}
    >
      <div className="flex flex-col h-full">
        {/* Card Header with Title and Icon */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium text-alpine-mist/80 uppercase tracking-wider">{title}</h3>
          
          {icon && (
            <div 
              className={cn(
                "p-1.5 rounded-md",
                iconBackground ? iconBackground : "bg-glass-highlight"
              )}
            >
              {icon}
            </div>
          )}
        </div>
        
        {/* Loading state */}
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-glass-highlight rounded w-2/3 mb-2"></div>
            {description && <div className="h-4 bg-glass-highlight rounded w-1/2 mt-2"></div>}
          </div>
        ) : (
          <>
            {/* Value Display */}
            <div className="flex items-end justify-between">
              <motion.div
                className={cn("text-alpine-light", valueSizeClasses[valueSize])}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {value}
              </motion.div>
              
              {/* Trend Display */}
              {trend && (
                <motion.div 
                  className={cn(
                    "flex items-center space-x-1 text-sm font-medium",
                    getTrendColor()
                  )}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  {getTrendIcon()}
                  <span>
                    {trend.value > 0 && '+'}
                    {trend.value}
                    {trend.label}
                  </span>
                </motion.div>
              )}
            </div>
            
            {/* Description */}
            {description && (
              <p className="text-sm text-alpine-mist/70 mt-1">
                {description}
              </p>
            )}
          </>
        )}
        
        {/* Chart Area */}
        {chart && (
          <div className="mt-4">
            {chart}
          </div>
        )}
        
        {/* Footer */}
        {footer && (
          <div className="mt-auto pt-4 border-t border-glass-border/50">
            {footer}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default InfoCard;
