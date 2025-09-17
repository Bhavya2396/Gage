import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ChevronUp, ChevronDown } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { getRecoveryColor } from '@/lib/utils';

interface RecoveryScoreCardProps {
  recoveryScore?: number;
  factors?: Array<{
    name: string;
    score: number;
    color: string;
  }>;
  insight?: string;
}

const RecoveryScoreCard: React.FC<RecoveryScoreCardProps> = ({
  recoveryScore = 78,
  factors = [
    { name: 'Sleep', score: 85, color: '#4ade80' },
    { name: 'HRV', score: 72, color: getRecoveryColor(78) },
    { name: 'Previous Activity', score: 65, color: 'var(--color-text-primary)' },
    { name: 'Stress', score: 60, color: 'var(--color-accent-secondary)' }
  ],
  insight = "Your recovery is good today, primarily driven by excellent sleep quality. Consider a moderate intensity workout to maintain this positive trend."
}) => {
  const [expanded, setExpanded] = useState(false);
  const recoveryColor = getRecoveryColor(recoveryScore);
  
  return (
    <GlassCard 
      variant="default" 
      size={expanded ? "xl" : "lg"} 
      className="w-full mb-4"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-medium text-alpine-mist">Recovery Score</h3>
        <Info size={16} className="text-alpine-mist" />
      </div>
      
      <div className="flex items-center justify-center my-4">
        <div className="relative flex items-center justify-center">
          <svg width="120" height="120" viewBox="0 0 100 100">
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
            className="absolute text-4xl font-bold"
            style={{ color: recoveryColor }}
          >
            {recoveryScore}
          </span>
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mt-4 pt-4 border-t border-glass-border">
              <h4 className="text-sm font-medium text-alpine-mist mb-2 bg-glass-background bg-opacity-30 px-3 py-1 rounded-lg inline-block">Contributing Factors</h4>
              
              <div className="space-y-3 mt-3">
                {factors.map(factor => (
                  <div key={factor.name} className="flex items-center bg-glass-background bg-opacity-30 p-2 rounded-lg">
                    <span className="text-alpine-mist text-sm w-32">{factor.name}</span>
                    <div className="flex-1 h-2 bg-glass rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${factor.score}%`,
                          backgroundColor: factor.color
                        }}
                      />
                    </div>
                    <span className="text-alpine-mist text-xs ml-2 bg-glass-background bg-opacity-50 px-2 py-1 rounded-lg">{factor.score}%</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 bg-glass-background bg-opacity-30 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-alpine-mist mb-2">AI Insight</h4>
                <p className="text-sm text-alpine-mist">
                  {insight}
                </p>
              </div>
              
              <div className="flex justify-center mt-4">
                {expanded ? (
                  <ChevronUp className="text-alpine-mist" size={20} />
                ) : (
                  <ChevronDown className="text-alpine-mist" size={20} />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};

export default RecoveryScoreCard;




