import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlassCard from '@/components/ui/GlassCard';
import { useActivityPoints } from '@/contexts/ActivityPointsContext';
import { getRecoveryColor } from '@/lib/utils';
import AIGreeting from './AIGreeting';
import { todaysWorkout, nutritionSummary, healthMetrics as baseHealthMetrics } from '@/data/mockData';
import { 
  Dumbbell, 
  Utensils, 
  Heart, 
  Activity, 
  Calendar, 
  Award, 
  ArrowUpRight, 
  MessageCircle, 
  Target, 
  BarChart3,
  Users,
  Zap,
  ChevronRight,
  Droplet,
  Thermometer,
  Wind,
  Clock
} from 'lucide-react';

// Interactive card component with hover effects
interface InteractiveCardProps {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  onClick: () => void;
  className?: string;
  highlight?: boolean;
  badge?: string;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  title,
  icon,
  content,
  onClick,
  className = '',
  highlight = false,
  badge
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className={`w-full mb-4 sm:mb-6 ${className}`}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <GlassCard 
        variant="default" 
        size="md" 
        className={`h-full w-full cursor-pointer overflow-hidden ${isHovered ? 'border-cyan-primary/50 shadow-xl shadow-cyan-primary/20' : 'shadow-lg'}`}
        onClick={onClick}
      >
        <div className="flex flex-col h-full">
          {/* Card Header */}
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <div className="flex items-center">
              <div className={`p-2.5 sm:p-3 rounded-full ${isHovered ? 'bg-gradient-to-br from-cyan-primary to-teal-primary' : 'bg-glass-highlight bg-opacity-80'} mr-3 sm:mr-4 transition-colors`}>
                <div className={`${isHovered ? 'text-white' : 'text-cyan-primary'}`}>
                  {icon}
                </div>
              </div>
              <div className="flex items-center">
                <h3 className="text-white font-medium text-base sm:text-lg">{title}</h3>
                {badge && (
                  <span className="ml-2 sm:ml-3 text-[10px] sm:text-xs bg-cyan-primary/30 text-white font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                    {badge}
                  </span>
                )}
              </div>
            </div>
            
            <motion.div
              animate={{ x: isHovered ? 0 : 5, opacity: isHovered ? 1 : 0.5 }}
              transition={{ duration: 0.2 }}
              className={`${isHovered ? 'bg-cyan-primary text-white' : 'bg-glass-highlight text-cyan-primary'} rounded-full p-1.5 transition-colors`}
            >
              <ArrowUpRight size={16} />
            </motion.div>
          </div>
          
          {/* Card Content */}
          <div className="flex-1">
            {content}
          </div>
          
          {/* Highlight indicator */}
          {highlight && (
            <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-cyan-primary animate-pulse m-2 shadow-md shadow-cyan-primary/30" />
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
};

// Health metric mini card
interface HealthMetricProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
  unit?: string;
}

const HealthMetric: React.FC<HealthMetricProps> = ({
  title,
  value,
  icon,
  trend = 'stable',
  color = 'text-cyan-primary',
  unit = ''
}) => {
  const trendIcons = {
    up: <span className="text-green-400 text-xs">↑</span>,
    down: <span className="text-red-400 text-xs">↓</span>,
    stable: <span className="text-gray-400 text-xs">→</span>
  };
  
  return (
    <div className="flex items-center justify-between p-2 sm:p-3 border-b border-glass-border last:border-b-0 bg-glass-background bg-opacity-30">
      <div className="flex items-center">
        <div className={`p-1.5 sm:p-2 rounded-full bg-glass-highlight mr-2 sm:mr-3`}>
          {icon}
        </div>
        <span className="text-alpine-mist text-xs sm:text-sm">{title}</span>
      </div>
      <div className="flex items-center">
        <span className={`font-medium ${color} mr-1 text-base sm:text-lg`}>{value}{unit}</span>
        {trendIcons[trend]}
      </div>
    </div>
  );
};

// Main Dashboard Component
const EnhancedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { activityPoints, getProgressPercentage, getPointsRemaining } = useActivityPoints();
  const [recoveryScore] = useState(78);
  const [weatherCondition] = useState<'sunny' | 'cloudy' | 'rainy' | 'snowy'>('sunny');
  const [temperature] = useState(25);
  
