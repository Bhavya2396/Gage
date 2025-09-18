import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import LightweightMountain from '@/components/mountain/LightweightMountain';
import { User } from 'lucide-react';

// Number picker component for age, height, weight
const NumberPicker: React.FC<{
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit?: string;
}> = ({ label, value, onChange, min, max, unit }) => {
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label className="text-text-secondary text-sm mb-2">{label}</label>
      <div className="flex flex-col items-center">
        <button 
          className="text-accent-primary hover:text-accent-primary/80 p-1"
          onClick={handleIncrement}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m18 15-6-6-6 6"/>
          </svg>
        </button>
        
        <div className="text-center my-1">
          <span className="text-3xl font-light text-text-primary">{value}</span>
          {unit && <span className="text-text-secondary text-sm ml-1">{unit}</span>}
        </div>
        
        <button 
          className="text-accent-primary hover:text-accent-primary/80 p-1"
          onClick={handleDecrement}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

// Gender selection component
const GenderSelector: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const options = ['Male', 'Female', 'Other'];
  
  return (
    <div className="w-full mb-6">
      <label className="text-text-secondary text-sm mb-2 block">Gender</label>
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

const BiometricsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [age, setAge] = useState(30);
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [gender, setGender] = useState('Male');
  
  const handleNext = () => {
    // In a real app, we would save this data
    navigate('/onboarding/activity');
  };
  
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Lightweight Mountain Background */}
      <div className="absolute inset-0 z-0">
        <LightweightMountain 
          progressPercentage={10}
          blurred={false}
          timeOfDay="day"
        />
      </div>
      
      {/* Biometrics Card */}
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
            <User className="text-accent-primary mr-2" size={24} />
            <h2 className="text-xl font-medium text-text-primary">Your Foundation</h2>
          </div>
          
          <div className="flex justify-between mb-8">
            <NumberPicker 
              label="Age"
              value={age}
              onChange={setAge}
              min={18}
              max={100}
              unit="yrs"
            />
            
            <NumberPicker 
              label="Height"
              value={height}
              onChange={setHeight}
              min={100}
              max={220}
              unit="cm"
            />
            
            <NumberPicker 
              label="Weight"
              value={weight}
              onChange={setWeight}
              min={40}
              max={150}
              unit="kg"
            />
          </div>
          
          <GenderSelector value={gender} onChange={setGender} />
          
          <div className="flex justify-between mt-8">
            <Button 
              variant="ghost" 
              size="md" 
              onClick={() => navigate('/onboarding/welcome')}
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

export default BiometricsScreen;



