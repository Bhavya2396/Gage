import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Mountain3D from '@/components/mountain/Mountain3D';
import { Target, Award, Zap, ChevronUp, BarChart3, ArrowUpRight } from 'lucide-react';
import { useActivityPoints } from '@/contexts/ActivityPointsContext';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';

const WorkoutCompletePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activityPoints, getProgressPercentage, getPointsRemaining } = useActivityPoints();
  const [animationStage, setAnimationStage] = useState(0);
  const [pointsGained, setPointsGained] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const totalPointsGain = location.state?.pointsEarned || 25; // Activity points earned from this workout
  
  // Animation timeline
  useEffect(() => {
    const timeline = [
      { stage: 1, delay: 1000 },   // Start camera movement
      { stage: 2, delay: 2000 },   // Show points gain text
      { stage: 3, delay: 3000 },   // Complete points gain animation
      { stage: 4, delay: 1500 },   // Show completion message
      { stage: 5, delay: 1000 },   // Show summary card
    ];
    
    let timeout: NodeJS.Timeout;
    
    const runNextAnimation = (index: number) => {
      if (index < timeline.length) {
        setAnimationStage(timeline[index].stage);
        timeout = setTimeout(() => {
          runNextAnimation(index + 1);
        }, timeline[index].delay);
      } else {
        // Animation complete, show summary
        setShowSummary(true);
      }
    };
    
    // Start the animation sequence
    runNextAnimation(0);
    
    return () => {
      clearTimeout(timeout);
    };
  }, [navigate]);
  
  // Points counter animation
  useEffect(() => {
    if (animationStage >= 2) {
      const duration = 2000; // 2 seconds
      const interval = 20; // Update every 20ms
      const steps = duration / interval;
      const increment = totalPointsGain / steps;
      let current = 0;
      let timer: NodeJS.Timeout;
      
      const updatePoints = () => {
        current += increment;
        if (current >= totalPointsGain) {
          setPointsGained(totalPointsGain);
          clearInterval(timer);
        } else {
          setPointsGained(Math.round(current));
        }
      };
      
      timer = setInterval(updatePoints, interval);
      
      return () => clearInterval(timer);
    }
  }, [animationStage, totalPointsGain]);

  // Handle continue button
  const handleContinue = () => {
    navigate('/');
  };
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Mountain Background */}
      <div className="absolute inset-0 z-0">
        <Mountain3D 
          progressPercentage={getProgressPercentage()}
          showJourneyAnimation={animationStage >= 1}
          onJourneyComplete={() => {}}
          blurred={false}
          interactive={false}
        />
      </div>
      
      {/* Points Gain Animation */}
      <AnimatePresence>
        {animationStage >= 2 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="text-6xl font-bold text-primary-cyan-500 mb-2 flex items-center"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <span>+</span>
                <motion.span>
                  {pointsGained}
                </motion.span>
              </motion.div>
              
              <motion.div
                className="text-xl text-alpine-mist"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                Activity Points Earned
              </motion.div>
              
              {/* Animated Path Line */}
              <motion.div
                className="mt-6 relative"
                initial={{ width: 0 }}
                animate={{ width: 200 }}
                transition={{ delay: 0.8, duration: 1.5 }}
              >
                <div className="h-1 bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 rounded-full"></div>
                <motion.div
                  className="absolute -top-2 -right-2 w-5 h-5 bg-primary-cyan-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 2.3, duration: 0.3 }}
                >
                  <ChevronUp size={14} className="text-white" />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Completion Message */}
      <AnimatePresence>
        {animationStage >= 4 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold text-alpine-mist mb-2">
                Workout Complete
              </h1>
              <p className="text-xl text-text-secondary">
                You're getting closer to your summit!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Workout Summary Card */}
      <AnimatePresence>
        {showSummary && (
          <motion.div
            className="absolute inset-x-0 bottom-0 z-20 p-4"
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          >
            <GlassCard variant="default" size="lg" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-alpine-mist">Workout Impact</h2>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary-cyan-500/20 flex items-center justify-center">
                    <Award className="text-primary-cyan-500" size={18} />
                  </div>
                </div>
              </div>
              
              {/* Points Breakdown */}
              <div className="mb-6">
                <h3 className="text-sm text-text-secondary mb-2">Points Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Zap className="text-primary-cyan-500 mr-2" size={16} />
                      <span className="text-sm text-alpine-mist">Exercise Completion</span>
                    </div>
                    <span className="text-sm text-primary-cyan-500">+{Math.round(totalPointsGain * 0.6)} points</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Target className="text-primary-cyan-500 mr-2" size={16} />
                      <span className="text-sm text-alpine-mist">Goal Alignment</span>
                    </div>
                    <span className="text-sm text-primary-cyan-500">+{Math.round(totalPointsGain * 0.3)} points</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <BarChart3 className="text-primary-cyan-500 mr-2" size={16} />
                      <span className="text-sm text-alpine-mist">Performance Bonus</span>
                    </div>
                    <span className="text-sm text-primary-cyan-500">+{Math.round(totalPointsGain * 0.1)} points</span>
                  </div>
                </div>
              </div>
              
              {/* Goal Progress */}
              <div className="mb-6">
                <h3 className="text-sm text-text-secondary mb-2">Summit Progress</h3>
                <div className="w-full bg-glass-border h-2 rounded-full overflow-hidden mb-2">
                  <div 
                    className="bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 h-full rounded-full" 
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-text-secondary">{activityPoints.currentPoints} points ({getProgressPercentage()}%)</span>
                  <span className="text-xs text-text-secondary">{getPointsRemaining()} points to summit</span>
                </div>
              </div>
              
              {/* AI Analysis */}
              <div className="mb-6 p-3 bg-glass-highlight rounded-lg">
                <h3 className="text-sm font-medium text-alpine-mist mb-2">AI Workout Analysis</h3>
                <p className="text-xs text-text-secondary">
                  Great work on the rotational exercises! Your medicine ball throws showed 12% improvement in power output compared to last week. This directly contributes to your golf swing goal by enhancing your rotational force generation.
                </p>
              </div>
              
              {/* Continue Button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleContinue}
                icon={<ArrowUpRight size={18} />}
              >
                Continue Your Journey
              </Button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkoutCompletePage;