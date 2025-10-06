import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { ChevronLeft, Plus, Minus, Target, Zap, Droplet, Apple, Clock, TrendingUp } from 'lucide-react';

const NutritionPage: React.FC = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks'>('breakfast');
  
  const nutritionData = {
    calories: { current: 1850, target: 2200, unit: 'kcal' },
    protein: { current: 120, target: 150, unit: 'g' },
    carbs: { current: 180, target: 220, unit: 'g' },
    fat: { current: 65, target: 80, unit: 'g' },
    water: { current: 1.8, target: 2.5, unit: 'L' }
  };

  const meals = {
    breakfast: [
      { name: 'Oatmeal with Berries', calories: 320, protein: 12, carbs: 45, fat: 8 },
      { name: 'Greek Yogurt', calories: 150, protein: 15, carbs: 8, fat: 2 },
      { name: 'Banana', calories: 90, protein: 1, carbs: 23, fat: 0 }
    ],
    lunch: [
      { name: 'Grilled Chicken Salad', calories: 450, protein: 35, carbs: 15, fat: 25 },
      { name: 'Quinoa', calories: 220, protein: 8, carbs: 40, fat: 4 }
    ],
    dinner: [
      { name: 'Salmon Fillet', calories: 350, protein: 40, carbs: 0, fat: 20 },
      { name: 'Sweet Potato', calories: 180, protein: 4, carbs: 41, fat: 0 },
      { name: 'Broccoli', calories: 50, protein: 5, carbs: 10, fat: 0 }
    ],
    snacks: [
      { name: 'Almonds', calories: 160, protein: 6, carbs: 6, fat: 14 },
      { name: 'Apple', calories: 80, protein: 0, carbs: 21, fat: 0 }
    ]
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(100, (current / target) * 100);
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 90) return 'from-green-500 to-emerald-500';
    if (percentage >= 70) return 'from-cyan-500 to-teal-500';
    if (percentage >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <MainLayout>
      {showContent && (
        <div className="absolute inset-0 z-10 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <motion.button
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft size={20} />
              <span>Back</span>
            </motion.button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">Nutrition</h1>
              <p className="text-white/60 text-sm">Track your daily intake</p>
            </div>
            
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>

          {/* Daily Overview */}
          <div className="px-6 mb-6">
            <motion.div
              className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h3 className="text-white font-semibold text-lg mb-4">Today's Overview</h3>
              
              {/* Calories */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Zap className="text-cyan-400" size={20} />
                    <span className="text-white font-medium">Calories</span>
                  </div>
                  <span className="text-white font-bold">
                    {nutritionData.calories.current} / {nutritionData.calories.target} {nutritionData.calories.unit}
                  </span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${getProgressColor(nutritionData.calories.current, nutritionData.calories.target)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${getProgressPercentage(nutritionData.calories.current, nutritionData.calories.target)}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </div>
              </div>

              {/* Macros Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'protein', icon: Target, color: 'text-cyan-400' },
                  { key: 'carbs', icon: Apple, color: 'text-teal-400' },
                  { key: 'fat', icon: Droplet, color: 'text-purple-400' },
                  { key: 'water', icon: Droplet, color: 'text-blue-400' }
                ].map(({ key, icon: Icon, color }) => (
                  <div key={key} className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon className={color} size={16} />
                      <span className="text-white/80 text-sm capitalize">{key}</span>
                    </div>
                    <div className="text-white font-bold text-lg">
                      {nutritionData[key as keyof typeof nutritionData].current}
                    </div>
                    <div className="text-white/60 text-xs">
                      / {nutritionData[key as keyof typeof nutritionData].target} {nutritionData[key as keyof typeof nutritionData].unit}
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${getProgressColor(
                          nutritionData[key as keyof typeof nutritionData].current,
                          nutritionData[key as keyof typeof nutritionData].target
                        )}`}
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${getProgressPercentage(
                            nutritionData[key as keyof typeof nutritionData].current,
                            nutritionData[key as keyof typeof nutritionData].target
                          )}%` 
                        }}
                        transition={{ delay: 0.7 + Math.random() * 0.3, duration: 0.6 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Meal Selection */}
          <div className="px-6 mb-6">
            <div className="flex space-x-2">
              {[
                { key: 'breakfast', label: 'Breakfast', icon: '🌅' },
                { key: 'lunch', label: 'Lunch', icon: '☀️' },
                { key: 'dinner', label: 'Dinner', icon: '🌙' },
                { key: 'snacks', label: 'Snacks', icon: '🍎' }
              ].map(({ key, label, icon }) => (
                <motion.button
                  key={key}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                    selectedMeal === key
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                  onClick={() => setSelectedMeal(key as any)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="mr-2">{icon}</span>
                  {label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Meal Items */}
          <div className="flex-1 px-6 pb-6">
            <motion.div
              className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg capitalize">{selectedMeal}</h3>
                <motion.button
                  className="bg-cyan-500 text-white px-4 py-2 rounded-xl font-medium text-sm flex items-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus size={16} />
                  <span>Add Food</span>
                </motion.button>
              </div>

              <div className="space-y-3">
                {meals[selectedMeal].map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/5 rounded-xl p-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">{item.name}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-cyan-400 text-sm">{item.calories} cal</span>
                          <span className="text-white/60 text-sm">P: {item.protein}g</span>
                          <span className="text-white/60 text-sm">C: {item.carbs}g</span>
                          <span className="text-white/60 text-sm">F: {item.fat}g</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.button
                          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Minus size={16} />
                        </motion.button>
                        <span className="text-white font-medium w-8 text-center">1</span>
                        <motion.button
                          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Plus size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default NutritionPage;