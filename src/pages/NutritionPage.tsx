import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { ChevronLeft, Check, MoreVertical, X, Edit2, MessageSquare } from 'lucide-react';

// Macro progress component
interface MacroProgressProps {
  name: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

const MacroProgress: React.FC<MacroProgressProps> = ({
  name,
  current,
  target,
  unit,
  color
}) => {
  const percentage = Math.min(100, (current / target) * 100);
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-text-secondary text-xs">{name}</span>
        <span className="text-text-primary text-xs">
          {current}/{target} {unit}
        </span>
      </div>
      <div className="h-1.5 bg-glass rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
};

// Nutrition summary header
const NutritionHeader: React.FC = () => {
  const calories = {
    current: 1450,
    target: 2400
  };
  
  const percentage = Math.min(100, (calories.current / calories.target) * 100);
  
  return (
    <GlassCard variant="default" size="md" className="w-full mb-4 sticky top-0 z-10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-medium text-text-primary">Today's Fuel</h2>
          <p className="text-text-secondary text-sm mt-1">
            {calories.current} / {calories.target} kcal
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-text-secondary text-sm">Remaining</div>
          <div className="text-accent-primary font-medium">
            {calories.target - calories.current} kcal
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <MacroProgress 
          name="Protein" 
          current={95} 
          target={180} 
          unit="g" 
          color="var(--color-accent-secondary)" 
        />
        
        <MacroProgress 
          name="Carbs" 
          current={120} 
          target={240} 
          unit="g" 
          color="var(--color-accent-primary)" 
        />
        
        <MacroProgress 
          name="Fat" 
          current={55} 
          target={80} 
          unit="g" 
          color="var(--color-text-primary)" 
        />
      </div>
    </GlassCard>
  );
};

// Meal card component
interface MealCardProps {
  title: string;
  time: string;
  foods: Array<{
    name: string;
    amount: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
  completed: boolean;
  onToggleComplete: () => void;
}

const MealCard: React.FC<MealCardProps> = ({
  title,
  time,
  foods,
  completed,
  onToggleComplete
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // Calculate meal totals
  const totals = foods.reduce((acc, food) => {
    return {
      calories: acc.calories + food.calories,
      protein: acc.protein + food.protein,
      carbs: acc.carbs + food.carbs,
      fat: acc.fat + food.fat
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  
  return (
    <GlassCard 
      variant={completed ? 'highlight' : 'default'} 
      size="md" 
      className={`w-full mb-4 transition-all ${
        completed ? 'bg-accent-primary/20' : ''
      }`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-text-primary">{title}</h3>
          <p className="text-text-secondary text-sm">{time}</p>
        </div>
        
        <div className="flex items-center">
          <button 
            className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
              completed
                ? 'bg-accent-primary text-bg-primary'
                : 'border border-text-secondary text-text-secondary'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete();
            }}
          >
            {completed && <Check size={14} />}
          </button>
          
          <div className="relative">
            <button 
              className="p-1 text-text-secondary hover:text-text-primary"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <MoreVertical size={18} />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-1 w-36 bg-glass backdrop-blur border border-glass-border rounded-md shadow-lg z-20">
                <button 
                  className="w-full text-left px-3 py-2 text-text-secondary hover:bg-white/5 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    // Edit meal logic would go here
                  }}
                >
                  <Edit2 size={14} className="mr-2" />
                  Edit Meal
                </button>
                
                <button 
                  className="w-full text-left px-3 py-2 text-text-secondary hover:bg-white/5 flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    // Add footnote logic would go here
                  }}
                >
                  <MessageSquare size={14} className="mr-2" />
                  Add Footnote
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <div className="text-text-secondary text-sm">
          {totals.calories} kcal
        </div>
        
        <div className="flex space-x-2 text-xs">
          <span className="text-accent-secondary">P: {totals.protein}g</span>
          <span className="text-accent-primary">C: {totals.carbs}g</span>
          <span className="text-text-primary">F: {totals.fat}g</span>
        </div>
      </div>
      
      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-glass-border"
          >
            <div className="space-y-3">
              {foods.map((food, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <div className="text-text-primary text-sm">{food.name}</div>
                    <div className="text-text-secondary text-xs">{food.amount}</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-text-primary text-sm">{food.calories} kcal</div>
                    <div className="text-text-secondary text-xs">
                      P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};

const NutritionPage: React.FC = () => {
  const navigate = useNavigate();
  const [completedMeals, setCompletedMeals] = useState<string[]>(['breakfast']);
  
  // Sample meals
  const meals = [
    {
      id: 'breakfast',
      title: 'Breakfast',
      time: '7:00 AM',
      foods: [
        {
          name: 'Greek Yogurt with Berries',
          amount: '200g yogurt, 100g mixed berries',
          calories: 220,
          protein: 18,
          carbs: 25,
          fat: 5
        },
        {
          name: 'Whole Grain Toast',
          amount: '2 slices',
          calories: 180,
          protein: 6,
          carbs: 30,
          fat: 3
        }
      ]
    },
    {
      id: 'lunch',
      title: 'Lunch',
      time: '12:30 PM',
      foods: [
        {
          name: 'Grilled Chicken Salad',
          amount: '150g chicken, mixed greens, vegetables',
          calories: 350,
          protein: 40,
          carbs: 15,
          fat: 12
        },
        {
          name: 'Quinoa',
          amount: '100g cooked',
          calories: 120,
          protein: 4,
          carbs: 20,
          fat: 2
        }
      ]
    },
    {
      id: 'snack',
      title: 'Afternoon Snack',
      time: '3:30 PM',
      foods: [
        {
          name: 'Protein Shake',
          amount: '1 scoop with water',
          calories: 120,
          protein: 25,
          carbs: 3,
          fat: 1
        },
        {
          name: 'Apple',
          amount: '1 medium',
          calories: 80,
          protein: 0,
          carbs: 20,
          fat: 0
        }
      ]
    },
    {
      id: 'dinner',
      title: 'Dinner',
      time: '7:00 PM',
      foods: [
        {
          name: 'Salmon Fillet',
          amount: '150g',
          calories: 280,
          protein: 30,
          carbs: 0,
          fat: 18
        },
        {
          name: 'Roasted Vegetables',
          amount: '200g mixed vegetables',
          calories: 120,
          protein: 4,
          carbs: 20,
          fat: 4
        },
        {
          name: 'Brown Rice',
          amount: '100g cooked',
          calories: 150,
          protein: 3,
          carbs: 30,
          fat: 1
        }
      ]
    }
  ];
  
  // Toggle meal completion
  const toggleMealCompletion = (mealId: string) => {
    if (completedMeals.includes(mealId)) {
      setCompletedMeals(completedMeals.filter(id => id !== mealId));
    } else {
      setCompletedMeals([...completedMeals, mealId]);
      
      // In a real app, we would recalculate the remaining meals
      // based on the updated nutrition intake
    }
  };
  
  return (
    <MainLayout>
      <div className="mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          icon={<ChevronLeft size={16} />}
        >
          Back
        </Button>
      </div>
      
      <div className="max-w-md mx-auto pb-20">
        <NutritionHeader />
        
        {meals.map((meal) => (
          <MealCard 
            key={meal.id}
            title={meal.title}
            time={meal.time}
            foods={meal.foods}
            completed={completedMeals.includes(meal.id)}
            onToggleComplete={() => toggleMealCompletion(meal.id)}
          />
        ))}
        
        <div className="mt-6">
          <Button 
            variant="outline" 
            size="md" 
            fullWidth
            onClick={() => {/* Add custom meal logic */}}
          >
            Add Custom Meal
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default NutritionPage;



