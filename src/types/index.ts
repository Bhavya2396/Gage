/**
 * Core application types used throughout the Gage application
 */

// Time of day types used for visual effects
export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';

// Weather condition types for visual effects
export type WeatherCondition = 'clear' | 'cloudy' | 'rainy' | 'snowy';

// Goal categories for user fitness goals
export type GoalCategory = 'Strength' | 'Endurance' | 'Skill' | 'Physique' | 'Health';

// Journey phase representing stage of progress
export interface JourneyPhase {
  name: string;
  points: number;
  totalPoints: number;
  completed: boolean;
}

// Goal-specific metric tracking
export interface GoalMetric {
  name: string;
  points: number;
  totalPoints: number;
}

// Goal metrics grouped by category
export interface GoalMetrics {
  category: string;
  metrics: GoalMetric[];
}

// Activity record for point earning events
export interface ActivityRecord {
  type: string;
  description: string;
  pointsEarned: number;
  timestamp: Date;
}

// Main activity points tracking interface
export interface ActivityPoints {
  currentPoints: number;
  totalPointsRequired: number;
  goalName: string;
  goalCategory: GoalCategory;
  targetValue: number;
  targetUnit: string;
  phases: JourneyPhase[];
  goalMetrics: GoalMetrics;
  recentActivities: ActivityRecord[];
}

// User profile information
export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  height?: number;
  weight?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  profileImage?: string;
  preferences: {
    units: 'metric' | 'imperial';
    darkMode: boolean;
    notifications: boolean;
    privacyLevel: 'public' | 'friends' | 'private';
  };
}

// Friend data for social features
export interface Friend {
  id: string;
  name: string;
  profileImage?: string;
  progress: number;
  goalName: string;
  lastActive: Date;
  status: 'online' | 'offline' | 'away';
}

// Health metrics data
export interface HealthMetrics {
  recoveryScore: number;
  hrv: number;
  restingHeartRate: number;
  respiratoryRate?: number;
  bloodOxygen?: number;
  sleepScore?: number;
  skinTemperature?: number;
  dailyStrain: number;
  history: {
    date: Date;
    recoveryScore: number;
    hrv: number;
    restingHeartRate: number;
  }[];
}

// Workout data
export interface Workout {
  id: string;
  name: string;
  description?: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'balance' | 'skill';
  duration: number; // in minutes
  caloriesBurned?: number;
  exercises: {
    name: string;
    sets?: number;
    reps?: number;
    weight?: number;
    duration?: number;
    distance?: number;
    completed: boolean;
  }[];
  completed: boolean;
  pointsEarned: number;
  date: Date;
}

// Nutrition data
export interface Meal {
  id: string;
  name: string;
  timeOfDay: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  completed: boolean;
  foods: {
    name: string;
    quantity: number;
    unit: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
}

// Schedule event
export interface ScheduleEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'workout' | 'meal' | 'recovery' | 'skill' | 'other';
  description?: string;
  completed: boolean;
  recurrence?: 'daily' | 'weekly' | 'monthly' | 'none';
}

// Notification data
export interface Notification {
  id: string;
  type: 'achievement' | 'reminder' | 'social' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

// Achievement data
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number; // 0-100
  completed: boolean;
}

// Insight data from AI analysis
export interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'recovery' | 'nutrition' | 'workout' | 'sleep' | 'progress';
  importance: 'low' | 'medium' | 'high';
  timestamp: Date;
  relatedMetrics?: string[];
  recommendations?: string[];
}

// Theme customization
export interface ThemePreferences {
  primaryColor: string;
  accentColor: string;
  darkMode: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
}

// Device & Connectivity
export interface DeviceStatus {
  connected: boolean;
  batteryLevel?: number;
  lastSynced?: Date;
  syncStatus: 'synced' | 'syncing' | 'failed';
  firmware?: string;
}
