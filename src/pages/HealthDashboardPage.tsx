import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { ChevronLeft, Heart, Activity, Wind, Droplet, Thermometer } from 'lucide-react';
import HealthCard from '@/components/health/HealthCard';
import RecoveryScoreCard from '@/components/health/RecoveryScoreCard';
import { getRecoveryColor } from '@/lib/utils';

const HealthDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Sample health metrics data
  const healthMetrics = [
    {
      title: 'HRV',
      value: 68,
      unit: 'ms',
      trend: 'up' as const,
      trendValue: '+5',
      chartData: [58, 60, 62, 59, 63, 65, 68],
      color: 'var(--color-accent-secondary)',
      icon: <Heart size={16} />,
      insightText: 'Your HRV has been steadily increasing over the past week, indicating improved recovery and reduced stress. Keep maintaining your current sleep schedule.'
    },
    {
      title: 'RHR',
      value: 52,
      unit: 'bpm',
      trend: 'down' as const,
      trendValue: '-2',
      chartData: [54, 55, 53, 54, 53, 52, 52],
      color: 'var(--color-accent-primary)',
      icon: <Activity size={16} />,
      insightText: 'Your resting heart rate has decreased slightly, which is a positive sign. This often correlates with improved cardiovascular fitness and recovery.'
    },
    {
      title: 'Respiratory Rate',
      value: 14.2,
      unit: 'br/min',
      trend: 'stable' as const,
      chartData: [14.5, 14.3, 14.4, 14.2, 14.3, 14.1, 14.2],
      icon: <Wind size={16} />,
      insightText: 'Your respiratory rate has remained stable within the healthy range. This indicates consistent breathing patterns during sleep.'
    },
    {
      title: 'SpO₂',
      value: 98,
      unit: '%',
      trend: 'stable' as const,
      chartData: [97, 98, 98, 97, 98, 98, 98],
      color: 'var(--color-text-primary)',
      icon: <Droplet size={16} />,
      insightText: 'Your blood oxygen saturation levels are excellent and consistent. This indicates optimal oxygen delivery to your tissues during sleep and rest.'
    },
    {
      title: 'Skin Temperature',
      value: 36.4,
      unit: '°C',
      trend: 'stable' as const,
      chartData: [36.5, 36.4, 36.5, 36.3, 36.4, 36.5, 36.4],
      icon: <Thermometer size={16} />,
      insightText: 'Your skin temperature has remained consistent, with no significant deviations. This suggests stable thermoregulation and absence of fever or inflammation.'
    }
  ];
  
  // Recovery score data
  const recoveryData = {
    recoveryScore: 78,
    factors: [
      { name: 'Sleep', score: 85, color: '#4ade80' },
      { name: 'HRV', score: 72, color: getRecoveryColor(78) },
      { name: 'Previous Activity', score: 65, color: 'var(--color-text-primary)' },
      { name: 'Stress', score: 60, color: 'var(--color-accent-secondary)' }
    ],
    insight: "Your recovery is good today, primarily driven by excellent sleep quality. Consider a moderate intensity workout to maintain this positive trend."
  };
  
  // Staggered animation for cards
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
    visible: { opacity: 1, y: 0 }
  };
  
  // Shared element transition animation from home screen
  const sharedElementTransition = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
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
          <h1 className="text-xl font-medium text-alpine-mist bg-glass-background bg-opacity-40 px-3 py-1 rounded-lg ml-2">Health Dashboard</h1>
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
            <RecoveryScoreCard {...recoveryData} />
          </motion.div>
          
          <div className="grid grid-cols-1 gap-6">
            {healthMetrics.map((metric, index) => (
              <motion.div key={metric.title} variants={itemVariants}>
                <HealthCard {...metric} />
              </motion.div>
            ))}
          </div>
          
          <motion.div variants={itemVariants}>
            <GlassCard variant="default" size="md" className="w-full">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-alpine-mist">Health Trends</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/health/trends')}
                  className="text-alpine-mist hover:bg-cyan-primary/20 hover:border-cyan-primary/40"
                >
                  View All
                </Button>
              </div>
              <div className="bg-glass-background bg-opacity-30 p-3 rounded-lg mt-3">
                <div className="flex items-center mb-2">
                  <div className="w-full h-2 bg-glass-border rounded-full overflow-hidden mr-2">
                    <div className="h-full bg-gradient-to-r from-cyan-primary to-teal-primary" style={{ width: '68%' }}></div>
                  </div>
                  <span className="text-xs text-cyan-primary whitespace-nowrap">+15%</span>
                </div>
                <p className="text-alpine-mist text-sm">
                  Your health metrics are trending positively. Sleep quality has improved significantly over the last month.
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default HealthDashboardPage;