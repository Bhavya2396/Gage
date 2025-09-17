import React from 'react';

interface CircleProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  className?: string;
}

export const CircleProgress: React.FC<CircleProgressProps> = ({
  percentage,
  size = 60,
  strokeWidth = 6,
  color = 'cyan-primary',
  bgColor = 'glass-border',
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className={`stroke-${bgColor} fill-transparent`}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`stroke-${color} fill-transparent transition-all duration-500 ease-in-out`}
          strokeLinecap="round"
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-${color} text-sm font-medium`}>
          {percentage}%
        </span>
      </div>
    </div>
  );
};

export default CircleProgress;

