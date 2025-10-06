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
  MapPin,
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
          {/* Timeline */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary-cyan-500"></div>
          
          <div className="space-y-6 pl-8">
            {/* Morning Workout */}
            <div className="relative">
              <div className="absolute -left-6 w-3 h-3 bg-primary-cyan-500 rounded-full shadow-lg shadow-cyan-500/50"></div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-white">Morning Workout</span>
                  <span className="text-sm text-primary-cyan-400">9:00 AM</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-white">
                  <Dumbbell className="text-primary-cyan-400" size={16} />
                  <span>Full Body</span>
                  <span className="text-white/40">•</span>
                  <span>45 min</span>
                </div>
              </div>
            </div>
            
            {/* Lunch */}
            <div className="relative">
              <div className="absolute -left-6 w-3 h-3 bg-primary-cyan-500 rounded-full shadow-lg shadow-cyan-500/50"></div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-white">Lunch</span>
                  <span className="text-sm text-primary-cyan-400">12:30 PM</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-white">
                  <Utensils className="text-primary-cyan-400" size={16} />
                  <span>Protein-rich</span>
                  <span className="text-white/40">•</span>
                  <span>650 kcal</span>
                </div>
              </div>
            </div>
            
            {/* Evening Session */}
            <div className="relative">
              <div className="absolute -left-6 w-3 h-3 bg-primary-cyan-500 rounded-full shadow-lg shadow-cyan-500/50"></div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-white">Evening Session</span>
                  <span className="text-sm text-primary-cyan-400">6:00 PM</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-white">
                  <Target className="text-primary-cyan-400" size={16} />
                  <span>Golf Practice</span>
                  <span className="text-white/40">•</span>
                  <span>60 min</span>
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
          {/* Workout Title */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-2">Full Body Strength</h3>
          </div>
          
          {/* Base Camp Focus Box */}
          <div className="bg-primary-teal-500/20 rounded-lg p-4 mb-4 border border-primary-teal-500/30">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-primary-cyan-500/30 rounded-full flex items-center justify-center">
                <Target className="text-primary-cyan-400" size={14} />
              </div>
              <span className="text-sm text-white">
                Base Camp Focus: Building foundational strength and movement patterns
              </span>
            </div>
          </div>
          
          {/* Workout Summary */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-semibold text-white">Rotational Power</span>
            <div className="flex items-center space-x-2">
              <Clock className="text-primary-cyan-400" size={16} />
              <span className="text-sm text-white">45 min</span>
            </div>
          </div>
          
          {/* Exercise List */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm text-white">
              <span>Dynamic Warm-up</span>
              <span>1 x 5 min</span>
            </div>
            <div className="flex items-center justify-between text-sm text-white">
              <span>Medicine Ball Rotational Throws</span>
              <span>3 x 10 each side</span>
            </div>
            <div className="flex items-center justify-between text-sm text-white">
              <span>Cable Woodchoppers</span>
              <span>3 x 12 each side</span>
            </div>
            <div className="flex items-center justify-between text-sm text-white">
              <span>Kettlebell Swings</span>
              <span>3 x 15</span>
            </div>
            <div className="flex items-center justify-between text-sm text-white">
              <span>Plank with Rotation</span>
              <span>3 x 10 each side</span>
            </div>
          </div>
          
          {/* Journey Impact */}
          <div className="bg-primary-teal-500/20 rounded-lg p-4 border border-primary-teal-500/30">
            <div className="flex items-center space-x-3 mb-2">
              <Zap className="text-primary-cyan-400" size={16} />
              <span className="text-sm font-bold text-white">Journey Impact</span>
            </div>
            <p className="text-sm text-white">
              This workout will earn you approximately 25-30 points toward your foundation phase of add 15 yeards to my golf swing.
            </p>
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
          {/* Daily Calories Card */}
          <div className="bg-white/5 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-white mb-1">Daily Calories</div>
                <div className="text-2xl font-bold text-white mb-1">1650</div>
                <div className="text-xs text-white/60">of 2400 kcal</div>
              </div>
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
                    stroke="#00ccff"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="37.7"
                    strokeDashoffset="11.7"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-xs font-bold text-white">69%</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Base Camp Nutrition */}
          <div className="bg-primary-teal-500/20 rounded-lg p-4 mb-4 border border-primary-teal-500/30">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-primary-cyan-500/30 rounded-full flex items-center justify-center">
                <Utensils className="text-primary-cyan-400" size={14} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Base Camp Nutrition</div>
                <div className="text-xs text-white/80">
                  Focus on balanced macros with adequate protein to build your foundation.
                </div>
              </div>
            </div>
          </div>
          
          {/* Macro Breakdown */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <div className="bg-primary-cyan-500 h-2 rounded-full" style={{ width: '63%' }}></div>
              </div>
              <div className="text-xs text-white/60 mb-1">Protein</div>
              <div className="text-sm font-bold text-white">95g</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <div className="bg-primary-teal-500 h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
              <div className="text-xs text-white/60 mb-1">Carbs</div>
              <div className="text-sm font-bold text-white">180g</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <div className="bg-primary-cyan-500 h-2 rounded-full" style={{ width: '69%' }}></div>
              </div>
              <div className="text-xs text-white/60 mb-1">Fat</div>
              <div className="text-sm font-bold text-white">55g</div>
            </div>
          </div>
          
          {/* Journey Impact */}
          <div className="bg-primary-teal-500/20 rounded-lg p-4 mt-4 border border-primary-teal-500/30">
            <div className="flex items-center space-x-3 mb-2">
              <Zap className="text-primary-cyan-400" size={16} />
              <span className="text-sm font-bold text-white">Journey Impact</span>
            </div>
            <p className="text-sm text-white">
              Optimal nutrition can boost your recovery by up to 30% and accelerate your progress toward add 15 yeards to my golf swing.
            </p>
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
          {/* Recovery Score */}
          <div className="flex justify-center mb-6">
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
                  stroke="#4ade80"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="62.83"
                  strokeDashoffset="13.8"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">78</div>
                  <div className="text-xs text-white/60">Recovery</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Base Camp Recovery */}
          <div className="bg-white/5 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-primary-cyan-500/30 rounded-full flex items-center justify-center">
                <Heart className="text-primary-cyan-400" size={14} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Base Camp Recovery</div>
                <div className="text-xs text-white/80">
                  Focus on establishing healthy recovery patterns to build a strong foundation.
                </div>
              </div>
            </div>
          </div>
          
          {/* Health Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="text-primary-cyan-400" size={16} />
                <span className="text-sm text-white font-semibold">Heart Rate</span>
              </div>
              <div className="text-lg font-bold text-white mb-1">68bpm</div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-primary-cyan-400 rounded-full"></div>
                <span className="text-xs text-primary-cyan-400">Stable</span>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="text-primary-cyan-400" size={16} />
                <span className="text-sm text-white font-semibold">HRV</span>
              </div>
              <div className="text-lg font-bold text-white mb-1">65ms</div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-green-400">Improving</span>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Wind className="text-primary-cyan-400" size={16} />
                <span className="text-sm text-white font-semibold">Respiration</span>
              </div>
              <div className="text-lg font-bold text-white mb-1">14bpm</div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-primary-cyan-400 rounded-full"></div>
                <span className="text-xs text-primary-cyan-400">Normal</span>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Droplet className="text-primary-cyan-400" size={16} />
                <span className="text-sm text-white font-semibold">Hydration</span>
              </div>
              <div className="text-lg font-bold text-white mb-1">Good</div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-green-400">Optimal</span>
              </div>
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
        <div className="relative">
          {/* Mountain Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-20 bg-gradient-to-t from-primary-cyan-500/20 to-transparent rounded-lg"></div>
          </div>
          
          <div className="relative z-10">
            {/* Goal Description */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-6 h-6 bg-primary-cyan-500/30 rounded-full flex items-center justify-center">
                <Award className="text-primary-cyan-400" size={14} />
              </div>
              <div>
                <div className="text-lg font-bold text-white">add 15 yeards to my golf swing</div>
                <div className="text-xs text-white/60">Your mountain journey</div>
              </div>
            </div>
            
            {/* Overall Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white">Overall Progress</span>
                <span className="text-sm text-white">0%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <div className="bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 h-2 rounded-full" style={{ width: '0%' }} />
              </div>
              <div className="flex justify-between text-xs text-white/60">
                <span>Base Camp</span>
                <span>Camp 1</span>
                <span>Summit</span>
              </div>
            </div>
            
            {/* Foundation Phase */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-white">Foundation Phase</span>
                  <span className="text-xs bg-primary-cyan-500/30 text-white px-2 py-1 rounded-full">Current</span>
                </div>
                <span className="text-sm text-white">0%</span>
              </div>
              <div className="text-xs text-white/60">0 of 518 points earned in this phase</div>
            </div>
            
            {/* Points Summary */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-white">0 points</div>
                <div className="text-xs text-white/60">total earned</div>
              </div>
              <div className="bg-gradient-to-r from-primary-cyan-500/30 to-primary-teal-500/30 rounded-lg px-3 py-2">
                <div className="text-sm font-bold text-white">2070 to summit</div>
              </div>
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
          {/* GAGE AI Header */}
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-primary-cyan-500/30 rounded-full flex items-center justify-center mr-3">
              <Sparkles className="text-primary-cyan-400" size={16} />
            </div>
            <div className="flex items-center">
              <span className="text-lg font-bold text-primary-cyan-400 mr-2">GAGE AI</span>
              <span className="text-xs bg-primary-cyan-500/30 text-white px-2 py-1 rounded-full">Coach</span>
            </div>
          </div>
          
          {/* AI Message */}
          <div className="mb-4">
            <p className="text-sm text-white mb-2">
              Good afternoon, Bhavya! It's a beautiful sunny day at 25°C – perfect weather for getting active!
            </p>
            <p className="text-sm text-white mb-2">
              You're at Base Camp (0%) in your add 15 yeards to my golf swing journey.
            </p>
            <p className="text-sm text-white mb-2">
              This Foundation Phase is all about building the fundamentals with 0 of 518 points earned.
            </p>
            <p className="text-sm text-white">
              Today at Base Camp, I've scheduled a foundational strength session focusing on building your core stability - essential for your add 15 yeards to my golf swing journey.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-2">
            <button className="w-full bg-white/5 rounded-lg p-3 flex items-center space-x-3 hover:bg-white/10 transition-colors">
              <Dumbbell className="text-primary-cyan-400" size={16} />
              <span className="text-sm text-white">Show me today's workout</span>
            </button>
            <button className="w-full bg-white/5 rounded-lg p-3 flex items-center space-x-3 hover:bg-white/10 transition-colors">
              <MapPin className="text-primary-cyan-400" size={16} />
              <span className="text-sm text-white">View my journey map</span>
            </button>
            <button className="w-full bg-white/5 rounded-lg p-3 flex items-center space-x-3 hover:bg-white/10 transition-colors">
              <Award className="text-primary-cyan-400" size={16} />
              <span className="text-sm text-white">Journey complete!</span>
            </button>
            <button className="w-full bg-white/5 rounded-lg p-3 flex items-center space-x-3 hover:bg-white/10 transition-colors">
              <MessageCircle className="text-primary-cyan-400" size={16} />
              <span className="text-sm text-white">Chat with AI Coach</span>
            </button>
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
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-primary-cyan-500/30 rounded-full flex items-center justify-center text-white text-xs font-bold border border-primary-cyan-500/30">
                JS
              </div>
              <div className="w-8 h-8 bg-primary-cyan-500/30 rounded-full flex items-center justify-center text-white text-xs font-bold border border-primary-cyan-500/30">
                KM
              </div>
              <div className="w-8 h-8 bg-primary-cyan-500/30 rounded-full flex items-center justify-center text-white text-xs font-bold border border-primary-cyan-500/30">
                AR
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-bold border border-white/30">
                +2
              </div>
            </div>
          </div>
          
          {/* Active Status */}
          <div className="text-center">
            <div className="text-sm text-white">3 friends active now</div>
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
          {/* Weekly Progress Chart */}
          <div className="mb-4">
            <div className="text-sm text-white mb-3">Weekly Progress</div>
            <div className="relative h-16">
              {/* Chart Bars */}
              <div className="flex items-end justify-between h-12">
                <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
                <div className="w-4 h-6 bg-white/20 rounded-sm"></div>
                <div className="w-4 h-8 bg-white/20 rounded-sm"></div>
                <div className="w-4 h-5 bg-white/20 rounded-sm"></div>
                <div className="w-4 h-7 bg-white/20 rounded-sm"></div>
                <div className="w-4 h-6 bg-white/20 rounded-sm"></div>
                <div className="w-4 h-12 bg-primary-cyan-500 rounded-sm relative">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary-cyan-500 text-white text-xs px-2 py-1 rounded">
                    90%
                  </div>
                </div>
              </div>
              {/* Day Labels */}
              <div className="flex justify-between text-xs text-white/60 mt-2">
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
                <span>S</span>
              </div>
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
      {/* Navigation indicators - moved down */}
      <div className="flex items-center justify-between px-4 py-4 mb-4">
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

    </div>
  );
};

export default SwipeDashboard;

