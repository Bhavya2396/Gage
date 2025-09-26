import { useState, useCallback, useRef, useEffect } from 'react';
import { useAnimation } from '@/contexts/AnimationContext';

interface DragConfig {
  axis?: 'x' | 'y' | 'both';
  bounds?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  resistance?: number;
  threshold?: number;
  elasticity?: number;
  momentum?: boolean;
  minimumDistance?: number;
}

interface DragCallbacks {
  onDragStart?: (position: { x: number, y: number }, event: PointerEvent) => void;
  onDragMove?: (position: { x: number, y: number }, delta: { x: number, y: number }, event: PointerEvent) => void;
  onDragEnd?: (position: { x: number, y: number }, velocity: { x: number, y: number }, event: PointerEvent) => void;
  onSwipe?: (direction: 'up' | 'down' | 'left' | 'right', velocity: number, event: PointerEvent) => void;
  onThresholdExceeded?: (direction: 'up' | 'down' | 'left' | 'right', position: { x: number, y: number }) => void;
}

interface DragStyles {
  transform?: string;
  transition?: string;
  cursor?: string;
  touchAction?: string;
  userSelect?: string;
}

/**
 * Custom hook for sophisticated drag interactions with physics
 * Provides natural feeling drag behaviors with elastic boundaries and momentum
 */
export function useDragInteraction(
  config: DragConfig = {},
  callbacks: DragCallbacks = {}
) {
  // Extract configuration with defaults
  const {
    axis = 'both',
    bounds = { top: -Infinity, right: Infinity, bottom: Infinity, left: -Infinity },
    resistance = 0.15,
    threshold = 40,
    elasticity = 0.55,
    momentum = true,
    minimumDistance = 5,
  } = config;
  
  // States and refs
  const { isReducedMotion } = useAnimation();
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStyles, setDragStyles] = useState<DragStyles>({});
  
  // Refs for tracking pointer events and animation
  const startPositionRef = useRef({ x: 0, y: 0 });
  const currentPositionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const thresholdsExceededRef = useRef<Set<string>>(new Set());
  
  // Calculate drag constraints based on bounds and resistance
  const calculateConstrainedPosition = useCallback((x: number, y: number) => {
    let constrainedX = x;
    let constrainedY = y;
    
    // Apply axis constraints
    if (axis === 'y') constrainedX = 0;
    if (axis === 'x') constrainedY = 0;
    
    // Apply boundaries with elastic resistance
    if (bounds.left !== undefined && constrainedX < bounds.left) {
      const overflow = bounds.left - constrainedX;
      constrainedX = bounds.left - (overflow * resistance);
    }
    
    if (bounds.right !== undefined && constrainedX > bounds.right) {
      const overflow = constrainedX - bounds.right;
      constrainedX = bounds.right + (overflow * resistance);
    }
    
    if (bounds.top !== undefined && constrainedY < bounds.top) {
      const overflow = bounds.top - constrainedY;
      constrainedY = bounds.top - (overflow * resistance);
    }
    
    if (bounds.bottom !== undefined && constrainedY > bounds.bottom) {
      const overflow = constrainedY - bounds.bottom;
      constrainedY = bounds.bottom + (overflow * resistance);
    }
    
    return { x: constrainedX, y: constrainedY };
  }, [axis, bounds, resistance]);
  
  // Update position and styles
  const updatePosition = useCallback((x: number, y: number, withTransition = false) => {
    const { x: constrainedX, y: constrainedY } = calculateConstrainedPosition(x, y);
    
    // Update position state and ref
    setPosition({ x: constrainedX, y: constrainedY });
    currentPositionRef.current = { x: constrainedX, y: constrainedY };
    
    // Generate CSS transform
    const transform = `translate3d(${constrainedX}px, ${constrainedY}px, 0)`;
    
    // Update styles with or without transition
    setDragStyles({
      transform,
      transition: withTransition ? `transform ${elasticity * 0.5}s cubic-bezier(0.25, 0.8, 0.4, 1)` : 'none',
      cursor: isDragging ? 'grabbing' : 'grab',
      touchAction: 'none',
      userSelect: 'none',
    });
    
    // Check threshold crossings
    checkThresholds(constrainedX, constrainedY);
    
    return { x: constrainedX, y: constrainedY };
  }, [calculateConstrainedPosition, elasticity, isDragging]);
  
  // Check if thresholds are exceeded
  const checkThresholds = useCallback((x: number, y: number) => {
    if (!callbacks.onThresholdExceeded || !threshold) return;
    
    const directions: Array<['up' | 'down' | 'left' | 'right', boolean]> = [
      ['up', y < -threshold],
      ['down', y > threshold],
      ['left', x < -threshold],
      ['right', x > threshold]
    ];
    
    directions.forEach(([direction, isExceeded]) => {
      const key = `${direction}`;
      
      if (isExceeded && !thresholdsExceededRef.current.has(key)) {
        thresholdsExceededRef.current.add(key);
        callbacks.onThresholdExceeded?.(direction, { x, y });
      } else if (!isExceeded && thresholdsExceededRef.current.has(key)) {
        thresholdsExceededRef.current.delete(key);
      }
    });
  }, [callbacks, threshold]);
  
  // Apply momentum-based deceleration animation
  const applyMomentum = useCallback((velocity: { x: number, y: number }) => {
    if (isReducedMotion || !momentum) return;
    
    // Minimum velocity threshold
    const minVelocity = 0.5;
    const velocityMagnitude = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
    
    if (velocityMagnitude < minVelocity) return;
    
    // Friction coefficient (lower = more slippery)
    const friction = 0.92;
    
    // Current velocity
    let currentVelocityX = velocity.x;
    let currentVelocityY = velocity.y;
    
    // Current position from ref
    let currentX = currentPositionRef.current.x;
    let currentY = currentPositionRef.current.y;
    
    const animateMomentum = () => {
      // Apply friction
      currentVelocityX *= friction;
      currentVelocityY *= friction;
      
      // Update position
      currentX += currentVelocityX;
      currentY += currentVelocityY;
      
      // Update element position
      updatePosition(currentX, currentY);
      
      // Continue animation until velocity is very low
      if (Math.abs(currentVelocityX) > minVelocity || Math.abs(currentVelocityY) > minVelocity) {
        animationFrameRef.current = requestAnimationFrame(animateMomentum);
      } else {
        // Snap to nearest bound if close
        snapToBounds();
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animateMomentum);
  }, [updatePosition, isReducedMotion, momentum]);
  
  // Snap to nearest bound if near boundary
  const snapToBounds = useCallback(() => {
    const { x, y } = currentPositionRef.current;
    const snapThreshold = 20;
    let newX = x;
    let newY = y;
    let shouldSnap = false;
    
    // Check if near boundary and snap
    if (bounds.left !== undefined && Math.abs(x - bounds.left) < snapThreshold) {
      newX = bounds.left;
      shouldSnap = true;
    } else if (bounds.right !== undefined && Math.abs(x - bounds.right) < snapThreshold) {
      newX = bounds.right;
      shouldSnap = true;
    }
    
    if (bounds.top !== undefined && Math.abs(y - bounds.top) < snapThreshold) {
      newY = bounds.top;
      shouldSnap = true;
    } else if (bounds.bottom !== undefined && Math.abs(y - bounds.bottom) < snapThreshold) {
      newY = bounds.bottom;
      shouldSnap = true;
    }
    
    if (shouldSnap) {
      updatePosition(newX, newY, true);
    }
  }, [bounds, updatePosition]);
  
  // Handle drag start
  const handleDragStart = useCallback((event: PointerEvent) => {
    // Cancel any existing animation
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Reset thresholds tracking
    thresholdsExceededRef.current.clear();
    
    // Capture current position and time
    startPositionRef.current = { ...currentPositionRef.current };
    lastTimeRef.current = event.timeStamp;
    velocityRef.current = { x: 0, y: 0 };
    
    setIsDragging(true);
    
    // Call drag start callback if provided
    callbacks.onDragStart?.({ ...currentPositionRef.current }, event);
    
    // Add haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(5); // Subtle vibration
    }
    
    // Capture pointer to track movement outside the element
    (event.target as Element).setPointerCapture(event.pointerId);
  }, [callbacks]);
  
  // Handle drag movement
  const handleDragMove = useCallback((event: PointerEvent) => {
    if (!isDragging) return;
    
    // Calculate new position
    const deltaX = axis !== 'y' ? event.movementX : 0;
    const deltaY = axis !== 'x' ? event.movementY : 0;
    
    const newX = currentPositionRef.current.x + deltaX;
    const newY = currentPositionRef.current.y + deltaY;
    
    // Update position
    const { x: updatedX, y: updatedY } = updatePosition(newX, newY);
    
    // Calculate velocity for momentum
    const now = event.timeStamp;
    const timeDelta = now - lastTimeRef.current;
    
    if (timeDelta > 0) {
      velocityRef.current = {
        x: deltaX / timeDelta * 16.7, // Normalize to roughly 60fps
        y: deltaY / timeDelta * 16.7,
      };
    }
    
    lastTimeRef.current = now;
    
    // Call drag move callback if provided
    callbacks.onDragMove?.({ x: updatedX, y: updatedY }, { x: deltaX, y: deltaY }, event);
  }, [axis, callbacks, isDragging, updatePosition]);
  
  // Handle drag end
  const handleDragEnd = useCallback((event: PointerEvent) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Calculate total distance dragged
    const totalDeltaX = currentPositionRef.current.x - startPositionRef.current.x;
    const totalDeltaY = currentPositionRef.current.y - startPositionRef.current.y;
    const distance = Math.sqrt(totalDeltaX * totalDeltaX + totalDeltaY * totalDeltaY);
    
    // Call drag end callback
    callbacks.onDragEnd?.(
      { ...currentPositionRef.current },
      { ...velocityRef.current },
      event
    );
    
    // Detect swipe direction if dragged far enough
    if (distance >= minimumDistance) {
      const absVelocityX = Math.abs(velocityRef.current.x);
      const absVelocityY = Math.abs(velocityRef.current.y);
      
      // Determine primary swipe direction
      if (absVelocityX > absVelocityY && absVelocityX > 5) {
        const direction = velocityRef.current.x > 0 ? 'right' : 'left';
        callbacks.onSwipe?.(direction, absVelocityX, event);
      } else if (absVelocityY > absVelocityX && absVelocityY > 5) {
        const direction = velocityRef.current.y > 0 ? 'down' : 'up';
        callbacks.onSwipe?.(direction, absVelocityY, event);
      }
    }
    
    // Apply momentum-based animation
    applyMomentum(velocityRef.current);
    
    // Release pointer capture
    (event.target as Element).releasePointerCapture(event.pointerId);
  }, [isDragging, callbacks, applyMomentum, minimumDistance]);
  
  // Reset position
  const resetPosition = useCallback((animate = true) => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    updatePosition(0, 0, animate);
  }, [updatePosition]);
  
  // Set a new position
  const setNewPosition = useCallback((x: number, y: number, animate = true) => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    updatePosition(x, y, animate);
  }, [updatePosition]);
  
  // Clean up event handlers and animations
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Prepare event handlers for the element
  const dragHandlers = {
    onPointerDown: handleDragStart,
    onPointerMove: handleDragMove,
    onPointerUp: handleDragEnd,
    onPointerCancel: handleDragEnd,
  };

  return {
    position,
    isDragging,
    dragHandlers,
    dragStyles,
    resetPosition,
    setPosition: setNewPosition,
  };
}

export default useDragInteraction;
