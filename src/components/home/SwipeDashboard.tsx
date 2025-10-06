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
        interactive
        animate
        whileHover={{ 
          scale: 1.02, 
          y: -4,
          boxShadow: '0 20px 40px rgba(0, 204, 255, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)'
        }}
        whileTap={{ scale: 0.98 }}
        glow={highlight}
        glowColor="#00ccff"
      >
        <div className="flex flex-col h-full">
          {/* Card Header */}
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <div className="flex items-center">
              <div className={`p-3 sm:p-4 rounded-full ${isHovered ? 'bg-gradient-to-br from-primary-cyan-500 to-primary-teal-500 shadow-lg shadow-cyan-500/30' : 'bg-gradient-to-br from-primary-cyan-500/20 to-primary-teal-500/20 border border-primary-cyan-500/30'} mr-4 sm:mr-5 transition-all duration-300`}>
                <div className={`${isHovered ? 'text-white' : 'text-primary-cyan-500'} transition-colors`}>
                  {icon}
                </div>
              </div>
              <div className="flex items-center">
                <h3 className="text-white font-semibold text-lg sm:text-xl">{title}</h3>
                {badge && (
                  <span className="ml-3 sm:ml-4 text-xs sm:text-sm bg-primary-cyan-500/30 text-white font-semibold px-3 py-1.5 rounded-full border border-primary-cyan-500/50">
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
    if (!activityPoints || !activityPoints.targetPoints || activityPoints.targetPoints === 0) {
      return 0;
    }
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
            {/* Morning Workout */}
            <div className="bg-gradient-to-r from-primary-cyan-500/20 to-primary-teal-500/20 rounded-xl p-4 border border-primary-cyan-500/30 shadow-lg shadow-cyan-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-full bg-primary-cyan-500/30">
                    <Dumbbell className="text-primary-cyan-400" size={20} />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">Foundation Strength</div>
                    <div className="text-sm text-primary-cyan-400">45 min</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/60">Morning</div>
                  <div className="text-sm font-bold text-primary-cyan-400">9:00 AM</div>
                </div>
              </div>
            </div>
            
            {/* Afternoon Nutrition */}
            <div className="bg-gradient-to-r from-primary-teal-500/20 to-primary-cyan-500/20 rounded-xl p-4 border border-primary-teal-500/30 shadow-lg shadow-teal-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-full bg-primary-teal-500/30">
                    <Utensils className="text-primary-teal-400" size={20} />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">Nutrition Check</div>
                    <div className="text-sm text-primary-teal-400">30 min</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/60">Afternoon</div>
                  <div className="text-sm font-bold text-primary-teal-400">2:00 PM</div>
                </div>
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
          {/* Workout Progress Ring */}
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#00ccff"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="62.83"
                  strokeDashoffset="31.42"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">50%</div>
                  <div className="text-xs text-white/60">Complete</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Exercise Icons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="w-8 h-8 bg-primary-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="text-primary-cyan-400" size={16} />
              </div>
              <div className="text-sm font-semibold text-white">Core</div>
              <div className="text-xs text-primary-cyan-400">3 sets</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="w-8 h-8 bg-primary-teal-500/30 rounded-full flex items-center justify-center mx-auto mb-2">
                <Activity className="text-primary-teal-400" size={16} />
              </div>
              <div className="text-sm font-semibold text-white">Legs</div>
              <div className="text-xs text-primary-teal-400">4 sets</div>
            </div>
          </div>
          
          {/* AI Tip */}
          <div className="bg-gradient-to-r from-primary-cyan-500/20 to-primary-teal-500/20 rounded-xl p-3 border border-primary-cyan-500/30">
            <div className="flex items-center space-x-2">
              <Lightbulb className="text-primary-cyan-400" size={16} />
              <span className="text-sm font-medium text-white">Focus on core stability</span>
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
          {/* Calorie Progress Ring */}
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="8"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="8"
                  stroke="#00ccff"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="50.27"
                  strokeDashoffset="15.08"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm font-bold text-white">69%</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Macro Icons */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className="w-6 h-6 bg-primary-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-1">
                <Flame className="text-primary-cyan-400" size={12} />
              </div>
              <div className="text-xs text-white font-semibold">1650</div>
              <div className="text-xs text-white/60">kcal</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className="w-6 h-6 bg-primary-teal-500/30 rounded-full flex items-center justify-center mx-auto mb-1">
                <Zap className="text-primary-teal-400" size={12} />
              </div>
              <div className="text-xs text-white font-semibold">95g</div>
              <div className="text-xs text-white/60">protein</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className="w-6 h-6 bg-primary-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-1">
                <Droplet className="text-primary-cyan-400" size={12} />
              </div>
              <div className="text-xs text-white font-semibold">2.1L</div>
              <div className="text-xs text-white/60">water</div>
            </div>
          </div>
          
          {/* Meal Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-white">Breakfast</span>
              </div>
              <span className="text-xs text-green-400">✓</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-cyan-400 rounded-full"></div>
                <span className="text-sm text-white">Lunch</span>
              </div>
              <span className="text-xs text-primary-cyan-400">⏳</span>
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
          {/* Health Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="w-8 h-8 bg-primary-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart className="text-primary-cyan-400" size={16} />
              </div>
              <div className="text-lg font-bold text-white">68</div>
              <div className="text-xs text-white/60">BPM</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="w-8 h-8 bg-primary-teal-500/30 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="text-primary-teal-400" size={16} />
              </div>
              <div className="text-lg font-bold text-white">7.5h</div>
              <div className="text-xs text-white/60">Sleep</div>
            </div>
          </div>
          
          {/* Recovery Ring */}
          <div className="flex justify-center mb-3">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="6"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="6"
                  stroke="#4ade80"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="37.7"
                  strokeDashoffset="8.3"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs font-bold text-white">78%</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Status Indicators */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-white">Recovery</span>
              </div>
              <span className="text-xs text-green-400">Good</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-cyan-400 rounded-full"></div>
                <span className="text-sm text-white">HRV</span>
              </div>
              <span className="text-xs text-primary-cyan-400">↑ +5</span>
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
          {/* Progress Ring */}
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="8"
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="8"
                  stroke="#00ccff"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="50.27"
                  strokeDashoffset="50.27"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm font-bold text-white">0%</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Goal Icons */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className="w-6 h-6 bg-primary-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-1">
                <Target className="text-primary-cyan-400" size={12} />
              </div>
              <div className="text-xs text-white font-semibold">0</div>
              <div className="text-xs text-white/60">points</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className="w-6 h-6 bg-primary-teal-500/30 rounded-full flex items-center justify-center mx-auto mb-1">
                <Award className="text-primary-teal-400" size={12} />
              </div>
              <div className="text-xs text-white font-semibold">518</div>
              <div className="text-xs text-white/60">target</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className="w-6 h-6 bg-primary-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-1">
                <Clock className="text-primary-cyan-400" size={12} />
              </div>
              <div className="text-xs text-white font-semibold">12</div>
              <div className="text-xs text-white/60">days</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2 mb-2">
            <div className="bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 h-2 rounded-full" style={{ width: '0%' }} />
          </div>
          <div className="text-center text-xs text-white/60">Foundation Phase</div>
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
          {/* AI Avatar */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-cyan-500/30 to-primary-teal-500/30 rounded-full flex items-center justify-center border border-primary-cyan-500/30">
              <Brain className="text-primary-cyan-400" size={24} />
            </div>
          </div>
          
          {/* AI Status */}
          <div className="text-center mb-4">
            <div className="text-sm font-bold text-white mb-1">AI Coach Active</div>
            <div className="text-xs text-primary-cyan-400">5 day streak</div>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className="w-6 h-6 bg-primary-cyan-500/30 rounded-full flex items-center justify-center mx-auto mb-1">
                <MessageCircle className="text-primary-cyan-400" size={12} />
              </div>
              <div className="text-xs text-white font-semibold">Chat</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2 text-center">
              <div className="w-6 h-6 bg-primary-teal-500/30 rounded-full flex items-center justify-center mx-auto mb-1">
                <Sparkles className="text-primary-teal-400" size={12} />
              </div>
              <div className="text-xs text-white font-semibold">Insights</div>
            </div>
          </div>
          
          {/* Next Session */}
          <div className="bg-gradient-to-r from-primary-cyan-500/20 to-primary-teal-500/20 rounded-lg p-3 border border-primary-cyan-500/30">
            <div className="flex items-center space-x-2">
              <Clock className="text-primary-cyan-400" size={14} />
              <span className="text-sm text-white">Next session: 2:00 PM</span>
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
          {/* Friends Avatars */}
          <div className="flex justify-center mb-4">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-cyan-500/30 to-primary-teal-500/30 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-primary-cyan-500/30">
                A
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-teal-500/30 to-primary-cyan-500/30 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-primary-teal-500/30">
                S
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-cyan-500/30 to-primary-teal-500/30 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-primary-cyan-500/30">
                M
              </div>
            </div>
          </div>
          
          {/* Active Status */}
          <div className="text-center mb-4">
            <div className="text-sm font-bold text-white mb-1">3 Active Friends</div>
            <div className="text-xs text-primary-cyan-400">2 working out now</div>
          </div>
          
          {/* Friend Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-white/5 rounded-lg p-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-white">Alex</span>
              </div>
              <span className="text-xs text-green-400">Online</span>
            </div>
            <div className="flex items-center justify-between bg-white/5 rounded-lg p-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-cyan-400 rounded-full"></div>
                <span className="text-sm text-white">Sarah</span>
              </div>
              <span className="text-xs text-primary-cyan-400">Workout</span>
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
          {/* Weekly Chart */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-white">Weekly Progress</span>
              <span className="text-xs text-primary-cyan-400">+12%</span>
            </div>
            <div className="flex items-center justify-between h-12">
              <div className="w-4 h-6 bg-primary-cyan-500/30 rounded-sm"></div>
              <div className="w-4 h-8 bg-primary-cyan-500/50 rounded-sm"></div>
              <div className="w-4 h-10 bg-primary-cyan-500 rounded-sm"></div>
              <div className="w-4 h-7 bg-primary-cyan-500/70 rounded-sm"></div>
              <div className="w-4 h-9 bg-primary-cyan-500/50 rounded-sm"></div>
              <div className="w-4 h-8 bg-primary-cyan-500/30 rounded-sm"></div>
              <div className="w-4 h-12 bg-primary-teal-500 rounded-sm"></div>
            </div>
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
          
          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-white mb-1">5</div>
              <div className="text-xs text-white/60">Day Streak</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-white mb-1">Tue</div>
              <div className="text-xs text-white/60">Best Day</div>
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

