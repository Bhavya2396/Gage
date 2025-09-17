import React from 'react';
import { cn } from '@/lib/utils';

interface TranslucentOverlayProps {
  children: React.ReactNode;
  opacity?: number; // 0 to 1
  blur?: number; // Blur amount in pixels
  className?: string;
  color?: string; // Background color
}

const TranslucentOverlay: React.FC<TranslucentOverlayProps> = ({
  children,
  opacity = 0.15, // Default very light opacity
  blur = 2, // Default slight blur
  className,
  color = 'rgba(15, 25, 35, 0.7)', // Default dark blue color
}) => {
  return (
    <div className={cn('relative', className)}>
      {/* The actual content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* The translucent overlay */}
      <div 
        className="absolute inset-0 -z-0 pointer-events-none"
        style={{
          backgroundColor: color,
          opacity: opacity,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
        }}
      />
    </div>
  );
};

export default TranslucentOverlay;
