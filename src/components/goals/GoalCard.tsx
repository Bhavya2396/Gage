import React from 'react';
import { motion } from 'framer-motion';
import { Target, Calendar, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { CircleProgress } from '@/components/ui/CircleProgress';

interface GoalCardProps {
  id: string;
  title: string;
  description: string;
  category: 'fitness' | 'nutrition' | 'health' | 'personal';
  target: number;
  current: number;
  unit: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'paused' | 'overdue';
  onEdit?: () => void;
  onComplete?: () => void;
  onPause?: () => void;
}

const GoalCard: React.FC<GoalCardProps> = ({
  title,
  description,
  category,
  target,
  current,
  unit,
  deadline,
  priority,
  status,
  onEdit,
  onComplete,
  onPause
}) => {
  const progress = Math.min((current / target) * 100, 100);
  const isOverdue = status === 'overdue';
  const isCompleted = status === 'completed';
  const isPaused = status === 'paused';

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fitness': return 'primary-cyan';
      case 'nutrition': return 'primary-teal';
      case 'health': return 'primary-purple';
      case 'personal': return 'primary-orange';
      default: return 'primary-cyan';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-white/60';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed': return <CheckCircle className="text-green-400" size={16} />;
      case 'overdue': return <AlertCircle className="text-red-400" size={16} />;
      case 'paused': return <Clock className="text-yellow-400" size={16} />;
      default: return <Target className="text-primary-cyan-400" size={16} />;
    }
  };

  const categoryColor = getCategoryColor(category);

  return (
    <GlassCard 
      variant={isCompleted ? 'muted' : 'default'} 
      size="sm" 
      className="w-full mb-3"
      interactive
      animate
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            {getStatusIcon()}
            <h3 className={`text-sm font-bold ml-2 ${isCompleted ? 'text-white/70' : 'text-white'}`}>
              {title}
            </h3>
            <div className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-${categoryColor}-500/20 text-${categoryColor}-400`}>
              {category}
            </div>
          </div>
          
          <p className={`text-xs mb-2 ${isCompleted ? 'text-white/50' : 'text-white/70'}`}>
            {description}
          </p>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Calendar className="text-white/60 mr-1" size={12} />
              <span className="text-xs text-white/60">{deadline}</span>
            </div>
            <div className="flex items-center">
              <span className={`text-xs font-bold ${getPriorityColor(priority)}`}>
                {priority.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="ml-4">
          <CircleProgress 
            percentage={Math.round(progress)} 
            size={50} 
            strokeWidth={4}
            color={categoryColor}
          />
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-white/60">Progress</span>
          <span className="text-xs text-white/60">{current}/{target} {unit}</span>
        </div>
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full bg-gradient-to-r from-${categoryColor}-500 to-${categoryColor}-400 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        {!isCompleted && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 bg-primary-cyan-500/20 text-primary-cyan-400 rounded-lg text-xs font-bold"
            onClick={onComplete}
          >
            {isPaused ? 'Resume' : 'Complete'}
          </motion.button>
        )}
        
        {!isCompleted && !isPaused && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1 bg-white/10 text-white/70 rounded-lg text-xs"
            onClick={onPause}
          >
            Pause
          </motion.button>
        )}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-3 py-1 bg-white/10 text-white/70 rounded-lg text-xs"
          onClick={onEdit}
        >
          Edit
        </motion.button>
      </div>
    </GlassCard>
  );
};

export default GoalCard;
