import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Mountain3D from '@/components/mountain/Mountain3D';
import { useActivityPoints } from '@/contexts/ActivityPointsContext';

const CompleteScreen: React.FC = () => {
  const navigate = useNavigate();
  const { activityPoints } = useActivityPoints();
  const [animationStage, setAnimationStage] = useState(0);
  const [mountainPlotted, setMountainPlotted] = useState(false);
  const [showJourneyAnimation, setShowJourneyAnimation] = useState(false);
  const [journeyComplete, setJourneyComplete] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  
  // Animation timeline
  useEffect(() => {
    const timeline = [
      { stage: 1, delay: 1000 },   // Dissolve card into particles
      { stage: 2, delay: 3000 },   // Mountain transforms to 3D (handled by Mountain3D)
    ];
    
    let timeout: NodeJS.Timeout;
    
    const runNextAnimation = (index: number) => {
      if (index < timeline.length) {
        setAnimationStage(timeline[index].stage);
        timeout = setTimeout(() => {
          runNextAnimation(index + 1);
        }, timeline[index].delay);
      } else {
        // After mountain plotting, start journey animation after a short delay
        setTimeout(() => {
          console.log("Starting journey animation");
          setShowJourneyAnimation(true);
        }, 1000);
      }
    };
    
    // Start the animation sequence
    runNextAnimation(0);
    
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  
  // Handle mountain plotting completion
  const handlePlottingComplete = () => {
    setMountainPlotted(true);
  };
  
  // Handle journey animation completion
  const handleJourneyComplete = () => {
    console.log("Journey animation completed");
    setJourneyComplete(true);
    setShowFinalMessage(true);
    
    // Show "Beginning your journey" message, then navigate to dashboard
    setTimeout(() => {
      // Mark onboarding as complete
      localStorage.setItem('onboardingComplete', 'true');
      console.log("Setting onboarding complete and navigating to home");
      
      // Navigate to home after a longer delay to ensure transition is smooth
      setTimeout(() => {
        // Force reload to ensure proper state initialization
        window.location.href = '/';
      }, 1000);
    }, 3000);
  };
  
  // Ensure we redirect to dashboard if user tries to access this page directly after onboarding is complete
  useEffect(() => {
    const isOnboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
    if (isOnboardingComplete) {
      navigate('/');
    }
  }, [navigate]);
  
  // Particle animation for card dissolve
  const Particles: React.FC = () => {
    return (
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-accent-primary"
            initial={{ 
              x: '50%', 
              y: '50%', 
              opacity: 0 
            }}
            animate={{ 
              x: `${Math.random() * 100}%`, 
              y: `${Math.random() * 100}%`, 
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{ 
              duration: 2,
              delay: Math.random() * 0.5,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div className="fixed inset-0 w-full h-screen mobile-full-height flex items-center justify-center overflow-hidden">
      {/* Mountain Background - with plotting and journey animations */}
      <div className="absolute inset-0 z-0">
        <Mountain3D 
          progressPercentage={10} // Initial progress
          blurred={false}
          interactive={false}
          showPlottingAnimation={animationStage >= 2}
          showJourneyAnimation={showJourneyAnimation}
          onPlottingComplete={handlePlottingComplete}
          onJourneyComplete={handleJourneyComplete}
        />
      </div>
      
      {/* Card that dissolves into particles */}
      <AnimatePresence>
        {animationStage < 1 && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              scale: 1.1,
              transition: { duration: 0.5 }
            }}
            className="relative z-10 w-full max-w-md px-4"
          >
            <div className="backdrop-blur border border-glass-border bg-glass rounded-xl p-6 w-full">
              <div className="text-center">
                <h2 className="text-2xl font-medium text-accent-primary mb-4">Your Summit Goal is Set</h2>
                <p className="text-text-secondary">
                  All set! Your path to {activityPoints.goalName} requires {activityPoints.totalPointsRequired} activity points.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Particles animation for card dissolve */}
      {animationStage >= 1 && animationStage < 2 && <Particles />}
      
      {/* "Beginning your journey" Text Overlay */}
      <AnimatePresence>
        {showFinalMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex items-center justify-center z-20"
          >
            <div className="text-center">
              <motion.h1 
                className="text-4xl font-bold text-text-primary relative inline-block"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                Begin your journey
                <motion.div 
                  className="absolute inset-0 -z-10 blur-lg bg-accent-primary/20"
                  animate={{ 
                    opacity: [0.2, 0.5, 0.2],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              </motion.h1>
              <motion.p
                className="text-lg text-text-secondary mt-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {activityPoints.totalPointsRequired} points to reach your summit goal
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Final transition overlay */}
      <AnimatePresence>
        {journeyComplete && showFinalMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className="absolute inset-0 bg-black z-30"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompleteScreen;