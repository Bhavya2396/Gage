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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-white">Daily Targets</h3>
            <div className="flex items-center text-xs text-white/60">
              <div className="w-2 h-2 rounded-full bg-primary-cyan-500 mr-1"></div>
              {caloriePercentage}% complete
            </div>
          </div>
        </motion.div>
      
      {calories && (
        <motion.div 
          className="mb-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-white/70">Daily Calories</p>
                <span className="text-xs text-white/60">{calories.current}/{calories.target}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mb-2">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(caloriePercentage, 100)}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
              
              {/* Remaining calories */}
              <div className="text-xs text-white/60">
                {calories.target - calories.current > 0 
                  ? `${calories.target - calories.current} calories remaining`
                  : calories.target - calories.current < 0
                  ? `${Math.abs(calories.target - calories.current)} calories over`
                  : 'Target reached!'
                }
              </div>
            </div>
            
            <div className="ml-4">
              <CircleProgress 
                percentage={caloriePercentage} 
                size={50} 
                strokeWidth={4}
                color={calories.color || "cyan-primary"}
              />
            </div>
          </div>
        </motion.div>
      )}
      
      {macrosArray.length > 0 && !macros && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white">Macro Breakdown</h4>
            <div className="text-xs text-white/60">Today's progress</div>
          </div>
          
          {macrosArray.map((macro, index) => {
            const percentage = Math.min(Math.round((macro.current / macro.target) * 100), 100);
            const remaining = macro.target - macro.current;
            
            return (
              <motion.div 
                key={index} 
                className="bg-white/5 p-3 rounded-lg border border-white/10"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div 
                      className="w-2 h-2 rounded-full mr-2"
                      style={{ backgroundColor: macro.color.startsWith('#') ? macro.color : `var(--${macro.color})` }}
                    ></div>
                    <p className="text-xs font-bold text-white">{macro.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/70">
                      {macro.current} / {macro.target} {macro.unit}
                    </p>
                    <p className="text-xs text-white/60">
                      {remaining > 0 ? `${remaining}g remaining` : remaining < 0 ? `${Math.abs(remaining)}g over` : 'Target reached!'}
                    </p>
                  </div>
                </div>
                
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ 
                      background: `linear-gradient(90deg, ${macro.color.startsWith('#') ? macro.color : `var(--${macro.color})`} 0%, ${macro.color.startsWith('#') ? macro.color : `var(--${macro.color})`}80 100%)`,
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

