import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, Target, Zap, Activity, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useActivityPoints } from '@/contexts/ActivityPointsContext';
import GlassCard from '@/components/ui/GlassCard';
import MainLayout from '@/layouts/MainLayout';

const InsightsPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    activityPoints, 
    getProgressPercentage, 
    getCurrentPhase, 
    getPhaseProgress 
  } = useActivityPoints();
  
  const currentPhase = getCurrentPhase();
  const phaseProgress = getPhaseProgress();
  const phaseName = currentPhase?.name || 'Complete';
  
  // Sample metrics data
  const metrics = [
    { 
      name: "Rotational Power", 
      current: 320, 
      target: 375, 
      unit: "points",
      icon: <Zap size={16} className="text-primary-cyan-500" />
    },
    { 
      name: "Endurance", 
      current: 210, 
      target: 250, 
      unit: "points",
      icon: <Activity size={16} className="text-primary-teal-500" />
    },
    { 
      name: "Recovery", 
      current: 180, 
      target: 200, 
      unit: "points",
      icon: <Calendar size={16} className="text-primary-cyan-500" />
    },
  ];

  return (
  <MainLayout>
    <div className="p-4 sm:p-6 pb-32 pt-20">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full bg-glass-background bg-opacity-70 backdrop-blur-sm border border-white/30 shadow-lg text-white hover:bg-glass-background hover:bg-opacity-80 hover:border-white/50"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl sm:text-2xl font-semibold text-alpine-mist bg-glass-background bg-opacity-40 px-3 py-1 rounded-lg">Summit Preparation Log</h1>
      </div>
      
      {/* Overall Progress */}
      <GlassCard size="full" className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-medium text-alpine-mist">
            {activityPoints.goalName}
          </h2>
          <div className="text-sm bg-primary-cyan-500/20 text-primary-cyan-500 px-3 py-1 rounded-full">
            {getProgressPercentage()}% Complete
          </div>
        </div>
        
        <div className="bg-glass-background bg-opacity-30 p-3 sm:p-4 rounded-lg mb-4">
          <div className="flex justify-between mb-2 text-sm text-alpine-mist">
            <span>Progress</span>
            <span>{activityPoints.currentPoints} / {activityPoints.totalPointsRequired} points</span>
          </div>
          
          <div className="w-full bg-glass-border h-2 sm:h-2.5 rounded-full overflow-hidden mb-4">
            <div 
              className="bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 h-full rounded-full" 
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          
          <div className="text-xs sm:text-sm text-alpine-mist">
            <p>Current phase: <span className="text-primary-cyan-500">{phaseName}</span></p>
            <p>Phase progress: <span className="text-primary-cyan-500">{phaseProgress}%</span></p>
          </div>
        </div>
      </GlassCard>
      
      {/* Goal Metrics */}
      <h2 className="text-lg sm:text-xl font-medium text-alpine-mist mb-4">Goal Metrics</h2>
      <div className="space-y-4 mb-6">
        {metrics.map((metric, index) => (
          <GlassCard key={index} size="full" className="bg-glass-background bg-opacity-30">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-glass-highlight mr-3">
                  {metric.icon}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-medium text-alpine-mist">{metric.name}</h3>
                  <p className="text-xs sm:text-sm text-alpine-mist">
                    {metric.current}/{metric.target} {metric.unit}
                  </p>
                </div>
              </div>
              
              <div className="w-24 bg-glass-border h-1.5 sm:h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-primary-cyan-500 h-full rounded-full" 
                  style={{ width: `${(metric.current / metric.target) * 100}%` }}
                />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
      
      {/* Preparation Phases */}
      <h2 className="text-lg sm:text-xl font-medium text-alpine-mist mb-4">Preparation Phases</h2>
      <div className="space-y-4 mb-6">
        {activityPoints.phases.map((phase, index) => (
          <GlassCard 
            key={index} 
            size="full" 
            className={`${phaseName === phase.name ? 'border-primary-cyan-500/50' : ''}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm sm:text-base font-medium text-alpine-mist">{phase.name}</h3>
              <span className="text-xs sm:text-sm text-alpine-mist">
                {phase.points}/{phase.totalPoints} points
              </span>
            </div>
            
            <div className="w-full bg-glass-border h-1.5 sm:h-2 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 h-full rounded-full" 
                style={{ width: `${(phase.points / phase.totalPoints) * 100}%` }}
              />
            </div>
            
            <p className="text-xs sm:text-sm text-alpine-mist">{phase.description}</p>
          </GlassCard>
        ))}
      </div>
      
      {/* Assessment Simulation */}
      <GlassCard size="full">
        <div className="flex items-center mb-4">
          <div className="p-2.5 rounded-full bg-glass-highlight mr-3">
            <Target size={18} className="text-primary-cyan-500" />
          </div>
          <h2 className="text-lg sm:text-xl font-medium text-alpine-mist">Assessment Simulation</h2>
        </div>
        
        <p className="text-xs sm:text-sm text-alpine-mist mb-4 bg-glass-background bg-opacity-30 p-3 rounded-lg">
          Based on your current progress and activity points, we can simulate your expected performance 
          for your goal: <span className="text-primary-cyan-500 font-medium">{activityPoints.goalName}</span>
        </p>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 rounded-lg text-white font-medium"
          onClick={() => navigate('/assessment-simulation')}
        >
          Simulate Assessment Day Performance
        </motion.button>
      </GlassCard>
    </div>
  </MainLayout>
  );
};

export default InsightsPage;
