import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define app state types
interface AppState {
  // Current journey state
  journeyState: {
    currentPhase: string;
    progressPercentage: number;
    nextMilestone: string;
    recentAchievements: string[];
  };
  
  // Feature integration flags
  featureIntegration: {
    workoutNutritionLinked: boolean;
    recoveryWorkoutLinked: boolean;
    socialChallengesEnabled: boolean;
    aiCoachEnabled: boolean;
    weatherEffectsEnabled: boolean;
  };
  
  // Cross-feature data sharing
  sharedData: {
    currentWorkout: any | null;
    nextScheduledEvent: any | null;
    latestHealthMetrics: any | null;
    recentMeals: any[];
    friendActivity: any[];
  };
}

// Define context interface
interface AppContextType {
  appState: AppState;
  updateJourneyState: (updates: Partial<AppState['journeyState']>) => void;
  updateFeatureIntegration: (updates: Partial<AppState['featureIntegration']>) => void;
  setSharedData: <K extends keyof AppState['sharedData']>(key: K, data: AppState['sharedData'][K]) => void;
  getSharedData: <K extends keyof AppState['sharedData']>(key: K) => AppState['sharedData'][K];
}

// Default app state
const defaultAppState: AppState = {
  journeyState: {
    currentPhase: 'foundation',
    progressPercentage: 0,
    nextMilestone: 'Base Camp',
    recentAchievements: [],
  },
  
  featureIntegration: {
    workoutNutritionLinked: true,
    recoveryWorkoutLinked: true,
    socialChallengesEnabled: true,
    aiCoachEnabled: true,
    weatherEffectsEnabled: true,
  },
  
  sharedData: {
    currentWorkout: null,
    nextScheduledEvent: null,
    latestHealthMetrics: null,
    recentMeals: [],
    friendActivity: [],
  },
};

// Create context with default undefined value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appState, setAppState] = useState<AppState>(defaultAppState);
  
  // Update journey state
  const updateJourneyState = (updates: Partial<AppState['journeyState']>) => {
    setAppState(prev => ({
      ...prev,
      journeyState: {
        ...prev.journeyState,
        ...updates,
      },
    }));
  };
  
  // Update feature integration
  const updateFeatureIntegration = (updates: Partial<AppState['featureIntegration']>) => {
    setAppState(prev => ({
      ...prev,
      featureIntegration: {
        ...prev.featureIntegration,
        ...updates,
      },
    }));
  };
  
  // Set shared data
  const setSharedData = <K extends keyof AppState['sharedData']>(
    key: K, 
    data: AppState['sharedData'][K]
  ) => {
    setAppState(prev => ({
      ...prev,
      sharedData: {
        ...prev.sharedData,
        [key]: data,
      },
    }));
  };
  
  // Get shared data
  const getSharedData = <K extends keyof AppState['sharedData']>(key: K): AppState['sharedData'][K] => {
    return appState.sharedData[key];
  };
  
  // Context value
  const contextValue: AppContextType = {
    appState,
    updateJourneyState,
    updateFeatureIntegration,
    setSharedData,
    getSharedData,
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppProvider;
