import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Mountain3D from '@/components/mountain/Mountain3D';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  
  const handleStart = () => {
    navigate('/onboarding/biometrics');
  };
  
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden mobile-full-height">
      {/* Wireframe Mountain Background */}
      <div className="absolute inset-0 z-0">
        <Mountain3D 
          progressPercentage={0}
          blurred={false}
        />
      </div>
      
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <GlassCard 
          variant="default" 
          size="lg"
          animate={false}
          className="w-full"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-accent-primary mb-2">GAGE</h1>
            <h2 className="text-xl font-light text-text-primary mb-6">Begin Your Ascent</h2>
            
            <p className="text-text-secondary mb-8">
              Welcome to Gage. We will now plot a personalized path to your peak. 
              Your journey is unique, built from your goals and biometrics.
            </p>
            
            <Button 
              variant="primary" 
              size="lg" 
              fullWidth
              onClick={handleStart}
              className="mt-4"
            >
              Start Plotting
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;

