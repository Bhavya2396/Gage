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

// Dashboard card component for swipe interface
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
  return (
    <motion.div
      className={`w-full ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <GlassCard
        variant={highlight ? 'highlight' : 'default'}
        className="p-4 cursor-pointer transition-all duration-300"
        interactive
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${highlight ? 'bg-primary-cyan-500/20' : 'bg-ui-highlight'}`}>
              {icon}
            </div>
            <div>
              <h3 className="font-semibold text-ui-text-primary text-shadow-medium">{title}</h3>
              {badge && (
                <span className="text-xs bg-primary-cyan-500/20 text-primary-cyan-400 px-2 py-1 rounded-full">
                  {badge}
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="text-ui-text-muted" size={16} />
        </div>
        {content}
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ui-text-secondary text-shadow-light">Morning</span>
              <span className="text-xs text-ui-text-muted">9:00 AM</span>
            </div>
            <div className="bg-primary-cyan-500/10 rounded-lg p-2">
              <div className="flex items-center space-x-2">
                <Dumbbell className="text-primary-cyan-500" size={14} />
                <span className="text-sm text-ui-text-primary text-shadow-light">Foundation Strength</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ui-text-secondary text-shadow-light">Afternoon</span>
              <span className="text-xs text-ui-text-muted">2:00 PM</span>
            </div>
            <div className="bg-primary-teal-500/10 rounded-lg p-2">
              <div className="flex items-center space-x-2">
                <Utensils className="text-primary-teal-500" size={14} />
                <span className="text-sm text-ui-text-primary text-shadow-light">Nutrition Check</span>
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
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-ui-text-secondary text-shadow-light">Foundation Strength</span>
              <span className="text-xs bg-primary-cyan-500/20 text-primary-cyan-400 px-2 py-1 rounded-full">
                45 min
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-ui-text-primary text-shadow-light">Core Stability</span>
                <span className="text-xs text-ui-text-muted">3 sets</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-ui-text-primary text-shadow-light">Leg Strength</span>
                <span className="text-xs text-ui-text-muted">4 sets</span>
              </div>
            </div>
          </div>
          <div className="bg-primary-cyan-500/10 rounded-lg p-2">
            <div className="flex items-center space-x-2">
              <Lightbulb className="text-primary-cyan-500" size={14} />
              <span className="text-xs text-ui-text-primary text-shadow-light">
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
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="text-center">
              <div className="text-lg font-bold text-ui-text-primary text-shadow-strong">
                {nutritionSummary.calories}
              </div>
              <div className="text-xs text-ui-text-muted">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-ui-text-primary text-shadow-strong">
                {nutritionSummary.protein}g
              </div>
              <div className="text-xs text-ui-text-muted">Protein</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ui-text-primary text-shadow-light">Breakfast</span>
              <span className="text-xs text-ui-text-muted">✓ Complete</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ui-text-primary text-shadow-light">Lunch</span>
              <span className="text-xs text-ui-text-muted">Pending</span>
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
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="text-center">
              <div className="text-lg font-bold text-ui-text-primary text-shadow-strong">
                {baseHealthMetrics.heartRate}
              </div>
              <div className="text-xs text-ui-text-muted">BPM</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-ui-text-primary text-shadow-strong">
                {baseHealthMetrics.sleep}
              </div>
              <div className="text-xs text-ui-text-muted">Hours</div>
            </div>
          </div>
          <div className="bg-primary-cyan-500/10 rounded-lg p-2">
            <div className="flex items-center space-x-2">
              <Brain className="text-primary-cyan-500" size={14} />
              <span className="text-xs text-ui-text-primary text-shadow-light">
                Recovery: {baseHealthMetrics.recovery}%
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
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-ui-text-secondary text-shadow-light">Foundation Phase</span>
              <span className="text-xs text-ui-text-muted">{getProgressPercentage()}%</span>
            </div>
            <div className="w-full bg-ui-highlight rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ui-text-primary text-shadow-light">Points to go</span>
              <span className="text-xs text-ui-text-muted">
                {activityPoints.targetPoints - activityPoints.currentPoints}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ui-text-primary text-shadow-light">Days remaining</span>
              <span className="text-xs text-ui-text-muted">12</span>
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
          <div className="mb-3">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="text-primary-cyan-500" size={14} />
              <span className="text-sm text-ui-text-secondary text-shadow-light">Latest Insight</span>
            </div>
            <p className="text-xs text-ui-text-primary text-shadow-light">
              "Your core stability is improving! Focus on rotational exercises for golf power."
            </p>
          </div>
          <div className="bg-primary-cyan-500/10 rounded-lg p-2">
            <div className="flex items-center space-x-2">
              <Brain className="text-primary-cyan-500" size={14} />
              <span className="text-xs text-ui-text-primary text-shadow-light">
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ui-text-primary text-shadow-light">Alex</span>
              <span className="text-xs text-ui-text-muted">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ui-text-primary text-shadow-light">Sarah</span>
              <span className="text-xs text-ui-text-muted">Working out</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ui-text-primary text-shadow-light">Mike</span>
              <span className="text-xs text-ui-text-muted">Just finished</span>
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ui-text-primary text-shadow-light">Weekly Progress</span>
              <span className="text-xs text-ui-text-muted">+12%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ui-text-primary text-shadow-light">Best Day</span>
              <span className="text-xs text-ui-text-muted">Tuesday</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ui-text-primary text-shadow-light">Streak</span>
              <span className="text-xs text-ui-text-muted">5 days</span>
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
