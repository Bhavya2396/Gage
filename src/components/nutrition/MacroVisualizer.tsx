import React from 'react';
import { motion } from 'framer-motion';

interface MacroNutrient {
  name: string;
  value: number;
  target: number;
  color: string;
  icon?: React.ReactNode;
}

interface MacroVisualizerProps {
  macros: MacroNutrient[];
  className?: string;
}

const MacroVisualizer: React.FC<MacroVisualizerProps> = ({ macros, className = '' }) => {
  // Calculate total values for the pie chart
  const totalTarget = macros.reduce((sum, macro) => sum + macro.target, 0);
  
  // Calculate angles for each macro (in degrees)
  const macroAngles = macros.map(macro => ({
    ...macro,
    percentage: Math.min((macro.value / macro.target) * 100, 100),
    targetAngle: (macro.target / totalTarget) * 360,
    currentAngle: Math.min((macro.value / macro.target) * ((macro.target / totalTarget) * 360), (macro.target / totalTarget) * 360)
  }));
  
  // Calculate cumulative angles for positioning
  let cumulativeAngle = 0;
  const macroPositions = macroAngles.map(macro => {
    const startAngle = cumulativeAngle;
    cumulativeAngle += macro.targetAngle;
    return {
      ...macro,
      startAngle,
      endAngle: cumulativeAngle
    };
  });

  return (
    <div className={`relative ${className}`}>
      <div className="w-full aspect-square relative">
        {/* Outer circle with segments */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full"
        >
          {/* Background circle */}
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke="rgba(255,255,255,0.1)" 
            strokeWidth="10" 
          />
          
          {/* Macro segments */}
          {macroPositions.map((macro, index) => {
            // Convert angles to radians for SVG
            const startAngleRad = ((macro.startAngle - 90) * Math.PI) / 180;
            const endAngleRad = ((macro.startAngle + macro.currentAngle - 90) * Math.PI) / 180;
            
            // Calculate path for arc
            const x1 = 50 + 45 * Math.cos(startAngleRad);
            const y1 = 50 + 45 * Math.sin(startAngleRad);
            const x2 = 50 + 45 * Math.cos(endAngleRad);
            const y2 = 50 + 45 * Math.sin(endAngleRad);
            
            // Determine if the arc should be drawn as a large arc
            const largeArcFlag = macro.currentAngle > 180 ? 1 : 0;
            
            return (
              <motion.path
                key={macro.name}
                d={`M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={`url(#${macro.name.toLowerCase()}Gradient)`}
                opacity={0.7}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 0.7, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            );
          })}
          
          {/* Inner circle */}
          <circle 
            cx="50" 
            cy="50" 
            r="30" 
            fill="#071630" 
            className="drop-shadow-lg"
          />
          
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="proteinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00CCFF" />
              <stop offset="100%" stopColor="#00B8B8" />
            </linearGradient>
            <linearGradient id="carbsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#319795" />
              <stop offset="100%" stopColor="#2C7A7B" />
            </linearGradient>
            <linearGradient id="fatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4FD1C5" />
              <stop offset="100%" stopColor="#38B2AC" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div 
            className="text-2xl font-bold text-alpine-mist"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {macros.reduce((sum, macro) => sum + macro.value, 0)}
          </motion.div>
          <motion.div 
            className="text-xs text-alpine-mist/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            of {macros.reduce((sum, macro) => sum + macro.target, 0)} kcal
          </motion.div>
        </div>
      </div>
      
      {/* Macro legend */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {macros.map((macro, index) => (
          <motion.div 
            key={macro.name}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <div className="w-full h-1 rounded-full mb-1" style={{ backgroundColor: macro.color }}></div>
            <div className="text-xs font-medium text-alpine-mist">{macro.name}</div>
            <div className="flex items-baseline">
              <span className="text-sm font-bold text-alpine-mist">{macro.value}</span>
              <span className="text-xs text-alpine-mist/70 ml-1">/ {macro.target}g</span>
            </div>
            <div className="text-xs text-alpine-mist/70 mt-0.5">
              {Math.round((macro.value / macro.target) * 100)}%
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MacroVisualizer;
