import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import LightweightMountain from '@/components/mountain/LightweightMountain';
import { BarChart2 } from 'lucide-react';

// Workout frequency slider component
const FrequencySlider: React.FC<{
  value: number;
  onChange: (value: number) => void;
}> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value));
  };
  
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between mb-2">
        <label className="text-text-secondary text-sm">Workout Frequency</label>
        <span className="text-accent-primary text-sm font-medium">{value} days/week</span>
      </div>
      <input
        type="range"
        min="1"
        max="7"
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-glass rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, var(--color-accent-primary) 0%, var(--color-accent-primary) ${(value / 7) * 100}%, var(--color-glass-border) ${(value / 7) * 100}%, var(--color-glass-border) 100%)`,
          WebkitAppearance: 'none',
        }}
      />
    </div>
  );
};

// Workout type selector component
const WorkoutTypeSelector: React.FC<{
  selected: string[];
  onChange: (selected: string[]) => void;
}> = ({ selected, onChange }) => {
  const options = ['Weightlifting', 'Running', 'Yoga', 'Cycling', 'Swimming', 'HIIT', 'Pilates', 'Walking'];
  
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };
  
  return (
    <div className="w-full mb-6">
      <label className="text-text-secondary text-sm mb-2 block">Preferred Workouts</label>
      <div className="grid grid-cols-2 gap-2">
        {options.map(option => (
          <button
            key={option}
            className={`py-2 px-4 rounded-full transition-all ${
              selected.includes(option) 
                ? 'bg-accent-primary/20 border border-accent-primary text-text-primary' 
                : 'bg-glass border border-glass-border text-text-secondary'
            }`}
            onClick={() => toggleOption(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

// Sports input component
const SportsInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="w-full mb-6">
      <label className="text-text-secondary text-sm mb-2 block">Sports (Optional)</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="E.g., Basketball, Tennis, Golf..."
        className="w-full py-2 px-4 rounded-full bg-glass border border-glass-border text-text-primary focus:border-accent-primary outline-none transition-colors"
      />
    </div>
  );
};

const ActivityScreen: React.FC = () => {
  const navigate = useNavigate();
  const [frequency, setFrequency] = useState(3);
  const [workoutTypes, setWorkoutTypes] = useState<string[]>(['Running', 'Weightlifting']);
  const [sports, setSports] = useState('');
  
  const handleNext = () => {
    // In a real app, we would save this data
    navigate('/onboarding/nutrition');
  };
  
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Lightweight Mountain Background */}
      <div className="absolute inset-0 z-0">
        <LightweightMountain 
          progressPercentage={20}
          blurred={false}
          timeOfDay="day"
        />
      </div>
      
      {/* Activity Card */}
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
            <BarChart2 className="text-accent-primary mr-2" size={24} />
            <h2 className="text-xl font-medium text-text-primary">Your Pace</h2>
          </div>
          
          <FrequencySlider value={frequency} onChange={setFrequency} />
          
          <WorkoutTypeSelector selected={workoutTypes} onChange={setWorkoutTypes} />
          
          <SportsInput value={sports} onChange={setSports} />
          
          <div className="flex justify-between mt-8">
            <Button 
              variant="ghost" 
              size="md" 
              onClick={() => navigate('/onboarding/biometrics')}
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

export default ActivityScreen;



