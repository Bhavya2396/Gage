import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, X, Sparkles, User, Bot } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: `Hi! I'm your AI nutrition coach. I can help you with meal planning, nutrition advice, and tracking your daily targets. You're currently at ${currentTotals.calories}/${targets.calories} calories for today. How can I help?`,
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
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Calorie-related queries
    if (lowerMessage.includes('calorie') || lowerMessage.includes('calories')) {
      const remaining = targets.calories - currentTotals.calories;
      if (remaining > 0) {
        return `You have ${remaining} calories left for today. I'd recommend focusing on nutrient-dense foods like lean proteins, vegetables, and whole grains to meet your remaining target.`;
      } else if (remaining < 0) {
        return `You've exceeded your calorie target by ${Math.abs(remaining)} calories. Consider lighter options for your remaining meals or add some extra activity to your day.`;
      } else {
        return `Perfect! You've hit your calorie target exactly. Great job on your nutrition tracking today!`;
      }
    }
    
    // Protein-related queries
    if (lowerMessage.includes('protein')) {
      const proteinRemaining = targets.protein - currentTotals.protein;
      if (proteinRemaining > 0) {
        return `You need ${proteinRemaining}g more protein today. Great sources include chicken breast, Greek yogurt, eggs, or plant-based options like tofu and legumes.`;
      } else {
        return `Excellent! You've met your protein target. This will help with muscle recovery and satiety.`;
      }
    }
    
    // Meal suggestions
    if (lowerMessage.includes('meal') || lowerMessage.includes('suggest') || lowerMessage.includes('recommend')) {
      const remaining = targets.calories - currentTotals.calories;
      if (remaining > 300) {
        return `For your remaining ${remaining} calories, I suggest a balanced meal with lean protein (chicken/fish), complex carbs (quinoa/brown rice), and vegetables. This will help you meet your macro targets.`;
      } else if (remaining > 100) {
        return `With ${remaining} calories left, consider a light snack like Greek yogurt with berries or a small handful of nuts to round out your day.`;
      } else {
        return `You're very close to your calorie target. A small piece of fruit or some vegetables would be perfect to finish your day.`;
      }
    }
    
    // General nutrition advice
    if (lowerMessage.includes('healthy') || lowerMessage.includes('nutrition')) {
      return `Focus on whole foods, stay hydrated, and aim for a variety of colors in your meals. Your current macro balance looks good - keep up the great work!`;
    }
    
    // Default response
    return `I'm here to help with your nutrition goals! I can assist with meal planning, macro tracking, and healthy eating advice. What specific question do you have about your nutrition today?`;
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
    <>
      {/* Chat Toggle Button */}
      <motion.button
        className="fixed bottom-6 right-6 z-20 p-3 rounded-full bg-primary-cyan-500 text-white shadow-lg shadow-cyan-primary/20"
        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 204, 255, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={18} /> : <MessageSquare size={18} />}
      </motion.button>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-6 w-[90%] max-w-sm z-20"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <GlassCard variant="default" size="lg" className="w-full backdrop-blur-lg border border-glass-highlight overflow-hidden">
              {/* Chat Header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-ui-border">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary-cyan-500/20 flex items-center justify-center mr-2">
                    <Sparkles className="text-primary-cyan-400" size={12} />
                  </div>
                  <h3 className="text-xs font-bold text-white">Nutrition AI</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/60"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={14} />
                </Button>
              </div>

              {/* Messages Container */}
              <div className="h-[300px] overflow-y-auto mb-3 pr-2 scrollbar-thin scrollbar-thumb-ui-border scrollbar-track-transparent">
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
                    <div className="text-xs text-white/60 mt-1">
                      {formatTime(message.timestamp)}
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
                  className="flex-1 bg-white/5 text-white rounded-l-lg px-2 py-1.5 outline-none border border-ui-border focus:border-primary-cyan-500 text-xs"
                  placeholder="Ask about your nutrition..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  className="bg-primary-cyan-500 text-white rounded-r-lg px-2 py-1.5 disabled:opacity-50"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                >
                  <Send size={14} />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MealAIChat;
