import { useState, useCallback, useRef } from 'react';

interface AnimationOptions {
  initialValue?: boolean;
  duration?: number;
  onComplete?: () => void;
  delayIn?: number;
  delayOut?: number;
}

/**
 * Hook to control animation states
 * Provides methods for triggering animations with proper timing and sequencing
 * @param options Animation configuration options
 * @returns Animation state and control methods
 */
export function useAnimationControl(options: AnimationOptions = {}) {
  const {
    initialValue = false,
    duration = 300,
    onComplete,
    delayIn = 0,
    delayOut = 0,
  } = options;
  
  // Animation state
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(initialValue);
  
  // Store timeouts in refs for cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clear any existing timeouts
  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);
  
  // Show the animated element
  const show = useCallback(() => {
    clearTimeouts();
    
    // Set animating state immediately
    setIsAnimating(true);
    
    // Delay making the element visible if needed
    if (delayIn > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        
        // Clear animating state after duration
        timeoutRef.current = setTimeout(() => {
          setIsAnimating(false);
          if (onComplete) onComplete();
        }, duration);
      }, delayIn);
    } else {
      // Make visible immediately
      setIsVisible(true);
      
      // Clear animating state after duration
      timeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
        if (onComplete) onComplete();
      }, duration);
    }
  }, [delayIn, duration, clearTimeouts, onComplete]);
  
  // Hide the animated element
  const hide = useCallback(() => {
    clearTimeouts();
    
    // Set animating state immediately
    setIsAnimating(true);
    
    // Delay hiding if needed
    if (delayOut > 0) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        
        // Clear animating state after duration
        timeoutRef.current = setTimeout(() => {
          setIsAnimating(false);
          if (onComplete) onComplete();
        }, duration);
      }, delayOut);
    } else {
      // Hide immediately
      setIsVisible(false);
      
      // Clear animating state after duration
      timeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
        if (onComplete) onComplete();
      }, duration);
    }
  }, [delayOut, duration, clearTimeouts, onComplete]);
  
  // Toggle visibility
  const toggle = useCallback(() => {
    if (isVisible) {
      hide();
    } else {
      show();
    }
  }, [isVisible, show, hide]);
  
  // Cleanup on unmount
  const cleanup = useCallback(() => {
    clearTimeouts();
  }, [clearTimeouts]);
  
  return {
    isAnimating,
    isVisible,
    show,
    hide,
    toggle,
    cleanup,
  };
}

export default useAnimationControl;
