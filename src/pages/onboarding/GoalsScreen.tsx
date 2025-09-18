import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import MountainLoader from '@/components/mountain/MountainLoader';
import { Flag, Calendar, Target } from 'lucide-react';
import { useActivityPoints } from '@/contexts/ActivityPointsContext';

// Primary goal category selector component
const PrimaryGoalSelector: React.FC<{
  selected: string;
  onChange: (value: string) => void;
}> = ({ selected, onChange }) => {
  const options = ['Strength', 'Endurance', 'Skill', 'Physique', 'Health'];
  
  return (
    <div className="w-full mb-6">
      <label className="text-text-secondary text-sm mb-2 block">Primary Goal Category</label>
      <div className="space-y-2">
        {options.map(option => (
          <button
            key={option}
            className={`w-full py-3 px-4 rounded-full transition-all text-left ${
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

// Target weight component (conditional)
const TargetWeight: React.FC<{
  current: number;
  target: number;
  onChange: (value: number) => void;
}> = ({ current, target, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value));
  };
  
  const min = Math.max(current - 30, 40); // Don't allow unrealistic targets
  const max = current + 30;
  
  return (
    <div className="w-full mb-6">
      <div className="flex justify-between mb-2">
        <label className="text-text-secondary text-sm">Target Weight</label>
        <span className="text-accent-primary text-sm font-medium">{target} kg</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={target}
        onChange={handleChange}
        className="w-full h-2 bg-glass rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, var(--color-accent-primary) 0%, var(--color-accent-primary) ${((target - min) / (max - min)) * 100}%, var(--color-glass-border) ${((target - min) / (max - min)) * 100}%, var(--color-glass-border) 100%)`,
          WebkitAppearance: 'none',
        }}
      />
      <div className="flex justify-between mt-1">
        <span className="text-text-secondary text-xs">{min} kg</span>
        <span className="text-text-secondary text-xs">{max} kg</span>
      </div>
    </div>
  );
};

// Specific goal input component with natural language processing
const SpecificGoalInput: React.FC<{
  goalText: string;
  setGoalText: (value: string) => void;
  category: string;
}> = ({ goalText, setGoalText, category }) => {
  // Example suggestions based on category
  const placeholders = {
    Strength: "e.g., Add 50 pounds to my deadlift",
    Endurance: "e.g., Run a sub-4 hour marathon",
    Skill: "e.g., Add 15 yards to my golf drive",
    Physique: "e.g., Reduce body fat to 15%",
    Health: "e.g., Lower blood pressure to normal range"
  };

  // Detected metrics from natural language input (simulated AI analysis)
  const detectedMetrics = goalText.length > 10 ? [
    { name: "Primary Metric", value: goalText.includes("golf") ? "Driving Distance" : 
                              goalText.includes("deadlift") ? "Max Lift Weight" : 
                              goalText.includes("marathon") ? "Race Time" : 
                              "Progress Metric" },
    { name: "Target Value", value: goalText.match(/\d+/) ? goalText.match(/\d+/)![0] + (goalText.includes("yard") ? " yards" : 
                                                                                   goalText.includes("pound") ? " lbs" : 
                                                                                   goalText.includes("hour") ? " hours" : 
                                                                                   "") : "Not specified" }
  ] : [];
  
  return (
    <div className="space-y-4">
      <div className="w-full">
        <label className="text-text-secondary text-sm mb-2 block">Specific Summit Goal</label>
        <textarea
          value={goalText}
          onChange={(e) => setGoalText(e.target.value)}
          placeholder={placeholders[category as keyof typeof placeholders]}
          className="w-full py-3 px-4 rounded-xl bg-glass border border-glass-border text-text-primary focus:border-accent-primary outline-none transition-colors min-h-[80px] resize-none"
        />
      </div>
      
      {/* AI-detected metrics */}
      {detectedMetrics.length > 0 && (
        <div className="bg-accent-primary/10 rounded-xl p-3 border border-accent-primary/30">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 rounded-full bg-accent-primary mr-2 animate-pulse"></div>
            <span className="text-xs text-text-secondary">AI-Detected Goal Metrics</span>
          </div>
          {detectedMetrics.map((metric, index) => (
            <div key={index} className="flex justify-between text-sm py-1">
              <span className="text-text-secondary">{metric.name}:</span>
              <span className="text-accent-primary font-medium">{metric.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Target achievement selector component
const TargetAchievementSelector: React.FC<{
  target: number;
  setTarget: (value: number) => void;
  category: string;
  goalText: string;
}> = ({ target, setTarget, category, goalText }) => {
  // Suggested targets based on goal category and text
  const getSuggestedTarget = () => {
    if (goalText.includes('golf') && goalText.includes('yard')) {
      // Extract number from text if possible
      const match = goalText.match(/(\d+)\s*yard/i);
      return match ? parseInt(match[1]) : 15;
    } else if (goalText.includes('deadlift') && goalText.includes('pound')) {
      const match = goalText.match(/(\d+)\s*pound/i);
      return match ? parseInt(match[1]) : 50;
    } else if (goalText.includes('marathon') && goalText.includes('hour')) {
      return 4; // 4-hour marathon
    } else {
      // Default targets by category
      const defaults = {
        Strength: 50,
        Endurance: 10,
        Skill: 15,
        Physique: 10,
        Health: 20
      };
      return defaults[category as keyof typeof defaults];
    }
  };
  
  const suggestedTarget = getSuggestedTarget();
  
  // Get appropriate unit based on goal text
  const getUnit = () => {
    if (goalText.includes('golf') && goalText.includes('yard')) {
      return 'yards';
    } else if (goalText.includes('deadlift') || goalText.includes('squat') || goalText.includes('bench')) {
      return 'lbs';
    } else if (goalText.includes('marathon') || goalText.includes('run')) {
      return 'hours';
    } else if (goalText.includes('fat') || goalText.includes('weight')) {
      return '%';
    } else {
      return 'points';
    }
  };
  
  const unit = getUnit();
  
  // Calculate required activity points based on target
  const requiredPoints = target * 100;
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="text-text-secondary text-sm">Target Achievement</label>
        <span className="text-xs text-accent-primary">Suggested: {suggestedTarget} {unit}</span>
      </div>
      
      <input
        type="range"
        min={Math.max(1, Math.floor(suggestedTarget * 0.5))}
        max={Math.ceil(suggestedTarget * 1.5)}
        value={target}
        onChange={(e) => setTarget(parseInt(e.target.value))}
        className="w-full h-2 bg-glass rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, var(--color-accent-primary) 0%, var(--color-accent-primary) ${((target - Math.max(1, Math.floor(suggestedTarget * 0.5))) / (Math.ceil(suggestedTarget * 1.5) - Math.max(1, Math.floor(suggestedTarget * 0.5)))) * 100}%, var(--color-glass-border) ${((target - Math.max(1, Math.floor(suggestedTarget * 0.5))) / (Math.ceil(suggestedTarget * 1.5) - Math.max(1, Math.floor(suggestedTarget * 0.5)))) * 100}%, var(--color-glass-border) 100%)`,
          WebkitAppearance: 'none',
        }}
      />
      
      <div className="flex justify-between mt-1">
        <span className="text-text-secondary text-xs">{Math.max(1, Math.floor(suggestedTarget * 0.5))} {unit}</span>
        <span className="text-accent-primary text-sm font-medium">{target} {unit}</span>
        <span className="text-text-secondary text-xs">{Math.ceil(suggestedTarget * 1.5)} {unit}</span>
      </div>
      
      <div className="flex items-center mt-3 bg-glass-background p-2 rounded-lg">
        <Target className="text-accent-primary mr-2" size={16} />
        <span className="text-xs text-text-secondary">You'll need to earn {requiredPoints} activity points to reach the summit</span>
      </div>
    </div>
  );
};

// Muscle gain component (conditional)
const MuscleGainGoal: React.FC<{
  focus: string;
  setFocus: (value: string) => void;
}> = ({ focus, setFocus }) => {
  const options = ['Overall Size', 'Strength', 'Definition', 'Functional Fitness'];
  
  return (
    <div className="w-full mb-6">
      <label className="text-text-secondary text-sm mb-2 block">Focus Area</label>
      <div className="grid grid-cols-2 gap-2">
        {options.map(option => (
          <button
            key={option}
            className={`py-2 px-4 rounded-full transition-all ${
              focus === option 
                ? 'bg-accent-primary/20 border border-accent-primary text-text-primary' 
                : 'bg-glass border border-glass-border text-text-secondary'
            }`}
            onClick={() => setFocus(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

const GoalsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setGoal } = useActivityPoints();
  const [primaryGoal, setPrimaryGoal] = useState('Strength');
  const [specificGoalText, setSpecificGoalText] = useState('');
  const [targetAchievement, setTargetAchievement] = useState(15); // Default target (will be updated based on goal)
  
  // AI-generated milestones (would be dynamic in a real app)
  const [milestones, setMilestones] = useState<{title: string, points: number}[]>([])
  
  const handleNext = () => {
    // Get the target unit based on the goal text
    const getUnit = () => {
      if (specificGoalText.includes('golf') && specificGoalText.includes('yard')) {
        return 'yards';
      } else if (specificGoalText.includes('deadlift') || specificGoalText.includes('squat')) {
        return 'lbs';
      } else if (specificGoalText.includes('marathon') || specificGoalText.includes('run')) {
        return 'hours';
      } else {
        return 'units';
      }
    };

    // Save the goal in the activity points context
    setGoal(primaryGoal, specificGoalText, targetAchievement, getUnit());
    
    // Navigate to the completion screen
    navigate('/onboarding/complete');
  };
  
  // Generate milestones based on goal and target achievement
  useEffect(() => {
    if (specificGoalText.length > 10) {
      // Calculate required activity points
      const totalPoints = targetAchievement * 100;
      
      // Calculate milestone points
      const milestone1Points = Math.round(totalPoints * 0.25);
      const milestone2Points = Math.round(totalPoints * 0.5);
      const milestone3Points = Math.round(totalPoints * 0.75);
      
      // Generate milestone content based on goal category and text
      let newMilestones = [];
      
      if (primaryGoal === 'Strength') {
        newMilestones = [
          { title: "Foundation Phase Complete", points: milestone1Points },
          { title: "Mid-point Strength Assessment", points: milestone2Points },
          { title: "Peak Preparation Phase", points: milestone3Points }
        ];
      } else if (primaryGoal === 'Endurance') {
        newMilestones = [
          { title: "Base Building Complete", points: milestone1Points },
          { title: "Tempo & Threshold Training", points: milestone2Points },
          { title: "Taper & Race Preparation", points: milestone3Points }
        ];
      } else if (primaryGoal === 'Skill') {
        newMilestones = [
          { title: "Technique Fundamentals", points: milestone1Points },
          { title: "Skill Integration", points: milestone2Points },
          { title: "Performance Refinement", points: milestone3Points }
        ];
      } else {
        newMilestones = [
          { title: "Phase 1 Complete", points: milestone1Points },
          { title: "Phase 2 Complete", points: milestone2Points },
          { title: "Final Preparation", points: milestone3Points }
        ];
      }
      
      setMilestones(newMilestones);
    }
  }, [specificGoalText, targetAchievement, primaryGoal]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* 3D Mountain Background with progressive loading */}
      <div className="absolute inset-0 z-0">
        <MountainLoader 
          progressPercentage={60}
          blurred={false}
          timeOfDay="day"
          use3D={true}
          autoUpgradeTo3D={false}
        />
      </div>
      
      {/* Goals Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md px-4 py-4 overflow-auto max-h-screen"
      >
        <GlassCard 
          variant="default" 
          size="lg"
          animate={false}
          className="w-full"
        >
          <div className="flex items-center mb-6">
            <Flag className="text-accent-primary mr-2" size={24} />
            <h2 className="text-xl font-medium text-text-primary">Your Summit Goal</h2>
          </div>
          
          <PrimaryGoalSelector selected={primaryGoal} onChange={setPrimaryGoal} />
          
          <div className="space-y-6 mt-6">
            <SpecificGoalInput 
              goalText={specificGoalText}
              setGoalText={setSpecificGoalText}
              category={primaryGoal}
            />
            
            <TargetAchievementSelector 
              target={targetAchievement}
              setTarget={setTargetAchievement}
              category={primaryGoal}
              goalText={specificGoalText}
            />
            
            {/* Milestones */}
            {milestones.length > 0 && (
              <div className="w-full">
                <label className="text-text-secondary text-sm mb-2 block">Your Journey Milestones</label>
                <div className="space-y-3">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center bg-glass p-3 rounded-lg border border-glass-border">
                      <div className="w-2 h-2 rounded-full bg-accent-primary mr-3"></div>
                      <div className="flex-1">
                        <div className="text-text-primary text-sm">{milestone.title}</div>
                        <div className="text-text-secondary text-xs">
                          {milestone.points} activity points required
                        </div>
                      </div>
                      <div className="bg-accent-primary/20 px-2 py-1 rounded-full text-xs text-accent-primary">
                        {Math.round((milestone.points / (targetAchievement * 100)) * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between mt-8">
            <Button 
              variant="ghost" 
              size="md" 
              onClick={() => navigate('/onboarding/nutrition')}
            >
              Back
            </Button>
            
            <Button 
              variant="primary" 
              size="md" 
              onClick={handleNext}
              disabled={specificGoalText.length < 10}
            >
              Set Your Path
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default GoalsScreen;

