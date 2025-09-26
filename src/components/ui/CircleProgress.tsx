import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { colors } from '@/design/tokens';
import { getRecoveryColor } from '@/design/tokens';

interface CircleProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  className?: string;
  showLabel?: boolean;
  label?: string;
  labelPosition?: 'inside' | 'bottom';
  animate?: boolean;
  colorByValue?: boolean;
}

export const CircleProgress: React.FC<CircleProgressProps> = ({
  percentage,
  size = 60,
  strokeWidth = 6,
  color,
  bgColor,
  className = '',
  showLabel = true,
  label,
  labelPosition = 'inside',
  animate = true,
  colorByValue = false,
}) => {
  // Ensure percentage is between 0 and 100
  const safePercentage = Math.max(0, Math.min(100, percentage));
  
  // Calculate circle parameters
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (safePercentage / 100) * circumference;
  
  // Determine color based on percentage if colorByValue is true
  const getCircleColor = () => {
    if (color) return color;
    if (colorByValue) return getRecoveryColor(safePercentage);
    return colors.primary.cyan;
  };
  
  // Get background color
  const getCircleBgColor = () => {
    if (bgColor) return bgColor;
    return 'rgba(255, 255, 255, 0.1)';
  };
  
  // Format percentage for display
  const formattedPercentage = `${Math.round(safePercentage)}%`;

  return (
    <div className={cn('relative inline-block', className)}>
      <div style={{ width: size, height: size }}>
        <svg
          className="transform -rotate-90"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={getCircleBgColor()}
            fill="transparent"
          />
          
          {/* Progress circle */}
          {animate ? (
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              stroke={getCircleColor()}
              fill="transparent"
              strokeLinecap="round"
              initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          ) : (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              stroke={getCircleColor()}
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          )}
        </svg>
        
        {/* Label inside the circle */}
        {showLabel && labelPosition === 'inside' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-alpine-mist text-sm font-medium" style={{ color: getCircleColor() }}>
              {label || formattedPercentage}
            </span>
          </div>
        )}
      </div>
      
      {/* Label below the circle */}
      {showLabel && labelPosition === 'bottom' && (
        <div className="mt-2 text-center">
          <span className="text-alpine-mist text-sm">{label || formattedPercentage}</span>
        </div>
      )}
    </div>
  );
};

export default CircleProgress;