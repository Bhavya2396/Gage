import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mountain } from 'lucide-react';
import Mountain3D from '@/components/mountain/Mountain3D';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      {/* Background mountain */}
      <div className="absolute inset-0 z-0">
        <Mountain3D 
          progressPercentage={50}
          blurred={true}
          interactive={false}
          timeOfDay="night"
        />
      </div>
      
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 max-w-md w-full px-4"
      >
        <GlassCard variant="default" size="lg" className="w-full text-center">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-glass flex items-center justify-center mb-6 border border-glass-border">
              <motion.div
                animate={{ 
                  rotateZ: [0, -10, 10, -10, 0],
                  y: [0, -5, 0, -5, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Mountain className="text-accent-primary" size={32} />
              </motion.div>
            </div>
            
            <h1 className="text-6xl font-bold text-accent-primary mb-2">404</h1>
            <h2 className="text-2xl font-medium text-text-primary mb-4">Trail Not Found</h2>
            
            <p className="text-text-secondary mb-8">
              It seems you've wandered off the mapped path. Let's get you back to basecamp.
            </p>
            
            <Button 
              variant="primary" 
              size="lg" 
              as={Link} 
              to="/"
              icon={<Mountain size={16} />}
            >
              Return to Basecamp
            </Button>
          </div>
        </GlassCard>
      </motion.div>
      
      {/* Subtle cyan glow at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-accent-primary/10 to-transparent pointer-events-none z-0"></div>
    </div>
  );
};

export default NotFoundPage;