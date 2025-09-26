import { useRef, useState, useEffect, useCallback } from 'react';
import { useAnimation } from '@/contexts/AnimationContext';

interface GestureOptions {
  enablePinch?: boolean;
  enableRotate?: boolean;
  enableSwipe?: boolean;
  enableDoubleTap?: boolean;
  enableLongPress?: boolean;
  threshold?: number;
  velocityThreshold?: number;
  doubleTapTimeout?: number;
  longPressTimeout?: number;
  longPressTolerance?: number;
}

interface GestureCallbacks {
  onPinch?: (scale: number, center: { x: number, y: number }) => void;
  onPinchStart?: (center: { x: number, y: number }) => void;
  onPinchEnd?: (scale: number) => void;
  onRotate?: (angle: number, center: { x: number, y: number }) => void;
  onRotateStart?: (center: { x: number, y: number }) => void;
  onRotateEnd?: (angle: number) => void;
  onSwipe?: (direction: 'up' | 'down' | 'left' | 'right', velocity: number) => void;
  onDoubleTap?: (position: { x: number, y: number }) => void;
  onLongPress?: (position: { x: number, y: number }) => void;
  onTap?: (position: { x: number, y: number }) => void;
}

interface TouchState {
  active: boolean;
  startTime: number;
  touches: {
    id: number;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  }[];
  pinchDistance: number;
  pinchScale: number;
  rotation: number;
  initialAngle: number;
  lastTapTime: number;
  longPressTimer: NodeJS.Timeout | null;
  isTap: boolean;
  swipeVelocity: { x: number, y: number };
  lastMoveTime: number;
}

/**
 * Custom hook for advanced multi-touch gestures
 * Supports pinch, rotate, swipe, double-tap, and long-press interactions
 */
