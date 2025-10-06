import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { BarChart3, ArrowUpRight } from 'lucide-react';

interface InsightsCardProps {
  className?: string;
}

const InsightsCard: React.FC<InsightsCardProps> = ({ className = '' }) => {
  const weeklyData = [
    { day: 'M', value: 20, height: 'h-4' },
    { day: 'T', value: 35, height: 'h-6' },
    { day: 'W', value: 25, height: 'h-5' },
    { day: 'T', value: 40, height: 'h-7' },
    { day: 'F', value: 30, height: 'h-5' },
    { day: 'S', value: 45, height: 'h-8' },
    { day: 'S', value: 90, height: 'h-16' }
  ];

  return (
    <GlassCard 
      variant="default" 
      size="md" 
      className={`w-full ${className}`}
      interactive
      animate
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="mr-3 p-2 rounded-full bg-white/10">
            <BarChart3 className="text-primary-cyan-400" size={20} />
          </div>
          <h3 className="text-lg font-bold text-white">Insights</h3>
        </div>
        <ArrowUpRight className="text-white/60" size={20} />
      </div>
      
      <div className="mb-4">
        <div className="text-sm text-white/60 font-medium mb-3">Weekly Progress</div>
        <div className="flex items-end space-x-2 h-16">
          {weeklyData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="relative">
                <div 
                  className={`w-full bg-white/20 rounded-t-sm ${item.height} ${
                    index === weeklyData.length - 1 ? 'bg-primary-cyan-500' : 'bg-white/20'
                  }`}
                />
                {index === weeklyData.length - 1 && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary-cyan-500 text-white text-xs font-bold px-2 py-1 rounded">
                    90%
                  </div>
                )}
              </div>
              <div className="text-xs text-white/60 mt-2">{item.day}</div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

export default InsightsCard;
