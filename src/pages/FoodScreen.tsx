import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, UtensilsCrossed } from 'lucide-react';
import MainLayout from '@/layouts/MainLayout';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import MealCard from '@/components/nutrition/MealCard';
import NutritionalTargets from '@/components/nutrition/NutritionalTargets';
import AINutritionAdvisor from '@/components/nutrition/AINutritionAdvisor';

// Import centralized mock data
import { sampleMeals, nutritionalTargets, userMetrics } from '@/data/mockData';

const FoodScreen: React.FC = () => {
  const navigate = useNavigate();
  const [meals, setMeals] = useState(sampleMeals);
  const [showContent, setShowContent] = useState(false);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [editingMealId, setEditingMealId] = useState<number | null>(null);
  
  // Calculate current nutritional totals
  const calculateCurrentTotals = () => {
    return meals.reduce(
      (totals, meal) => {
        if (meal.completed) {
          totals.calories += meal.macros.calories;
          totals.protein += meal.macros.protein;
          totals.carbs += meal.macros.carbs;
          totals.fat += meal.macros.fat;
        }
        return totals;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };
  
  // Update nutritional targets with current values
  const [currentTotals, setCurrentTotals] = useState(calculateCurrentTotals());
  
  // Show content after a short delay to ensure mountain is rendered
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);
  
  // Update totals when meals change
  useEffect(() => {
    setCurrentTotals(calculateCurrentTotals());
  }, [meals]);
  
  // Handle meal completion
  const handleCompleteMeal = (id: number) => {
    setMeals(
      meals.map(meal =>
        meal.id === id ? { ...meal, completed: !meal.completed } : meal
      )
    );
  };
  
  // Handle meal editing
  const handleEditMeal = (id: number) => {
    setEditingMealId(id);
    setShowAddMealModal(true);
  };
  
  // Handle adding footnote
  const handleAddFootnote = (id: number, note: string) => {
    console.log(`Added footnote to meal ${id}: ${note}`);
    // In a real app, this would update the meal with the footnote
  };
  
  // Handle adding new meal
  const handleAddMeal = () => {
    setEditingMealId(null);
    setShowAddMealModal(true);
  };
  
  // Get updated nutritional targets
  const getUpdatedTargets = () => {
    return {
      calories: {
        ...nutritionalTargets.calories,
        current: currentTotals.calories
      },
      protein: {
        ...nutritionalTargets.protein,
        current: currentTotals.protein
      },
      carbs: {
        ...nutritionalTargets.carbs,
        current: currentTotals.carbs
      },
      fat: {
        ...nutritionalTargets.fat,
        current: currentTotals.fat
      }
    };
  };

  return (
    <MainLayout>
      {showContent && (
        <div className="w-full max-w-md mx-auto px-4 pb-24">
          {/* Content container with proper padding for header */}
          <div className="pt-20 pb-4">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  icon={<ChevronLeft size={16} />}
                  className="text-white"
                >
                  Back
                </Button>
                <h1 className="text-sm font-bold text-white ml-2">Nutrition</h1>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddMeal}
                icon={<Plus size={14} />}
                className="border-primary-cyan-500 text-primary-cyan-400"
              >
                Add Meal
              </Button>
            </div>
            {/* Nutritional Targets Card - Regular, scrollable card */}
            <div className="mb-6">
              <NutritionalTargets {...getUpdatedTargets()} />
            </div>
          
          {/* Meal Cards */}
          <div className="space-y-4">
            {meals.map(meal => (
              <MealCard
                key={meal.id}
                title={meal.title}
                time={meal.time}
                items={meal.items}
                macros={meal.macros}
                completed={meal.completed}
                onComplete={() => handleCompleteMeal(meal.id)}
                onEdit={() => handleEditMeal(meal.id)}
                onAddFootnote={(note) => handleAddFootnote(meal.id, note)}
                className="mb-4"
              />
            ))}
          </div>
          
          {/* Nutrition Impact Card */}
          <GlassCard variant="default" size="md" className="w-full mt-6 mb-6">
            <div className="flex items-center mb-3">
              <UtensilsCrossed className="text-primary-cyan-500 mr-2" size={18} />
              <h3 className="text-lg font-medium text-alpine-mist">Nutrition Impact</h3>
            </div>
            
            <p className="text-text-secondary text-sm mb-3">
              Today's nutrition plan is optimized for your recovery and upcoming workout. Following this plan will contribute:
            </p>
            
            <div className="bg-glass-background p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-primary-cyan-500 mr-2"></div>
                  <span className="text-sm text-alpine-mist">Activity Points</span>
                </div>
                <span className="text-xs bg-primary-cyan-500/20 text-primary-cyan-500 px-2 py-1 rounded-full">
                  +15 points
                </span>
              </div>
              
              <div className="mt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary">Recovery Optimization</span>
                  <span className="text-xs text-alpine-mist">+5 points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary">Workout Support</span>
                  <span className="text-xs text-alpine-mist">+7 points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary">Goal Alignment</span>
                  <span className="text-xs text-alpine-mist">+3 points</span>
                </div>
              </div>
            </div>
          </GlassCard>
          
          {/* AI Nutrition Advisor */}
          <div className="mb-6">
            <AINutritionAdvisor userMetrics={userMetrics} />
          </div>
          
          {/* Add/Edit Meal Modal (simplified placeholder) */}
          {showAddMealModal && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddMealModal(false)}
            >
              <motion.div
                className="w-full max-w-md mx-4 bg-glass-background backdrop-blur-md border border-glass-border rounded-lg p-4"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-xl font-medium text-alpine-mist mb-4">
                  {editingMealId ? 'Edit Meal' : 'Add New Meal'}
                </h2>
                
                <p className="text-text-secondary">
                  This is a placeholder for the meal editor. In a complete implementation, this would include fields for meal name, time, food items, and quantities.
                </p>
                
                <div className="flex justify-end mt-4 space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddMealModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowAddMealModal(false)}
                  >
                    {editingMealId ? 'Save Changes' : 'Add Meal'}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default FoodScreen;
