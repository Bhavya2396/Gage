import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Target, ArrowUpRight, Shield } from 'lucide-react';

interface GoalProgressCardProps {
  className?: string;
}

const GoalProgressCard: React.FC<GoalProgressCardProps> = ({ className = '' }) => {
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
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <div className="mr-3 p-2 rounded-full bg-primary-cyan-500/20 border border-primary-cyan-500/30">
            <Target className="text-primary-cyan-400" size={20} />
          </div>
          <h3 className="text-lg font-bold text-white">Goal Progress</h3>
        </div>
        <ArrowUpRight className="text-white/60" size={20} />
      </div>
      
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="mr-3 p-2 rounded-full bg-primary-cyan-500/20 border border-primary-cyan-500/30">
            <Shield className="text-primary-cyan-400" size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-white">add 15 yeards to my golf swing</div>
            <div className="text-sm text-white/60">Your mountain journey</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/80 font-medium">Overall Progress</span>
            <span className="text-sm text-primary-cyan-400 font-bold">0%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 h-2 rounded-full" style={{ width: '0%' }} />
          </div>
          <div className="flex justify-between text-xs text-white/60 mt-2">
            <span>Base Camp</span>
            <span>Camp 1</span>
            <span>Summit</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/80 font-medium">Foundation Phase</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-primary-cyan-500/30 text-white font-semibold px-2 py-1 rounded-full border border-primary-cyan-500/50">
                Current
              </span>
              <span className="text-sm text-primary-cyan-400 font-bold">0%</span>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 h-2 rounded-full" style={{ width: '0%' }} />
          </div>
          <div className="text-xs text-white/60 mt-2">0 of 518 points earned in this phase</div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-white/80 font-medium">0 points total earned</div>
        <div className="bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 text-white font-bold px-4 py-2 rounded-lg">
          2070 to summit
        </div>
      </div>
    </GlassCard>
  );
};

export default GoalProgressCard;
