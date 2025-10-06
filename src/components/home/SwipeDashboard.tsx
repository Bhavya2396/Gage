import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
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
  Clock,
  Lightbulb,
  Brain,
  Sparkles,
  Flame,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';

// Dashboard card component for swipe interface - matches original InteractiveCard styling
interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  onClick: () => void;
  className?: string;
  highlight?: boolean;
  badge?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon,
  content,
  onClick,
  className = '',
  highlight = false,
  badge
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Handle click with event prevention
  const handleClick = (e: React.MouseEvent) => {
    // Prevent event bubbling
    e.preventDefault();
    e.stopPropagation();
    
    // Call the onClick handler
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      className={`w-full mb-4 sm:mb-6 ${className}`}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <GlassCard 
        variant="default" 
        size="md" 
        className={`h-full w-full cursor-pointer overflow-hidden ${isHovered ? 'border-primary-cyan-500/50 shadow-xl shadow-cyan-primary/20' : 'shadow-lg'}`}
        onClick={handleClick}
      >
        <div className="flex flex-col h-full">
          {/* Card Header */}
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <div className="flex items-center">
              <div className={`p-2.5 sm:p-3 rounded-full ${isHovered ? 'bg-gradient-to-br from-primary-cyan-500 to-primary-teal-500' : 'bg-glass-highlight bg-opacity-80'} mr-3 sm:mr-4 transition-colors`}>
                <div className={`${isHovered ? 'text-white' : 'text-primary-cyan-500'}`}>
                  {icon}
                </div>
              </div>
              <div className="flex items-center">
                <h3 className="text-white font-medium text-base sm:text-lg">{title}</h3>
                {badge && (
                  <span className="ml-2 sm:ml-3 text-[10px] sm:text-xs bg-primary-cyan-500/30 text-white font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                    {badge}
                  </span>
                )}
              </div>
            </div>
            
            <motion.div
              animate={{ x: isHovered ? 0 : 5, opacity: isHovered ? 1 : 0.5 }}
              transition={{ duration: 0.2 }}
              className={`${isHovered ? 'bg-primary-cyan-500 text-white' : 'bg-glass-highlight text-primary-cyan-500'} rounded-full p-1.5 transition-colors`}
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
            <div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-primary-cyan-500 animate-pulse m-2 shadow-md shadow-cyan-primary/30" />
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
};

// Main swipe dashboard component
const SwipeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { activityPoints } = useActivityPoints();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate progress percentage
  const getProgressPercentage = () => {
    return Math.min(Math.round((activityPoints.currentPoints / activityPoints.targetPoints) * 100), 100);
  };

  // Get recovery color based on score
  const getRecoveryColor = (score: number) => {
    if (score >= 80) return '#4ADE80';
    if (score >= 60) return '#FBBF24';
    return '#F87171';
  };

  // Dashboard cards data
  const dashboardCards = [
    {
      id: 'schedule',
      title: "Today's Schedule",
      icon: <Calendar className="text-primary-cyan-500" size={16} />,
      onClick: () => navigate('/calendar'),
      content: (
        <div className="relative">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">Morning</span>
              <span className="text-xs text-white/60">9:00 AM</span>
            </div>
            <div className="bg-primary-cyan-500/20 rounded-lg p-3 border border-primary-cyan-500/30">
              <div className="flex items-center space-x-3">
                <Dumbbell className="text-primary-cyan-500" size={16} />
                <span className="text-sm text-white font-medium">Foundation Strength</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">Afternoon</span>
              <span className="text-xs text-white/60">2:00 PM</span>
            </div>
            <div className="bg-primary-teal-500/20 rounded-lg p-3 border border-primary-teal-500/30">
              <div className="flex items-center space-x-3">
                <Utensils className="text-primary-teal-500" size={16} />
                <span className="text-sm text-white font-medium">Nutrition Check</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'workout',
      title: "Workout",
      icon: <Dumbbell className="text-primary-cyan-500" size={16} />,
      badge: "Ready",
      highlight: true,
      onClick: () => navigate('/workout'),
      content: (
        <div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-white/80">Foundation Strength</span>
              <span className="text-xs bg-primary-cyan-500/30 text-white font-medium px-2.5 py-1 rounded-full">
                45 min
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white font-medium">Core Stability</span>
                <span className="text-xs text-white/60">3 sets</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white font-medium">Leg Strength</span>
                <span className="text-xs text-white/60">4 sets</span>
              </div>
            </div>
          </div>
          <div className="bg-primary-cyan-500/20 rounded-lg p-3 border border-primary-cyan-500/30">
            <div className="flex items-center space-x-3">
              <Lightbulb className="text-primary-cyan-500" size={16} />
              <span className="text-xs text-white font-medium">
                Focus on core stability for golf drive power
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'nutrition',
      title: "Nutrition",
      icon: <Utensils className="text-primary-teal-500" size={16} />,
      onClick: () => navigate('/food'),
      content: (
        <div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {nutritionSummary.calories.current}
              </div>
              <div className="text-xs text-white/60">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {nutritionSummary.protein.current}g
              </div>
              <div className="text-xs text-white/60">Protein</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white font-medium">Breakfast</span>
              <span className="text-xs text-white/60">✓ Complete</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white font-medium">Lunch</span>
              <span className="text-xs text-white/60">Pending</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'health',
      title: "Health",
      icon: <Heart className="text-primary-cyan-500" size={16} />,
      onClick: () => navigate('/health'),
      content: (
        <div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                {baseHealthMetrics[0]?.value || 68}
              </div>
              <div className="text-xs text-white/60">BPM</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">
                7.5
              </div>
              <div className="text-xs text-white/60">Hours</div>
            </div>
          </div>
          <div className="bg-primary-cyan-500/20 rounded-lg p-3 border border-primary-cyan-500/30">
            <div className="flex items-center space-x-3">
              <Brain className="text-primary-cyan-500" size={16} />
              <span className="text-xs text-white font-medium">
                Recovery: 78%
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'goals',
      title: "Goal Progress",
      icon: <Target className="text-primary-cyan-500" size={16} />,
      onClick: () => navigate('/goals/progress'),
      content: (
        <div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-white/80">Foundation Phase</span>
              <span className="text-xs text-white/60">{getProgressPercentage()}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white font-medium">Points to go</span>
              <span className="text-xs text-white/60">
                {activityPoints.targetPoints - activityPoints.currentPoints}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white font-medium">Days remaining</span>
              <span className="text-xs text-white/60">12</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'coach',
      title: "AI Coach",
      icon: <MessageCircle className="text-primary-cyan-500" size={16} />,
      onClick: () => navigate('/coach'),
      content: (
        <div>
          <div className="mb-4">
            <div className="flex items-center space-x-3 mb-3">
              <Sparkles className="text-primary-cyan-500" size={16} />
              <span className="text-sm text-white/80">Latest Insight</span>
            </div>
            <p className="text-sm text-white font-medium">
              "Your core stability is improving! Focus on rotational exercises for golf power."
            </p>
          </div>
          <div className="bg-primary-cyan-500/20 rounded-lg p-3 border border-primary-cyan-500/30">
            <div className="flex items-center space-x-3">
              <Brain className="text-primary-cyan-500" size={16} />
              <span className="text-xs text-white font-medium">
                Personalized recommendations available
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'friends',
      title: "Friends",
      icon: <Users className="text-primary-teal-500" size={16} />,
      badge: "3 active",
      onClick: () => navigate('/friends'),
      content: (
        <div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white font-medium">Alex</span>
              <span className="text-xs text-white/60">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white font-medium">Sarah</span>
              <span className="text-xs text-white/60">Working out</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white font-medium">Mike</span>
              <span className="text-xs text-white/60">Just finished</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'insights',
      title: "Insights",
      icon: <BarChart3 className="text-primary-teal-500" size={16} />,
      onClick: () => navigate('/health/trends'),
      content: (
        <div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white font-medium">Weekly Progress</span>
              <span className="text-xs text-white/60">+12%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white font-medium">Best Day</span>
              <span className="text-xs text-white/60">Tuesday</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white font-medium">Streak</span>
              <span className="text-xs text-white/60">5 days</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Handle swipe gestures
  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50;
    
    if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setDragDirection('right');
    } else if (info.offset.x < -threshold && currentIndex < dashboardCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setDragDirection('left');
    }
  };

  // Handle touch navigation
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setDragDirection('right');
    }
  };

  const goToNext = () => {
    if (currentIndex < dashboardCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setDragDirection('left');
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Navigation indicators */}
      <div className="flex items-center justify-between px-4 py-2 mb-2">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className={`p-2 rounded-lg transition-all duration-300 ${
            currentIndex === 0 
              ? 'text-ui-text-muted/50 cursor-not-allowed' 
              : 'text-ui-text-primary hover:bg-ui-highlight'
          }`}
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex space-x-2">
          {dashboardCards.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary-cyan-500' 
                  : 'bg-ui-text-muted/30'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={goToNext}
          disabled={currentIndex === dashboardCards.length - 1}
          className={`p-2 rounded-lg transition-all duration-300 ${
            currentIndex === dashboardCards.length - 1 
              ? 'text-ui-text-muted/50 cursor-not-allowed' 
              : 'text-ui-text-primary hover:bg-ui-highlight'
          }`}
        >
          <ChevronRightIcon size={20} />
        </button>
      </div>

      {/* Swipeable content */}
      <div className="flex-1 px-4">
        <motion.div
          ref={containerRef}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
          className="w-full"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ 
                x: dragDirection === 'left' ? 300 : -300, 
                opacity: 0 
              }}
              animate={{ 
                x: 0, 
                opacity: 1 
              }}
              exit={{ 
                x: dragDirection === 'left' ? -300 : 300, 
                opacity: 0 
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30 
              }}
            >
              <DashboardCard
                key={dashboardCards[currentIndex].id}
                title={dashboardCards[currentIndex].title}
                icon={dashboardCards[currentIndex].icon}
                content={dashboardCards[currentIndex].content}
                onClick={dashboardCards[currentIndex].onClick}
                highlight={dashboardCards[currentIndex].highlight}
                badge={dashboardCards[currentIndex].badge}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Swipe instruction */}
      <div className="px-4 py-2">
        <div className="text-center">
          <span className="text-xs text-ui-text-muted text-shadow-light">
            Swipe left/right to explore • {currentIndex + 1} of {dashboardCards.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SwipeDashboard;
