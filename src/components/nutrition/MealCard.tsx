import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, Edit, MessageSquare, Plus, Utensils } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import FoodItemsVisualizer from './FoodItemVisual';

interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
}

interface MacroBreakdown {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealCardProps {
  title: string;
  time: string;
  items: FoodItem[];
  macros: MacroBreakdown;
  completed?: boolean;
  onComplete?: () => void;
  onEdit?: () => void;
  onAddFootnote?: (note: string) => void;
  className?: string;
}

const MealCard: React.FC<MealCardProps> = ({
  title,
  time,
  items,
  macros,
  completed = false,
  onComplete,
  onEdit,
  onAddFootnote,
  className = ''
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showFootnoteInput, setShowFootnoteInput] = useState(false);
  const [footnote, setFootnote] = useState('');
  
  const handleToggle = () => {
    setExpanded(!expanded);
  };
  
  const handleAddFootnote = () => {
    if (footnote.trim() && onAddFootnote) {
      onAddFootnote(footnote);
      setFootnote('');
      setShowFootnoteInput(false);
    }
  };
  
  return (
    <GlassCard 
      variant={completed ? 'muted' : 'default'} 
      size="md" 
      className={`w-full ${className}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <h3 className={`text-base sm:text-lg font-medium ${completed ? 'text-alpine-mist/70' : 'text-alpine-mist'}`}>
              {title}
            </h3>
            <span className={`ml-2 text-xs ${completed ? 'text-alpine-mist/50' : 'text-alpine-mist/80'}`}>
              {time}
            </span>
          </div>
          
          <p className={`text-xs sm:text-sm mt-1 ${completed ? 'text-alpine-mist/50' : 'text-alpine-mist/70'}`}>
            {macros.calories} kcal • {macros.protein}g protein • {macros.carbs}g carbs • {macros.fat}g fat
          </p>
        </div>
        
        <div className="flex">
          {onComplete && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-1.5 rounded-md mr-2 ${
                completed ? 'bg-cyan-primary/20' : 'bg-glass-highlight'
              }`}
              onClick={onComplete}
            >
              <Check size={16} className={completed ? 'text-cyan-primary' : 'text-alpine-mist'} />
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 bg-glass-highlight rounded-md"
            onClick={handleToggle}
          >
            {expanded ? (
              <ChevronUp size={16} className="text-alpine-mist" />
            ) : (
              <ChevronDown size={16} className="text-alpine-mist" />
            )}
          </motion.button>
        </div>
      </div>
      
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4"
        >
          {/* Visual food items representation */}
          <div className="mb-3">
            <div className="flex items-center mb-2">
              <Utensils size={14} className="text-cyan-primary mr-1.5" />
              <p className="text-xs sm:text-sm text-alpine-mist/80">Food Items</p>
            </div>
            
            <FoodItemsVisualizer items={items} />
            
            {/* Simplified text summary */}
            <div className="mt-3 bg-glass-background bg-opacity-30 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className={`text-xs ${completed ? 'text-alpine-mist/50' : 'text-alpine-mist'}`}>
                  {items.length} items
                </span>
                <span className={`text-xs ${completed ? 'text-alpine-mist/50' : 'text-alpine-mist'}`}>
                  {items.reduce((sum, item) => sum + item.calories, 0)} kcal total
                </span>
              </div>
              
              {/* Show/hide details button */}
              <motion.button
                className="w-full mt-2 text-xs text-cyan-primary flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  // This would toggle a detailed view in a real implementation
                }}
              >
                View details
              </motion.button>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-end space-x-2">
            {onEdit && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center p-1.5 bg-glass-highlight rounded-md text-xs sm:text-sm text-alpine-mist"
                onClick={onEdit}
              >
                <Edit size={14} className="mr-1" />
                Edit
              </motion.button>
            )}
            
            {onAddFootnote && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center p-1.5 bg-glass-highlight rounded-md text-xs sm:text-sm text-alpine-mist"
                onClick={() => setShowFootnoteInput(!showFootnoteInput)}
              >
                <MessageSquare size={14} className="mr-1" />
                Add Note
              </motion.button>
            )}
          </div>
          
          {/* Footnote input */}
          {showFootnoteInput && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex"
            >
              <input
                type="text"
                className="flex-1 bg-glass-background border border-glass-border rounded-l-md p-2 text-xs sm:text-sm text-alpine-mist focus:outline-none focus:border-cyan-primary/50"
                placeholder="Add a note about this meal..."
                value={footnote}
                onChange={(e) => setFootnote(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddFootnote()}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-cyan-primary p-2 rounded-r-md"
                onClick={handleAddFootnote}
              >
                <Plus size={14} className="text-white" />
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      )}
    </GlassCard>
  );
};

export default MealCard;