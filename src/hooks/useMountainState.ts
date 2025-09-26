import { useState, useEffect, useCallback } from 'react';
import { TimeOfDay, WeatherCondition } from '@/types';
import { useTimeOfDay } from './useTimeOfDay';
import { useActivityPoints } from '@/contexts/ActivityPointsContext';

interface MountainStateOptions {
  initialFocused?: boolean;
  manualTimeOfDay?: TimeOfDay;
  initialWeather?: WeatherCondition;
}

/**
 * Custom hook to manage Mountain visualization state
 * Centralizes mountain-related state across components
 */
export function useMountainState(options: MountainStateOptions = {}) {
  const {
    initialFocused = false,
    manualTimeOfDay,
    initialWeather = 'clear'
  } = options;
  
  // Get current time of day from hook
  const { timeOfDay } = useTimeOfDay(manualTimeOfDay);
  
  // Get progress data from context
  const { getProgressPercentage, getCurrentPhase } = useActivityPoints();
  
  // Mountain state
  const [isFocused, setIsFocused] = useState(initialFocused);
  const [isLoaded, setIsLoaded] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState<WeatherCondition>(initialWeather);
  const [is3DEnabled, setIs3DEnabled] = useState(false);
  
  // Performance state
  const [renderQuality, setRenderQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [fps, setFps] = useState(60);
  
  // Handle device performance detection
  useEffect(() => {
    // Simple device capability check
    const checkPerformance = () => {
      // Check if device is likely mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      // Check if device has low memory
      const hasLowMemory = (navigator as any).deviceMemory !== undefined && (navigator as any).deviceMemory < 4;
      
      // Set initial quality based on device capabilities
      if (isMobile || hasLowMemory) {
        setRenderQuality('low');
        setIs3DEnabled(false);
      } else {
        // Desktop or high-end device
        setRenderQuality('medium');
        setIs3DEnabled(true);
      }
    };
    
    checkPerformance();
  }, []);
  
  // Simulate weather conditions changing occasionally
  useEffect(() => {
    // Only change weather if not manually specified
    if (initialWeather === undefined) {
      const weatherTypes: WeatherCondition[] = ['clear', 'cloudy', 'rainy', 'snowy'];
      const weatherWeights = [0.6, 0.25, 0.1, 0.05]; // Probability weights
      
      // Change weather occasionally
      const weatherInterval = setInterval(() => {
        // Random weighted selection
        const random = Math.random();
        let cumulativeWeight = 0;
        
        for (let i = 0; i < weatherTypes.length; i++) {
          cumulativeWeight += weatherWeights[i];
          if (random <= cumulativeWeight) {
            setWeatherCondition(weatherTypes[i]);
            break;
          }
        }
      }, 5 * 60 * 1000); // Every 5 minutes
      
      return () => clearInterval(weatherInterval);
    }
  }, [initialWeather]);
  
  // Track FPS for performance monitoring
  useEffect(() => {
    if (!isFocused) return; // Only track FPS when focused
    
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFps = () => {
      const now = performance.now();
      frameCount++;
      
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }
      
      requestAnimationFrame(measureFps);
    };
    
    const frameId = requestAnimationFrame(measureFps);
    
    return () => cancelAnimationFrame(frameId);
  }, [isFocused]);
  
  // Toggle mountain focus
  const toggleFocus = useCallback(() => {
    setIsFocused(prev => !prev);
  }, []);
  
  // Manually set weather condition
  const setWeather = useCallback((condition: WeatherCondition) => {
    setWeatherCondition(condition);
  }, []);
  
  // Toggle 3D rendering
  const toggle3D = useCallback(() => {
    setIs3DEnabled(prev => !prev);
  }, []);
  
  // Handle loading complete
  const handleLoadComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);
  
  // Dynamically adjust quality based on performance
  useEffect(() => {
    if (fps < 30 && renderQuality !== 'low') {
      setRenderQuality('low');
    } else if (fps > 50 && renderQuality === 'low') {
      setRenderQuality('medium');
    } else if (fps > 58 && renderQuality === 'medium') {
      setRenderQuality('high');
    }
  }, [fps, renderQuality]);

  return {
    // State
    isFocused,
    isLoaded,
    timeOfDay,
    weatherCondition,
    is3DEnabled,
    renderQuality,
    fps,
    
    // Current progress
    progressPercentage: getProgressPercentage(),
    currentPhase: getCurrentPhase(),
    
    // Actions
    toggleFocus,
    setFocused: setIsFocused,
    setWeather,
    toggle3D,
    setIs3DEnabled,
    handleLoadComplete,
    setRenderQuality,
  };
}

export default useMountainState;
