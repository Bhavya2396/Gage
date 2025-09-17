import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Sparkles, Zap, Dumbbell } from 'lucide-react';
import { useActivityPoints } from '@/contexts/ActivityPointsContext';
import { getGreeting } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { getWeatherDescription, WeatherCondition } from '@/data/mockData';

interface AIGreetingProps {
  userName: string;
  weatherCondition?: string;
  temperature?: number;
}

const AIGreeting: React.FC<AIGreetingProps> = ({
  userName,
  weatherCondition = 'sunny',
  temperature = 25
}) => {
  const navigate = useNavigate();
  const { activityPoints, getProgressPercentage, getPointsRemaining } = useActivityPoints();
  const [greeting, setGreeting] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Generate personalized greeting based on time, weather, progress, etc.
  useEffect(() => {
    const timeOfDay = getGreeting().toLowerCase();
    const progress = getProgressPercentage();
    const pointsRemaining = getPointsRemaining();
    
    // Construct personalized greeting
    let personalizedGreeting = `${getGreeting()}, ${userName}! `;
    
    // Add weather context using centralized utility
    personalizedGreeting += getWeatherDescription(weatherCondition as WeatherCondition, temperature) + ' ';
    
    // Add progress context
    if (progress < 30) {
      personalizedGreeting += `You're just getting started on your ${activityPoints.goalName} journey with ${activityPoints.currentPoints} points so far. Every workout brings you closer! `;
    } else if (progress < 70) {
      personalizedGreeting += `You're making awesome progress on your ${activityPoints.goalName} goal! You've earned ${activityPoints.currentPoints} points (${progress}% of the way there). Keep this momentum going! `;
    } else {
      personalizedGreeting += `You're so close to the summit! Just ${pointsRemaining} more points to achieve your ${activityPoints.goalName} goal. I can almost see you at the top! `;
    }
    
    // Add daily recommendation
    const dayOfWeek = new Date().getDay();
    if (dayOfWeek === 1 || dayOfWeek === 4) { // Monday or Thursday
      personalizedGreeting += `Today I've got a strength session planned for you, focusing on rotational power to help with your goal.`;
    } else if (dayOfWeek === 2 || dayOfWeek === 5) { // Tuesday or Friday
      personalizedGreeting += `Today's focus: Let's work on your flexibility and mobility to enhance your swing mechanics.`;
    } else if (dayOfWeek === 3 || dayOfWeek === 6) { // Wednesday or Saturday
      personalizedGreeting += `Today's all about practice and consistency. I've got a session that'll help reinforce your technique.`;
    } else { // Sunday
      personalizedGreeting += `It's recovery day! Let's focus on active recovery to make sure you're ready to crush next week.`;
    }
    
    setGreeting(personalizedGreeting);
    
    // Simulate typing effect
    const typingTimer = setTimeout(() => {
      setIsTyping(false);
      setShowSuggestions(true);
    }, 1500);
    
    return () => clearTimeout(typingTimer);
  }, [userName, weatherCondition, temperature, activityPoints, getProgressPercentage, getPointsRemaining]);

  // Navigate to chat page with specific topic
  const handleChatNavigation = (topic: string) => {
    navigate('/coach', { state: { initialTopic: topic } });
  };

  // Quick action suggestions
  const suggestions = [
    { 
      text: "Show me today's workout", 
      icon: <Dumbbell size={14} className="sm:size-4" />,
      action: () => navigate('/workout')
    },
    { 
      text: "How's my recovery?", 
      icon: <Sparkles size={14} className="sm:size-4" />,
      action: () => handleChatNavigation('recovery')
    },
    { 
      text: "Chat with AI Coach", 
      icon: <MessageCircle size={14} className="sm:size-4" />,
      action: () => navigate('/coach')
    }
  ];

  return (
    <div className="relative">
      <div className="flex items-start mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-cyan-primary to-teal-primary flex items-center justify-center mr-3 sm:mr-4 mt-1 flex-shrink-0">
          <Sparkles size={14} className="sm:size-[18px] text-white" />
        </div>
          <div className="flex-1">
            <div className="bg-glass-highlight bg-opacity-80 p-3 sm:p-4 rounded-lg rounded-tl-none backdrop-blur-md shadow-lg">
              <div className="flex items-center mb-1.5 sm:mb-2">
                <span className="text-xs sm:text-sm text-cyan-primary font-medium">GAGE AI</span>
                <span className="ml-2 sm:ml-3 text-[10px] sm:text-xs bg-cyan-primary/30 text-cyan-primary font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">Coach</span>
              </div>
              <p className="text-white text-sm sm:text-base leading-relaxed">
                {isTyping ? (
                  <span className="flex items-center">
                    <span className="animate-pulse">•</span>
                    <span className="animate-pulse delay-100 mx-1">•</span>
                    <span className="animate-pulse delay-200">•</span>
                  </span>
                ) : (
                  greeting
                )}
              </p>
            </div>
          
          <AnimatePresence>
            {showSuggestions && (
              <motion.div 
                className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    className="bg-glass-background bg-opacity-80 backdrop-blur-md shadow-md border border-glass-border rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white font-medium flex items-center hover:bg-glass-highlight hover:bg-opacity-90 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    onClick={suggestion.action}
                  >
                    <span className="mr-1.5 sm:mr-2 text-cyan-primary">{suggestion.icon}</span>
                    {suggestion.text}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AIGreeting;