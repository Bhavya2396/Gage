import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import useHaptics from '@/hooks/useHaptics';
import { useAnimation } from '@/contexts/AnimationContext';

interface InteractiveSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  vertical?: boolean;
  showTicks?: boolean;
  showLabels?: boolean;
  showValue?: boolean;
  tickCount?: number;
  tickLabels?: string[];
  marks?: { value: number; label: string }[];
  trackClassName?: string;
  filledTrackClassName?: string;
  thumbClassName?: string;
  className?: string;
  thumbSize?: 'sm' | 'md' | 'lg';
  trackHeight?: 'xs' | 'sm' | 'md';
  color?: string;
  hapticFeedback?: boolean;
  formatValue?: (value: number) => string;
  valuePosition?: 'top' | 'bottom' | 'thumb';
  aria?: Record<string, string>;
}

/**
 * InteractiveSlider component with physical feedback and animations
 * Provides enhanced touch interaction with haptic feedback
 */
export const InteractiveSlider: React.FC<InteractiveSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  vertical = false,
  showTicks = false,
  showLabels = false,
  showValue = false,
  tickCount = 5,
  tickLabels,
  marks,
  trackClassName,
  filledTrackClassName,
  thumbClassName,
  className,
  thumbSize = 'md',
  trackHeight = 'sm',
  color = 'from-primary-cyan-500 to-primary-teal-500',
  hapticFeedback = true,
  formatValue = (val) => val.toString(),
  valuePosition = 'top',
  aria = {},
}) => {
  // Hooks
  const { isReducedMotion } = useAnimation();
  const { impact, selection } = useHaptics();
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  // Ensure value is within bounds and quantized to steps
  const normalizedValue = Math.max(min, Math.min(max, value));
  
  // Calculate percentage for positioning
  const percentage = ((normalizedValue - min) / (max - min)) * 100;
  
  // Motion values for smooth animations
  const motionPercentage = useMotionValue(percentage);
  const springPercentage = useSpring(motionPercentage, { 
    stiffness: isReducedMotion ? 500 : 300, 
    damping: isReducedMotion ? 40 : 30 
  });
  
  // Transform for thumb positioning
  const position = useTransform(
    springPercentage,
    [0, 100],
    vertical ? ['0%', '100%'] : ['0%', '100%']
  );
  
  // Calculate the size of each tick step
  const tickStep = (max - min) / (tickCount - 1);
  
  // Generate ticks array
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const tickValue = min + i * tickStep;
    return {
      value: tickValue,
      label: tickLabels ? tickLabels[i] : formatValue(tickValue),
      percentage: ((tickValue - min) / (max - min)) * 100,
    };
  });
  
  // Use any provided marks or fall back to ticks
  const displayMarks = marks || (showTicks ? ticks : []);
  
  // Size classes
  const thumbSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };
  
  const trackHeightClasses = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
  };
  
  // Update the value based on event position
  const updateValue = useCallback((clientX: number, clientY: number) => {
    if (!sliderRef.current || disabled) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const size = vertical ? rect.height : rect.width;
    const position = vertical ? clientY - rect.top : clientX - rect.left;
    
    // Calculate new percentage
    let newPercentage = Math.max(0, Math.min(100, (position / size) * 100));
    if (vertical) {
      newPercentage = 100 - newPercentage; // Invert for vertical
    }
    
    // Calculate value from percentage
    const range = max - min;
    let newValue = min + (range * newPercentage) / 100;
    
    // Apply step quantization
    newValue = Math.round(newValue / step) * step;
    newValue = Math.max(min, Math.min(max, newValue));
    
    // Find nearest mark if we're near one
    const markSnap = 5; // Percentage snap distance
    const nearestMark = displayMarks.find(mark => {
      const markPercentage = ((mark.value - min) / range) * 100;
      return Math.abs(markPercentage - newPercentage) < markSnap;
    });
    
    if (nearestMark) {
      newValue = nearestMark.value;
      
      // Extra haptic feedback when snapping to marks
      if (hapticFeedback && !isReducedMotion) {
        impact();
      }
    }
    
    // Set motion percentage for smooth animation
    motionPercentage.set(((newValue - min) / range) * 100);
    
    // Only call onChange if value has changed
    if (newValue !== value) {
      onChange(newValue);
      
      // Add haptic feedback when changing
      if (hapticFeedback && !isReducedMotion) {
        selection();
      }
    }
  }, [
    disabled, vertical, min, max, step, value, onChange, motionPercentage,
    hapticFeedback, isReducedMotion, impact, selection, displayMarks
  ]);
  
  // Handle mouse and touch interactions
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    setIsDragging(true);
    updateValue(e.clientX, e.clientY);
    
    // Capture pointer to handle dragging outside the element
    sliderRef.current?.setPointerCapture(e.pointerId);
  };
  
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateValue(e.clientX, e.clientY);
  };
  
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    updateValue(e.clientX, e.clientY);
    
    // Release pointer capture
    sliderRef.current?.releasePointerCapture(e.pointerId);
  };
  
  // Handle hover value preview
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || isDragging) return;
    
    const rect = sliderRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const size = vertical ? rect.height : rect.width;
    const position = vertical 
      ? rect.bottom - e.clientY 
      : e.clientX - rect.left;
    
    // Calculate hover value
    const percentage = Math.max(0, Math.min(100, (position / size) * 100));
    const range = max - min;
    const hoverVal = min + (range * percentage) / 100;
    
    setHoverValue(hoverVal);
  };
  
  const handleMouseLeave = () => {
    setHoverValue(null);
  };
  
  // Make sure value updates the motion value
  useEffect(() => {
    const newPercentage = ((normalizedValue - min) / (max - min)) * 100;
    motionPercentage.set(newPercentage);
  }, [normalizedValue, min, max, motionPercentage]);
  
  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    
    let newValue = value;
    const smallStep = step;
    const largeStep = Math.max(step, (max - min) / 10);
    
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(max, value + smallStep);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(min, value - smallStep);
        break;
      case 'PageUp':
        newValue = Math.min(max, value + largeStep);
        break;
      case 'PageDown':
        newValue = Math.max(min, value - largeStep);
        break;
      case 'Home':
        newValue = min;
        break;
      case 'End':
        newValue = max;
        break;
      default:
        return;
    }
    
    if (newValue !== value) {
      e.preventDefault();
      onChange(newValue);
      motionPercentage.set(((newValue - min) / (max - min)) * 100);
      
      // Add haptic feedback
      if (hapticFeedback && !isReducedMotion) {
        selection();
      }
    }
  };

  return (
    <div 
      className={cn(
        'relative',
        vertical ? 'h-48 w-8' : 'h-10 w-full',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Value display */}
      {showValue && valuePosition !== 'thumb' && (
        <div 
          className={cn(
            'absolute text-xs text-alpine-mist',
            valuePosition === 'top' ? '-top-6' : 'bottom-0',
            vertical ? 'left-8' : `left-[${percentage}%]`
          )}
          style={{
            [vertical ? 'bottom' : 'left']: `${percentage}%`,
            transform: vertical ? 'none' : 'translateX(-50%)',
          }}
        >
          {formatValue(value)}
        </div>
      )}
      
      {/* Main track */}
      <div 
        ref={sliderRef}
        className={cn(
          'absolute rounded-full bg-glass-background',
          vertical ? 'w-2 h-full top-0' : `${trackHeightClasses[trackHeight]} w-full top-1/2 -translate-y-1/2`,
          trackClassName
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-orientation={vertical ? 'vertical' : 'horizontal'}
        aria-disabled={disabled}
        {...aria}
      >
        {/* Filled track */}
        <motion.div
          className={cn(
            'absolute rounded-full bg-gradient-to-r',
            color,
            vertical ? 'w-full left-0 bottom-0' : 'h-full left-0',
            filledTrackClassName
          )}
          style={{
            [vertical ? 'height' : 'width']: springPercentage,
          }}
        />
        
        {/* Thumb */}
        <motion.div
          className={cn(
            'absolute rounded-full bg-white shadow-md flex items-center justify-center',
            thumbSizeClasses[thumbSize],
            vertical ? 'left-1/2 -translate-x-1/2' : 'top-1/2 -translate-y-1/2',
            isDragging && 'ring-2 ring-primary-cyan-400',
            disabled ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing',
            thumbClassName
          )}
          style={{
            [vertical ? 'bottom' : 'left']: position,
          }}
        >
          {/* Value display on thumb */}
          {showValue && valuePosition === 'thumb' && (
            <div className="absolute whitespace-nowrap -top-6 left-1/2 -translate-x-1/2 text-xs bg-glass-background backdrop-blur-sm px-1.5 py-0.5 rounded border border-glass-border text-alpine-mist">
              {formatValue(hoverValue !== null ? hoverValue : value)}
            </div>
          )}
        </motion.div>
        
        {/* Tick marks */}
        {showTicks && displayMarks.map((tick, index) => (
          <div
            key={index}
            className={cn(
              'absolute w-1 h-1 bg-alpine-mist/50 rounded-full',
              vertical 
                ? 'left-1/2 -translate-x-1/2' 
                : 'top-1/2 -translate-y-1/2'
            )}
            style={{
              [vertical ? 'bottom' : 'left']: `${tick.percentage}%`,
            }}
          />
        ))}
      </div>
      
      {/* Labels */}
      {showLabels && (
        <div className={cn(
          'absolute',
          vertical ? 'left-6 inset-y-0' : 'top-6 inset-x-0',
          'flex',
          vertical ? 'flex-col justify-between h-full items-start' : 'justify-between w-full items-center'
        )}>
          {displayMarks.map((mark, index) => (
            <div 
              key={index}
              className="text-xs text-alpine-mist/70"
            >
              {mark.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InteractiveSlider;
