import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { ChevronLeft, Send, Sparkles, User, Zap, Dumbbell, Utensils, Brain } from 'lucide-react';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import { useActivityPoints } from '@/contexts/ActivityPointsContext';

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const CoachPage: React.FC = () => {
  const navigate = useNavigate();
  const { activityPoints, getProgressPercentage } = useActivityPoints();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: `Hey there! I'm your Gage coach. How can I help you today? Want to talk about your workouts, nutrition plan, or how you're recovering?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle message submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1500);
  };

  // Handle topic selection
  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    
    let topicMessage = '';
    
    switch(topic) {
      case 'workout':
        topicMessage = "I'd like to discuss my workout plan";
        break;
      case 'nutrition':
        topicMessage = "I need help with my nutrition plan";
        break;
      case 'recovery':
        topicMessage = "How's my recovery looking today?";
        break;
      case 'goals':
        topicMessage = `Tell me about my progress towards ${activityPoints.goalName}`;
        break;
    }
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: topicMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(topicMessage);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1500);
  };

  // Generate AI response based on user input
  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('workout') || input.includes('exercise') || input.includes('training')) {
      return `Looking at your recovery score of 78% today, I think you're good for a solid workout! I've got "Full Body Strength" on your schedule, which is perfect for your ${activityPoints.goalName} goal. It focuses on rotational power development – exactly what you need right now. Want me to walk you through the exercises?`;
    }
    
    if (input.includes('nutrition') || input.includes('diet') || input.includes('food') || input.includes('eat')) {
      return `For your ${activityPoints.goalName} goal, nutrition is super important! Today I'd focus on getting enough protein (aim for about 1.6g per kg of your weight) and some good complex carbs to fuel your workout. You've been doing well with your meal timing lately. Want some specific meal ideas based on what you usually like?`;
    }
    
    if (input.includes('recovery') || input.includes('rest') || input.includes('sleep')) {
      return `Your recovery is looking pretty good today at 78%! Your sleep quality was excellent (85%) – that deep sleep between 2-4am really helped. I noticed your HRV is a bit lower than usual though. Maybe drink some extra water today and consider some light stretching this evening? That usually helps get you back to your baseline quickly.`;
    }
    
    if (input.includes('progress') || input.includes('goal') || input.includes(activityPoints.goalName.toLowerCase())) {
      const progress = getProgressPercentage();
      return `You're making awesome progress on your ${activityPoints.goalName} journey! You've got ${activityPoints.currentPoints} points out of the ${activityPoints.totalPointsRequired} needed (that's ${progress}% of the way there!). At your current pace, you'll reach your summit in about ${Math.ceil((activityPoints.totalPointsRequired - activityPoints.currentPoints) / 25)} more workouts. Keep this momentum going!`;
    }
    
    return `I'm here to help you crush your ${activityPoints.goalName} goal! We can chat about your workouts, tweak your nutrition, look at your recovery data, or check in on your overall progress. What's on your mind today?`;
  };

  // Format timestamp
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <MainLayout>
      <div className="w-full max-w-md mx-auto px-4 pt-4 pb-4 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            icon={<ChevronLeft size={16} />}
            className="text-ui-text-primary"
          >
            Back
          </Button>
          <h1 className="text-sm font-bold text-ui-text-primary">AI Coach</h1>
          <div className="w-8"></div> {/* Spacer for centering */}
        </div>
        
        {/* Chat container */}
        <GlassCard variant="default" size="lg" className="flex-1 flex flex-col overflow-hidden">
          {/* Topic selection */}
          {messages.length === 1 && !selectedTopic && (
            <div className="p-3 border-b border-ui-border">
              <h3 className="text-xs font-bold text-ui-text-primary mb-3">What would you like to discuss?</h3>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  className="bg-white/5 p-2 rounded-lg flex flex-col items-center justify-center hover:bg-primary-cyan-500/20 transition-colors"
                  onClick={() => handleTopicSelect('workout')}
                >
                  <Dumbbell size={16} className="text-primary-cyan-500 mb-1" />
                  <span className="text-xs text-ui-text-primary">Workouts</span>
                </button>
                <button 
                  className="bg-white/5 p-2 rounded-lg flex flex-col items-center justify-center hover:bg-primary-cyan-500/20 transition-colors"
                  onClick={() => handleTopicSelect('nutrition')}
                >
                  <Utensils size={16} className="text-primary-cyan-500 mb-1" />
                  <span className="text-xs text-ui-text-primary">Nutrition</span>
                </button>
                <button 
                  className="bg-white/5 p-2 rounded-lg flex flex-col items-center justify-center hover:bg-primary-cyan-500/20 transition-colors"
                  onClick={() => handleTopicSelect('recovery')}
                >
                  <Zap size={16} className="text-primary-cyan-500 mb-1" />
                  <span className="text-xs text-ui-text-primary">Recovery</span>
                </button>
                <button 
                  className="bg-white/5 p-2 rounded-lg flex flex-col items-center justify-center hover:bg-primary-cyan-500/20 transition-colors"
                  onClick={() => handleTopicSelect('goals')}
                >
                  <Brain size={16} className="text-primary-cyan-500 mb-1" />
                  <span className="text-xs text-ui-text-primary">Goals</span>
                </button>
              </div>
            </div>
          )}
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`mb-3 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-cyan-500 to-primary-teal-500 flex items-center justify-center mr-2 flex-shrink-0">
                    <Sparkles size={12} className="text-white" />
                  </div>
                )}
                
                <div 
                  className={`max-w-[75%] p-2 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-primary-cyan-500/20 text-ui-text-primary rounded-br-none' 
                      : 'bg-white/5 text-ui-text-primary rounded-tl-none'
                  }`}
                >
                  <div className="text-xs">{message.content}</div>
                  <div className="text-xs text-ui-text-muted mt-1 text-right">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
                
                {message.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center ml-2 flex-shrink-0">
                    <User size={12} className="text-ui-text-primary" />
                  </div>
                )}
              </div>
            ))}
            
            {/* AI typing indicator */}
            {isTyping && (
              <div className="mb-3 flex justify-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-cyan-500 to-primary-teal-500 flex items-center justify-center mr-2 flex-shrink-0">
                  <Sparkles size={12} className="text-white" />
                </div>
                <div className="bg-white/5 p-2 rounded-lg rounded-tl-none">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-ui-text-muted animate-bounce"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-ui-text-muted animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-ui-text-muted animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Invisible div for auto-scrolling */}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input area */}
          <div className="p-3 border-t border-ui-border">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-white/5 border border-ui-border rounded-lg px-3 py-2 text-xs text-ui-text-primary focus:outline-none focus:border-primary-cyan-500"
                placeholder="Ask your AI coach..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <motion.button
                type="submit"
                className="w-8 h-8 rounded-full bg-primary-cyan-500 flex items-center justify-center"
                whileTap={{ scale: 0.9 }}
                disabled={!inputMessage.trim() || isTyping}
              >
                <Send size={14} className="text-white" />
              </motion.button>
            </form>
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  );
};

export default CoachPage;