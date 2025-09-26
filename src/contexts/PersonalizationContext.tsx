import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define personalization preferences types
export interface PersonalizationPreferences {
  // Visual preferences
  colorTheme: 'default' | 'high-contrast' | 'muted' | 'warm' | 'cool';
  reducedMotion: boolean;
  reducedTransparency: boolean;
  highContrast: boolean;
  
  // Content preferences
  detailLevel: 'concise' | 'balanced' | 'detailed';
  metricSystem: 'imperial' | 'metric';
  
  // Feature preferences
  showJourneyLandmarks: boolean;
  showFriendProgress: boolean;
  showWeatherEffects: boolean;
  enableHapticFeedback: boolean;
}

// Default preferences
const defaultPreferences: PersonalizationPreferences = {
  colorTheme: 'default',
  reducedMotion: false,
  reducedTransparency: false,
  highContrast: false,
  
  detailLevel: 'balanced',
  metricSystem: 'imperial',
  
  showJourneyLandmarks: true,
  showFriendProgress: true,
  showWeatherEffects: true,
  enableHapticFeedback: true,
};

// Context type definition
interface PersonalizationContextType {
  preferences: PersonalizationPreferences;
  updatePreferences: (updates: Partial<PersonalizationPreferences>) => void;
  resetPreferences: () => void;
  isReducedMotion: () => boolean;
  isHighContrast: () => boolean;
  shouldShowFeature: (featureName: keyof Pick<PersonalizationPreferences, 
    'showJourneyLandmarks' | 'showFriendProgress' | 'showWeatherEffects'>) => boolean;
}

// Create context with default undefined value
const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

// Provider component
export const PersonalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<PersonalizationPreferences>(defaultPreferences);
  
  // Load preferences from localStorage on initial render
  useEffect(() => {
    const savedPreferences = localStorage.getItem('personalizationPreferences');
    if (savedPreferences) {
      try {
        const parsedPreferences = JSON.parse(savedPreferences);
        setPreferences(parsedPreferences);
      } catch (error) {
        console.error('Error parsing saved preferences:', error);
      }
    }
  }, []);
  
  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('personalizationPreferences', JSON.stringify(preferences));
  }, [preferences]);
  
  // Update preferences
  const updatePreferences = (updates: Partial<PersonalizationPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...updates,
    }));
  };
  
  // Reset to defaults
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };
  
  // Helper functions for common preference checks
  const shouldShowFeature = (featureName: keyof Pick<PersonalizationPreferences, 
    'showJourneyLandmarks' | 'showFriendProgress' | 'showWeatherEffects'>) => {
    return preferences[featureName];
  };
  
  const isReducedMotion = () => preferences.reducedMotion;
  
  const isHighContrast = () => preferences.highContrast;
  
  // Context value
  const contextValue: PersonalizationContextType = {
    preferences,
    updatePreferences,
    resetPreferences,
    shouldShowFeature,
    isReducedMotion,
    isHighContrast,
  };
  
  return (
    <PersonalizationContext.Provider value={contextValue}>
      {children}
    </PersonalizationContext.Provider>
  );
};

// Custom hook for using the context
export const usePersonalization = () => {
  const context = useContext(PersonalizationContext);
  if (context === undefined) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
};

export default PersonalizationProvider;