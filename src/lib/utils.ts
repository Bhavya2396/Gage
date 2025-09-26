import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TimeOfDay } from '@/types';

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as altitude with 'm' suffix
 */
export function formatAltitude(value: number): string {
  return `${value.toLocaleString()}m`;
}

/**
 * Returns the current time of day
 */
export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 8) return 'dawn';
  if (hour >= 8 && hour < 18) return 'day';
  if (hour >= 18 && hour < 21) return 'dusk';
  return 'night';
}

/**
 * Returns a greeting based on the time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Generates a color based on recovery score
 */
export function getRecoveryColor(score: number): string {
  if (score < 0 || score > 100) {
    console.warn('Recovery score should be between 0 and 100');
    score = Math.max(0, Math.min(score, 100));
  }
  
  if (score >= 71) return '#4ADE80'; // Green for high recovery
  if (score >= 41) return '#FFDE59'; // Yellow for medium recovery
  return '#FF4B4B'; // Red for low recovery
}

/**
 * Formats a date as a readable string
 * @param options Customization options for date formatting
 */
export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  };
  
  return new Intl.DateTimeFormat('en-US', options || defaultOptions).format(date);
}

/**
 * Formats a time value
 */
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
}

/**
 * Formats a duration in minutes into hours and minutes
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}m`;
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Generate a random ID (useful for temporary IDs)
 */
export function generateId(prefix = ''): string {
  return `${prefix}${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Format a number with comma separators
 */
export function formatNumber(value: number): string {
  return value.toLocaleString();
}

/**
 * Get initials from a name (for avatars)
 */
export function getInitials(name: string): string {
  if (!name) return '?';
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Convert a string to title case
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Check if the current environment is a browser
 */
export const isBrowser = typeof window !== 'undefined';