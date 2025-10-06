import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import GeneralAIChat from '@/components/ai/GeneralAIChat';
import { ChevronLeft, Target, TrendingUp, Calendar, Award, Plus } from 'lucide-react';
import GoalProgressCard from '@/components/goals/GoalProgressCard';

// Goals overview component
const GoalsOverview: React.FC = () => {
  return (
    <GlassCard variant="default" size="sm" className="w-full mb-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full bg-primary-cyan-500/20 flex items-center justify-center mx-auto mb-2">
            <Target className="text-primary-cyan-400" size={16} />
          </div>
          <div className="text-lg font-bold text-white">5</div>
          <div className="text-xs text-white/60">Active Goals</div>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 rounded-full bg-primary-teal-500/20 flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="text-primary-teal-400" size={16} />
          </div>
          <div className="text-lg font-bold text-white">3</div>
          <div className="text-xs text-white/60">Completed</div>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 rounded-full bg-primary-purple-500/20 flex items-center justify-center mx-auto mb-2">
            <Award className="text-primary-purple-400" size={16} />
          </div>
          <div className="text-lg font-bold text-white">78%</div>
          <div className="text-xs text-white/60">Progress</div>
        </div>
      </div>
    </GlassCard>
  );
};

// Quick goal actions component
const QuickGoalActions: React.FC = () => {
  return (
    <GlassCard variant="default" size="sm" className="w-full mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-white">Quick Actions</h3>
        <Button
          variant="outline"
          size="sm"
          icon={<Plus size={12} />}
          className="text-primary-cyan-400 border-primary-cyan-500"
        >
          New Goal
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="justify-start text-white/70"
          icon={<Calendar size={14} />}
        >
          Set Timeline
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="justify-start text-white/70"
          icon={<TrendingUp size={14} />}
        >
          Track Progress
        </Button>
      </div>
    </GlassCard>
  );
};

const GoalsDashboardPage: React.FC = () => {
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

  return (
    <MainLayout>
      <div className="w-full max-w-md mx-auto px-4 pt-20 pb-24">
        {/* Header */}
        <div className="mb-4 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            icon={<ChevronLeft size={16} />}
            className="text-white"
          >
            Back
          </Button>
          <h1 className="text-sm font-bold text-white ml-2">Goals</h1>
        </div>
        
        {/* Goals Overview */}
        <GoalsOverview />
        
        {/* AI Chat */}
        <div className="mb-4">
          <GeneralAIChat topic="goals" />
        </div>
        
        {/* Quick Actions */}
        <QuickGoalActions />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4"
        >
          <motion.div variants={itemVariants}>
            <GoalProgressCard />
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default GoalsDashboardPage;
