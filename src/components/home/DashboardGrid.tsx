import React, { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { useActivityPoints } from '@/contexts/ActivityPointsContext';
import { 
  Dumbbell, 
  Utensils, 
  Heart, 
  Activity, 
  Calendar, 
  Award, 
  Zap, 
  ArrowUpRight, 
  MessageCircle, 
  Target, 
  BarChart3,
  Users,
  Settings,
  ChevronRight,
  Send
} from 'lucide-react';

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  className?: string;
  expandable?: boolean;
  route?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon,
  content,
  actions,
  size = 'md',
  onClick,
  className = '',
  expandable = false,
  route
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    if (route) {
      navigate(route);
    } else if (onClick) {
      onClick();
    }
  };
  
  const sizeClasses = {
    sm: 'col-span-1 row-span-1',
    md: 'col-span-1 row-span-2',
    lg: 'col-span-2 row-span-1',
    xl: 'col-span-2 row-span-2'
  };
  
  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <GlassCard 
        variant="default" 
        size="md" 
        className={`h-full w-full cursor-pointer overflow-hidden ${isHovered ? 'border-primary-cyan-500/50' : ''}`}
        onClick={handleClick}
      >
        <div className="flex flex-col h-full">
          {/* Card Header */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-glass-highlight mr-2">
                {icon}
              </div>
              <h3 className="text-alpine-mist font-medium">{title}</h3>
            </div>
            
            {expandable && (
              <motion.div
                animate={{ x: isHovered ? 0 : 5, opacity: isHovered ? 1 : 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={16} className="text-primary-cyan-500" />
              </motion.div>
            )}
            
            {route && (
              <motion.div
                animate={{ x: isHovered ? 0 : 5, opacity: isHovered ? 1 : 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowUpRight size={16} className="text-primary-cyan-500" />
              </motion.div>
            )}
          </div>
          
          {/* Card Content */}
          <div className="flex-1">
            {content}
          </div>
          
          {/* Card Actions */}
          {actions && (
            <div className="mt-3 pt-3 border-t border-glass-border">
              {actions}
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
};

// Chat message component for contextual AI chat
interface ChatMessageProps {
  content: string;
  sender: 'user' | 'ai';
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, sender }) => {
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          sender === 'user'
            ? 'bg-primary-cyan-500/20 text-alpine-mist'
            : 'bg-glass-highlight text-text-secondary'
        }`}
      >
        <p className="text-sm">{content}</p>
      </div>
    </div>
  );
};

// Main Dashboard Grid Component
const DashboardGrid: React.FC = () => {
  const navigate = useNavigate();
  const { activityPoints, getProgressPercentage, getPointsRemaining } = useActivityPoints();
  const [showChatInput, setShowChatInput] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessageProps[]>([
    { sender: 'ai', content: 'How can I help with your fitness journey today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [recoveryScore] = useState(78);
  
  // Handle sending a chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    // Add user message
    const newUserMessage = { sender: 'user', content: inputValue };
    setChatMessages([...chatMessages, newUserMessage as ChatMessageProps]);
    setInputValue('');
    
    // Simulate AI response
    setTimeout(() => {
      let response = '';
      const userMessage = inputValue.toLowerCase();
      
      if (userMessage.includes('workout') || userMessage.includes('exercise')) {
        response = "I've analyzed your recovery metrics and today is optimal for strength training. Would you like me to prepare your workout plan?";
      } else if (userMessage.includes('food') || userMessage.includes('meal') || userMessage.includes('nutrition')) {
        response = "Based on your activity level today, I recommend focusing on protein intake. Your meal plan is ready with 2,400 calories to support your training.";
      } else if (userMessage.includes('progress') || userMessage.includes('goal')) {
        response = `You're making excellent progress on your ${activityPoints.goalName} goal. You've earned ${activityPoints.currentPoints} points, which is ${getProgressPercentage()}% of your target.`;
      } else if (userMessage.includes('recovery') || userMessage.includes('sleep')) {
        response = "Your recovery score is 78% today, which is good. Your sleep quality was excellent with 1.5 hours of deep sleep. You're well-prepared for today's training.";
      } else {
        response = "I'm here to help you reach your fitness goals. Would you like insights on your workout plan, nutrition, recovery, or progress?";
      }
      
      setChatMessages([...chatMessages, newUserMessage as ChatMessageProps, { sender: 'ai', content: response }]);
    }, 1000);
  };
  
  // Recovery color based on score
  const getRecoveryColor = (score: number) => {
    if (score < 40) return 'text-red-500';
    if (score < 70) return 'text-amber-400';
    return 'text-primary-cyan-500';
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Today's Plan Card */}
      <div className="mb-4 px-4">
        <GlassCard variant="default" size="md" className="w-full">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-glass-highlight mr-2">
                <Calendar className="text-primary-cyan-500" size={18} />
              </div>
              <h3 className="text-alpine-mist font-medium">Today's Plan</h3>
            </div>
            <motion.div
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
              onClick={() => navigate('/calendar')}
              className="cursor-pointer"
            >
              <ArrowUpRight size={16} className="text-primary-cyan-500" />
            </motion.div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-1 h-10 bg-primary-cyan-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-alpine-mist">Morning Workout</span>
                  <span className="text-text-secondary text-sm">9:00 AM</span>
                </div>
                <span className="text-text-secondary text-sm">Full Body Strength · 45 min</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-1 h-10 bg-primary-teal-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-alpine-mist">Lunch</span>
                  <span className="text-text-secondary text-sm">12:30 PM</span>
                </div>
                <span className="text-text-secondary text-sm">Protein-rich · 650 kcal</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-1 h-10 bg-primary-cyan-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-alpine-mist">Evening Session</span>
                  <span className="text-text-secondary text-sm">6:00 PM</span>
                </div>
                <span className="text-text-secondary text-sm">Golf Practice · 60 min</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
      
      {/* Quick Actions Card */}
      <div className="mb-4 px-4">
        <GlassCard variant="default" size="md" className="w-full">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-glass-highlight mr-2">
                <Zap className="text-primary-cyan-500" size={18} />
              </div>
              <h3 className="text-alpine-mist font-medium">Quick Actions</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="glass" 
              size="md"
              className="flex flex-col items-center justify-center h-20 transition-all hover:bg-glass-highlight"
              onClick={() => navigate('/workout')}
            >
              <Dumbbell className="text-primary-cyan-500 mb-2" size={24} />
              <span className="text-alpine-mist text-sm">Start Workout</span>
            </Button>
            
            <Button 
              variant="glass" 
              size="md"
              className="flex flex-col items-center justify-center h-20 transition-all hover:bg-glass-highlight"
              onClick={() => navigate('/food')}
            >
              <Utensils className="text-primary-teal-500 mb-2" size={24} />
              <span className="text-alpine-mist text-sm">Log Meal</span>
            </Button>
            
            <Button 
              variant="glass" 
              size="md"
              className="flex flex-col items-center justify-center h-20 transition-all hover:bg-glass-highlight"
              onClick={() => navigate('/friends')}
            >
              <Users className="text-primary-cyan-500 mb-2" size={24} />
              <span className="text-alpine-mist text-sm">Friends</span>
            </Button>
            
            <Button 
              variant="glass" 
              size="md"
              className="flex flex-col items-center justify-center h-20 transition-all hover:bg-glass-highlight"
              onClick={() => navigate('/health/trends')}
            >
              <BarChart3 className="text-primary-teal-500 mb-2" size={24} />
              <span className="text-alpine-mist text-sm">Stats</span>
            </Button>
          </div>
        </GlassCard>
      </div>
      
      {/* Bottom Row Cards */}
      <div className="grid grid-cols-2 gap-4 px-4 mb-4">
        {/* Activity Load Card */}
        <GlassCard variant="default" size="md" className="w-full" onClick={() => navigate('/health')}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-glass-highlight mr-2">
                <Activity className="text-primary-cyan-500" size={18} />
              </div>
              <h3 className="text-alpine-mist font-medium">Activity Load</h3>
            </div>
            <ArrowUpRight size={16} className="text-primary-cyan-500" />
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-alpine-mist">340</div>
            <div className="text-xs text-text-secondary mt-1">Daily Target: 400</div>
            <div className="w-full bg-glass-border h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 h-full rounded-full" 
                style={{ width: '85%' }}
              />
            </div>
          </div>
        </GlassCard>
        
        {/* Recovery Score Card */}
        <GlassCard variant="default" size="md" className="w-full" onClick={() => navigate('/health')}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-glass-highlight mr-2">
                <Heart className="text-primary-cyan-500" size={18} />
              </div>
              <h3 className="text-alpine-mist font-medium">Recovery</h3>
            </div>
            <ArrowUpRight size={16} className="text-primary-cyan-500" />
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              <svg width="60" height="60" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.1)" 
                  strokeWidth="8" 
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  strokeDasharray={`${recoveryScore * 2.83} 283`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  className={getRecoveryColor(recoveryScore)}
                />
              </svg>
              <span className={`absolute text-xl font-bold ${getRecoveryColor(recoveryScore)}`}>
                {recoveryScore}
              </span>
            </div>
            <span className="text-xs text-text-secondary mt-2">Good Recovery</span>
          </div>
        </GlassCard>
      </div>
      
      {/* Daily Briefing Card - Contextual AI Chat */}
      <div className="mb-4 px-4">
        <GlassCard variant="default" size="md" className="w-full" onClick={() => setShowChatInput(!showChatInput)}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-glass-highlight mr-2">
                <MessageCircle className="text-primary-cyan-500" size={18} />
              </div>
              <h3 className="text-alpine-mist font-medium">Daily Briefing</h3>
            </div>
            <ChevronRight size={16} className="text-primary-cyan-500" />
          </div>
          
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto mb-2 space-y-2 max-h-32">
              {chatMessages.slice(-2).map((msg, index) => (
                <ChatMessage key={index} content={msg.content} sender={msg.sender} />
              ))}
            </div>
            
            <AnimatePresence>
              {showChatInput && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleSendMessage}
                  className="flex items-center space-x-2 mt-2"
                >
                  <input
                    type="text"
                    className="flex-1 p-2 bg-glass-highlight border border-glass-border rounded-lg text-alpine-mist text-sm"
                    placeholder="Ask your coach..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    autoFocus
                  />
                  <motion.button
                    type="submit"
                    className="w-8 h-8 rounded-full bg-primary-cyan-500/20 flex items-center justify-center"
                    whileTap={{ scale: 0.9 }}
                    disabled={!inputValue.trim()}
                  >
                    <Send size={14} className="text-primary-cyan-500" />
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
            
            <div className="mt-3 pt-3 border-t border-glass-border">
              <Button
                variant="ghost"
                size="sm"
                className="w-full flex items-center justify-center text-primary-cyan-500"
                onClick={() => navigate('/coach')}
              >
                <span>Full Conversation</span>
                <ArrowUpRight size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
      
      {/* Goal Progress Card */}
      <div className="mb-24 px-4">
        <GlassCard variant="default" size="md" className="w-full" onClick={() => navigate('/health/trends')}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-glass-highlight mr-2">
                <Target className="text-primary-cyan-500" size={18} />
              </div>
              <h3 className="text-alpine-mist font-medium">Goal Progress</h3>
            </div>
            <ArrowUpRight size={16} className="text-primary-cyan-500" />
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-alpine-mist">{activityPoints.goalName}</span>
              <span className="text-xs bg-primary-cyan-500/20 text-primary-cyan-500 px-2 py-1 rounded-full">
                {getPointsRemaining()} points left
              </span>
            </div>
            
            <div className="w-full bg-glass-border h-2 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 h-full rounded-full" 
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-text-secondary mb-4">
              <span>{activityPoints.currentPoints} points</span>
              <span>{getProgressPercentage()}% complete</span>
            </div>
            
            <div className="space-y-3">
              {activityPoints.phases.map((phase, index) => (
                <div key={index} className="w-full">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-alpine-mist">{phase.name}</span>
                    <span className="text-text-secondary">
                      {phase.points}/{phase.totalPoints} points
                    </span>
                  </div>
                  <div className="w-full bg-glass-border h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 h-full rounded-full" 
                      style={{ width: `${(phase.points / phase.totalPoints) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default DashboardGrid;