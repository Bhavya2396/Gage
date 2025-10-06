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
      interactive
      animate
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        boxShadow: completed 
          ? '0 8px 16px rgba(0, 0, 0, 0.1)' 
          : '0 20px 40px rgba(0, 204, 255, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)'
      }}
      whileTap={{ scale: 0.98 }}
      glow={!completed}
      glowColor="#00ccff"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${completed ? 'bg-white/10' : 'bg-gradient-to-br from-primary-cyan-500/20 to-primary-teal-500/20 border border-primary-cyan-500/30'}`}>
                <Utensils size={16} className={completed ? 'text-white/60' : 'text-primary-cyan-500'} />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${completed ? 'text-white/70' : 'text-white'}`}>
                  {title}
                </h3>
                <span className={`text-sm ${completed ? 'text-white/50' : 'text-white/60'}`}>
                  {time}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gradient-to-br from-primary-cyan-500/20 to-primary-teal-500/20 rounded-xl p-4 border border-primary-cyan-500/30 shadow-lg shadow-cyan-500/10">
              <div className="text-2xl font-bold text-white mb-1">{macros.calories}</div>
              <div className="text-sm text-primary-cyan-400 font-semibold">kcal</div>
            </div>
            <div className="bg-gradient-to-br from-primary-teal-500/20 to-primary-cyan-500/20 rounded-xl p-4 border border-primary-teal-500/30 shadow-lg shadow-teal-500/10">
              <div className="text-2xl font-bold text-white mb-1">{macros.protein}g</div>
              <div className="text-sm text-primary-teal-400 font-semibold">protein</div>
            </div>
          </div>
        </div>
        
        <div className="flex">
          {onComplete && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-1.5 rounded-md mr-2 ${
                completed ? 'bg-primary-cyan-500/20' : 'bg-glass-highlight'
              }`}
              onClick={onComplete}
            >
              <Check size={16} className={completed ? 'text-primary-cyan-500' : 'text-alpine-mist'} />
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
              <Utensils size={14} className="text-primary-cyan-500 mr-1.5" />
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
                className="w-full mt-2 text-xs text-primary-cyan-500 flex items-center justify-center"
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
                className="flex-1 bg-glass-background border border-glass-border rounded-l-md p-2 text-xs sm:text-sm text-alpine-mist focus:outline-none focus:border-primary-cyan-500/50"
                placeholder="Add a note about this meal..."
                value={footnote}
                onChange={(e) => setFootnote(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddFootnote()}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary-cyan-500 p-2 rounded-r-md"
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