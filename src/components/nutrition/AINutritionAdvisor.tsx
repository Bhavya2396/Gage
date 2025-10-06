import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Sparkles } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface UserMetrics {
  workoutIntensity: 'low' | 'medium' | 'high';
  recoveryScore: number;
  upcomingWorkout: string;
}

interface AINutritionAdvisorProps {
  className?: string;
  userMetrics?: UserMetrics;
}

const AINutritionAdvisor: React.FC<AINutritionAdvisorProps> = ({ className = '', userMetrics }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: userMetrics 
        ? `Based on your ${userMetrics.recoveryScore > 70 ? 'good' : 'moderate'} recovery score of ${userMetrics.recoveryScore} and upcoming ${userMetrics.upcomingWorkout}, I recommend focusing on ${userMetrics.workoutIntensity === 'high' ? 'high protein and carb intake' : 'balanced macros'}. What questions do you have about your nutrition plan?`
        : "I've analyzed your nutrition log for today. You're doing well with protein intake, but consider adding more complex carbs to fuel your workout tomorrow. What questions do you have about your nutrition plan?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "Based on your goal to increase rotational power, I recommend adding more anti-inflammatory foods like berries and fatty fish to your diet. This will help with recovery between workouts.",
        "Looking at your macros, you could benefit from increasing your protein intake by about 15-20g per day. Try adding a protein shake after your morning workout.",
        "Your current meal timing is good, but consider having a small carb-rich snack about 30 minutes before your workout to maximize energy availability."
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: randomResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  return (
    <GlassCard size="full" className={className}>
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-full bg-gradient-to-br from-primary-cyan-500 to-primary-teal-500 mr-3">
          <Sparkles size={16} className="text-white" />
        </div>
        <h3 className="text-base sm:text-lg font-medium text-alpine-mist">AI Nutrition Advisor</h3>
      </div>
      
      <div className="h-64 sm:h-80 overflow-y-auto mb-4 pr-2">
        {messages.map(message => (
          <div 
            key={message.id}
            className={`mb-3 ${message.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
          >
            <div 
              className={`max-w-[85%] p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-primary-cyan-500/20 text-alpine-mist rounded-tr-none' 
                  : 'bg-glass-highlight text-alpine-mist rounded-tl-none'
              }`}
            >
              <p className="text-xs sm:text-sm">{message.text}</p>
              <p className="text-[10px] text-alpine-mist/60 mt-1 text-right">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start mb-3">
            <div className="bg-glass-highlight p-3 rounded-lg rounded-tl-none">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-primary-cyan-500/60 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-primary-cyan-500/60 animate-pulse delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-primary-cyan-500/60 animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center">
        <input
          type="text"
          className="flex-1 bg-glass-background border border-glass-border rounded-l-lg p-2 text-sm text-alpine-mist focus:outline-none focus:border-primary-cyan-500/50"
          placeholder="Ask about your nutrition plan..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-primary-cyan-500 p-2 rounded-r-lg"
          onClick={handleSendMessage}
        >
          <Send size={18} className="text-white" />
        </motion.button>
      </div>
    </GlassCard>
  );
};

export default AINutritionAdvisor;
