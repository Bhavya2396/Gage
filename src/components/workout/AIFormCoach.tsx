import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Send, X, Sparkles } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface AIFormCoachProps {
  exerciseName: string;
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIFormCoach: React.FC<AIFormCoachProps> = ({ 
  exerciseName,
  isOpen = true,
  onClose,
  className = ''
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `I'll analyze your ${exerciseName} form. Activate the camera when you're ready.`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  
  const activateCamera = () => {
    setCameraActive(true);
    
    // Simulate camera activation and analysis
    setTimeout(() => {
      setAnalyzing(true);
      
      setTimeout(() => {
        setAnalyzing(false);
        
        // Add AI feedback
        const feedbackOptions = [
          `Your ${exerciseName} form looks good! Keep your core engaged throughout the movement for maximum stability.`,
          `I notice you're leaning slightly forward during the ${exerciseName}. Try keeping your chest up and shoulders back.`,
          `Great depth on your ${exerciseName}! For even better results, focus on controlling the eccentric (lowering) phase of the movement.`
        ];
        
        const randomFeedback = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
        
        const aiMessage: Message = {
          id: Date.now().toString(),
          text: randomFeedback,
          sender: 'ai',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
      }, 2000);
    }, 1500);
  };
  
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
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        `For ${exerciseName}, focus on maintaining proper alignment through the entire range of motion. This will maximize effectiveness and reduce injury risk.`,
        `I recommend slowing down the eccentric phase of the ${exerciseName} to increase time under tension and improve muscle development.`,
        `Your question about ${exerciseName} is great! Try to keep your movements controlled and deliberate rather than using momentum.`
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: randomResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1500);
  };
  
  if (!isOpen) return null;
  
  return (
    <GlassCard size="full" className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 rounded-full bg-gradient-to-br from-cyan-primary to-teal-primary mr-3">
            <Sparkles size={16} className="text-white" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-alpine-mist">AI Form Coach</h3>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-1.5 bg-glass-highlight rounded-lg"
          onClick={onClose}
        >
          <X size={16} className="text-alpine-mist" />
        </motion.button>
      </div>
      
      {/* Camera View (Simulated) */}
      {cameraActive && (
        <div className="relative w-full h-48 bg-black/20 rounded-lg mb-4 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {analyzing ? (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-2 border-t-transparent border-cyan-primary rounded-full animate-spin mb-2"></div>
                <p className="text-xs text-alpine-mist">Analyzing form...</p>
              </div>
            ) : (
              <p className="text-sm text-alpine-mist">Camera active</p>
            )}
          </div>
        </div>
      )}
      
      {/* Chat Messages */}
      <div className="h-48 overflow-y-auto mb-4 pr-2">
        {messages.map(message => (
          <div 
            key={message.id}
            className={`mb-3 ${message.sender === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
          >
            <div 
              className={`max-w-[85%] p-2.5 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-cyan-primary/20 text-alpine-mist rounded-tr-none' 
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
      </div>
      
      {/* Input Area */}
      <div className="flex items-center">
        {!cameraActive && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-cyan-primary p-2 rounded-l-lg"
            onClick={activateCamera}
          >
            <Camera size={18} className="text-white" />
          </motion.button>
        )}
        
        <input
          type="text"
          className={`flex-1 bg-glass-background border border-glass-border ${!cameraActive ? 'rounded-none' : 'rounded-l-lg'} p-2 text-xs sm:text-sm text-alpine-mist focus:outline-none focus:border-cyan-primary/50`}
          placeholder="Ask about your form..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-cyan-primary p-2 rounded-r-lg"
          onClick={handleSendMessage}
        >
          <Send size={18} className="text-white" />
        </motion.button>
      </div>
    </GlassCard>
  );
};

export default AIFormCoach;