import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { ChevronLeft, Heart } from 'lucide-react';
import RecoveryScoreCard from '@/components/health/RecoveryScoreCard';
import HealthMetricsGrid from '@/components/health/HealthMetricsGrid';

const HealthDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  const sharedElementTransition = {
    layoutId: 'health-dashboard',
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  };
  
  return (
    <MainLayout>
      <div className="w-full max-w-md mx-auto px-4 pt-20 pb-24">
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
          <h1 className="text-xl font-medium text-white bg-white/10 px-3 py-1 rounded-lg ml-2">Health Dashboard</h1>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6"
        >
          <motion.div 
            variants={itemVariants} 
            {...sharedElementTransition}
          >
            <RecoveryScoreCard score={78} />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <GlassCard variant="default" size="md" className="w-full">
              <div className="flex items-center mb-4">
                <div className="mr-3 p-2 rounded-full bg-white/10">
                  <Heart className="text-primary-cyan-400" size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">Base Camp Recovery</h3>
              </div>
              <p className="text-white/70 text-sm">
                Focus on establishing healthy recovery patterns to build a strong foundation.
              </p>
            </GlassCard>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <HealthMetricsGrid />
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default HealthDashboardPage;