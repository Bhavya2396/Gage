import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
export function getTimeOfDay(): 'dawn' | 'day' | 'dusk' | 'night' {
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
  if (score >= 71) return 'var(--color-accent-primary)'; // Cyan (was Amber Glow)
  if (score >= 41) return 'var(--color-text-primary)';   // Alpine Mist
  return 'var(--color-accent-secondary)';                // Teal (was Glacial Blue)
}

/**
 * Formats a date as a readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(date);
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