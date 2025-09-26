import { useCallback, useState, useEffect } from 'react';
import { useAnimation } from '@/contexts/AnimationContext';

type HapticPattern = 
  | 'selection' 
  | 'impact' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'notification'
  | 'custom';

interface HapticOptions {
  disableAll?: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
  fallbackAudio?: boolean;
}

/**
 * Custom hook for consistent haptic feedback across devices
 * Provides standardized haptic patterns and graceful degradation
 */
export function useHaptics(options: HapticOptions = {}) {
  const {
    disableAll = false,
    intensity = 'medium',
    fallbackAudio = true
  } = options;
  
  const { isReducedMotion } = useAnimation();
  const [isAvailable, setIsAvailable] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  
  // Check for haptic feedback availability
  useEffect(() => {
    const hasVibration = 'vibrate' in navigator;
    
    // On iOS, there's no direct way to check, but we can infer it exists on modern devices
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const hasHaptics = hasVibration || isIOS;
    
    setIsAvailable(hasHaptics);
    
    // If fallback audio is enabled and vibration is not available
    if (fallbackAudio && !hasVibration) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(audioCtx);
      } catch (e) {
        console.warn('Audio feedback fallback unavailable:', e);
      }
    }
    
    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [fallbackAudio]);
  
  // Generate haptic feedback patterns
  const getPattern = useCallback((pattern: HapticPattern, customPattern?: number[]) => {
    // Intensity multipliers
    const intensityFactor = {
      light: 0.5,
      medium: 1,
      heavy: 1.5
    }[intensity];
    
    // Base durations
    const baseDuration = 20 * intensityFactor;
    const shortDuration = 10 * intensityFactor;
    const longDuration = 40 * intensityFactor;
    const pauseDuration = 30 * intensityFactor;
    
    // Round durations to integers
    const normalize = (val: number) => Math.max(1, Math.round(val));
    
    switch (pattern) {
      case 'selection':
        return [normalize(shortDuration)];
      case 'impact':
        return [normalize(baseDuration)];
      case 'success':
        return [
          normalize(shortDuration), 
          normalize(pauseDuration), 
          normalize(longDuration)
        ];
      case 'warning':
        return [
          normalize(baseDuration), 
          normalize(pauseDuration), 
          normalize(baseDuration)
        ];
      case 'error':
        return [
          normalize(longDuration), 
          normalize(pauseDuration), 
          normalize(longDuration), 
          normalize(pauseDuration), 
          normalize(longDuration)
        ];
      case 'notification':
        return [
          normalize(shortDuration), 
          normalize(pauseDuration / 2), 
          normalize(shortDuration), 
          normalize(pauseDuration / 2), 
          normalize(baseDuration)
        ];
      case 'custom':
        return customPattern || [normalize(baseDuration)];
    }
  }, [intensity]);
  
  // Play audio feedback as fallback
  const playAudioFeedback = useCallback((pattern: HapticPattern) => {
    if (!audioContext) return;
    
    // Create properties based on pattern
    let frequency, duration;
    
    switch (pattern) {
      case 'selection':
        frequency = 200;
        duration = 0.03;
        break;
      case 'impact':
        frequency = 150;
        duration = 0.05;
        break;
      case 'success':
        frequency = 440;
        duration = 0.1;
        break;
      case 'warning':
        frequency = 330;
        duration = 0.1;
        break;
      case 'error':
        frequency = 220;
        duration = 0.15;
        break;
      case 'notification':
        frequency = 660;
        duration = 0.1;
        break;
      default:
        frequency = 200;
        duration = 0.05;
    }
    
    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      
      // Very quiet sound, just enough for tactile feedback
      gainNode.gain.value = 0.03;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      
      // Gentle fade out
      gainNode.gain.exponentialRampToValueAtTime(
        0.001, audioContext.currentTime + duration
      );
      
      setTimeout(() => {
        oscillator.stop();
      }, duration * 1000);
    } catch (e) {
      console.warn('Error playing audio feedback:', e);
    }
  }, [audioContext]);
  
  // The main trigger function
  const triggerHaptic = useCallback((
    pattern: HapticPattern = 'selection',
    customPattern?: number[]
  ) => {
    // Skip if disabled by user preference or reduced motion
    if (disableAll || isReducedMotion) return;
    
    // Get the appropriate vibration pattern
    const vibrationPattern = getPattern(pattern, customPattern);
    
    // Try native haptic feedback first
    if ('vibrate' in navigator) {
      navigator.vibrate(vibrationPattern);
      return;
    }
    
    // Fall back to audio feedback if enabled
    if (fallbackAudio && audioContext) {
      playAudioFeedback(pattern);
    }
  }, [disableAll, isReducedMotion, getPattern, fallbackAudio, audioContext, playAudioFeedback]);
  
  // Specific feedback types for common interactions
  const selection = useCallback(() => triggerHaptic('selection'), [triggerHaptic]);
  const impact = useCallback(() => triggerHaptic('impact'), [triggerHaptic]);
  const success = useCallback(() => triggerHaptic('success'), [triggerHaptic]);
  const warning = useCallback(() => triggerHaptic('warning'), [triggerHaptic]);
  const error = useCallback(() => triggerHaptic('error'), [triggerHaptic]);
  const notification = useCallback(() => triggerHaptic('notification'), [triggerHaptic]);
  
  // Custom pattern
  const custom = useCallback((pattern: number[]) => {
    triggerHaptic('custom', pattern);
  }, [triggerHaptic]);

  return {
    isAvailable,
    triggerHaptic,
    selection,
    impact,
    success,
    warning,
    error,
    notification,
    custom
  };
}

export default useHaptics;
