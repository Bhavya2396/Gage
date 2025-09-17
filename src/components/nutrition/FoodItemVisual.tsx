import React from 'react';
import { motion } from 'framer-motion';

interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  color?: string;
  icon?: React.ReactNode;
}

interface FoodItemVisualProps {
  item: FoodItem;
  index: number;
  total: number;
  className?: string;
}

const FoodItemVisual: React.FC<FoodItemVisualProps> = ({ 
  item, 
  index, 
  total, 
  className = '' 
}) => {
  // Calculate size based on calories relative to other items
  const getItemSize = () => {
    // Base size between 20-40% of container width - smaller for better layout
    const baseSize = 20 + (item.calories / 300) * 20;
    return `${baseSize}%`;
  };
  
  // Get color based on food type or use default
  const getItemColor = () => {
    if (item.color) return item.color;
    
    // Default color mapping based on macros
    if (item.protein && item.protein > item.carbs && item.protein > item.fat) {
      return '#00CCFF'; // Protein-rich foods
    } else if (item.carbs && item.carbs > item.protein && item.carbs > item.fat) {
      return '#319795'; // Carb-rich foods
    } else if (item.fat && item.fat > item.protein && item.fat > item.carbs) {
      return '#4FD1C5'; // Fat-rich foods
    }
    
    return '#A0AEC0'; // Default color
  };
  
  // Calculate position in the container - more evenly distributed
  const getPosition = () => {
    // Create a circular layout for better distribution
    const angleStep = (2 * Math.PI) / total;
    const angle = index * angleStep;
    
    // Radius should be smaller to keep items more centered
    const radius = 35; // percentage of container width
    
    return {
      top: `${50 - Math.cos(angle) * radius}%`,
      left: `${50 + Math.sin(angle) * radius}%`,
      transform: 'translate(-50%, -50%)'
    };
  };

  const position = getPosition();
  const size = getItemSize();
  const color = getItemColor();

  return (
    <motion.div
      className={`absolute rounded-full flex items-center justify-center ${className}`}
      style={{
        top: position.top,
        left: position.left,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}40 0%, ${color}10 100%)`,
        border: `2px solid ${color}70`,
        transform: position.transform,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: [0, -5, 0],
      }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        y: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          delay: index * 0.2
        }
      }}
    >
      <motion.div
        className="flex flex-col items-center justify-center p-2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 + index * 0.1 }}
      >
        <span className="text-xs font-medium text-alpine-mist whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
          {item.name}
        </span>
        <span className="text-[10px] text-alpine-mist/70">
          {item.calories} kcal
        </span>
      </motion.div>
    </motion.div>
  );
};

interface FoodItemsVisualizerProps {
  items: FoodItem[];
  className?: string;
}

const FoodItemsVisualizer: React.FC<FoodItemsVisualizerProps> = ({ 
  items, 
  className = '' 
}) => {
  return (
    <div className={`relative w-full h-40 bg-glass-background bg-opacity-20 rounded-lg overflow-hidden ${className}`}>
      {/* Plate circle */}
      <div className="absolute top-1/2 left-1/2 w-3/4 h-3/4 rounded-full bg-glass-background bg-opacity-30 border border-glass-border transform -translate-x-1/2 -translate-y-1/2"></div>
      
      {/* Food items */}
      {items.map((item, index) => (
        <FoodItemVisual 
          key={`${item.name}-${index}`}
          item={item}
          index={index}
          total={items.length}
        />
      ))}
    </div>
  );
};

export default FoodItemsVisualizer;





