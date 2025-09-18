import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import LightweightMountain from '@/components/mountain/LightweightMountain';
import { Utensils } from 'lucide-react';

// Dietary preferences component
const DietaryPreferences: React.FC<{
  selected: string;
  onChange: (value: string) => void;
}> = ({ selected, onChange }) => {
  const options = ['None', 'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Paleo'];
  
  return (
    <div className="w-full mb-6">
      <label className="text-text-secondary text-sm mb-2 block">Dietary Preferences</label>
      <div className="grid grid-cols-2 gap-2">
        {options.map(option => (
          <button
            key={option}
            className={`py-2 px-4 rounded-full transition-all ${
              selected === option 
                ? 'bg-accent-primary/20 border border-accent-primary text-text-primary' 
                : 'bg-glass border border-glass-border text-text-secondary'
            }`}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

// Allergies input component
const AllergiesInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="w-full mb-6">
      <label className="text-text-secondary text-sm mb-2 block">Allergies (Optional)</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="E.g., Nuts, Dairy, Shellfish..."
        className="w-full py-2 px-4 rounded-full bg-glass border border-glass-border text-text-primary focus:border-accent-primary outline-none transition-colors"
      />
    </div>
  );
};

// Meals per day component
const MealsPerDay: React.FC<{
  value: number;
  onChange: (value: number) => void;
}> = ({ value, onChange }) => {
  const increment = () => {
    if (value < 6) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > 2) {
      onChange(value - 1);
    }
  };

  return (
    <div className="w-full mb-6">
      <label className="text-text-secondary text-sm mb-2 block">Meals Per Day</label>
      <div className="flex items-center justify-center">
        <button 
          className="w-10 h-10 rounded-full bg-glass border border-glass-border text-text-primary flex items-center justify-center"
          onClick={decrement}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        
        <div className="w-16 text-center">
          <span className="text-3xl font-light text-accent-primary">{value}</span>
        </div>
        
        <button 
          className="w-10 h-10 rounded-full bg-glass border border-glass-border text-text-primary flex items-center justify-center"
          onClick={increment}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  );
};

// Cooking habits component
const CookingHabits: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const options = ['Cook at Home', 'Eat Out'];
  
  return (
    <div className="w-full mb-6">
      <label className="text-text-secondary text-sm mb-2 block">Cooking Habits</label>
      <div className="flex space-x-2">
        {options.map(option => (
          <button
            key={option}
            className={`flex-1 py-2 px-4 rounded-full transition-all ${
              value === option 
                ? 'bg-accent-primary/20 border border-accent-primary text-text-primary' 
                : 'bg-glass border border-glass-border text-text-secondary'
            }`}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

const NutritionScreen: React.FC = () => {
  const navigate = useNavigate();
  const [dietaryPreference, setDietaryPreference] = useState('None');
  const [allergies, setAllergies] = useState('');
  const [mealsPerDay, setMealsPerDay] = useState(3);
  const [cookingHabit, setCookingHabit] = useState('Cook at Home');
  
  const handleNext = () => {
    // In a real app, we would save this data
    navigate('/onboarding/goals');
  };
  
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Lightweight Mountain Background */}
      <div className="absolute inset-0 z-0">
        <LightweightMountain 
          progressPercentage={40}
          blurred={false}
          timeOfDay="day"
        />
      </div>
      
      {/* Nutrition Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <GlassCard 
          variant="default" 
          size="lg"
          animate={false}
          className="w-full"
        >
          <div className="flex items-center mb-6">
            <Utensils className="text-accent-primary mr-2" size={24} />
            <h2 className="text-xl font-medium text-text-primary">Your Fuel</h2>
          </div>
          
          <DietaryPreferences selected={dietaryPreference} onChange={setDietaryPreference} />
          
          <AllergiesInput value={allergies} onChange={setAllergies} />
          
          <MealsPerDay value={mealsPerDay} onChange={setMealsPerDay} />
          
          <CookingHabits value={cookingHabit} onChange={setCookingHabit} />
          
          <div className="flex justify-between mt-8">
            <Button 
              variant="ghost" 
              size="md" 
              onClick={() => navigate('/onboarding/activity')}
            >
              Back
            </Button>
            
            <Button 
              variant="primary" 
              size="md" 
              onClick={handleNext}
            >
              Continue
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default NutritionScreen;



