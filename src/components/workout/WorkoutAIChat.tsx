import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, X, Sparkles, Dumbbell, Activity, Target, Zap } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface WorkoutAIChatProps {
  currentWorkout?: {
    name: string;
    exercises: number;
    completed: number;
    duration: number;
  };
  userMetrics?: {
    strength: number;
    endurance: number;
    flexibility: number;
  };
}

const WorkoutAIChat: React.FC<WorkoutAIChatProps> = ({ currentWorkout, userMetrics }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: `I'm your workout AI coach. I can help you with exercise form, workout planning, and training optimization. ${currentWorkout ? `You're currently doing ${currentWorkout.name} with ${currentWorkout.completed}/${currentWorkout.exercises} exercises completed.` : 'Ready to help with your training!'} How can I assist you?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Exercise form queries
    if (lowerMessage.includes('form') || lowerMessage.includes('technique')) {
      return `Great question about form! Focus on controlled movements, proper breathing, and full range of motion. For most exercises, maintain a neutral spine and engage your core. Would you like specific form tips for any particular exercise?`;
    }
    
    // Workout planning
    if (lowerMessage.includes('plan') || lowerMessage.includes('schedule') || lowerMessage.includes('routine')) {
      return `I can help you create an effective workout plan! Consider your goals (strength, endurance, flexibility), available time, and current fitness level. What are your main training objectives?`;
    }
    
    // Exercise modifications
    if (lowerMessage.includes('modify') || lowerMessage.includes('alternative') || lowerMessage.includes('substitute')) {
      return `I can suggest exercise modifications based on your needs! Whether you need easier variations, harder progressions, or equipment substitutions, I'm here to help. What exercise would you like to modify?`;
    }
    
    // Recovery and rest
    if (lowerMessage.includes('recovery') || lowerMessage.includes('rest') || lowerMessage.includes('sore')) {
      return `Recovery is crucial for progress! Focus on proper sleep, nutrition, and active recovery like stretching or light cardio. If you're feeling very sore, consider a rest day or light movement.`;
    }
    
    // Motivation and encouragement
    if (lowerMessage.includes('motivation') || lowerMessage.includes('encourage') || lowerMessage.includes('stuck')) {
      return `You're doing great! Consistency is key to fitness success. Every workout counts, even the challenging ones. Remember your goals and celebrate small victories along the way.`;
    }
    
    // Default response
    return `I'm here to help with your training! I can assist with exercise form, workout planning, modifications, and motivation. What specific aspect of your workout would you like to discuss?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <GlassCard variant="default" size="sm" className="w-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-primary-cyan-500/20 flex items-center justify-center mr-2">
            <Dumbbell className="text-primary-cyan-400" size={14} />
          </div>
          <h3 className="text-xs font-bold text-white">Workout AI Coach</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-1.5 bg-white/10 rounded-md"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <X size={14} className="text-white" /> : <MessageSquare size={14} className="text-white" />}
        </motion.button>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-2 bg-white/5 rounded-lg text-xs text-white border border-white/10"
          onClick={() => setInputMessage("Check my exercise form")}
        >
          <Target size={12} className="mx-auto mb-1" />
          Form
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-2 bg-white/5 rounded-lg text-xs text-white border border-white/10"
          onClick={() => setInputMessage("Plan my workout")}
        >
          <Activity size={12} className="mx-auto mb-1" />
          Plan
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-2 bg-white/5 rounded-lg text-xs text-white border border-white/10"
          onClick={() => setInputMessage("Motivate me")}
        >
          <Zap size={12} className="mx-auto mb-1" />
          Motivate
        </motion.button>
      </div>

      {/* Chat Interface */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 pt-3"
          >
            {/* Messages Container */}
            <div className="h-[200px] overflow-y-auto mb-3 pr-2 scrollbar-thin scrollbar-thumb-ui-border scrollbar-track-transparent">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div
                    className={`inline-block max-w-[80%] px-2 py-1 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary-cyan-500/20 text-white'
                        : 'bg-white/5 text-white'
                    }`}
                  >
                    <div className="text-xs">{message.content}</div>
                  </div>
                </div>
              ))}
              
              {/* AI Typing Indicator */}
              {isTyping && (
                <div className="mb-2 text-left">
                  <div className="inline-block max-w-[80%] px-2 py-1 rounded-lg bg-white/5 text-white">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-primary-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-primary-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 bg-primary-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex items-center">
              <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-white/5 text-white rounded-l-lg px-2 py-1.5 outline-none border border-white/20 focus:border-primary-cyan-500 text-xs"
                placeholder="Ask about your workout..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className="bg-primary-cyan-500 text-white rounded-r-lg px-2 py-1.5 disabled:opacity-50"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
              >
                <Send size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};

export default WorkoutAIChat;
