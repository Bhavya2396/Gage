import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import GlassCard from '@/components/ui/GlassCard';
import { useActivityPoints } from '@/contexts/ActivityPointsContext';
import { 
  ChevronLeft, 
  Target, 
  Award, 
  TrendingUp,
  Flag,
  Calendar,
  Clock,
  Zap,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Phase progress component
const PhaseProgress: React.FC<{
  name: string;
  progress: number;
  isActive: boolean;
  isCompleted: boolean;
}> = ({ name, progress, isActive, isCompleted }) => {
  return (
    <div className={`p-4 rounded-lg overflow-hidden ${
      isActive 
        ? 'bg-glass-highlight border border-primary-cyan-500/30' 
        : isCompleted 
          ? 'bg-glass-background bg-opacity-40 border border-primary-teal-500/30' 
          : 'bg-glass-background bg-opacity-20'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {isCompleted ? (
            <CheckCircle className="text-primary-teal-500 mr-2" size={16} />
          ) : (
            <Flag className={`${isActive ? 'text-primary-cyan-500' : 'text-alpine-mist/50'} mr-2`} size={16} />
          )}
          <h3 className={`text-sm font-medium ${
            isActive ? 'text-alpine-mist' : isCompleted ? 'text-primary-teal-500' : 'text-alpine-mist/50'
          }`}>
            {name}
          </h3>
        </div>
        {isCompleted ? (
          <span className="text-xs bg-primary-teal-500/20 text-primary-teal-500 px-2 py-0.5 rounded-full">
            Completed
          </span>
        ) : isActive ? (
          <span className="text-xs bg-primary-cyan-500/20 text-primary-cyan-500 px-2 py-0.5 rounded-full">
            Active
          </span>
        ) : (
          <span className="text-xs bg-glass-border px-2 py-0.5 rounded-full text-alpine-mist/50">
            Upcoming
          </span>
        )}
      </div>
      
      <div className="w-full bg-glass-border h-2 rounded-full overflow-hidden mb-2">
        <div 
          className={`h-full rounded-full ${
            isCompleted 
              ? 'bg-primary-teal-500' 
              : 'bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500'
          }`}
          style={{ width: `${isCompleted ? 100 : progress}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs">
        <span className={isActive ? 'text-alpine-mist' : 'text-alpine-mist/50'}>
          {isCompleted ? '100%' : `${progress}%`}
        </span>
      </div>
    </div>
  );
};

// Activity card component
const ActivityCard: React.FC<{
  date: string;
  title: string;
  points: number;
  category: string;
}> = ({ date, title, points, category }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Determine color based on category
  const getCategoryColor = (cat?: string) => {
    if (!cat) return '#60A5FA'; // default blue if category is undefined
    
    switch (cat.toLowerCase()) {
      case 'workout': return '#00CCFF'; // cyan-primary
      case 'nutrition': return '#4ADE80'; // teal-primary
      case 'recovery': return '#A78BFA'; // purple
      default: return '#60A5FA'; // blue
    }
  };
  
  const categoryColor = getCategoryColor(category);
  
  return (
    <div className="bg-glass-background bg-opacity-30 rounded-lg overflow-hidden">
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center overflow-hidden">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mr-3"
            style={{ backgroundColor: `${categoryColor}20` }}
          >
            {category && category.toLowerCase() === 'workout' && <Zap style={{ color: categoryColor }} size={16} />}
            {category && category.toLowerCase() === 'nutrition' && <Award style={{ color: categoryColor }} size={16} />}
            {category && category.toLowerCase() === 'recovery' && <Clock style={{ color: categoryColor }} size={16} />}
            {!category || !['workout', 'nutrition', 'recovery'].includes(category.toLowerCase()) && 
              <Target style={{ color: categoryColor }} size={16} />
            }
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-medium text-alpine-mist truncate">{title}</h4>
            <div className="flex items-center text-xs text-alpine-mist/70">
              <Calendar size={12} className="mr-1" />
              <span>{date}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="bg-glass-highlight px-2 py-1 rounded-full mr-2">
            <span className="text-xs font-medium text-primary-cyan-500">+{points} pts</span>
          </div>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-full bg-glass-highlight hover:bg-glass-border transition-colors"
          >
            {expanded ? 
              <ChevronUp size={16} className="text-alpine-mist" /> : 
              <ChevronDown size={16} className="text-alpine-mist" />
            }
          </button>
        </div>
      </div>
      
      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="px-3 pb-3"
        >
          <div className="border-t border-white/10 pt-2 text-xs text-alpine-mist">
            <p>This activity contributed {points} points toward your goal.</p>
            <p className="mt-1">Category: {category}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Helper function to format dates
const formatDate = (timestamp: Date): string => {
  if (!timestamp) return 'Unknown date';
  
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (dayDiff === 0) {
    const hourDiff = Math.floor(diff / (1000 * 60 * 60));
    if (hourDiff < 1) return 'Just now';
    return `${hourDiff} ${hourDiff === 1 ? 'hour' : 'hours'} ago`;
  } else if (dayDiff === 1) {
    return 'Yesterday';
  } else if (dayDiff < 7) {
    return `${dayDiff} days ago`;
  } else {
    return timestamp.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  }
};

// Main Goal Progress Page
const GoalProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    activityPoints, 
    getProgressPercentage, 
    getPhaseProgress, 
    getCurrentPhase,
    getPointsRemaining 
  } = useActivityPoints();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Get current phase info
  const currentPhase = getCurrentPhase();
  const currentPhaseIndex = currentPhase 
    ? activityPoints.phases.findIndex(p => p.name === currentPhase.name)
    : activityPoints.phases.length - 1;
  
  // Calculate progress metrics
  const overallProgress = getProgressPercentage();
  const phaseProgress = getPhaseProgress();
  const pointsRemaining = getPointsRemaining();
  const daysActive = 14; // Placeholder - would come from actual tracking
  const estimatedCompletion = Math.ceil(pointsRemaining / (activityPoints.currentPoints / daysActive));
  
  return (
    <MainLayout>
      <div className="w-full max-w-md mx-auto px-4 pt-20 pb-24">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full bg-glass-background bg-opacity-70 backdrop-blur-sm border border-white/30 shadow-lg text-white hover:bg-glass-background hover:bg-opacity-80 hover:border-white/50"
          >
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-xl sm:text-2xl font-semibold text-alpine-mist bg-glass-background bg-opacity-40 px-3 py-1 rounded-lg">Goal Progress</h1>
        </div>
        
        {/* Goal Summary */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <motion.div variants={itemVariants}>
            <GlassCard size="full" className="overflow-hidden">
              <h2 className="text-lg font-medium text-alpine-mist mb-4">{activityPoints.goalName}</h2>
              
              {/* Progress visualization */}
              <div className="relative h-32 bg-glass-highlight bg-opacity-70 rounded-lg overflow-hidden mb-4">
                {/* Mountain silhouette background */}
                <div className="absolute inset-0 flex items-end opacity-30">
                  <svg viewBox="0 0 100 60" className="w-full">
                    <path 
                      d="M0,60 L20,30 L30,40 L40,20 L60,45 L70,15 L80,35 L100,10 L100,60 Z" 
                      fill="#06b6d4" 
                    />
                  </svg>
                </div>
                
                {/* Progress indicator */}
                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  <div className="flex justify-between items-center">
                    <div className="bg-glass-background bg-opacity-50 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-medium text-primary-cyan-500">{overallProgress}% Complete</span>
                    </div>
                    <div className="bg-glass-background bg-opacity-50 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-medium text-alpine-mist">{pointsRemaining} pts left</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-glass-border h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 h-full rounded-full" 
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Stats summary */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-glass-background bg-opacity-30 p-3 rounded-lg text-center overflow-hidden">
                  <div className="text-xs text-alpine-mist mb-1">Current Points</div>
                  <div className="text-lg font-bold text-primary-cyan-500 truncate">
                    {activityPoints.currentPoints}
                  </div>
                </div>
                
                <div className="bg-glass-background bg-opacity-30 p-3 rounded-lg text-center overflow-hidden">
                  <div className="text-xs text-alpine-mist mb-1">Days Active</div>
                  <div className="text-lg font-bold text-primary-cyan-500 truncate">
                    {daysActive}
                  </div>
                </div>
                
                <div className="bg-glass-background bg-opacity-30 p-3 rounded-lg text-center overflow-hidden">
                  <div className="text-xs text-alpine-mist mb-1">Est. Completion</div>
                  <div className="text-lg font-bold text-primary-cyan-500 truncate">
                    {estimatedCompletion} days
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
        
        {/* Phases */}
        <h2 className="text-lg font-medium text-alpine-mist mb-4">Journey Phases</h2>
        <motion.div 
          className="space-y-4 mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {activityPoints.phases.map((phase, index) => (
            <motion.div key={phase.name} variants={itemVariants}>
              <PhaseProgress 
                name={phase.name}
                progress={index < currentPhaseIndex ? 100 : index === currentPhaseIndex ? phaseProgress : 0}
                isActive={index === currentPhaseIndex}
                isCompleted={index < currentPhaseIndex}
              />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Recent Activities */}
        <h2 className="text-lg font-medium text-alpine-mist mb-4">Recent Activities</h2>
        <motion.div 
          className="space-y-3 mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {activityPoints.recentActivities.length > 0 ? (
            activityPoints.recentActivities.map((activity, index) => (
              <motion.div key={index} variants={itemVariants}>
                <ActivityCard 
                  date={formatDate(activity.timestamp)}
                  title={activity.description}
                  points={activity.pointsEarned}
                  category={activity.type}
                />
              </motion.div>
            ))
          ) : (
            <motion.div variants={itemVariants} className="bg-glass-background bg-opacity-30 p-4 rounded-lg text-center">
              <p className="text-alpine-mist text-sm">No recent activities recorded yet.</p>
              <p className="text-xs text-alpine-mist/70 mt-1">Complete activities to earn points toward your goal.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default GoalProgressPage;
