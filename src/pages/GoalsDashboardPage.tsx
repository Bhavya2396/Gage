import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import GeneralAIChat from '@/components/ai/GeneralAIChat';
import GoalCard from '@/components/goals/GoalCard';
import ProgressChart from '@/components/goals/ProgressChart';
import GoalCreationModal from '@/components/goals/GoalCreationModal';
import { ChevronLeft, Target, TrendingUp, Calendar, Award, Plus, BarChart3, Activity, Heart, Utensils } from 'lucide-react';
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
const QuickGoalActions: React.FC<{ onCreateGoal: () => void }> = ({ onCreateGoal }) => {
  return (
    <GlassCard variant="default" size="sm" className="w-full mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-white">Quick Actions</h3>
        <Button
          variant="outline"
          size="sm"
          icon={<Plus size={12} />}
          className="text-primary-cyan-400 border-primary-cyan-500"
          onClick={onCreateGoal}
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

// Sample goals data
const sampleGoals = [
  {
    id: '1',
    title: 'Run 5K in 25 minutes',
    description: 'Complete a 5K run in under 25 minutes to improve cardiovascular fitness',
    category: 'fitness' as const,
    target: 25,
    current: 18,
    unit: 'minutes',
    deadline: '2024-03-15',
    priority: 'high' as const,
    status: 'active' as const
  },
  {
    id: '2',
    title: 'Lose 10 pounds',
    description: 'Achieve a healthy weight by losing 10 pounds through diet and exercise',
    category: 'health' as const,
    target: 10,
    current: 6,
    unit: 'pounds',
    deadline: '2024-04-01',
    priority: 'medium' as const,
    status: 'active' as const
  },
  {
    id: '3',
    title: 'Eat 5 servings of vegetables daily',
    description: 'Maintain a balanced diet by consuming 5 servings of vegetables every day',
    category: 'nutrition' as const,
    target: 5,
    current: 5,
    unit: 'servings',
    deadline: '2024-02-28',
    priority: 'medium' as const,
    status: 'completed' as const
  },
  {
    id: '4',
    title: 'Read 12 books this year',
    description: 'Expand knowledge and improve reading habits by reading one book per month',
    category: 'personal' as const,
    target: 12,
    current: 3,
    unit: 'books',
    deadline: '2024-12-31',
    priority: 'low' as const,
    status: 'active' as const
  }
];

// Sample progress data
const progressData = {
  fitness: [
    { date: '2024-01-01', value: 15, target: 25 },
    { date: '2024-01-08', value: 18, target: 25 },
    { date: '2024-01-15', value: 20, target: 25 },
    { date: '2024-01-22', value: 18, target: 25 },
    { date: '2024-01-29', value: 16, target: 25 }
  ],
  nutrition: [
    { date: '2024-01-01', value: 3, target: 5 },
    { date: '2024-01-08', value: 4, target: 5 },
    { date: '2024-01-15', value: 5, target: 5 },
    { date: '2024-01-22', value: 4, target: 5 },
    { date: '2024-01-29', value: 5, target: 5 }
  ]
};

const GoalsDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState(sampleGoals);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'progress'>('overview');

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

  const handleGoalCreated = (newGoal: any) => {
    setGoals(prev => [...prev, newGoal]);
  };

  const handleGoalComplete = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, status: 'completed' as const, current: goal.target }
        : goal
    ));
  };

  const handleGoalEdit = (goalId: string) => {
    console.log('Edit goal:', goalId);
    // In a real app, this would open an edit modal
  };

  const handleGoalPause = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, status: goal.status === 'paused' ? 'active' as const : 'paused' as const }
        : goal
    ));
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
        <QuickGoalActions onCreateGoal={() => setShowCreateModal(true)} />
        
        {/* Tabs */}
        <div className="flex mb-4">
          <Button 
            variant={activeTab === 'overview' ? 'primary' : 'ghost'} 
            size="sm" 
            className="flex-1 rounded-r-none"
            onClick={() => setActiveTab('overview')}
            icon={<BarChart3 size={14} />}
          >
            Overview
          </Button>
          
          <Button 
            variant={activeTab === 'goals' ? 'primary' : 'ghost'} 
            size="sm" 
            className="flex-1 rounded-none"
            onClick={() => setActiveTab('goals')}
            icon={<Target size={14} />}
          >
            Goals
          </Button>
          
          <Button 
            variant={activeTab === 'progress' ? 'primary' : 'ghost'} 
            size="sm" 
            className="flex-1 rounded-l-none"
            onClick={() => setActiveTab('progress')}
            icon={<TrendingUp size={14} />}
          >
            Progress
          </Button>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4"
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div variants={itemVariants}>
              <GoalProgressCard />
            </motion.div>
          )}
          
          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <motion.div variants={itemVariants} className="space-y-3">
              {goals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  {...goal}
                  onEdit={() => handleGoalEdit(goal.id)}
                  onComplete={() => handleGoalComplete(goal.id)}
                  onPause={() => handleGoalPause(goal.id)}
                />
              ))}
            </motion.div>
          )}
          
          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <motion.div variants={itemVariants} className="space-y-4">
              <ProgressChart
                title="Fitness Progress"
                data={progressData.fitness}
                unit="minutes"
                color="primary-cyan"
                icon={<Activity className="text-primary-cyan-400" size={14} />}
              />
              <ProgressChart
                title="Nutrition Progress"
                data={progressData.nutrition}
                unit="servings"
                color="primary-teal"
                icon={<Utensils className="text-primary-teal-400" size={14} />}
              />
            </motion.div>
          )}
        </motion.div>
        
        {/* Goal Creation Modal */}
        <GoalCreationModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onGoalCreated={handleGoalCreated}
        />
      </div>
    </MainLayout>
  );
};

export default GoalsDashboardPage;
