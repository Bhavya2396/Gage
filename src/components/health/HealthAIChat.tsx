import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, X, Sparkles, Heart, Activity, AlertTriangle, TrendingUp, Zap } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface HealthAIChatProps {
  currentMetrics: {
    recovery: number;
    strain: number;
    sleep: number;
    hrv: number;
  };
  targets?: {
    recovery: number;
    strain: number;
    sleep: number;
    hrv: number;
  };
}

const HealthAIChat: React.FC<HealthAIChatProps> = ({ currentMetrics, targets }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: `I'm your health AI coach. I can help you understand your recovery, strain, sleep patterns, and HRV data. Your recovery is at ${currentMetrics.recovery}% today. How can I help optimize your health?`,
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
    
    // Recovery-related queries
    if (lowerMessage.includes('recovery') || lowerMessage.includes('recover')) {
      if (currentMetrics.recovery >= 80) {
        return `Excellent! Your recovery is at ${currentMetrics.recovery}%, which means you're well-rested and ready for training. Consider a high-intensity workout today.`;
      } else if (currentMetrics.recovery >= 60) {
        return `Your recovery is at ${currentMetrics.recovery}%, which is good. You can handle moderate training today. Focus on proper nutrition and hydration.`;
      } else {
        return `Your recovery is at ${currentMetrics.recovery}%, which is low. I recommend light activity, extra sleep, and stress management today.`;
      }
    }
    
    // Strain-related queries
    if (lowerMessage.includes('strain') || lowerMessage.includes('training load')) {
      if (currentMetrics.strain >= 15) {
        return `Your strain is at ${currentMetrics.strain}, which is high. This is great for building fitness, but make sure to balance with recovery. Consider a lighter day tomorrow.`;
      } else if (currentMetrics.strain >= 10) {
        return `Your strain is at ${currentMetrics.strain}, which is moderate. This is a good training load that should help you progress without overreaching.`;
      } else {
        return `Your strain is at ${currentMetrics.strain}, which is low. You have room to increase your training intensity if your recovery allows.`;
      }
    }
    
    // Sleep-related queries
    if (lowerMessage.includes('sleep') || lowerMessage.includes('rest')) {
      if (currentMetrics.sleep >= 8) {
        return `Great! You got ${currentMetrics.sleep} hours of sleep, which is excellent for recovery. Your sleep quality is supporting your training goals.`;
      } else if (currentMetrics.sleep >= 7) {
        return `You got ${currentMetrics.sleep} hours of sleep, which is good. Try to aim for 8+ hours for optimal recovery and performance.`;
      } else {
        return `You only got ${currentMetrics.sleep} hours of sleep, which may impact your recovery. Prioritize sleep tonight and consider adjusting your schedule.`;
      }
    }
    
    // HRV-related queries
    if (lowerMessage.includes('hrv') || lowerMessage.includes('heart rate variability')) {
      if (currentMetrics.hrv >= 60) {
        return `Your HRV is at ${currentMetrics.hrv}ms, which is excellent! This indicates great autonomic nervous system balance and readiness for training.`;
      } else if (currentMetrics.hrv >= 40) {
        return `Your HRV is at ${currentMetrics.hrv}ms, which is good. Your nervous system is balanced, but there's room for improvement through better sleep and stress management.`;
      } else {
        return `Your HRV is at ${currentMetrics.hrv}ms, which is low. Focus on stress reduction, quality sleep, and recovery techniques to improve your autonomic balance.`;
      }
    }
    
    // Health optimization
    if (lowerMessage.includes('optimize') || lowerMessage.includes('improve') || lowerMessage.includes('better')) {
      return `Based on your current metrics, I recommend focusing on sleep quality, stress management, and proper nutrition. Your recovery and HRV could benefit from consistent sleep schedules and relaxation techniques.`;
    }
    
    // Training recommendations
    if (lowerMessage.includes('train') || lowerMessage.includes('workout') || lowerMessage.includes('exercise')) {
      if (currentMetrics.recovery >= 80) {
        return `With ${currentMetrics.recovery}% recovery, you're ready for high-intensity training. Focus on strength training or interval work today.`;
      } else if (currentMetrics.recovery >= 60) {
        return `Your recovery is moderate at ${currentMetrics.recovery}%. Consider moderate-intensity training like steady-state cardio or lighter strength work.`;
      } else {
        return `Your recovery is low at ${currentMetrics.recovery}%. I recommend light activity like walking, yoga, or gentle stretching today.`;
      }
    }
    
    // Default response
    return `I'm here to help optimize your health! I can assist with recovery analysis, training recommendations, sleep optimization, and HRV insights. What specific aspect of your health would you like to discuss?`;
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
            <Heart className="text-primary-cyan-400" size={14} />
          </div>
          <h3 className="text-xs font-bold text-white">Health AI Coach</h3>
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
          onClick={() => setInputMessage("How is my recovery today?")}
        >
          <Zap size={12} className="mx-auto mb-1" />
          Recovery
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-2 bg-white/5 rounded-lg text-xs text-white border border-white/10"
          onClick={() => setInputMessage("Should I train today?")}
        >
          <Activity size={12} className="mx-auto mb-1" />
          Training
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="p-2 bg-white/5 rounded-lg text-xs text-white border border-white/10"
          onClick={() => setInputMessage("How can I optimize my health?")}
        >
          <TrendingUp size={12} className="mx-auto mb-1" />
          Optimize
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
                placeholder="Ask about your health..."
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

export default HealthAIChat;
