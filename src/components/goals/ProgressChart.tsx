import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Target } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface ProgressData {
  date: string;
  value: number;
  target: number;
}

interface ProgressChartProps {
  title: string;
  data: ProgressData[];
  unit: string;
  color: string;
  icon: React.ReactNode;
}

const ProgressChart: React.FC<ProgressChartProps> = ({
  title,
  data,
  unit,
  color,
  icon
}) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.value, d.target)));
  const minValue = Math.min(...data.map(d => Math.min(d.value, d.target)));
  const range = maxValue - minValue;

  const getBarHeight = (value: number) => {
    return ((value - minValue) / range) * 100;
  };

  const getBarColor = (value: number, target: number) => {
    if (value >= target) return 'bg-primary-cyan-500';
    if (value >= target * 0.8) return 'bg-primary-teal-500';
    return 'bg-red-400';
  };

  return (
    <GlassCard variant="default" size="sm" className="w-full mb-4">
      <div className="flex items-center mb-3">
        <div className="w-6 h-6 rounded-full bg-primary-cyan-500/20 flex items-center justify-center mr-2">
          {icon}
        </div>
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      
      {/* Chart */}
      <div className="mb-4">
        <div className="flex items-end justify-between h-24 mb-2">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="flex flex-col items-center w-full">
                {/* Target line */}
                <div 
                  className="w-full bg-white/20 h-0.5 mb-1"
                  style={{ 
                    height: `${getBarHeight(item.target)}%`,
                    minHeight: '2px'
                  }}
                />
                
                {/* Value bar */}
                <motion.div
                  className={`w-3/4 rounded-t ${getBarColor(item.value, item.target)}`}
                  style={{ height: `${getBarHeight(item.value)}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${getBarHeight(item.value)}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-white/60">
          {data.map((item, index) => (
            <span key={index} className="flex-1 text-center">
              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          ))}
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-lg font-bold text-white">
            {Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length)}
          </div>
          <div className="text-xs text-white/60">Avg {unit}</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-white">
            {Math.max(...data.map(d => d.value))}
          </div>
          <div className="text-xs text-white/60">Peak {unit}</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-white">
            {Math.round((data.filter(d => d.value >= d.target).length / data.length) * 100)}%
          </div>
          <div className="text-xs text-white/60">Success Rate</div>
        </div>
      </div>
    </GlassCard>
  );
};

export default ProgressChart;
