import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the structure for goal-specific metrics
interface GoalMetrics {
  category: string;
  metrics: {
    name: string;
    points: number;
    totalPoints: number;
  }[];
}

// Define the structure for activity points
interface ActivityPoints {
  currentPoints: number;
  totalPointsRequired: number;
  goalName: string;
  goalCategory: string;
  targetValue: number;
  targetUnit: string;
  phases: {
    name: string;
    points: number;
    totalPoints: number;
    completed: boolean;
  }[];
  goalMetrics: GoalMetrics;
  recentActivities: {
    type: string;
    description: string;
    pointsEarned: number;
    timestamp: Date;
  }[];
}

interface ActivityPointsContextType {
  activityPoints: ActivityPoints;
  addPoints: (points: number, activityType: string, description: string) => void;
  setGoal: (category: string, name: string, targetValue: number, targetUnit: string) => void;
  getProgressPercentage: () => number;
  getPhaseProgress: () => number;
  getCurrentPhase: () => { name: string; points: number; totalPoints: number; completed: boolean } | undefined;
  getPointsRemaining: () => number;
}

// Create the context with a default value
const ActivityPointsContext = createContext<ActivityPointsContextType | undefined>(undefined);

// Create a provider component
export const ActivityPointsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default state for activity points
  const [activityPoints, setActivityPoints] = useState<ActivityPoints>({
    currentPoints: 480, // Starting with some progress
    totalPointsRequired: 1500, // Default for a 15-yard golf swing improvement
    goalName: 'Add 15 yards to my golf drive',
    goalCategory: 'Skill',
    targetValue: 15,
    targetUnit: 'yards',
    phases: [
      {
        name: 'Foundation Phase',
        points: 320,
        totalPoints: 375, // 25% of total
        completed: false,
      },
      {
        name: 'Development Phase',
        points: 160,
        totalPoints: 450, // 30% of total
        completed: false,
      },
      {
        name: 'Specialization Phase',
        points: 0,
        totalPoints: 675, // 45% of total
        completed: false,
      },
    ],
    goalMetrics: {
      category: 'Skill',
      metrics: [
        { name: 'Rotational Power', points: 320, totalPoints: 375 },
        { name: 'Swing Mechanics', points: 160, totalPoints: 450 },
        { name: 'Consistency', points: 0, totalPoints: 675 },
      ],
    },
    recentActivities: [
      {
        type: 'Workout',
        description: 'Full Body Strength',
        pointsEarned: 25,
        timestamp: new Date(Date.now() - 86400000), // Yesterday
      },
      {
        type: 'Nutrition',
        description: 'Protein-rich meal',
        pointsEarned: 10,
        timestamp: new Date(Date.now() - 43200000), // 12 hours ago
      },
      {
        type: 'Skill Practice',
        description: 'Golf swing practice',
        pointsEarned: 15,
        timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      },
    ],
  });

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedPoints = localStorage.getItem('activityPoints');
    if (savedPoints) {
      try {
        const parsedPoints = JSON.parse(savedPoints);
        // Convert string timestamps back to Date objects
        if (parsedPoints.recentActivities) {
          parsedPoints.recentActivities = parsedPoints.recentActivities.map((activity: any) => ({
            ...activity,
            timestamp: new Date(activity.timestamp),
          }));
        }
        setActivityPoints(parsedPoints);
      } catch (error) {
        console.error('Error parsing saved activity points:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activityPoints', JSON.stringify(activityPoints));
  }, [activityPoints]);

  // Add points to the current total and record the activity
  const addPoints = (points: number, activityType: string, description: string) => {
    setActivityPoints(prev => {
      const newCurrentPoints = prev.currentPoints + points;
      
      // Update phases based on new point total
      const updatedPhases = prev.phases.map(phase => {
        // Calculate how many points from this activity should go to this phase
        const phaseRemaining = phase.totalPoints - phase.points;
        
        if (phaseRemaining <= 0) {
          // Phase is already complete
          return { ...phase, completed: true };
        }
        
        // If we're still in this phase
        if (phase.points < phase.totalPoints) {
          const pointsToAdd = Math.min(points, phaseRemaining);
          points -= pointsToAdd; // Reduce remaining points for next phases
          
          return {
            ...phase,
            points: phase.points + pointsToAdd,
            completed: phase.points + pointsToAdd >= phase.totalPoints,
          };
        }
        
        return phase;
      });
      
      // Update goal metrics based on activity type
      const updatedMetrics = { ...prev.goalMetrics };
      
      // Distribute points to relevant metrics based on activity type
      if (activityType === 'Workout' && prev.goalCategory === 'Skill') {
        // For golf swing, workouts primarily improve rotational power
        updatedMetrics.metrics = updatedMetrics.metrics.map(metric => {
          if (metric.name === 'Rotational Power') {
            return { ...metric, points: Math.min(metric.points + Math.round(points * 0.7), metric.totalPoints) };
          } else if (metric.name === 'Swing Mechanics') {
            return { ...metric, points: Math.min(metric.points + Math.round(points * 0.3), metric.totalPoints) };
          }
          return metric;
        });
      } else if (activityType === 'Skill Practice' && prev.goalCategory === 'Skill') {
        // Skill practice improves mechanics and consistency
        updatedMetrics.metrics = updatedMetrics.metrics.map(metric => {
          if (metric.name === 'Swing Mechanics') {
            return { ...metric, points: Math.min(metric.points + Math.round(points * 0.6), metric.totalPoints) };
          } else if (metric.name === 'Consistency') {
            return { ...metric, points: Math.min(metric.points + Math.round(points * 0.4), metric.totalPoints) };
          }
          return metric;
        });
      }
      
      return {
        ...prev,
        currentPoints: newCurrentPoints,
        phases: updatedPhases,
        goalMetrics: updatedMetrics,
        recentActivities: [
          {
            type: activityType,
            description,
            pointsEarned: points,
            timestamp: new Date(),
          },
          ...prev.recentActivities.slice(0, 9), // Keep only the 10 most recent activities
        ],
      };
    });
  };

  // Set a new goal
  const setGoal = (category: string, name: string, targetValue: number, targetUnit: string) => {
    // Calculate total points required based on goal complexity
    let totalPoints = 1000; // Base points
    
    // Adjust based on category
    if (category === 'Strength') totalPoints = 1200;
    if (category === 'Endurance') totalPoints = 1800;
    if (category === 'Skill') totalPoints = 1500;
    if (category === 'Physique') totalPoints = 1600;
    if (category === 'Health') totalPoints = 1400;
    
    // Adjust based on target value
    totalPoints = Math.round(totalPoints * (1 + (targetValue / 100)));
    
    // Calculate phase points
    const foundationPoints = Math.round(totalPoints * 0.25);
    const developmentPoints = Math.round(totalPoints * 0.3);
    const specializationPoints = totalPoints - foundationPoints - developmentPoints;
    
    // Create goal-specific metrics
    let metrics: { name: string; points: number; totalPoints: number }[] = [];
    
    if (category === 'Skill' && name.toLowerCase().includes('golf')) {
      metrics = [
        { name: 'Rotational Power', points: 0, totalPoints: foundationPoints },
        { name: 'Swing Mechanics', points: 0, totalPoints: developmentPoints },
        { name: 'Consistency', points: 0, totalPoints: specializationPoints },
      ];
    } else if (category === 'Strength') {
      metrics = [
        { name: 'Foundation Work', points: 0, totalPoints: foundationPoints },
        { name: 'Progressive Overload', points: 0, totalPoints: developmentPoints },
        { name: 'Technique Refinement', points: 0, totalPoints: specializationPoints },
      ];
    } else if (category === 'Endurance') {
      metrics = [
        { name: 'Aerobic Base', points: 0, totalPoints: foundationPoints },
        { name: 'Race Pace Training', points: 0, totalPoints: developmentPoints },
        { name: 'Endurance Building', points: 0, totalPoints: specializationPoints },
      ];
    } else {
      // Default metrics
      metrics = [
        { name: 'Foundation', points: 0, totalPoints: foundationPoints },
        { name: 'Development', points: 0, totalPoints: developmentPoints },
        { name: 'Specialization', points: 0, totalPoints: specializationPoints },
      ];
    }
    
    setActivityPoints({
      currentPoints: 0,
      totalPointsRequired: totalPoints,
      goalName: name,
      goalCategory: category,
      targetValue,
      targetUnit,
      phases: [
        {
          name: 'Foundation Phase',
          points: 0,
          totalPoints: foundationPoints,
          completed: false,
        },
        {
          name: 'Development Phase',
          points: 0,
          totalPoints: developmentPoints,
          completed: false,
        },
        {
          name: 'Specialization Phase',
          points: 0,
          totalPoints: specializationPoints,
          completed: false,
        },
      ],
      goalMetrics: {
        category,
        metrics,
      },
      recentActivities: [],
    });
  };

  // Calculate overall progress percentage
  const getProgressPercentage = () => {
    return Math.round((activityPoints.currentPoints / activityPoints.totalPointsRequired) * 100);
  };

  // Get progress percentage for the current phase
  const getPhaseProgress = () => {
    const currentPhase = getCurrentPhase();
    if (!currentPhase) {
      return 100; // All phases complete
    }
    
    return Math.round((currentPhase.points / currentPhase.totalPoints) * 100);
  };

  // Get the current active phase object
  const getCurrentPhase = () => {
    for (const phase of activityPoints.phases) {
      if (phase.points < phase.totalPoints) {
        return phase;
      }
    }
    return undefined; // All phases complete
  };

  // Get points remaining to reach the summit
  const getPointsRemaining = () => {
    return activityPoints.totalPointsRequired - activityPoints.currentPoints;
  };

  return (
    <ActivityPointsContext.Provider
      value={{
        activityPoints,
        addPoints,
        setGoal,
        getProgressPercentage,
        getPhaseProgress,
        getCurrentPhase,
        getPointsRemaining,
      }}
    >
      {children}
    </ActivityPointsContext.Provider>
  );
};

// Create a custom hook to use the context
export const useActivityPoints = () => {
  const context = useContext(ActivityPointsContext);
  if (context === undefined) {
    throw new Error('useActivityPoints must be used within an ActivityPointsProvider');
  }
  return context;
};


