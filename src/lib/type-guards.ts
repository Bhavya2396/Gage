/**
 * Type guard utilities to improve type safety throughout the application
 */

import { 
  TimeOfDay, 
  WeatherCondition, 
  GoalCategory,
  ActivityPoints,
  UserProfile
} from '@/types';

/**
 * Type guard for TimeOfDay
 */
export function isTimeOfDay(value: unknown): value is TimeOfDay {
  const validTimeOfDay: readonly string[] = ['dawn', 'day', 'dusk', 'night'];
  return typeof value === 'string' && validTimeOfDay.includes(value);
}

/**
 * Type guard for WeatherCondition
 */
export function isWeatherCondition(value: unknown): value is WeatherCondition {
  const validConditions: readonly string[] = ['clear', 'cloudy', 'rainy', 'snowy'];
  return typeof value === 'string' && validConditions.includes(value);
}

/**
 * Type guard for GoalCategory
 */
export function isGoalCategory(value: unknown): value is GoalCategory {
  const validCategories: readonly string[] = ['Strength', 'Endurance', 'Skill', 'Physique', 'Health'];
  return typeof value === 'string' && validCategories.includes(value);
}

/**
 * Type guard for ActivityPoints to check if an object conforms to the expected structure
 */
export function isValidActivityPoints(obj: unknown): obj is ActivityPoints {
  if (!obj || typeof obj !== 'object') return false;
  
  const activityPoints = obj as Partial<ActivityPoints>;
  
  return (
    typeof activityPoints.currentPoints === 'number' &&
    typeof activityPoints.totalPointsRequired === 'number' &&
    typeof activityPoints.goalName === 'string' &&
    isGoalCategory(activityPoints.goalCategory) &&
    typeof activityPoints.targetValue === 'number' &&
    typeof activityPoints.targetUnit === 'string' &&
    Array.isArray(activityPoints.phases) &&
    activityPoints.phases.every(phase => 
      typeof phase.name === 'string' &&
      typeof phase.points === 'number' &&
      typeof phase.totalPoints === 'number' &&
      typeof phase.completed === 'boolean'
    ) &&
    !!activityPoints.goalMetrics &&
    typeof activityPoints.goalMetrics === 'object' &&
    Array.isArray(activityPoints.recentActivities)
  );
}

/**
 * Type guard for UserProfile
 */
export function isValidUserProfile(obj: unknown): obj is UserProfile {
  if (!obj || typeof obj !== 'object') return false;
  
  const profile = obj as Partial<UserProfile>;
  
  return (
    typeof profile.id === 'string' &&
    typeof profile.name === 'string' &&
    (profile.email === undefined || typeof profile.email === 'string') &&
    (profile.height === undefined || typeof profile.height === 'number') &&
    (profile.weight === undefined || typeof profile.weight === 'number') &&
    (profile.age === undefined || typeof profile.age === 'number') &&
    (profile.gender === undefined || ['male', 'female', 'other'].includes(profile.gender)) &&
    !!profile.preferences &&
    typeof profile.preferences === 'object'
  );
}

/**
 * Safely parse JSON with type checking
 */
export function safeParseJSON<T>(json: string, typeGuard: (value: unknown) => value is T): T | null {
  try {
    const parsed = JSON.parse(json);
    return typeGuard(parsed) ? parsed : null;
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return null;
  }
}

/**
 * Ensures a value is within specified min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Converts string to enum if valid, or returns default
 */
export function parseEnum<T extends string>(value: unknown, validValues: readonly T[], defaultValue: T): T {
  return typeof value === 'string' && validValues.includes(value as T) ? value as T : defaultValue;
}

/**
 * Safely access deeply nested properties to avoid runtime errors
 */
export function safeGet<T, K extends keyof T>(obj: T | null | undefined, key: K): T[K] | undefined {
  return obj ? obj[key] : undefined;
}
