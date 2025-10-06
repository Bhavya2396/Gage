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
    <GlassCard size="full" className={className}>
      <div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-base sm:text-lg font-medium text-alpine-mist mb-4">Nutritional Targets</h3>
        </motion.div>
      
      {calories && (        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {macrosArray.length > 0 ? (
            <MacroVisualizer macros={macroVisualizerData} />
          ) : (
            <div className="flex items-center justify-between bg-glass-background bg-opacity-30 p-3 rounded-lg">
              <div>
                <p className="text-xs sm:text-sm text-alpine-mist mb-1">Daily Calories</p>
                <div className="flex items-baseline">
                  <span className="text-lg sm:text-xl font-medium text-primary-cyan-500">{calories.current}</span>
                  <span className="text-xs sm:text-sm text-alpine-mist ml-1">/ {calories.target} {calories.unit || 'kcal'}</span>
                </div>
              </div>
              
              <CircleProgress 
                percentage={caloriePercentage} 
                size={60} 
                strokeWidth={6}
                color={calories.color || "cyan-primary"}
              />
            </div>
          )}
        </motion.div>
      )}
      
      {macrosArray.length > 0 && !macros && (
        <div className="space-y-4">
          {macrosArray.map((macro, index) => {
            const percentage = Math.min(Math.round((macro.current / macro.target) * 100), 100);
            
            return (
              <motion.div 
                key={index} 
                className="bg-glass-background bg-opacity-30 p-3 rounded-lg"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              >
                <div className="flex justify-between mb-2">
                  <p className="text-xs sm:text-sm text-alpine-mist">{macro.name}</p>
                  <p className="text-xs sm:text-sm text-alpine-mist">
                    {macro.current} / {macro.target} {macro.unit}
                  </p>
                </div>
                
                <div className="w-full bg-glass-border h-1.5 sm:h-2 rounded-full overflow-hidden">
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

