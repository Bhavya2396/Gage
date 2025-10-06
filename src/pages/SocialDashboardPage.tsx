import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { ChevronLeft } from 'lucide-react';
import FriendsCard from '@/components/social/FriendsCard';
import InsightsCard from '@/components/analytics/InsightsCard';

const SocialDashboardPage: React.FC = () => {
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
          <h1 className="text-sm font-bold text-white ml-2">Social</h1>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6"
        >
          <motion.div variants={itemVariants}>
            <FriendsCard />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <InsightsCard />
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default SocialDashboardPage;
