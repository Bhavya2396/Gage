import React from 'react';
import { motion } from 'framer-motion';
import { CircleProgress } from '@/components/ui/CircleProgress';
import GlassCard from '@/components/ui/GlassCard';
import MacroVisualizer from './MacroVisualizer';

interface MacroTarget {
  name: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

interface NutritionalTargetsProps {
  calories?: {
    current: number;
    target: number;
    name?: string;
    unit?: string;
    color?: string;
  };
  protein?: {
    name: string;
    current: number;
    target: number;
    unit: string;
    color: string;
  };
  carbs?: {
    name: string;
    current: number;
    target: number;
    unit: string;
    color: string;
  };
  fat?: {
    name: string;
    current: number;
    target: number;
    unit: string;
    color: string;
  };
  macros?: MacroTarget[];
  className?: string;
}

const NutritionalTargets: React.FC<NutritionalTargetsProps> = ({ 
  calories, 
  protein,
  carbs,
  fat,
  macros,
  className = ''
}) => {
  // Convert new prop format to macros array if needed
  const macrosArray = macros || [];
  
  // Add individual macro props to array if provided
  if (protein) macrosArray.push(protein);
  if (carbs) macrosArray.push(carbs);
  if (fat) macrosArray.push(fat);
  
  // Calculate calorie percentage
  const caloriePercentage = calories ? 
    Math.min(Math.round((calories.current / calories.target) * 100), 100) : 0;
  
  // Prepare data for MacroVisualizer
  const macroVisualizerData = macrosArray.map(macro => ({
    name: macro.name,
    value: macro.current,
    target: macro.target,
    color: macro.color
  }));

  return (
    <GlassCard size="sm" className={className}>
      <div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xs font-bold text-white mb-3">Daily Targets</h3>
        </motion.div>
      
      {calories && (
        <motion.div 
          className="mb-3"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/70 mb-1">Daily Calories</p>
              <div className="flex items-baseline">
                <span className="text-sm font-bold text-white">{calories.current}</span>
                <span className="text-xs text-white/60 ml-1">/ {calories.target} kcal</span>
              </div>
            </div>
            
            <CircleProgress 
              percentage={caloriePercentage} 
              size={40} 
              strokeWidth={4}
              color={calories.color || "cyan-primary"}
            />
          </div>
        </motion.div>
      )}
      
      {macrosArray.length > 0 && !macros && (
        <div className="space-y-2">
          {macrosArray.map((macro, index) => {
            const percentage = Math.min(Math.round((macro.current / macro.target) * 100), 100);
            
            return (
              <motion.div 
                key={index} 
                className="bg-white/5 p-2 rounded-lg"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              >
                <div className="flex justify-between mb-1">
                  <p className="text-xs text-white/70">{macro.name}</p>
                  <p className="text-xs text-white/70">
                    {macro.current} / {macro.target} {macro.unit}
                  </p>
                </div>
                
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ 
                      backgroundColor: macro.color.startsWith('#') ? macro.color : `var(--${macro.color})`,
                      width: '0%'
                    }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      </div>
    </GlassCard>
  );
};

export default NutritionalTargets;

