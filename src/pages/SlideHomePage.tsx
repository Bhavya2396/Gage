import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import GlassCard from '@/components/ui/GlassCard';
import ClickCard from '@/components/ui/ClickCard';
import Button from '@/components/ui/Button';
import { getGreeting, formatAltitude, getRecoveryColor } from '@/lib/utils';
import { 
  Sun, Cloud, CloudRain, Snowflake, Dumbbell, Utensils, 
  Activity, Calendar, ChevronRight, Heart, Award, Zap
} from 'lucide-react';

// Weather card component
const WeatherCard: React.FC = () => {
  const [weather, setWeather] = useState<{
    temp: number;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  }>({
    temp: 28,
    condition: 'sunny'
  });

  // In a real app, we would fetch weather data from an API
  useEffect(() => {
    // Simulate weather API call
    const fetchWeather = async () => {
      // This would be a real API call in a production app
      const conditions = ['sunny', 'cloudy', 'rainy', 'snowy'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)] as 'sunny' | 'cloudy' | 'rainy' | 'snowy';
      const randomTemp = Math.floor(Math.random() * 30) + 5; // 5-35°C
      
      setWeather({
        temp: randomTemp,
        condition: randomCondition
      });
    };
    
    fetchWeather();
  }, []);

  const weatherIcons = {
    sunny: <Sun className="text-primary-cyan-500" size={24} />,
    cloudy: <Cloud className="text-gray-400" size={24} />,
    rainy: <CloudRain className="text-primary-teal-500" size={24} />,
    snowy: <Snowflake className="text-alpine-mist" size={24} />
  };

  return (
    <ClickCard 
      variant="glass" 
      size="sm" 
      className="w-full mb-4"
      onClick={() => window.location.href = '/'}
    >
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs uppercase tracking-wider text-gray-400">Welcome</span>
          <h2 className="text-xl font-medium text-alpine-mist">{getGreeting()}, Bhavya.</h2>
        </div>
        <div className="flex items-center bg-glass-background px-3 py-1 rounded-full">
          {weatherIcons[weather.condition]}
          <span className="ml-2 text-alpine-mist font-medium">{weather.temp}°C</span>
        </div>
      </div>
      <div className="flex justify-center mt-2">
                  <span className="text-xs text-primary-cyan-500 flex items-center">
            Switch to compact view
            <ChevronRight size={12} className="ml-1" />
          </span>
      </div>
    </ClickCard>
  );
};

// AI briefing card component
const AiBriefingCard: React.FC = () => {
  return (
    <GlassCard variant="default" size="md" className="w-full mb-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium text-text-primary">Your Daily Briefing</h3>
      </div>
      <p className="text-text-secondary">
        Your sleep quality was <span className="text-primary-teal-500">excellent</span> last night. 
        Today is a great day for your scheduled <span className="text-primary-cyan-500">strength training</span>. 
        I've adjusted your calorie target to <span className="text-primary-cyan-500">2,400</span> based on 
        yesterday's activity.
      </p>
      <p className="text-text-secondary mt-2">
        Your HRV has increased by <span className="text-primary-cyan-500">5ms</span> since yesterday, 
        indicating good recovery. Your training readiness is at <span className="text-primary-cyan-500">85%</span>.
      </p>
    </GlassCard>
  );
};

