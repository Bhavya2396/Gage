import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import CircularProgress from '@/components/ui/CircularProgress';

interface RecoveryScoreCardProps {
  score: number;
  className?: string;
}

const RecoveryScoreCard: React.FC<RecoveryScoreCardProps> = ({
  score,
  className = ''
}) => {
  return (
    <GlassCard 
      variant="default" 
      size="lg" 
      className={`w-full ${className}`}
      interactive
      animate
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        boxShadow: '0 20px 40px rgba(0, 204, 255, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="flex flex-col items-center justify-center py-8">
        <CircularProgress
          value={score}
          size={140}
          strokeWidth={12}
          color="#4ade80"
          backgroundColor="rgba(255, 255, 255, 0.1)"
          className="mb-4"
        >
          <div className="text-center">
            <div className="text-4xl font-bold text-white">{score}</div>
            <div className="text-sm text-white/60 font-medium">Recovery</div>
          </div>
        </CircularProgress>
      </div>
    </GlassCard>
  );
};

export default RecoveryScoreCard;