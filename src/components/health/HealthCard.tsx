import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface HealthMetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  chartData?: number[];
  color?: string;
  icon?: React.ReactNode;
  insightText?: string;
  onClick?: () => void;
}

const HealthCard: React.FC<HealthMetricCardProps> = ({
  title,
  value,
  unit,
  trend,
  trendValue,
  chartData = [60, 58, 62, 65, 61, 64, 68],
  color = 'var(--color-accent-secondary)',
  icon,
  insightText = "Your metrics have been stable over the past week. Keep up the good work!",
  onClick
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setExpanded(!expanded);
    }
  };
  
  const trendIcons = {
    up: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
        <path d="m18 9-6-6-6 6"/>
        <path d="M12 3v18"/>
      </svg>
    ),
    down: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
        <path d="M12 3v18"/>
        <path d="m6 15 6 6 6-6"/>
      </svg>
    ),
    stable: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-secondary">
        <path d="M5 12h14"/>
      </svg>
    )
  };
  
  // Mini chart for the card
  const MiniChart = () => {
    const max = Math.max(...chartData);
    const min = Math.min(...chartData);
    const range = max - min;
    
    return (
      <div className="h-10 flex items-end space-x-1">
        {chartData.map((point, i) => {
          const height = ((point - min) / range) * 100;
          return (
            <div 
              key={i}
              className="w-1 rounded-t-sm"
              style={{ 
                height: `${height}%`,
                backgroundColor: color,
                opacity: i === chartData.length - 1 ? 1 : 0.6
              }}
            />
          );
        })}
      </div>
    );
  };
  
  // Expanded chart for when card is clicked
  const ExpandedChart = () => {
    const max = Math.max(...chartData);
    const min = Math.min(...chartData);
    const range = max - min;
    
    return (
      <div className="mt-4">
        <div className="h-40 flex items-end space-x-2">
          {chartData.map((point, i) => {
            const height = ((point - min) / range) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full rounded-t-sm"
                  style={{ 
                    height: `${height}%`,
                    backgroundColor: color,
                    opacity: i === chartData.length - 1 ? 1 : 0.6
                  }}
                />
                <div className="text-xs text-alpine-mist bg-glass-background bg-opacity-30 px-2 py-1 rounded-lg mt-1">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 bg-glass-background bg-opacity-30 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-alpine-mist mb-2">AI Insight</h4>
          <p className="text-sm text-alpine-mist">
            {insightText}
          </p>
        </div>
      </div>
    );
  };
  
  return (
    <GlassCard 
      variant="default" 
      size={expanded ? "xl" : "md"} 
      className="w-full"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          {icon && <div className="mr-2 text-accent-primary">{icon}</div>}
          <h3 className="text-sm font-medium text-alpine-mist">{title}</h3>
        </div>
        
        {trend && (
          <div className="flex items-center">
            {trendIcons[trend]}
            {trendValue && (
              <span className="text-xs ml-1" style={{ color: trend === 'up' ? '#4ade80' : trend === 'down' ? '#f87171' : 'var(--color-accent-secondary)' }}>
                {trendValue}
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-end mt-2">
        <div>
          <span className="text-2xl font-bold" style={{ color }}>{value}</span>
          {unit && <span className="text-alpine-mist text-sm ml-1 bg-glass-background bg-opacity-30 px-2 py-1 rounded-lg">{unit}</span>}
        </div>
        
        <MiniChart />
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
              <ExpandedChart />
            </div>
            
            <div className="flex justify-center mt-4">
              {expanded ? (
                <ChevronUp className="text-alpine-mist" size={20} />
              ) : (
                <ChevronDown className="text-alpine-mist" size={20} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};

export default HealthCard;