  // Use the imported getRecoveryColor function for consistency
  
  // Enhance health metrics with icons
  const healthMetrics = baseHealthMetrics.map(metric => ({
    ...metric,
    icon: metric.title === "Heart Rate" ? <Heart size={14} className="sm:size-4 text-cyan-primary" /> :
          metric.title === "HRV" ? <Activity size={14} className="sm:size-4 text-teal-primary" /> :
          metric.title === "Respiration" ? <Wind size={14} className="sm:size-4 text-cyan-primary" /> :
          <Droplet size={14} className="sm:size-4 text-teal-primary" />
  }));
  
  return (
    <div className="space-y-4 sm:space-y-6 pb-24 sm:pb-32">
      {/* AI Greeting */}
      <div className="px-4 sm:px-6 pt-2">
        <AIGreeting 
          userName="Bhavya" 
          weatherCondition={weatherCondition} 
          temperature={temperature}
        />
      </div>
      
      {/* Today's Plan Card */}
      <div className="px-4 sm:px-6">
        <InteractiveCard
          title="Today's Schedule"
          icon={<Calendar className="text-cyan-primary" size={16} />}
          onClick={() => navigate('/calendar')}
          content={
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-primary via-teal-primary to-cyan-primary"></div>
                
                {/* Timeline events */}
                <div className="pl-8 space-y-4">
                  {/* Morning workout */}
                  <div className="relative">
                    {/* Time marker */}
                    <div className="absolute left-[-22px] top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full bg-cyan-primary shadow-lg shadow-cyan-primary/30 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    
                    {/* Event content */}
                    <div className="bg-glass-highlight bg-opacity-70 p-3 rounded-lg shadow-md">
                      <div className="flex justify-between mb-1">
                        <span className="text-white font-medium text-sm">Morning Workout</span>
                        <span className="text-cyan-primary text-xs font-medium">9:00 AM</span>
                      </div>
                      <div className="flex items-center">
                        <Dumbbell size={12} className="text-teal-primary mr-1.5" />
                        <span className="text-white/80 text-xs">Full Body · 45 min</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Lunch */}
                  <div className="relative">
                    <div className="absolute left-[-22px] top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full bg-teal-primary shadow-lg shadow-teal-primary/30 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <div className="bg-glass-highlight bg-opacity-70 p-3 rounded-lg shadow-md">
                      <div className="flex justify-between mb-1">
                        <span className="text-white font-medium text-sm">Lunch</span>
                        <span className="text-teal-primary text-xs font-medium">12:30 PM</span>
                      </div>
                      <div className="flex items-center">
                        <Utensils size={12} className="text-cyan-primary mr-1.5" />
                        <span className="text-white/80 text-xs">Protein-rich · 650 kcal</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Evening Session */}
                  <div className="relative">
                    <div className="absolute left-[-22px] top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full bg-cyan-primary shadow-lg shadow-cyan-primary/30 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <div className="bg-glass-highlight bg-opacity-70 p-3 rounded-lg shadow-md">
                      <div className="flex justify-between mb-1">
                        <span className="text-white font-medium text-sm">Evening Session</span>
                        <span className="text-cyan-primary text-xs font-medium">6:00 PM</span>
                      </div>
                      <div className="flex items-center">
                        <Target size={12} className="text-teal-primary mr-1.5" />
                        <span className="text-white/80 text-xs">Golf Practice · 60 min</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          }
        />
      </div>
      
      {/* Workout Card */}
      <div className="px-4 sm:px-6">
        <InteractiveCard
          title="Workout"
          icon={<Dumbbell className="text-cyan-primary" size={16} />}
          badge="Ready"
          highlight={true}
          onClick={() => navigate('/workout')}
          content={
            <div>
              <h4 className="text-alpine-mist font-medium text-sm sm:text-base mb-2 sm:mb-3">{todaysWorkout.title}</h4>
              <div className="flex justify-between text-xs sm:text-sm text-alpine-mist mb-3 sm:mb-4 bg-glass-background bg-opacity-30 p-1.5 sm:p-2 rounded-lg">
                <div className="flex items-center">
                  <Target size={14} className="mr-2 text-teal-primary" />
                  <span>{todaysWorkout.focus}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={14} className="mr-2 text-cyan-primary" />
                  <span>{todaysWorkout.duration}</span>
                </div>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                {todaysWorkout.exercises.map((exercise, index) => (
                  <div key={index} className="flex justify-between text-xs sm:text-sm bg-glass-background bg-opacity-30 p-1.5 sm:p-2 rounded-lg">
                    <span className="text-alpine-mist">{exercise.name}</span>
                    <span className="text-alpine-mist">{exercise.sets} × {exercise.reps}</span>
                  </div>
                ))}
              </div>
            </div>
          }
        />
      </div>
      
      {/* Nutrition Card */}
      <div className="px-4 sm:px-6">
        <InteractiveCard
          title="Nutrition"
          icon={<Utensils className="text-teal-primary" size={16} />}
          onClick={() => navigate('/food')}
          content={
              <div>
                {/* Calories Gauge */}
                <div className="relative h-32 mb-4 bg-glass-highlight bg-opacity-70 rounded-lg p-3 overflow-hidden">
                  {/* Circular gauge */}
                  <div className="absolute top-3 right-3 w-20 h-20">
                    <div className="relative w-full h-full">
                      {/* Background circle */}
                      <div className="absolute inset-0 rounded-full border-4 border-glass-highlight"></div>
                      
                      {/* Progress circle */}
                      <div 
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `conic-gradient(
                            ${nutritionSummary.calories.current > nutritionSummary.calories.target ? '#ef4444' : '#06b6d4'} ${(nutritionSummary.calories.current / nutritionSummary.calories.target) * 100}%, 
                            transparent ${(nutritionSummary.calories.current / nutritionSummary.calories.target) * 100}%
                          )`,
                          clipPath: 'circle(50% at center)'
                        }}
                      ></div>
                      
                      {/* Inner circle with percentage */}
                      <div className="absolute inset-1 rounded-full bg-glass-background bg-opacity-70 flex items-center justify-center flex-col">
                        <div className="text-white text-sm font-medium">
                          {Math.round((nutritionSummary.calories.current / nutritionSummary.calories.target) * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Calories info */}
                  <div className="pt-2 pl-2">
                    <div className="text-white text-sm font-medium mb-1">Daily Calories</div>
                    <div className="text-white text-lg font-bold">{nutritionSummary.calories.current}</div>
                    <div className="text-white/70 text-xs">of {nutritionSummary.calories.target} kcal</div>
                  </div>
                </div>
                
                {/* Macros visualization */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {/* Protein */}
                  <motion.div 
                    className="bg-glass-highlight bg-opacity-70 rounded-lg p-3 flex flex-col items-center"
                    whileHover={{ y: -2, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="relative w-full h-10 mb-2">
                      <div className="absolute inset-0 bg-glass-background bg-opacity-30 rounded-md"></div>
                      <motion.div 
                        className="absolute left-0 top-0 bottom-0 bg-cyan-primary rounded-md"
                        initial={{ width: 0 }}
                        animate={{ width: `${(nutritionSummary.protein.current / nutritionSummary.protein.target) * 100}%` }}
                        transition={{ duration: 1, type: 'spring' }}
                      ></motion.div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">{Math.round((nutritionSummary.protein.current / nutritionSummary.protein.target) * 100)}%</span>
                      </div>
                    </div>
                    <span className="text-white text-xs">Protein</span>
                    <span className="text-white text-sm font-medium">{nutritionSummary.protein.current}{nutritionSummary.protein.unit}</span>
                  </motion.div>
                  
                  {/* Carbs */}
                  <motion.div 
                    className="bg-glass-highlight bg-opacity-70 rounded-lg p-3 flex flex-col items-center"
                    whileHover={{ y: -2, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="relative w-full h-10 mb-2">
                      <div className="absolute inset-0 bg-glass-background bg-opacity-30 rounded-md"></div>
                      <motion.div 
                        className="absolute left-0 top-0 bottom-0 bg-teal-primary rounded-md"
                        initial={{ width: 0 }}
                        animate={{ width: `${(nutritionSummary.carbs.current / nutritionSummary.carbs.target) * 100}%` }}
                        transition={{ duration: 1, type: 'spring', delay: 0.2 }}
                      ></motion.div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">{Math.round((nutritionSummary.carbs.current / nutritionSummary.carbs.target) * 100)}%</span>
                      </div>
                    </div>
                    <span className="text-white text-xs">Carbs</span>
                    <span className="text-white text-sm font-medium">{nutritionSummary.carbs.current}{nutritionSummary.carbs.unit}</span>
                  </motion.div>
                  
                  {/* Fat */}
                  <motion.div 
                    className="bg-glass-highlight bg-opacity-70 rounded-lg p-3 flex flex-col items-center"
                    whileHover={{ y: -2, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="relative w-full h-10 mb-2">
                      <div className="absolute inset-0 bg-glass-background bg-opacity-30 rounded-md"></div>
                      <motion.div 
                        className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-primary/70 to-teal-primary/70 rounded-md"
                        initial={{ width: 0 }}
                        animate={{ width: `${(nutritionSummary.fat.current / nutritionSummary.fat.target) * 100}%` }}
                        transition={{ duration: 1, type: 'spring', delay: 0.4 }}
                      ></motion.div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">{Math.round((nutritionSummary.fat.current / nutritionSummary.fat.target) * 100)}%</span>
                      </div>
                    </div>
                    <span className="text-white text-xs">Fat</span>
                    <span className="text-white text-sm font-medium">{nutritionSummary.fat.current}{nutritionSummary.fat.unit}</span>
                  </motion.div>
                </div>
              </div>
          }
        />
      </div>
      
      {/* Health Metrics Card */}
      <div className="px-4 sm:px-6">
        <InteractiveCard
          title="Health"
          icon={<Heart className="text-cyan-primary" size={16} />}
          onClick={() => navigate('/health')}
          content={
              <div>
                {/* Recovery Score Gauge */}
                <div className="relative h-36 mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      {/* Background circle */}
                      <div className="absolute inset-0 rounded-full border-8 border-glass-highlight bg-glass-background bg-opacity-30"></div>
                      
                      {/* Progress circle - using conic gradient for visual effect */}
                      <div 
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `conic-gradient(
                            ${getRecoveryColor(recoveryScore)} ${recoveryScore}%, 
                            transparent ${recoveryScore}%
                          )`,
                          clipPath: 'circle(50% at center)'
                        }}
                      ></div>
                      
                      {/* Inner circle with score */}
                      <div className="absolute inset-2 rounded-full bg-glass-background bg-opacity-70 flex items-center justify-center flex-col">
                        <div className="text-2xl font-bold" style={{ color: getRecoveryColor(recoveryScore) }}>
                          {recoveryScore}
                        </div>
                        <div className="text-white text-xs font-medium">Recovery</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Health metrics grid */}
                <div className="grid grid-cols-2 gap-3">
                  {healthMetrics.map((metric, index) => (
                    <div 
                      key={index} 
                      className="bg-glass-highlight bg-opacity-70 rounded-lg p-3 flex flex-col items-center"
                    >
                      <div className="mb-2 p-2 rounded-full bg-glass-background bg-opacity-30">
                        {React.cloneElement(metric.icon as React.ReactElement, { 
                          size: 20, 
                          className: metric.trend === 'up' ? 'text-teal-primary' : 'text-cyan-primary' 
                        })}
                      </div>
                      
                      <div className="text-white text-sm font-medium mb-1">{metric.value}{metric.unit || ''}</div>
                      <div className="text-white/70 text-xs">{metric.title}</div>
                      
                      {/* Trend indicator */}
                      <div className={`mt-1 text-xs font-medium ${
                        metric.trend === 'up' ? 'text-teal-primary' : 
                        metric.trend === 'down' ? 'text-red-400' : 
                        'text-white/50'
                      }`}>
                        {metric.trend === 'up' ? '↑ Improving' : 
                         metric.trend === 'down' ? '↓ Decreasing' : 
                         '→ Stable'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          }
        />
      </div>
      
      {/* Goal Progress Card */}
      <div className="px-4 sm:px-6">
        <InteractiveCard
          title="Goal Progress"
          icon={<Target className="text-cyan-primary" size={16} />}
          onClick={() => navigate('/goals/progress')}
          content={
              <div>
                {/* Simplified goal progress card */}
                <div className="relative h-32 bg-glass-highlight bg-opacity-70 rounded-lg overflow-hidden">
                  {/* Mountain silhouette background - simplified */}
                  <div className="absolute inset-0 flex items-end opacity-30">
                    <svg viewBox="0 0 100 60" className="w-full">
                      <path 
                        d="M0,60 L20,30 L30,40 L40,20 L60,45 L70,15 L80,35 L100,10 L100,60 Z" 
                        fill="#06b6d4" 
                      />
                    </svg>
                  </div>
                  
                  {/* Main content */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    {/* Top section */}
                    <div>
                      <div className="text-white text-base font-medium mb-1">{activityPoints.goalName}</div>
                      <div className="text-white/80 text-sm mb-3">{getProgressPercentage()}% complete</div>
                      
                      {/* Progress bar */}
                      <div className="relative h-2 bg-glass-background bg-opacity-30 rounded-full overflow-hidden">
                        <motion.div 
                          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-primary to-teal-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${getProgressPercentage()}%` }}
                          transition={{ duration: 1, type: 'spring', bounce: 0.2 }}
                        />
                      </div>
                    </div>
                    
                    {/* Bottom section */}
                    <div className="flex justify-between items-center">
                      <div className="text-white text-sm">
                        <span className="font-medium">{activityPoints.currentPoints}</span>
                        <span className="text-white/70"> / {activityPoints.targetPoints} points</span>
                      </div>
                      
                      <div className="bg-cyan-primary/30 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {getPointsRemaining()} to next level
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          }
        />
      </div>
      
      {/* AI Coach Card */}
      <div className="px-4 sm:px-6">
        <InteractiveCard
          title="AI Coach"
          icon={<MessageCircle className="text-cyan-primary" size={16} />}
          onClick={() => navigate('/coach')}
          content={
            <div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-glass-highlight bg-opacity-80 p-3 rounded-lg flex flex-col items-center justify-center aspect-square">
                  <Dumbbell size={24} className="text-cyan-primary mb-2" />
                  <span className="text-white text-xs font-medium">Form Check</span>
                </div>
                <div className="bg-glass-highlight bg-opacity-80 p-3 rounded-lg flex flex-col items-center justify-center aspect-square">
                  <Zap size={24} className="text-teal-primary mb-2" />
                  <span className="text-white text-xs font-medium">Workout Plans</span>
                </div>
                <div className="bg-glass-highlight bg-opacity-80 p-3 rounded-lg flex flex-col items-center justify-center aspect-square">
                  <Utensils size={24} className="text-cyan-primary mb-2" />
                  <span className="text-white text-xs font-medium">Nutrition</span>
                </div>
                <div className="bg-glass-highlight bg-opacity-80 p-3 rounded-lg flex flex-col items-center justify-center aspect-square">
                  <Heart size={24} className="text-teal-primary mb-2" />
                  <span className="text-white text-xs font-medium">Recovery</span>
                </div>
              </div>
            </div>
          }
        />
      </div>
      
      {/* Friends Card */}
      <div className="px-4 sm:px-6">
        <InteractiveCard
          title="Friends"
          icon={<Users className="text-teal-primary" size={16} />}
          onClick={() => navigate('/friends')}
          badge="3 active"
          content={
              <div className="relative h-24 bg-glass-highlight bg-opacity-80 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex -space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-primary/80 to-teal-primary/80 border-2 border-white/30 shadow-lg flex items-center justify-center text-sm font-medium text-white z-30">JS</div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-primary/80 to-cyan-primary/80 border-2 border-white/30 shadow-lg flex items-center justify-center text-sm font-medium text-white z-20">KM</div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-primary/80 to-teal-primary/80 border-2 border-white/30 shadow-lg flex items-center justify-center text-sm font-medium text-white z-10">AR</div>
                    <div className="w-12 h-12 rounded-full bg-glass-highlight border-2 border-white/30 shadow-lg flex items-center justify-center text-sm font-medium text-white">+2</div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-glass-background to-transparent h-8 flex items-end justify-center pb-1">
                  <span className="text-xs text-white font-medium">3 friends active now</span>
                </div>
              </div>
          }
        />
      </div>
      
      {/* Insights Card */}
      <div className="px-4 sm:px-6">
        <InteractiveCard
          title="Insights"
          icon={<BarChart3 className="text-teal-primary" size={16} />}
          onClick={() => navigate('/health/trends')}
          content={
            <div>
              <div className="flex items-center justify-between mb-2 sm:mb-3 bg-glass-background bg-opacity-30 p-1.5 sm:p-2 rounded-lg">
                <span className="text-xs sm:text-sm text-alpine-mist">Weekly Progress</span>
              </div>
              <div className="relative h-32 bg-glass-highlight bg-opacity-70 rounded-lg p-4 overflow-hidden">
                {/* Background grid lines */}
                <div className="absolute inset-0 grid grid-cols-7 gap-1">
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={`grid-${i}`} className="border-r border-white/10 h-full"></div>
                  ))}
                  {[0, 1, 2, 3].map((i) => (
                    <div key={`grid-h-${i}`} className="border-b border-white/10 w-full absolute" style={{bottom: `${i * 25}%`}}></div>
                  ))}
                </div>
                
                {/* Chart bars with animations */}
                <div className="relative h-full flex items-end space-x-1 sm:space-x-2 z-10">
                  {[65, 45, 75, 60, 80, 70, 90].map((height, i) => (
                    <motion.div 
                      key={i} 
                      className={`flex-1 rounded-t ${i === 6 ? 'bg-gradient-to-t from-cyan-primary to-teal-primary shadow-lg shadow-cyan-primary/20' : 'bg-glass-highlight bg-opacity-80'}`}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, type: 'spring', stiffness: 100 }}
                    >
                      {i === 6 && (
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white bg-cyan-primary px-1.5 py-0.5 rounded-sm shadow-md">
                          {height}%
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
                
                {/* Day labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 py-1 bg-gradient-to-t from-glass-background to-transparent">
                  <span className="text-[10px] sm:text-xs text-white/70 font-medium">M</span>
                  <span className="text-[10px] sm:text-xs text-white/70 font-medium">T</span>
                  <span className="text-[10px] sm:text-xs text-white/70 font-medium">W</span>
                  <span className="text-[10px] sm:text-xs text-white/70 font-medium">T</span>
                  <span className="text-[10px] sm:text-xs text-white/70 font-medium">F</span>
                  <span className="text-[10px] sm:text-xs text-white/70 font-medium">S</span>
                  <span className="text-[10px] sm:text-xs text-cyan-primary font-medium">S</span>
                </div>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default EnhancedDashboard;