export function useGestures(
  options: GestureOptions = {},
  callbacks: GestureCallbacks = {}
) {
  const { isReducedMotion } = useAnimation();
  
  // Extract options with defaults
  const {
    enablePinch = true,
    enableRotate = true,
    enableSwipe = true,
    enableDoubleTap = true,
    enableLongPress = true,
    threshold = 10,
    velocityThreshold = 0.3,
    doubleTapTimeout = 300,
    longPressTimeout = 500,
    longPressTolerance = 10,
  } = options;
  
  // State
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  
  // Touch state ref (for performance - avoids re-renders during touch)
  const touchStateRef = useRef<TouchState>({
    active: false,
    startTime: 0,
    touches: [],
    pinchDistance: 0,
    pinchScale: 1,
    rotation: 0,
    initialAngle: 0,
    lastTapTime: 0,
    longPressTimer: null,
    isTap: false,
    swipeVelocity: { x: 0, y: 0 },
    lastMoveTime: 0,
  });
  
  // Calculate distance between two touch points
  const getDistance = useCallback((touchA: Touch, touchB: Touch): number => {
    const dx = touchA.clientX - touchB.clientX;
    const dy = touchA.clientY - touchB.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);
  
  // Calculate angle between two touch points
  const getAngle = useCallback((touchA: Touch, touchB: Touch): number => {
    const dx = touchB.clientX - touchA.clientX;
    const dy = touchB.clientY - touchA.clientY;
    return Math.atan2(dy, dx) * 180 / Math.PI;
  }, []);
  
  // Calculate center point between two touches
  const getCenter = useCallback((touchA: Touch, touchB: Touch): { x: number, y: number } => {
    return {
      x: (touchA.clientX + touchB.clientX) / 2,
      y: (touchA.clientY + touchB.clientY) / 2,
    };
  }, []);
  
  // Reset touch state
  const resetTouchState = useCallback(() => {
    const state = touchStateRef.current;
    
    // Clear any long press timer
    if (state.longPressTimer) {
      clearTimeout(state.longPressTimer);
      state.longPressTimer = null;
    }
    
    // Reset state
    state.active = false;
    state.touches = [];
    state.pinchDistance = 0;
    state.pinchScale = 1;
    state.rotation = 0;
    state.initialAngle = 0;
    state.isTap = false;
    state.swipeVelocity = { x: 0, y: 0 };
    
    setIsActive(false);
  }, []);
  
  // Update saved touch in state
  const updateTouch = useCallback((state: TouchState, touch: Touch) => {
    const index = state.touches.findIndex(t => t.id === touch.identifier);
    
    if (index !== -1) {
      state.touches[index].currentX = touch.clientX;
      state.touches[index].currentY = touch.clientY;
    }
  }, []);
  
  // Find a touch in state by id
  const findTouch = useCallback((state: TouchState, id: number) => {
    return state.touches.find(t => t.id === id);
  }, []);
  
  // Calculate velocity for swipe gestures
  const calculateSwipeVelocity = useCallback((state: TouchState, touch: Touch, time: number) => {
    const savedTouch = findTouch(state, touch.identifier);
    if (!savedTouch || state.lastMoveTime === 0) return;
    
    const dt = time - state.lastMoveTime;
    if (dt === 0) return;
    
    const dx = touch.clientX - savedTouch.currentX;
    const dy = touch.clientY - savedTouch.currentY;
    
    state.swipeVelocity = {
      x: dx / dt,
      y: dy / dt
    };
    
    state.lastMoveTime = time;
  }, [findTouch]);
  
  // Touch start handler
  const handleTouchStart = useCallback((event: TouchEvent) => {
    const state = touchStateRef.current;
    const time = event.timeStamp;
    
    // Store initial touch data
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i];
      
      state.touches.push({
        id: touch.identifier,
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
      });
    }
    
    // Start touch sequence if not active
    if (!state.active) {
      state.active = true;
      state.startTime = time;
      state.lastMoveTime = time;
      state.isTap = true;
      setIsActive(true);
      
      // Add haptic feedback
      if (!isReducedMotion && 'vibrate' in navigator) {
        navigator.vibrate(3); // Very subtle feedback
      }
      
      // Set long press timer
      if (enableLongPress) {
        state.longPressTimer = setTimeout(() => {
          // Only trigger if touch is still active and hasn't moved much
          if (state.active && state.touches.length === 1) {
            const touch = state.touches[0];
            const dx = touch.currentX - touch.startX;
            const dy = touch.currentY - touch.startY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < longPressTolerance) {
              callbacks.onLongPress?.({ x: touch.currentX, y: touch.currentY });
              
              // Add haptic feedback for long press
              if (!isReducedMotion && 'vibrate' in navigator) {
                navigator.vibrate(50); // Stronger feedback for long press
              }
              
              state.isTap = false; // Not a tap after long press
            }
          }
        }, longPressTimeout);
      }
      
      // Check for double tap
      if (enableDoubleTap && time - state.lastTapTime < doubleTapTimeout && state.touches.length === 1) {
        const touch = state.touches[0];
        callbacks.onDoubleTap?.({ x: touch.currentX, y: touch.currentY });
        
        // Add haptic feedback for double tap
        if (!isReducedMotion && 'vibrate' in navigator) {
          navigator.vibrate([10, 30, 10]); // Double pulse for double tap
        }
        
        state.isTap = false; // Not a regular tap after double tap
        state.lastTapTime = 0; // Reset to avoid triple-tap
      }
    }
    
    // Handle multi-touch gestures
    if (state.touches.length === 2) {
      const touchA = event.touches[0];
      const touchB = event.touches[1];
      
      if (enablePinch) {
        state.pinchDistance = getDistance(touchA, touchB);
        callbacks.onPinchStart?.(getCenter(touchA, touchB));
      }
      
      if (enableRotate) {
        state.initialAngle = getAngle(touchA, touchB);
        callbacks.onRotateStart?.(getCenter(touchA, touchB));
      }
    }
  }, [
    getDistance,
    getAngle,
    getCenter,
    enableDoubleTap,
    enableLongPress,
    enablePinch,
    enableRotate,
    callbacks,
    doubleTapTimeout,
    longPressTimeout,
    longPressTolerance,
    isReducedMotion
  ]);
  
  // Touch move handler
  const handleTouchMove = useCallback((event: TouchEvent) => {
    const state = touchStateRef.current;
    const time = event.timeStamp;
    
    if (!state.active) return;
    
    // Update stored touches
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i];
      updateTouch(state, touch);
      calculateSwipeVelocity(state, touch, time);
    }
    
    // Check if we've moved enough to no longer be a tap
    if (state.isTap && state.touches.length === 1) {
      const touch = state.touches[0];
      const dx = touch.currentX - touch.startX;
      const dy = touch.currentY - touch.startY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > threshold) {
        state.isTap = false;
        
        // Cancel long press timer if we've moved too far
        if (state.longPressTimer) {
          clearTimeout(state.longPressTimer);
          state.longPressTimer = null;
        }
      }
    }
    
    // Handle pinch gesture
    if (enablePinch && state.touches.length === 2) {
      const touchA = event.touches[0];
      const touchB = event.touches[1];
      
      const currentDistance = getDistance(touchA, touchB);
      const newCenter = getCenter(touchA, touchB);
      
      if (state.pinchDistance > 0) {
        const newScale = currentDistance / state.pinchDistance;
        state.pinchScale = newScale;
        setScale(newScale);
        setCenter(newCenter);
        
        callbacks.onPinch?.(newScale, newCenter);
      }
    }
    
    // Handle rotate gesture
    if (enableRotate && state.touches.length === 2) {
      const touchA = event.touches[0];
      const touchB = event.touches[1];
      
      const currentAngle = getAngle(touchA, touchB);
      const newCenter = getCenter(touchA, touchB);
      
      const angleDiff = currentAngle - state.initialAngle;
      state.rotation = angleDiff;
      setRotation(angleDiff);
      setCenter(newCenter);
      
      callbacks.onRotate?.(angleDiff, newCenter);
    }
  }, [
    getDistance,
    getAngle,
    getCenter,
    updateTouch,
    calculateSwipeVelocity,
    enablePinch,
    enableRotate,
    callbacks,
    threshold
  ]);
  
  // Touch end handler
  const handleTouchEnd = useCallback((event: TouchEvent) => {
    const state = touchStateRef.current;
    const time = event.timeStamp;
    
    if (!state.active) return;
    
    // Get touches that ended
    const endedTouches = [];
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i];
      const index = state.touches.findIndex(t => t.id === touch.identifier);
      
      if (index !== -1) {
        endedTouches.push({ ...state.touches[index] });
        state.touches.splice(index, 1);
      }
    }
    
    // Handle tap event
    if (state.isTap && endedTouches.length === 1 && state.touches.length === 0) {
      const touch = endedTouches[0];
      state.lastTapTime = time;
      callbacks.onTap?.({ x: touch.currentX, y: touch.currentY });
    }
    
    // Handle swipe event
    if (enableSwipe && endedTouches.length === 1 && time - state.startTime < 300) {
      const touch = endedTouches[0];
      const dx = touch.currentX - touch.startX;
      const dy = touch.currentY - touch.startY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > threshold) {
        // Calculate total velocity
        const velocity = Math.sqrt(
          state.swipeVelocity.x * state.swipeVelocity.x + 
          state.swipeVelocity.y * state.swipeVelocity.y
        );
        
        if (velocity > velocityThreshold) {
          // Determine direction with highest velocity
          const absX = Math.abs(dx);
          const absY = Math.abs(dy);
          
          if (absX > absY) {
            const direction = dx > 0 ? 'right' : 'left';
            callbacks.onSwipe?.(direction, velocity);
          } else {
            const direction = dy > 0 ? 'down' : 'up';
            callbacks.onSwipe?.(direction, velocity);
          }
          
          // Add haptic feedback for swipe
          if (!isReducedMotion && 'vibrate' in navigator) {
            navigator.vibrate(15); // Medium feedback for swipe
          }
        }
      }
    }
    
    // Handle pinch end
    if (enablePinch && state.touches.length < 2 && state.pinchDistance > 0) {
      callbacks.onPinchEnd?.(state.pinchScale);
      state.pinchDistance = 0;
      state.pinchScale = 1;
    }
    
    // Handle rotation end
    if (enableRotate && state.touches.length < 2 && state.initialAngle !== 0) {
      callbacks.onRotateEnd?.(state.rotation);
      state.initialAngle = 0;
      state.rotation = 0;
    }
    
    // Reset state if all touches are gone
    if (state.touches.length === 0) {
      resetTouchState();
    }
  }, [
    callbacks,
    enableSwipe,
    enablePinch,
    enableRotate,
    threshold,
    velocityThreshold,
    resetTouchState,
    isReducedMotion
  ]);
  
  // Handle touch cancel - clean up everything
  const handleTouchCancel = useCallback(() => {
    resetTouchState();
  }, [resetTouchState]);
  
  // Set up and clean up event handlers
  useEffect(() => {
    return () => resetTouchState();
  }, [resetTouchState]);
  
  // Prepare gesture handlers for the element
  const gestureHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
    style: { touchAction: 'none' }
  };

  return {
    scale,
    rotation,
    center,
    isActive,
    gestureHandlers,
    resetGesture: resetTouchState
  };
}

export default useGestures;
