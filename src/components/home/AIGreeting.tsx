import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Sparkles, Zap, Dumbbell, Map, Award } from 'lucide-react';
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
    
    // Add journey narrative with phase-specific context
    const currentPhase = activityPoints.phases.find(p => !p.completed);
    const phaseIndex = activityPoints.phases.findIndex(p => !p.completed);
    const phaseProgress = currentPhase ? Math.round((currentPhase.points / currentPhase.totalPoints) * 100) : 100;
    
    if (!currentPhase) {
      // All phases complete
      personalizedGreeting += `Congratulations on reaching the summit of your ${activityPoints.goalName} journey! You've conquered all phases and earned ${activityPoints.currentPoints} points. What an achievement! `;
    } else if (phaseIndex === 0) {
      // Foundation Phase
      if (phaseProgress < 30) {
        personalizedGreeting += `You're at Base Camp (${phaseProgress}%) in your ${activityPoints.goalName} journey. This Foundation Phase is all about building the fundamentals with ${currentPhase.points} of ${currentPhase.totalPoints} points earned. `;
      } else if (phaseProgress < 70) {
        personalizedGreeting += `You're making great progress at Base Camp (${phaseProgress}%) on your ${activityPoints.goalName} journey. Keep building those foundations! You've earned ${currentPhase.points} of ${currentPhase.totalPoints} points in this phase. `;
      } else {
        personalizedGreeting += `You're almost ready to leave Base Camp (${phaseProgress}%)! Just ${currentPhase.totalPoints - currentPhase.points} more points to complete the Foundation Phase of your ${activityPoints.goalName} journey. `;
      }
    } else if (phaseIndex === 1) {
      // Development Phase
      if (phaseProgress < 30) {
        personalizedGreeting += `You've reached Camp 1 (${phaseProgress}%) on your climb toward ${activityPoints.goalName}! This Development Phase builds on your solid foundation. You've earned ${currentPhase.points} of ${currentPhase.totalPoints} points here. `;
      } else if (phaseProgress < 70) {
        personalizedGreeting += `You're making strong progress at Camp 1 (${phaseProgress}%) on your ${activityPoints.goalName} journey. This Development Phase is really coming along with ${currentPhase.points} of ${currentPhase.totalPoints} points earned. `;
      } else {
        personalizedGreeting += `You're preparing for the final ascent! At ${phaseProgress}% through Camp 1, you're almost ready for the summit push. Just ${currentPhase.totalPoints - currentPhase.points} more points to complete this Development Phase! `;
      }
    } else if (phaseIndex === 2) {
      // Specialization Phase
      if (phaseProgress < 30) {
        personalizedGreeting += `You've begun the final ascent (${phaseProgress}%) toward your ${activityPoints.goalName} goal! This Specialization Phase is where everything comes together. You've earned ${currentPhase.points} of ${currentPhase.totalPoints} points on this final stretch. `;
      } else if (phaseProgress < 70) {
        personalizedGreeting += `The summit is in sight! At ${phaseProgress}% through the final ascent, you're making incredible progress toward your ${activityPoints.goalName} goal. You've earned ${currentPhase.points} of ${currentPhase.totalPoints} points in this Specialization Phase. `;
      } else {
        personalizedGreeting += `You're so close to the summit! At ${phaseProgress}% through the final phase, just ${currentPhase.totalPoints - currentPhase.points} more points and you'll achieve your ${activityPoints.goalName} goal. I can almost see you at the top! `;
      }
    }
    
    // Add phase-specific daily recommendation
    const dayOfWeek = new Date().getDay();
    const phaseName = currentPhase?.name || "Maintenance";
    
    // Different recommendations based on current phase
    if (phaseName === "Foundation Phase") {
      if (dayOfWeek === 1 || dayOfWeek === 4) { // Monday or Thursday
        personalizedGreeting += `Today at Base Camp, I've scheduled a foundational strength session focusing on building your core stability - essential for your ${activityPoints.goalName} journey.`;
      } else if (dayOfWeek === 2 || dayOfWeek === 5) { // Tuesday or Friday
        personalizedGreeting += `Today's Base Camp focus: Let's work on your fundamental movement patterns to create a solid foundation for your ${activityPoints.goalName} goal.`;
      } else if (dayOfWeek === 3 || dayOfWeek === 6) { // Wednesday or Saturday
        personalizedGreeting += `Today at Base Camp we're focusing on technique fundamentals. I've mapped out key exercises to build your base skills for ${activityPoints.goalName}.`;
      } else { // Sunday
        personalizedGreeting += `Base Camp recovery day! Let's focus on mobility and light activity to ensure your foundation is solid before we climb higher.`;
      }
    } else if (phaseName === "Development Phase") {
      if (dayOfWeek === 1 || dayOfWeek === 4) { // Monday or Thursday
        personalizedGreeting += `At Camp 1 today, we're intensifying your training with progressive overload to develop the specific strength patterns needed for ${activityPoints.goalName}.`;
      } else if (dayOfWeek === 2 || dayOfWeek === 5) { // Tuesday or Friday
        personalizedGreeting += `Today at Camp 1, we're focusing on skill development and technique refinement to enhance your performance for ${activityPoints.goalName}.`;
      } else if (dayOfWeek === 3 || dayOfWeek === 6) { // Wednesday or Saturday
        personalizedGreeting += `Camp 1 training today combines strength and skill work - the perfect development combo for your ${activityPoints.goalName} journey.`;
      } else { // Sunday
        personalizedGreeting += `Strategic recovery day at Camp 1! Today's lighter session will help your body adapt to the increasing demands of your ${activityPoints.goalName} development.`;
      }
    } else if (phaseName === "Specialization Phase") {
      if (dayOfWeek === 1 || dayOfWeek === 4) { // Monday or Thursday
        personalizedGreeting += `Summit push day! Today's specialized training integrates all components needed for peak performance in your ${activityPoints.goalName} goal.`;
      } else if (dayOfWeek === 2 || dayOfWeek === 5) { // Tuesday or Friday
        personalizedGreeting += `Today's summit training: Fine-tuning your technique with specialized drills specifically designed for ${activityPoints.goalName} mastery.`;
      } else if (dayOfWeek === 3 || dayOfWeek === 6) { // Wednesday or Saturday
        personalizedGreeting += `On the final ascent today, we're focusing on performance integration - bringing together all elements of your ${activityPoints.goalName} training.`;
      } else { // Sunday
        personalizedGreeting += `Strategic recovery near the summit! Today's session focuses on precision recovery to ensure peak performance for your final push toward ${activityPoints.goalName}.`;
      }
    } else { // Maintenance or completed
      if (dayOfWeek === 1 || dayOfWeek === 4) { // Monday or Thursday
        personalizedGreeting += `Summit maintenance day! Today's session will help you maintain your hard-earned progress and continue enjoying the view from the top of ${activityPoints.goalName}.`;
      } else if (dayOfWeek === 2 || dayOfWeek === 5) { // Tuesday or Friday
        personalizedGreeting += `Today's focus: Skill refinement to keep your ${activityPoints.goalName} performance at its peak while you enjoy the summit view.`;
      } else if (dayOfWeek === 3 || dayOfWeek === 6) { // Wednesday or Saturday
        personalizedGreeting += `Summit celebration day! Let's enjoy some fun training variations that keep your ${activityPoints.goalName} skills sharp while planning your next adventure.`;
      } else { // Sunday
        personalizedGreeting += `Summit reflection day! Let's take time to appreciate your achievement and plan how to maintain your ${activityPoints.goalName} success long-term.`;
      }
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

  // Get current phase
  const currentPhase = activityPoints.getCurrentPhase?.();
  const progress = getProgressPercentage();
  
  // Quick action suggestions - enhanced with journey context
  const suggestions = [
    { 
      text: "Show me today's workout", 
      icon: <Dumbbell size={14} className="sm:size-4" />,
      action: () => navigate('/workout')
    },
    { 
      text: "View my journey map", 
      icon: <Map size={14} className="sm:size-4" />,
      action: () => navigate('/goals/progress')
    },
    { 
      text: currentPhase ? `Next milestone: ${Math.round((currentPhase.points / currentPhase.totalPoints) * 100)}%` : "Journey complete!", 
      icon: <Award size={14} className="sm:size-4" />,
      action: () => navigate('/goals/progress')
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
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary-cyan-500 to-primary-teal-500 flex items-center justify-center mr-3 sm:mr-4 mt-1 flex-shrink-0">
          <Sparkles size={14} className="sm:size-[18px] text-white" />
        </div>
          <div className="flex-1">
            <div className="bg-glass-highlight bg-opacity-80 p-3 sm:p-4 rounded-lg rounded-tl-none backdrop-blur-md shadow-lg">
              <div className="flex items-center mb-1.5 sm:mb-2">
                <span className="text-xs sm:text-sm text-primary-cyan-500 font-medium">GAGE AI</span>
                <span className="ml-2 sm:ml-3 text-[10px] sm:text-xs bg-primary-cyan-500/30 text-primary-cyan-500 font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">Coach</span>
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
                    <span className="mr-1.5 sm:mr-2 text-primary-cyan-500">{suggestion.icon}</span>
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