// Recovery score card component
const RecoveryScoreCard: React.FC = () => {
  const recoveryScore = 78;
  const recoveryColor = getRecoveryColor(recoveryScore);
  
  return (
    <GlassCard 
      variant="default" 
      size="md" 
      className="w-full flex-1 mr-2"
      onClick={() => window.location.href = '/health'}
    >
      <h3 className="text-sm font-medium text-text-secondary mb-2">Recovery</h3>
      <div className="flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <svg width="80" height="80" viewBox="0 0 100 100">
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="rgba(255,255,255,0.1)" 
              strokeWidth="8" 
            />
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke={recoveryColor} 
              strokeWidth="8" 
              strokeDasharray={`${recoveryScore * 2.83} 283`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <span 
            className="absolute text-2xl font-bold"
            style={{ color: recoveryColor }}
          >
            {recoveryScore}
          </span>
        </div>
      </div>
    </GlassCard>
  );
};

// Capacity load card component
const CapacityLoadCard: React.FC = () => {
  const capacityLoad = 340;
  const dailyTarget = 400;
  const percentage = Math.min(100, (capacityLoad / dailyTarget) * 100);
  
  return (
    <GlassCard 
      variant="default" 
      size="md" 
      className="w-full flex-1 ml-2"
      onClick={() => window.location.href = '/activity'}
    >
      <h3 className="text-sm font-medium text-text-secondary mb-2">Capacity Load</h3>
      <div className="flex flex-col items-center justify-center">
        <div className="text-center mb-2">
          <span className="text-3xl font-bold text-accent-primary">{capacityLoad}</span>
        </div>
        
        <div className="w-full h-2 bg-glass rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent-primary rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div className="w-full flex justify-between mt-1">
          <span className="text-xs text-text-secondary">0</span>
          <span className="text-xs text-text-secondary">{dailyTarget}</span>
        </div>
      </div>
    </GlassCard>
  );
};

// Workout card component
const WorkoutCard: React.FC = () => {
  return (
    <GlassCard 
      variant="default" 
      size="md" 
      className="w-full flex-1 mr-2 relative overflow-hidden group"
      onClick={() => window.location.href = '/workout'}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <h3 className="text-sm font-medium text-text-secondary mb-2">Today's Workout</h3>
      <div className="flex flex-col items-center justify-center">
        <Dumbbell className="text-accent-primary mb-2" size={32} />
        <span className="text-text-primary text-sm">Full Body Strength</span>
        <span className="text-xs text-text-secondary mt-1">45 min · 320 kcal</span>
      </div>
    </GlassCard>
  );
};

// Nutrition card component
const NutritionCard: React.FC = () => {
  const calories = 2400;
  const consumed = 1450;
  const percentage = Math.min(100, (consumed / calories) * 100);
  
  return (
    <GlassCard 
      variant="default" 
      size="md" 
      className="w-full flex-1 ml-2 relative overflow-hidden group"
      onClick={() => window.location.href = '/nutrition'}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <h3 className="text-sm font-medium text-text-secondary mb-2">Today's Fuel</h3>
      <div className="flex flex-col items-center justify-center">
        <Utensils className="text-accent-secondary mb-2" size={32} />
        <span className="text-text-primary text-sm">{consumed} / {calories} kcal</span>
        
        <div className="w-full h-1 bg-glass rounded-full overflow-hidden mt-2">
          <div 
            className="h-full bg-accent-secondary rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </GlassCard>
  );
};

// Daily plan summary component
const DailyPlanSummary: React.FC = () => {
  return (
    <GlassCard variant="default" size="md" className="w-full mb-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-medium text-text-primary">Today's Plan</h3>
        <Activity className="text-accent-primary" size={20} />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <div className="w-1 h-12 bg-accent-primary rounded-full mr-3"></div>
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="text-text-primary">Morning Workout</span>
              <span className="text-text-secondary text-sm">9:00 AM</span>
            </div>
            <span className="text-text-secondary text-sm">Full Body Strength · 45 min</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-1 h-12 bg-accent-secondary rounded-full mr-3"></div>
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="text-text-primary">Lunch</span>
              <span className="text-text-secondary text-sm">12:30 PM</span>
            </div>
            <span className="text-text-secondary text-sm">Protein-rich · 650 kcal</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-1 h-12 bg-accent-primary/70 rounded-full mr-3"></div>
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="text-text-primary">Evening Walk</span>
              <span className="text-text-secondary text-sm">6:00 PM</span>
            </div>
            <span className="text-text-secondary text-sm">Recovery · 30 min</span>
          </div>
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full mt-4 border border-glass-border"
        onClick={() => window.location.href = '/calendar'}
      >
        View Full Schedule
      </Button>
    </GlassCard>
  );
};

// Progress indicator component
const ProgressIndicator: React.FC = () => {
  const [altitude, setAltitude] = useState(1250);
  
  // Simulate altitude increase over time
  useEffect(() => {
    const interval = setInterval(() => {
      setAltitude(prev => prev + Math.floor(Math.random() * 5));
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-glass backdrop-blur px-4 py-2 rounded-full border border-glass-border flex items-center space-x-2 shadow-lg shadow-accent-primary/20">
        <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></div>
        <span className="text-xs text-text-secondary">{formatAltitude(altitude)} Climbed</span>
      </div>
    </div>
  );
};

// Mountain location indicators
const MountainIndicators: React.FC = () => {
  // Current position and target indicators
  const [showIndicators, setShowIndicators] = useState(false);
  
  useEffect(() => {
    // Show indicators briefly when the page loads
    setShowIndicators(true);
    
    const timer = setTimeout(() => {
      setShowIndicators(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      {showIndicators && (
        <>
          {/* Current position indicator */}
          <motion.div 
            className="absolute left-1/2 bottom-[30%] transform -translate-x-1/2 z-10"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-primary-cyan-500 animate-pulse shadow-lg shadow-cyan-primary/50"></div>
              <div className="mt-2 px-3 py-1 bg-glass-background backdrop-blur-md rounded-lg border border-glass-border">
                <span className="text-xs text-alpine-mist whitespace-nowrap">You are here (1250m)</span>
              </div>
            </div>
          </motion.div>
          
          {/* Target position indicator */}
          <motion.div 
            className="absolute left-1/2 top-[15%] transform -translate-x-1/2 z-10"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <div className="flex flex-col items-center">
              <div className="mt-2 px-3 py-1 bg-glass-background backdrop-blur-md rounded-lg border border-glass-border">
                <span className="text-xs text-alpine-mist whitespace-nowrap">Summit (10,000m)</span>
              </div>
              <div className="w-4 h-4 rounded-full bg-primary-teal-500 mt-2 animate-pulse shadow-lg shadow-teal-primary/50"></div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

const SlideHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isMountainFocused, setIsMountainFocused] = useState(false);
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    // Short delay to ensure mountain is rendered first
    const timer = setTimeout(() => {
      console.log("Showing SlideHomePage content");
      setShowContent(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <MainLayout isMountainFocused={isMountainFocused}>
      {showContent && <MountainIndicators />}
      
      {showContent && (
        <div className="w-full max-w-md mx-auto px-4 pt-6 pb-24">
          <WeatherCard />
          <AiBriefingCard />
          
          <div className="flex mb-4">
            <RecoveryScoreCard />
            <CapacityLoadCard />
          </div>
          
          <div className="flex mb-4">
            <WorkoutCard />
            <NutritionCard />
          </div>
          
          <DailyPlanSummary />
        </div>
      )}
      
      {showContent && <ProgressIndicator />}
    </MainLayout>
  );
};

export default SlideHomePage;
