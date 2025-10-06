import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  Target, 
  TrendingUp, 
  MessageCircle, 
  Map, 
  Crown,
  Calendar,
  BarChart3,
  Heart,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CleanDashboardProps {
  className?: string;
}

const CleanDashboard: React.FC<CleanDashboardProps> = ({ className }) => {
  const quickActions = [
    {
      icon: Activity,
      label: "Today's Workout",
      description: "Foundation strength session",
      color: "text-primary-cyan-500",
      bgColor: "bg-primary-cyan-500/10",
      borderColor: "border-primary-cyan-500/30"
    },
    {
      icon: Map,
      label: "Journey Map",
      description: "View your progress",
      color: "text-primary-teal-500",
      bgColor: "bg-primary-teal-500/10",
      borderColor: "border-primary-teal-500/30"
    },
    {
      icon: BarChart3,
      label: "Analytics",
      description: "Performance insights",
      color: "text-primary-cyan-400",
      bgColor: "bg-primary-cyan-400/10",
      borderColor: "border-primary-cyan-400/30"
    },
    {
      icon: MessageCircle,
      label: "AI Coach",
      description: "Get personalized advice",
      color: "text-primary-teal-400",
      bgColor: "bg-primary-teal-400/10",
      borderColor: "border-primary-teal-400/30"
    }
  ];

  const stats = [
    { label: "Recovery", value: "78", icon: Heart, color: "text-green-400" },
    { label: "Progress", value: "32%", icon: Target, color: "text-primary-cyan-400" },
    { label: "BPM", value: "68", icon: Heart, color: "text-primary-teal-400" },
    { label: "Load", value: "340", icon: Zap, color: "text-yellow-400" }
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* AI Coach Message - Compact and Professional */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-ui-card backdrop-blur-md rounded-xl border border-ui-border p-4 shadow-card-medium"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary-cyan-500/20 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-primary-cyan-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-semibold text-ui-text-accent">GAGE AI</span>
              <span className="px-2 py-1 bg-primary-cyan-500/20 text-primary-cyan-400 text-xs rounded-full">
                Coach
              </span>
            </div>
            <p className="text-sm text-ui-text-secondary leading-relaxed">
              Good afternoon, Bhavya! Perfect weather for training. You're 85% through Base Camp. 
              Today's focus: core stability for your golf drive improvement.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
              "bg-ui-card backdrop-blur-md rounded-lg border p-4 text-left transition-all duration-300",
              "hover:scale-105 hover:shadow-card-strong",
              action.borderColor
            )}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                action.bgColor
              )}>
                <action.icon className={cn("w-5 h-5", action.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-ui-text-primary truncate">
                  {action.label}
                </h3>
                <p className="text-xs text-ui-text-muted truncate">
                  {action.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Stats Overview - Clean and Readable */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-ui-card backdrop-blur-md rounded-xl border border-ui-border p-4 shadow-card-medium"
      >
        <h3 className="text-sm font-semibold text-ui-text-primary mb-4">Today's Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={stat.label} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-ui-highlight rounded-lg flex items-center justify-center">
                <stat.icon className={cn("w-4 h-4", stat.color)} />
              </div>
              <div>
                <div className="text-lg font-bold text-ui-text-primary">{stat.value}</div>
                <div className="text-xs text-ui-text-muted">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Journey Progress - Visual and Clean */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-ui-card backdrop-blur-md rounded-xl border border-ui-border p-4 shadow-card-medium"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-ui-text-primary">Journey Progress</h3>
          <span className="text-xs text-ui-text-muted">Base Camp</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-ui-text-secondary">Foundation Phase</span>
            <span className="text-sm font-semibold text-ui-text-accent">85%</span>
          </div>
          <div className="w-full bg-ui-border rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "85%" }}
              transition={{ duration: 1, delay: 0.6 }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-ui-text-muted">
            <span>55 points to complete</span>
            <span>Next: Camp 1</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CleanDashboard;
