import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, X, Sparkles, User, Bot, ChefHat, AlertTriangle, RefreshCw } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface MealAIChatProps {
  currentTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  targets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const MealAIChat: React.FC<MealAIChatProps> = ({ currentTotals, targets }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: `I can help you understand your meals, suggest replacements, or adjust your plan if you've deviated. What would you like to know about your nutrition today?`,
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
    
    // Meal understanding queries
    if (lowerMessage.includes('what') && (lowerMessage.includes('eat') || lowerMessage.includes('meal'))) {
      return `Based on your current intake, you've had a good balance today. Your meals are providing solid nutrition. Would you like me to analyze any specific meal or suggest improvements?`;
    }
    
    // Deviation from plan
    if (lowerMessage.includes('deviate') || lowerMessage.includes('off track') || lowerMessage.includes('cheat')) {
      const remaining = targets.calories - currentTotals.calories;
      if (remaining < 0) {
        return `I see you've gone over your calorie target by ${Math.abs(remaining)} calories. Don't worry! We can adjust your remaining meals to lighter options or add some extra activity. What would you prefer?`;
      } else {
        return `You're still on track with your plan. You have ${remaining} calories remaining. Would you like me to suggest some healthy options for your next meal?`;
      }
    }
    
    // Meal replacements
    if (lowerMessage.includes('replace') || lowerMessage.includes('substitute') || lowerMessage.includes('alternative')) {
      return `I can help you find healthier alternatives! What specific food or meal would you like to replace? I can suggest options that fit your remaining calorie and macro targets.`;
    }
    
    // Ingredient substitutions
    if (lowerMessage.includes('ingredient') || lowerMessage.includes('swap')) {
      return `I can suggest ingredient swaps to make your meals healthier or fit your dietary preferences. What ingredient would you like to replace?`;
    }
    
    // Meal analysis
    if (lowerMessage.includes('analyze') || lowerMessage.includes('breakdown')) {
      return `Let me analyze your current nutrition: You're at ${Math.round((currentTotals.calories/targets.calories)*100)}% of your calorie target. Your macro balance looks good. Would you like specific recommendations for your remaining meals?`;
    }
    
    // Default response
    return `I'm here to help you understand your meals, suggest replacements, or adjust your plan. What specific aspect of your nutrition would you like to discuss?`;
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

    // Simulate AI thinking time
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <GlassCard variant="default" size="sm" className="w-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-primary-cyan-500/20 flex items-center justify-center mr-2">
            <ChefHat className="text-primary-cyan-400" size={14} />
          </div>
          <h3 className="text-xs font-bold text-white">Meal AI Assistant</h3>
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
          onClick={() => setInputMessage("What should I eat next?")}
        >
          <ChefHat size={12} className="mx-auto mb-1" />
          Next Meal
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-2 bg-white/5 rounded-lg text-xs text-white border border-white/10"
          onClick={() => setInputMessage("I deviated from my plan")}
        >
          <AlertTriangle size={12} className="mx-auto mb-1" />
          Off Track
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-2 bg-white/5 rounded-lg text-xs text-white border border-white/10"
          onClick={() => setInputMessage("Suggest a replacement")}
        >
          <RefreshCw size={12} className="mx-auto mb-1" />
          Replace
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
                placeholder="Ask about your meals..."
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

export default MealAIChat;
