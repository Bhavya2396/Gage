import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccessibility } from './AccessibilityContext';

// Animation preferences type
export interface AnimationPreferences {
  enableAnimations: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  enableParallax: boolean;
  enableTransitions: boolean;
  enableHoverEffects: boolean;
}

// Context type
interface AnimationContextType {
  preferences: AnimationPreferences;
  updatePreferences: (prefs: Partial<AnimationPreferences>) => void;
  resetPreferences: () => void;
  shouldAnimate: () => boolean;
  getAnimationDuration: (baseDuration: number) => number;
}

// Default preferences
const defaultPreferences: AnimationPreferences = {
  enableAnimations: true,
  animationSpeed: 'normal',
  enableParallax: true,
  enableTransitions: true,
  enableHoverEffects: true,
};

// Create context
const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

// Provider component
export const AnimationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { settings: accessibilitySettings } = useAccessibility();
  const [preferences, setPreferences] = useState<AnimationPreferences>(() => {
    // Load preferences from localStorage on initial render
    const savedPreferences = localStorage.getItem('animationPreferences');
    if (savedPreferences) {
      try {
        return JSON.parse(savedPreferences);
      } catch (error) {
        console.error('Error parsing saved animation preferences:', error);
        return defaultPreferences;
      }
    }
    return defaultPreferences;
  });

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('animationPreferences', JSON.stringify(preferences));
  }, [preferences]);

  // Update preferences
  const updatePreferences = (newPrefs: Partial<AnimationPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...newPrefs,
    }));
  };

  // Reset preferences to defaults
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  // Check if animations should run (considering both animation preferences and accessibility settings)
  const shouldAnimate = () => {
    return preferences.enableAnimations && !accessibilitySettings.reducedMotion;
  };

  // Get adjusted animation duration based on speed preference and accessibility settings
  const getAnimationDuration = (baseDuration: number) => {
    if (accessibilitySettings.reducedMotion) {
      return 0.01; // Nearly instant for reduced motion
    }

    const speedMultiplier = {
      slow: 1.5,
      normal: 1,
      fast: 0.5,
    }[preferences.animationSpeed];

    return baseDuration * speedMultiplier;
  };

  return (
    <AnimationContext.Provider 
      value={{ 
        preferences, 
        updatePreferences, 
        resetPreferences,
        shouldAnimate,
        getAnimationDuration,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

// Custom hook for using the animation context
export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

export default AnimationProvider;