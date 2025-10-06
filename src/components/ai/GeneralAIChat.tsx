import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, X, Sparkles, Brain, HelpCircle, Lightbulb, Target, TrendingUp, Zap, Users, Share, Heart, BarChart, Settings, User, Bell } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface GeneralAIChatProps {
  topic: 'schedule' | 'goals' | 'social' | 'insights' | 'settings';
  context?: any;
}

const GeneralAIChat: React.FC<GeneralAIChatProps> = ({ topic, context }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: getInitialMessage(topic),
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function getInitialMessage(topic: string): string {
    switch (topic) {
      case 'schedule':
        return `I'm your schedule AI assistant. I can help you plan your day, manage events, and optimize your time. How can I help organize your schedule?`;
      case 'goals':
        return `I'm your goals AI coach. I can help you set, track, and achieve your objectives. What goals would you like to work on today?`;
      case 'social':
        return `I'm your social AI assistant. I can help you connect with friends, share achievements, and build your fitness community. How can I help with your social features?`;
      case 'insights':
        return `I'm your insights AI analyst. I can help you understand your data, identify patterns, and make data-driven decisions. What insights are you looking for?`;
      case 'settings':
        return `I'm your settings AI helper. I can assist with personalization, preferences, and optimizing your app experience. What would you like to customize?`;
      default:
        return `I'm your AI assistant. I'm here to help with any questions or tasks you have. How can I assist you today?`;
    }
  }

  function getQuickActions(topic: string) {
    switch (topic) {
      case 'schedule':
        return [
          { icon: <HelpCircle size={12} />, label: 'Plan Day', message: 'Help me plan my day' },
          { icon: <Lightbulb size={12} />, label: 'Optimize', message: 'Optimize my schedule' },
          { icon: <Brain size={12} />, label: 'Suggest', message: 'Suggest time blocks' }
        ];
      case 'goals':
        return [
          { icon: <Target size={12} />, label: 'Set Goal', message: 'Help me set a new goal' },
          { icon: <TrendingUp size={12} />, label: 'Track', message: 'Track my progress' },
          { icon: <Zap size={12} />, label: 'Motivate', message: 'Motivate me' }
        ];
      case 'social':
        return [
          { icon: <Users size={12} />, label: 'Connect', message: 'Help me connect with friends' },
          { icon: <Share size={12} />, label: 'Share', message: 'Share my achievements' },
          { icon: <Heart size={12} />, label: 'Community', message: 'Build my community' }
        ];
      case 'insights':
        return [
          { icon: <BarChart size={12} />, label: 'Analyze', message: 'Analyze my data' },
          { icon: <TrendingUp size={12} />, label: 'Trends', message: 'Show me trends' },
          { icon: <Lightbulb size={12} />, label: 'Insights', message: 'Give me insights' }
        ];
      case 'settings':
        return [
          { icon: <Settings size={12} />, label: 'Customize', message: 'Customize my experience' },
          { icon: <User size={12} />, label: 'Profile', message: 'Update my profile' },
          { icon: <Bell size={12} />, label: 'Notifications', message: 'Manage notifications' }
        ];
      default:
        return [
          { icon: <HelpCircle size={12} />, label: 'Help', message: 'Help me' },
          { icon: <Lightbulb size={12} />, label: 'Tips', message: 'Give me tips' },
          { icon: <Brain size={12} />, label: 'Advice', message: 'Give me advice' }
        ];
    }
  }

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
    
    // Topic-specific responses
    switch (topic) {
      case 'schedule':
        if (lowerMessage.includes('plan') || lowerMessage.includes('schedule')) {
          return `I can help you create an effective schedule! Consider your priorities, energy levels, and available time blocks. What's your main focus for today?`;
        }
        if (lowerMessage.includes('optimize') || lowerMessage.includes('improve')) {
          return `Let's optimize your schedule! I can suggest better time management, identify inefficiencies, and help you create more productive routines.`;
        }
        break;
        
      case 'goals':
        if (lowerMessage.includes('goal') || lowerMessage.includes('objective')) {
          return `Great! Setting clear, achievable goals is key to success. I can help you break down big goals into smaller milestones and create an action plan.`;
        }
        if (lowerMessage.includes('track') || lowerMessage.includes('progress')) {
          return `Tracking progress is essential! I can help you monitor your achievements, identify patterns, and adjust your approach as needed.`;
        }
        break;
        
      case 'social':
        if (lowerMessage.includes('friend') || lowerMessage.includes('connect')) {
          return `Building connections is important! I can help you find like-minded people, share your achievements, and create meaningful relationships in your fitness journey.`;
        }
        if (lowerMessage.includes('share') || lowerMessage.includes('post')) {
          return `Sharing your progress is motivating! I can help you craft engaging posts, celebrate milestones, and inspire others in your community.`;
        }
        break;
        
      case 'insights':
        if (lowerMessage.includes('analyze') || lowerMessage.includes('data')) {
          return `I can help you analyze your data! I'll look for patterns, trends, and insights that can help you make better decisions about your health and fitness.`;
        }
        if (lowerMessage.includes('trend') || lowerMessage.includes('pattern')) {
          return `Let me analyze your trends! I can identify patterns in your behavior, performance, and progress to help you understand what's working.`;
        }
        break;
        
      case 'settings':
        if (lowerMessage.includes('customize') || lowerMessage.includes('personalize')) {
          return `I can help you personalize your experience! I can suggest settings based on your preferences, goals, and usage patterns.`;
        }
        if (lowerMessage.includes('notification') || lowerMessage.includes('alert')) {
          return `Let's optimize your notifications! I can help you set up the right alerts to stay motivated without being overwhelmed.`;
        }
        break;
    }
    
    // Default response
    return `I'm here to help with your ${topic} needs! I can provide guidance, suggestions, and support. What specific aspect would you like to discuss?`;
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

  const quickActions = getQuickActions(topic);

  return (
    <GlassCard variant="default" size="sm" className="w-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-primary-cyan-500/20 flex items-center justify-center mr-2">
            <Brain className="text-primary-cyan-400" size={14} />
          </div>
          <h3 className="text-xs font-bold text-white capitalize">{topic} AI Assistant</h3>
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
        {quickActions.map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-2 bg-white/5 rounded-lg text-xs text-white border border-white/10"
            onClick={() => setInputMessage(action.message)}
          >
            {action.icon}
            <div className="mt-1">{action.label}</div>
          </motion.button>
        ))}
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
                placeholder={`Ask about your ${topic}...`}
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

export default GeneralAIChat;
