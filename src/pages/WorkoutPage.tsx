import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { ChevronLeft, Play, Pause, RotateCcw, Timer, Target, Award, CheckCircle, Dumbbell, Zap } from 'lucide-react';
import { useActivityPoints } from '@/contexts/ActivityPointsContext';

const WorkoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { activityPoints, getPointsRemaining } = useActivityPoints();
  const [showContent, setShowContent] = useState(false);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60); // 45 minutes in seconds
  
  const exercises = [
    {
      name: "Dynamic Warm-up",
      duration: 5,
      sets: 1,
      reps: "Dynamic",
      focus: "Mobility & Activation",
      description: "Prepare your body for the workout ahead"
    },
    {
      name: "Rotational Medicine Ball Throws",
      duration: 8,
      sets: 3,
      reps: "8-10 each side",
      focus: "Rotational Power",
      description: "Develop explosive rotational strength"
    },
    {
      name: "Single-Arm Kettlebell Swings",
      duration: 10,
      sets: 3,
      reps: "12-15 each arm",
      focus: "Hip Power & Stability",
      description: "Build hip drive and core stability"
    },
    {
      name: "Plyometric Box Jumps",
      duration: 8,
      sets: 3,
      reps: "6-8",
      focus: "Explosive Power",
      description: "Develop vertical power and landing mechanics"
    },
    {
      name: "Cool Down & Stretching",
      duration: 5,
      sets: 1,
      reps: "Hold 30s each",
      focus: "Recovery",
      description: "Promote recovery and flexibility"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkoutActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutActive, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startWorkout = () => {
    setIsWorkoutActive(true);
  };

  const pauseWorkout = () => {
    setIsWorkoutActive(false);
  };

  const resetWorkout = () => {
    setIsWorkoutActive(false);
    setTimeRemaining(45 * 60);
    setCurrentExercise(0);
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
              <h1 className="text-2xl font-bold text-white">Full Body Strength</h1>
              <p className="text-white/60 text-sm">Focus: Rotational Power Development</p>
            </div>
            
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>

          {/* Workout Timer */}
          <div className="px-6 mb-6">
            <motion.div
              className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Timer className="text-cyan-400" size={24} />
                <span className="text-4xl font-bold text-white">{formatTime(timeRemaining)}</span>
              </div>
              
              <div className="flex justify-center space-x-3">
                {!isWorkoutActive ? (
                  <motion.button
                    className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-8 py-3 rounded-2xl font-medium flex items-center space-x-2"
                    onClick={startWorkout}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play size={20} />
                    <span>Start Workout</span>
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-2xl font-medium flex items-center space-x-2 border border-white/20"
                      onClick={pauseWorkout}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Pause size={20} />
                      <span>Pause</span>
                    </motion.button>
                    <motion.button
                      className="bg-red-500/20 backdrop-blur-md text-white px-6 py-3 rounded-2xl font-medium flex items-center space-x-2 border border-red-500/30"
                      onClick={resetWorkout}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RotateCcw size={20} />
                      <span>Reset</span>
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* Current Exercise */}
          <div className="px-6 mb-6">
            <motion.div
              className="bg-gradient-to-br from-cyan-500/20 to-teal-500/20 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Dumbbell className="text-cyan-400" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Current Exercise</h3>
                    <p className="text-white/60 text-sm">Exercise {currentExercise + 1} of {exercises.length}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-cyan-400 font-bold text-lg">{exercises[currentExercise].duration} min</span>
                  <p className="text-white/60 text-sm">Duration</p>
                </div>
              </div>
              
              <h4 className="text-2xl font-bold text-white mb-2">{exercises[currentExercise].name}</h4>
              <p className="text-white/80 mb-4">{exercises[currentExercise].description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <Target className="text-cyan-400" size={16} />
                    <span className="text-white/80 text-sm">Sets</span>
                  </div>
                  <span className="text-white font-bold text-lg">{exercises[currentExercise].sets}</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <Zap className="text-teal-400" size={16} />
                    <span className="text-white/80 text-sm">Reps</span>
                  </div>
                  <span className="text-white font-bold text-lg">{exercises[currentExercise].reps}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Exercise List */}
          <div className="flex-1 px-6 pb-6">
            <h3 className="text-white font-semibold text-lg mb-4">Workout Plan</h3>
            <div className="space-y-3">
              {exercises.map((exercise, index) => (
                <motion.div
                  key={index}
                  className={`bg-black/20 backdrop-blur-md rounded-xl p-4 border ${
                    index === currentExercise 
                      ? 'border-cyan-500/50 bg-cyan-500/10' 
                      : 'border-white/10'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index < currentExercise 
                          ? 'bg-green-500/20 text-green-400' 
                          : index === currentExercise 
                          ? 'bg-cyan-500/20 text-cyan-400' 
                          : 'bg-white/10 text-white/60'
                      }`}>
                        {index < currentExercise ? (
                          <CheckCircle size={16} />
                        ) : (
                          <span className="text-sm font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{exercise.name}</h4>
                        <p className="text-white/60 text-sm">{exercise.focus}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-bold">{exercise.duration} min</span>
                      <p className="text-white/60 text-xs">Duration</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default WorkoutPage;