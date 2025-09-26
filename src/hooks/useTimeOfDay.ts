import { useState, useEffect } from 'react';

export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';

/**
 * Hook to track and manage time of day
 * Useful for dynamic lighting and visual effects that change throughout the day
 * @param forcedTimeOfDay Optional override to set a specific time of day
 * @returns Current time of day and related utilities
 */
export function useTimeOfDay(forcedTimeOfDay?: TimeOfDay) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(
    forcedTimeOfDay || getCurrentTimeOfDay()
  );

  // Calculate time of day based on current hour
  function getCurrentTimeOfDay(): TimeOfDay {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 8) {
      return 'dawn';
    } else if (hour >= 8 && hour < 18) {
      return 'day';
    } else if (hour >= 18 && hour < 21) {
      return 'dusk';
    } else {
      return 'night';
    }
  }
  
  // Get colors associated with current time of day
  const getTimeOfDayColors = () => {
    switch (timeOfDay) {
      case 'dawn':
        return {
          primary: '#FF9E7A',
          secondary: '#FFC4A3',
          accent: '#FFD6A5',
          sky: 'from-orange-300 via-pink-300 to-purple-400'
        };
      case 'day':
        return {
          primary: '#4F86C6',
          secondary: '#89B4FF',
          accent: '#00CCFF',
          sky: 'from-blue-300 via-blue-400 to-blue-600'
        };
      case 'dusk':
        return {
          primary: '#FFA07A',
          secondary: '#FF7F50',
          accent: '#FF6347',
          sky: 'from-orange-400 via-red-400 to-purple-500'
        };
      case 'night':
        return {
          primary: '#1F2937',
          secondary: '#374151',
          accent: '#4B5563',
          sky: 'from-indigo-800 via-purple-900 to-black'
        };
    }
  };

  // Update time of day periodically if not forced
  useEffect(() => {
    if (forcedTimeOfDay) {
      setTimeOfDay(forcedTimeOfDay);
      return;
    }
    
    // Set initial time of day
    setTimeOfDay(getCurrentTimeOfDay());
    
    // Update every minute
    const interval = setInterval(() => {
      setTimeOfDay(getCurrentTimeOfDay());
    }, 60000);
    
    return () => clearInterval(interval);
  }, [forcedTimeOfDay]);

  return {
    timeOfDay,
    colors: getTimeOfDayColors(),
    isNight: timeOfDay === 'night',
    isDaytime: timeOfDay === 'day',
    isDawn: timeOfDay === 'dawn',
    isDusk: timeOfDay === 'dusk',
  };
}

export default useTimeOfDay;
