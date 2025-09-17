import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Minimize2, Maximize2, Bot, User, Loader2 } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AiChatbotProps {
  initialContext?: string;
  onClose?: () => void;
}

const AiChatbot: React.FC<AiChatbotProps> = ({ initialContext = 'fitness', onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial welcome message
  useEffect(() => {
    const welcomeMessages = {
      'fitness': "Hi, I'm your Gage AI coach. I can help you optimize your workouts, adjust your nutrition plan, or provide insights about your progress. What would you like help with today?",
      'nutrition': "Hi, I'm your Gage nutrition assistant. I can help you with meal planning, calorie adjustments, or nutritional insights based on your goals. How can I assist you?",
      'recovery': "Hi, I'm your Gage recovery specialist. I can help you optimize rest days, suggest recovery techniques, or analyze your sleep patterns. What would you like to know?"
    };

    const welcomeMessage = welcomeMessages[initialContext as keyof typeof welcomeMessages] || welcomeMessages.fitness;
    
    setMessages([
      {
        id: '1',
        content: welcomeMessage,
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
  }, [initialContext]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response with typing delay
    setTimeout(() => {
      generateAiResponse(inputValue);
    }, 1000 + Math.random() * 2000);
  };

  const generateAiResponse = (userInput: string) => {
    // In a real app, this would call an AI API
    const responses = [
      "Based on your recent activity data, I'd recommend reducing your training intensity for the next 2-3 days. Your recovery metrics suggest you need more time to adapt.",
      "Your nutrition plan looks good, but you might want to increase protein intake by about 20g per day to support your current training volume.",
      "I've analyzed your sleep patterns and noticed you're consistently getting less deep sleep than optimal. Try reducing screen time 1 hour before bed.",
      "Looking at your workout history, you've been making steady progress on your strength goals. Your squat has improved by 15% over the past month.",
      "Based on your heart rate variability trends, today would be ideal for a high-intensity workout. Your body is showing good recovery.",
      "I've adjusted your calorie target to 2,450 calories today based on yesterday's activity level and your current goals.",
      "Your hydration levels have been consistently low. I recommend increasing water intake by at least 500ml daily, especially before workouts.",
      "The data shows your endurance has improved significantly. You're now able to maintain your target heart rate for 15% longer than last month.",
      "For your goals, I'd recommend focusing more on compound movements like squats, deadlifts, and pull-ups rather than isolation exercises.",
      "Based on your performance metrics, you might benefit from adding an extra rest day this week. Your nervous system fatigue markers are elevated."
    ];

    // Simple keyword matching for demo purposes
    let responseIndex = Math.floor(Math.random() * responses.length);
    
    if (userInput.toLowerCase().includes('workout')) {
      responseIndex = 3;
    } else if (userInput.toLowerCase().includes('nutrition') || userInput.toLowerCase().includes('diet') || userInput.toLowerCase().includes('food')) {
      responseIndex = 1;
    } else if (userInput.toLowerCase().includes('sleep') || userInput.toLowerCase().includes('recovery')) {
      responseIndex = 2;
    }

    const aiMessage: Message = {
      id: Date.now().toString(),
      content: responses[responseIndex],
      sender: 'ai',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const minimizeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(true);
  };

  const maximizeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(false);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <motion.button
          className="fixed bottom-36 right-6 z-50 w-14 h-14 rounded-full bg-cyan-primary text-white shadow-lg flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleChat}
        >
          <Bot size={24} />
        </motion.button>
      )}

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '70vh',
              width: isMinimized ? 'auto' : '90vw',
              maxWidth: isMinimized ? 'none' : '400px'
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                          className={cn(
                "fixed right-6 z-50 overflow-hidden",
                isMinimized ? "bottom-36 rounded-full" : "bottom-36 rounded-xl"
              )}
          >
            <GlassCard 
              variant="default" 
              className={cn(
                "w-full h-full flex flex-col p-0 backdrop-blur-lg border border-glass-highlight",
                isMinimized ? "p-0" : ""
              )}
            >
              {/* Chat header */}
              <div 
                className="flex items-center justify-between p-3 border-b border-glass-border bg-glass-highlight cursor-pointer"
                onClick={isMinimized ? maximizeChat : undefined}
              >
                <div className="flex items-center">
                  <Bot className="text-cyan-primary mr-2" size={20} />
                  <h3 className="text-alpine-mist font-medium">Gage AI Coach</h3>
                </div>
                <div className="flex items-center space-x-2">
                  {isMinimized ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-auto" 
                      onClick={maximizeChat}
                      icon={<Maximize2 size={16} />}
                    />
                  ) : (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 h-auto" 
                        onClick={minimizeChat}
                        icon={<Minimize2 size={16} />}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 h-auto" 
                        onClick={handleClose}
                        icon={<X size={16} />}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Chat messages */}
              {!isMinimized && (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={cn(
                          "flex",
                          message.sender === 'user' ? "justify-end" : "justify-start"
                        )}
                      >
                        <div 
                          className={cn(
                            "max-w-[80%] rounded-xl p-3",
                            message.sender === 'user' 
                              ? "bg-cyan-primary text-white rounded-tr-none" 
                              : "bg-glass-background backdrop-blur-md border border-glass-border text-alpine-mist rounded-tl-none"
                          )}
                        >
                          <div className="flex items-center mb-1">
                            {message.sender === 'ai' ? (
                              <Bot size={14} className="mr-1" />
                            ) : (
                              <User size={14} className="mr-1" />
                            )}
                            <span className="text-xs opacity-70">
                              {message.sender === 'ai' ? 'Gage AI' : 'You'} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-xl p-3 bg-glass-background backdrop-blur-md border border-glass-border text-alpine-mist rounded-tl-none">
                          <div className="flex items-center">
                            <Bot size={14} className="mr-1" />
                            <span className="text-xs opacity-70">Gage AI</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Loader2 className="animate-spin mr-2" size={14} />
                            <span className="text-sm">Typing...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Chat input */}
                  <div className="p-3 border-t border-glass-border">
                    <div className="flex items-center">
                      <input
                        ref={inputRef}
                        type="text"
                        placeholder="Ask me anything about your fitness journey..."
                        className="flex-1 bg-glass-background backdrop-blur-md border border-glass-border rounded-l-lg p-2 text-alpine-mist focus:outline-none focus:ring-1 focus:ring-cyan-primary"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                      <Button
                        variant="primary"
                        className="rounded-l-none"
                        onClick={handleSend}
                        disabled={inputValue.trim() === '' || isTyping}
                        icon={<Send size={16} />}
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiChatbot;
