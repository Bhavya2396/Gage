/**
 * Centralized mock data for the Gage application
 * This file contains sample data used across multiple components
 * to ensure consistency and reduce redundancy.
 */

// Sample meal data
export const sampleMeals = [
  {
    id: 1,
    title: 'Breakfast',
    time: '7:30 AM',
    completed: true,
    items: [
      { name: 'Greek Yogurt', quantity: '200g', calories: 150 },
      { name: 'Blueberries', quantity: '100g', calories: 60 },
      { name: 'Honey', quantity: '15g', calories: 45 },
      { name: 'Granola', quantity: '30g', calories: 120 }
    ],
    macros: {
      calories: 375,
      protein: 20,
      carbs: 45,
      fat: 10
    }
  },
  {
    id: 2,
    title: 'Lunch',
    time: '12:30 PM',
    completed: false,
    items: [
      { name: 'Grilled Chicken', quantity: '150g', calories: 250 },
      { name: 'Brown Rice', quantity: '100g', calories: 130 },
      { name: 'Mixed Vegetables', quantity: '150g', calories: 70 },
      { name: 'Olive Oil', quantity: '10g', calories: 90 }
    ],
    macros: {
      calories: 540,
      protein: 35,
      carbs: 60,
      fat: 15
    }
  },
  {
    id: 3,
    title: 'Afternoon Snack',
    time: '3:30 PM',
    completed: false,
    items: [
      { name: 'Protein Shake', quantity: '300ml', calories: 180 },
      { name: 'Banana', quantity: '1 medium', calories: 105 },
      { name: 'Almonds', quantity: '20g', calories: 120 }
    ],
    macros: {
      calories: 405,
      protein: 25,
      carbs: 40,
      fat: 12
    }
  },
  {
    id: 4,
    title: 'Dinner',
    time: '7:00 PM',
    completed: false,
    items: [
      { name: 'Salmon Fillet', quantity: '180g', calories: 320 },
      { name: 'Sweet Potato', quantity: '150g', calories: 130 },
      { name: 'Asparagus', quantity: '100g', calories: 40 },
      { name: 'Quinoa', quantity: '80g', calories: 120 }
    ],
    macros: {
      calories: 610,
      protein: 40,
      carbs: 55,
      fat: 22
    }
  }
];

// Sample nutritional targets
export const nutritionalTargets = {
  calories: {
    name: 'Calories',
    current: 1930,
    target: 2400,
    unit: 'kcal',
    color: '#00CCFF'
  },
  protein: {
    name: 'Protein',
    current: 120,
    target: 160,
    unit: 'g',
    color: '#00CCFF'
  },
  carbs: {
    name: 'Carbs',
    current: 200,
    target: 280,
    unit: 'g',
    color: '#319795'
  },
  fat: {
    name: 'Fat',
    current: 60,
    target: 80,
    unit: 'g',
    color: '#4FD1C5'
  }
};

// Sample user metrics for AI advisor
export const userMetrics = {
  workoutIntensity: 'medium' as const,
  recoveryScore: 78,
  upcomingWorkout: 'Strength Training - Upper Body'
};

// Sample health metrics
export const healthMetrics = [
  { 
    title: "Heart Rate", 
    value: 68, 
    unit: "bpm", 
    trend: "stable" as const, 
    color: "text-cyan-primary" 
  },
  { 
    title: "HRV", 
    value: 65, 
    unit: "ms", 
    trend: "up" as const, 
    color: "text-teal-primary" 
  },
  { 
    title: "Respiration", 
    value: 14, 
    unit: "bpm", 
    trend: "stable" as const, 
    color: "text-cyan-primary" 
  },
  { 
    title: "Hydration", 
    value: "Good", 
    trend: "stable" as const, 
    color: "text-teal-primary" 
  }
];

// Sample workout data
export const todaysWorkout = {
  title: "Full Body Strength",
  focus: "Rotational Power",
  duration: "45 min",
  exercises: [
    { name: "Dynamic Warm-up", sets: 1, reps: "5 min" },
    { name: "Medicine Ball Rotational Throws", sets: 3, reps: "10 each side" },
    { name: "Cable Woodchoppers", sets: 3, reps: "12 each side" },
    { name: "Kettlebell Swings", sets: 3, reps: "15" },
    { name: "Plank with Rotation", sets: 3, reps: "10 each side" }
  ]
};

// Sample nutrition summary
export const nutritionSummary = {
  calories: { current: 1650, target: 2400 },
  protein: { current: 95, target: 150, unit: 'g' },
  carbs: { current: 180, target: 250, unit: 'g' },
  fat: { current: 55, target: 80, unit: 'g' }
};

// Weather condition utility
export type WeatherCondition = 'sunny' | 'cloudy' | 'rainy' | 'snowy';

export const getWeatherDescription = (condition: WeatherCondition, temperature: number): string => {
  switch (condition) {
    case 'sunny':
      return `It's a beautiful sunny day at ${temperature}°C – perfect weather for getting active!`;
    case 'rainy':
      return `It's raining at ${temperature}°C today. Great day for an indoor workout!`;
    case 'cloudy':
      return `It's cloudy and ${temperature}°C out there. Nice conditions for a run if you're up for it!`;
    case 'snowy':
      return `It's snowing at ${temperature}°C! Bundle up if you're heading out, or we can focus on indoor activities today.`;
    default:
      return `It's ${temperature}°C outside today.`;
  }
};
