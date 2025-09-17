import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import ExerciseCard from '@/components/workout/ExerciseCard';
import AIFormCoach from '@/components/workout/AIFormCoach';
import { ChevronLeft, Timer, Info, Lightbulb, Target, Award, CheckCircle, Dumbbell } from 'lucide-react';
import { useActivityPoints } from '@/contexts/ActivityPointsContext';

// Workout Header Component
const WorkoutHeader: React.FC = () => {
  const { activityPoints, getPointsRemaining } = useActivityPoints();
  const [showAiTip, setShowAiTip] = useState(false);
  
  return (
    <GlassCard variant="default" size="md" className="w-full mb-4 sticky top-0 z-10">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-medium text-alpine-mist">Full Body Strength</h2>
          <p className="text-alpine-mist text-sm mt-1 bg-glass-background bg-opacity-30 px-2 py-1 rounded-lg">Focus: Rotational Power Development</p>
        </div>
        <div className="text-right">
          <div className="text-alpine-mist text-sm bg-glass-background bg-opacity-30 px-2 py-1 rounded-lg mb-1">Duration</div>
          <div className="text-accent-primary font-medium text-lg">45 min</div>
        </div>
      </div>
      
      <div className="mt-3 bg-glass-background bg-opacity-50 p-3 rounded-lg border border-glass-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-accent-primary mr-2"></span>
            <span className="text-alpine-mist font-medium">Summit Contribution</span>
          </div>
          <span className="text-accent-primary font-medium">+{getPointsRemaining() > 0 ? 25 : 0} Activity Points</span>
        </div>
        <div className="text-sm text-alpine-mist mt-2 bg-glass-background bg-opacity-30 p-2 rounded-lg">
          This workout directly improves your {activityPoints.goalName} metrics for your {activityPoints.targetValue}-{activityPoints.targetUnit} goal
        </div>
      </div>
      
      {/* AI Coach Tip */}
      <div className="mt-3 relative">
        <button
          className="flex items-center text-sm text-alpine-mist bg-glass-background bg-opacity-30 px-3 py-2 rounded-lg"
          onClick={() => setShowAiTip(!showAiTip)}
        >
          <Lightbulb size={16} className="text-cyan-primary mr-2" />
          <span>AI Coach Tip</span>
        </button>
        
        <AnimatePresence>
          {showAiTip && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-2 p-3 bg-glass-highlight backdrop-blur-sm rounded-lg text-sm text-alpine-mist"
            >
              Based on your recovery score of 78%, focus on quality reps rather than maximal weight today. Your HRV indicates good readiness for rotational power development.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
};

// Main WorkoutPage Component
const WorkoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { addPoints } = useActivityPoints();
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showFormCoach, setShowFormCoach] = useState(false);
  const [currentExerciseName, setCurrentExerciseName] = useState('');
  
  // Sample exercises
  const exercises = [
    {
      id: 1,
      name: 'Barbell Squats',
      sets: 4,
      reps: '8-10',
      muscleGroup: 'Legs, Core',
      aiTip: 'Focus on driving your knees outward to engage your glutes more effectively.',
      pointValue: 5
    },
    {
      id: 2,
      name: 'Medicine Ball Rotational Throws',
      sets: 3,
      reps: '12 each side',
      muscleGroup: 'Core, Rotational',
      aiTip: 'Generate power from the ground up, transferring force through your core rotation.',
      pointValue: 4
    },
    {
      id: 3,
      name: 'Cable Woodchoppers',
      sets: 3,
      reps: '12 each side',
      muscleGroup: 'Core, Rotational',
      aiTip: 'Keep your arms straight and rotate from your torso, not your arms.',
      pointValue: 4
    },
    {
      id: 4,
      name: 'Kettlebell Swings',
      sets: 3,
      reps: '15',
      muscleGroup: 'Posterior Chain, Core',
      aiTip: 'Drive with your hips and engage your core throughout the movement.',
      pointValue: 4
    },
    {
      id: 5,
      name: 'Plank with Rotation',
      sets: 3,
      reps: '10 each side',
      muscleGroup: 'Core, Shoulders',
      aiTip: 'Maintain a stable plank position as you rotate, avoiding hip sag.',
      pointValue: 3
    }
  ];
  
  // Handle exercise activation
  const handleActivateExercise = (index: number) => {
    setActiveExerciseIndex(index);
    setCurrentExerciseName(exercises[index].name);
  };
  
  // Handle exercise completion
  const handleCompleteExercise = (index: number) => {
    setCompletedExercises([...completedExercises, index]);
    
    // Activate next exercise if available
    if (index < exercises.length - 1) {
      setTimeout(() => {
        setActiveExerciseIndex(index + 1);
        setCurrentExerciseName(exercises[index + 1].name);
      }, 500);
    } else {
      // All exercises completed
      setTimeout(() => {
        setWorkoutComplete(true);
        const points = 25;
        setPointsEarned(points);
        addPoints(points, 'Workout', 'Full Body Strength Workout');
      }, 500);
    }
  };
  
  // Handle workout completion
  const handleFinishWorkout = () => {
    navigate('/workout-complete', { 
      state: { 
        pointsEarned, 
        workoutName: 'Full Body Strength',
        duration: '45 min'
      } 
    });
  };
  
  // Show AI form coach
  const handleShowFormCoach = (exerciseName: string) => {
    setCurrentExerciseName(exerciseName);
    setShowFormCoach(true);
  };
  
  return (
    <MainLayout>
      <div className="w-full max-w-md mx-auto px-4 pt-20 pb-24">
        {/* Back Button */}
        <div className="mb-4 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            icon={<ChevronLeft size={16} />}
            className="font-medium"
          >
            Back
          </Button>
          <h1 className="text-lg font-medium text-alpine-mist bg-glass-background bg-opacity-40 px-3 py-1 rounded-lg ml-2">Workout</h1>
        </div>
        
        {/* Points Display */}
        <div className="mb-4 bg-glass-background bg-opacity-50 px-4 py-2 rounded-full flex items-center justify-center">
          <span className="text-sm text-alpine-mist">
            <span className="text-cyan-primary font-medium">480 points</span> / 1500
          </span>
        </div>
        
        {/* Workout Header */}
        <WorkoutHeader />
        
        {/* Exercise Cards */}
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise.id}
              name={exercise.name}
              sets={exercise.sets}
              reps={exercise.reps}
              muscleGroup={exercise.muscleGroup}
              aiTip={exercise.aiTip}
              isActive={activeExerciseIndex === index}
              isCompleted={completedExercises.includes(index)}
              onActivate={() => handleActivateExercise(index)}
              onComplete={() => handleCompleteExercise(index)}
            />
          ))}
        </div>
        
        {/* Workout Complete Card */}
        <AnimatePresence>
          {workoutComplete && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-0 bottom-0 p-4 z-40"
            >
              <GlassCard variant="success" size="md" className="w-full max-w-md mx-auto">
                <div className="text-center">
                  <h3 className="text-xl font-medium text-alpine-mist mb-2">Workout Complete!</h3>
                  <p className="text-alpine-mist mb-4">
                    You've earned <span className="text-cyan-primary font-medium">+{pointsEarned} Activity Points</span>
                  </p>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleFinishWorkout}
                  >
                    Finish Workout
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* AI Form Coach Modal */}
        <AIFormCoach
          isOpen={showFormCoach}
          onClose={() => setShowFormCoach(false)}
          exerciseName={currentExerciseName}
        />
      </div>
    </MainLayout>
  );
};

export default WorkoutPage;