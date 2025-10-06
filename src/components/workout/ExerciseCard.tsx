import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Timer, Check, X, Camera, Plus, Minus, Info, Dumbbell } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import AIFormCoach from './AIFormCoach';
import ExerciseVisual from './ExerciseVisual';

interface Set {
  id: number;
  reps: number;
  weight: number;
  completed: boolean;
}

interface ExerciseCardProps {
  name: string;
  sets: number;
  reps: string | number;
  muscleGroup?: string;
  aiTip?: string;
  restTime?: number; // in seconds
  pointValue?: number;
  description?: string;
  isActive?: boolean;
  isCompleted?: boolean;
  onActivate?: () => void;
  onComplete?: (sets?: Set[]) => void;
  className?: string;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  name,
  sets,
  reps,
  muscleGroup,
  aiTip,
  restTime = 60,
  pointValue = 4,
  description,
  isActive = false,
  isCompleted = false,
  onActivate,
  onComplete,
  className = ''
}) => {
  // Convert string reps (like "8-10") to a number for the state
  const initialReps = typeof reps === 'string' ? 
    parseInt(reps.split('-')[0]) : reps;
  
  const [exerciseSets, setExerciseSets] = useState<Set[]>(
    Array.from({ length: sets }, (_, i) => ({
      id: i + 1,
      reps: initialReps,
      weight: 0,
      completed: false
    }))
  );
  
  const [currentSet, setCurrentSet] = useState(1);
  const [restTimerActive, setRestTimerActive] = useState(false);
  const [remainingRestTime, setRemainingRestTime] = useState(restTime);
  const [showFormCoach, setShowFormCoach] = useState(false);
  const [showVisualGuide, setShowVisualGuide] = useState(false);
  
  // Handle completing a set
  const completeSet = (setId: number) => {
    setExerciseSets(prev => 
      prev.map(set => 
        set.id === setId ? { ...set, completed: true } : set
      )
    );
    
    if (currentSet < sets) {
      setCurrentSet(currentSet + 1);
      setRestTimerActive(true);
      setRemainingRestTime(restTime);
      
      // Start rest timer
      const timer = setInterval(() => {
        setRemainingRestTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setRestTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // All sets completed
      if (onComplete) {
        onComplete(exerciseSets);
      }
    }
  };
  
  // Update reps or weight
  const updateSetValue = (setId: number, field: 'reps' | 'weight', value: number) => {
    setExerciseSets(prev => 
      prev.map(set => 
        set.id === setId ? { ...set, [field]: value } : set
      )
    );
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <GlassCard 
      size="full" 
      className={`${className} ${isActive ? 'border-primary-cyan-500' : ''} ${isCompleted ? 'border-primary-cyan-500/50 bg-glass-background/50' : ''}`}
      onClick={!isActive && !isCompleted ? onActivate : undefined}
      interactive
      animate
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        boxShadow: isActive 
          ? '0 20px 40px rgba(0, 204, 255, 0.2), 0 8px 16px rgba(0, 0, 0, 0.1)'
          : '0 8px 16px rgba(0, 0, 0, 0.1)'
      }}
      whileTap={{ scale: 0.98 }}
      glow={isActive}
      glowColor="#00ccff"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`p-2 rounded-lg ${isActive ? 'bg-gradient-to-br from-primary-cyan-500/20 to-primary-teal-500/20 border border-primary-cyan-500/30' : 'bg-white/10'}`}>
              <Dumbbell size={16} className={isActive ? 'text-primary-cyan-500' : 'text-white/60'} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{name}</h3>
              <div className="flex flex-wrap gap-3 mt-2">
                {muscleGroup && (
                  <span className="text-sm px-3 py-1.5 bg-white/10 rounded-lg text-white/80 font-semibold border border-white/20">
                    {muscleGroup}
                  </span>
                )}
                <span className="text-sm px-3 py-1.5 bg-gradient-to-r from-primary-cyan-500/20 to-primary-teal-500/20 rounded-lg text-primary-cyan-400 font-bold border border-primary-cyan-500/30">
                  {typeof reps === 'string' ? reps : `${reps} reps`} × {sets} sets
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-glass-highlight rounded-lg text-alpine-mist"
            onClick={(e) => {
              e.stopPropagation();
              setShowVisualGuide(!showVisualGuide);
            }}
          >
            <Info size={18} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-glass-highlight rounded-lg text-alpine-mist"
            onClick={(e) => {
              e.stopPropagation();
              setShowFormCoach(!showFormCoach);
            }}
          >
            <Camera size={18} />
          </motion.button>
        </div>
      </div>
      
      {/* Visual Exercise Guide */}
      {showVisualGuide && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mb-4 overflow-hidden"
        >
          <ExerciseVisual exerciseName={name} />
          
          {aiTip && (
            <div className="mt-2 p-3 bg-glass-background bg-opacity-30 rounded-lg">
              <div className="flex items-start">
                <div className="p-1.5 rounded-full bg-gradient-to-br from-primary-cyan-500 to-primary-teal-500 mr-2 mt-0.5">
                  <Camera size={12} className="text-white" />
                </div>
                <p className="text-xs text-alpine-mist flex-1">{aiTip}</p>
              </div>
            </div>
          )}
        </motion.div>
      )}
      
      {description && !showVisualGuide && (
        <div className="bg-glass-background bg-opacity-30 p-3 rounded-lg mb-4">
          <p className="text-xs sm:text-sm text-alpine-mist">{description}</p>
        </div>
      )}
      
      {/* Rest Timer */}
      {restTimerActive && (
        <div className="bg-primary-cyan-500/20 p-3 rounded-lg mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Timer size={18} className="text-primary-cyan-500 mr-2" />
            <span className="text-sm text-alpine-mist">Rest</span>
          </div>
          <span className="text-base font-medium text-primary-cyan-500">{formatTime(remainingRestTime)}</span>
        </div>
      )}
      
      {/* Sets - Only show if exercise is active */}
      {isActive && (
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {exerciseSets.map((set) => (
            <motion.div 
              key={set.id}
              className={`border ${set.completed ? 'border-primary-cyan-500/30' : 'border-glass-border'} 
                rounded-lg p-2 flex items-center justify-between ${set.id === currentSet && !set.completed ? 'bg-glass-highlight' : 'bg-glass-background bg-opacity-30'}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: set.id * 0.1 }}
            >
              <div className="flex items-center">
                <motion.span 
                  className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 text-xs
                  ${set.completed ? 'bg-primary-cyan-500 text-white' : 'bg-glass-border text-alpine-mist'}`}
                  animate={set.completed ? {
                    scale: [1, 1.2, 1],
                    backgroundColor: ['rgba(0, 204, 255, 0)', 'rgba(0, 204, 255, 1)', 'rgba(0, 204, 255, 1)']
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {set.id}
                </motion.span>
                
                <div className="flex items-center">
                  <div className="mr-3">
                    <p className="text-[10px] text-alpine-mist mb-0.5">Reps</p>
                    <div className="flex items-center">
                      <button 
                        className="p-0.5 bg-glass-border rounded-l-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          !set.completed && updateSetValue(set.id, 'reps', Math.max(1, set.reps - 1));
                        }}
                        disabled={set.completed}
                      >
                        <Minus size={10} className="text-alpine-mist" />
                      </button>
                      <span className="w-6 text-center text-xs text-alpine-mist">{set.reps}</span>
                      <button 
                        className="p-0.5 bg-glass-border rounded-r-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          !set.completed && updateSetValue(set.id, 'reps', set.reps + 1);
                        }}
                        disabled={set.completed}
                      >
                        <Plus size={10} className="text-alpine-mist" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-[10px] text-alpine-mist mb-0.5">Weight</p>
                    <div className="flex items-center">
                      <button 
                        className="p-0.5 bg-glass-border rounded-l-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          !set.completed && updateSetValue(set.id, 'weight', Math.max(0, set.weight - 5));
                        }}
                        disabled={set.completed}
                      >
                        <Minus size={10} className="text-alpine-mist" />
                      </button>
                      <span className="w-6 text-center text-xs text-alpine-mist">{set.weight}</span>
                      <button 
                        className="p-0.5 bg-glass-border rounded-r-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          !set.completed && updateSetValue(set.id, 'weight', set.weight + 5);
                        }}
                        disabled={set.completed}
                      >
                        <Plus size={10} className="text-alpine-mist" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {!set.completed ? (
                set.id === currentSet && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1.5 bg-primary-cyan-500 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      completeSet(set.id);
                    }}
                  >
                    <Check size={14} className="text-white" />
                  </motion.button>
                )
              ) : (
                <motion.div 
                  className="p-1.5 bg-primary-cyan-500/20 rounded-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  <Check size={14} className="text-primary-cyan-500" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Completed exercise summary */}
      {isCompleted && !isActive && (
        <div className="mt-2 p-3 bg-primary-cyan-500/10 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Check size={16} className="text-primary-cyan-500 mr-2" />
              <span className="text-sm text-alpine-mist">Completed</span>
            </div>
            <span className="text-xs text-primary-cyan-500 font-medium">+{sets * pointValue} points</span>
          </div>
        </div>
      )}
      
      {/* AI Form Coach */}
      {showFormCoach && (
        <div className="mt-4">
          <AIFormCoach exerciseName={name} />
        </div>
      )}
    </GlassCard>
  );
};

export default ExerciseCard;
