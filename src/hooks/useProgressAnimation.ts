import { useCallback, useState, useRef, useEffect } from 'react';
import { useAnimation } from '@/contexts/AnimationContext';

interface ProgressAnimationOptions {
  duration?: number;
  delay?: number;
  easing?: string;
  threshold?: number;
  onMilestone?: (milestone: number, value: number) => void;
  milestones?: number[];
  countUp?: boolean;
}

/**
 * Custom hook for creating satisfying progress animations
 * Provides utilities for animating progress values, counters, and achievement effects
 */
export function useProgressAnimation(initialValue: number = 0) {
  const { isReducedMotion, globalAnimationSpeed } = useAnimation();
  const [displayValue, setDisplayValue] = useState(initialValue);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef<number>(initialValue);
  const targetValueRef = useRef<number>(initialValue);
  
  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Animate value from current to target
  const animateTo = useCallback((
    targetValue: number,
    options: ProgressAnimationOptions = {}
  ) => {
    const {
      duration = 1000,
      delay = 0,
      easing = 'easeOutExpo',
      threshold = 0.1,
      onMilestone,
      milestones = [],
      countUp = true
    } = options;
    
    // Don't animate if reduced motion is enabled
    if (isReducedMotion) {
      setDisplayValue(targetValue);
      return;
    }
    
    // Adjust duration based on global animation speed
    const adjustedDuration = duration / globalAnimationSpeed;
    
    // Cancel any existing animation
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // Store references
    startValueRef.current = displayValue;
    targetValueRef.current = targetValue;
    setIsAnimating(true);
    
    // Track passed milestones
    const passedMilestones = new Set<number>();
    
    // Animation start handler with delay support
    const startAnimation = () => {
      startTimeRef.current = performance.now();
      
      // Easing functions
      const easingFunctions: Record<string, (x: number) => number> = {
        linear: (x) => x,
        easeInQuad: (x) => x * x,
        easeOutQuad: (x) => 1 - (1 - x) * (1 - x),
        easeInOutQuad: (x) => x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2,
        easeInCubic: (x) => x * x * x,
        easeOutCubic: (x) => 1 - Math.pow(1 - x, 3),
        easeInOutCubic: (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
        easeOutExpo: (x) => x === 1 ? 1 : 1 - Math.pow(2, -10 * x),
        easeInExpo: (x) => x === 0 ? 0 : Math.pow(2, 10 * x - 10),
        easeInOutExpo: (x) => x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? 
          Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
        easeOutBack: (x) => {
          const c1 = 1.70158;
          const c3 = c1 + 1;
          return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
        },
      };
      
      const easingFn = easingFunctions[easing] || easingFunctions.easeOutExpo;
      
      // Animation frame handler
      const animate = (time: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = time;
        }
        
        const elapsed = time - startTimeRef.current;
        const progress = Math.min(elapsed / adjustedDuration, 1);
        const easedProgress = easingFn(progress);
        
        const startValue = startValueRef.current;
        const targetValue = targetValueRef.current;
        const diff = targetValue - startValue;
        const currentValue = startValue + diff * easedProgress;
        
        // Round value to avoid unnecessary decimals
        const roundedValue = Math.abs(diff) > 100 
          ? Math.round(currentValue) 
          : Math.abs(diff) > 10 
            ? Number(currentValue.toFixed(1)) 
            : Number(currentValue.toFixed(2));
        
        setDisplayValue(roundedValue);
        
        // Check milestones
        if (onMilestone && milestones.length > 0) {
          const increasingValue = targetValue > startValue;
          
          milestones.forEach(milestone => {
            const crossedMilestone = increasingValue 
              ? (startValue < milestone && currentValue >= milestone)
              : (startValue > milestone && currentValue <= milestone);
            
            if (crossedMilestone && !passedMilestones.has(milestone)) {
              passedMilestones.add(milestone);
              onMilestone(milestone, currentValue);
            }
          });
        }
        
        // Continue animation if not complete
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Ensure final value is exactly target value
          setDisplayValue(targetValue);
          setIsAnimating(false);
          animationRef.current = null;
          startTimeRef.current = null;
          
          // Check if target is a significant achievement (90% or 100%)
          if (targetValue === 100 || targetValue === 1) {
            setIsCelebrating(true);
            setTimeout(() => setIsCelebrating(false), 3000);
          }
        }
      };
      
      // Start the animation loop
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Handle delay
    if (delay > 0) {
      setTimeout(startAnimation, delay);
    } else {
      startAnimation();
    }
    
    // Return methods to control the animation
    return {
      cancel: () => {
        if (animationRef.current !== null) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
          setIsAnimating(false);
        }
      },
      finish: () => {
        if (animationRef.current !== null) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
          setDisplayValue(targetValue);
          setIsAnimating(false);
        }
      }
    };
  }, [displayValue, isReducedMotion, globalAnimationSpeed]);
  
  // Animate a counter (numbers counting up/down)
  const animateCounter = useCallback((
    targetValue: number,
    options: ProgressAnimationOptions = {}
  ) => {
    const defaultOptions = {
      duration: 1500,
      easing: 'easeOutExpo',
      countUp: true,
      ...options
    };
    
    return animateTo(targetValue, defaultOptions);
  }, [animateTo]);
  
  // Animate progress with milestone celebrations
  const animateProgress = useCallback((
    targetValue: number,
    options: ProgressAnimationOptions = {}
  ) => {
    const defaultOptions = {
      duration: 2000,
      easing: 'easeOutExpo',
      milestones: [25, 50, 75, 100],
      ...options
    };
    
    return animateTo(targetValue, defaultOptions);
  }, [animateTo]);
  
  // Format the value for display
  const getFormattedValue = useCallback((
    format: 'number' | 'percent' | 'currency' | 'compact' = 'number',
    options?: Intl.NumberFormatOptions
  ) => {
    switch (format) {
      case 'percent':
        return `${displayValue}%`;
      case 'currency':
        return new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: 'USD',
          ...options
        }).format(displayValue);
      case 'compact':
        return new Intl.NumberFormat(undefined, {
          notation: 'compact',
          ...options
        }).format(displayValue);
      default:
        return displayValue.toString();
    }
  }, [displayValue]);

  return {
    value: displayValue,
    setValue: setDisplayValue,
    animateTo,
    animateCounter,
    animateProgress,
    isAnimating,
    isCelebrating,
    getFormattedValue,
  };
}

export default useProgressAnimation;
