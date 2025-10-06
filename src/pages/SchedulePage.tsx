import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
// Timeline visualizer removed as requested
import MonthCalendar from '@/components/schedule/MonthCalendar';
import EventForm from '@/components/schedule/EventForm';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, Send, Trash2, Edit, 
  Dumbbell, Utensils, Activity, Zap, Clock, MoreHorizontal, 
  X, Check, MessageSquare, Plus, ArrowLeft, Sparkles, Calendar
} from 'lucide-react';

// Sample schedule data (in a real app, this would come from an API)
const initialScheduleData = [
  {
    id: '1',
    title: 'Morning Workout',
    type: 'workout',
    time: '9:00 AM',
    duration: 45,
    details: 'Full Body Strength',
    color: 'cyan-primary',
    date: new Date()
  },
  {
    id: '2',
    title: 'Lunch',
    type: 'nutrition',
    time: '12:30 PM',
    duration: 30,
    details: 'Protein-rich · 650 kcal',
    color: 'teal-primary',
    date: new Date()
  },
  {
    id: '3',
    title: 'Evening Walk',
    type: 'workout',
    time: '6:00 PM',
    duration: 30,
    details: 'Recovery · Low intensity',
    color: 'cyan-primary',
    date: new Date()
  },
  {
    id: '4',
    title: 'Dinner',
    type: 'nutrition',
    time: '7:30 PM',
    duration: 30,
    details: 'Balanced · 550 kcal',
    color: 'teal-primary',
    date: new Date()
  },
  {
    id: '5',
    title: 'Sleep',
    type: 'recovery',
    time: '10:30 PM',
    duration: 480, // 8 hours in minutes
    details: 'Target: 8 hours',
    color: 'teal-secondary',
    date: new Date()
  },
  {
    id: '6',
    title: 'Team Meeting',
    type: 'other',
    time: '2:00 PM',
    duration: 60,
    details: 'Weekly sync',
    color: 'cyan-primary',
    date: new Date(new Date().setDate(new Date().getDate() + 1))
  },
  {
    id: '7',
    title: 'Yoga Session',
    type: 'workout',
    time: '8:00 AM',
    duration: 60,
    details: 'Flexibility focus',
    color: 'cyan-primary',
    date: new Date(new Date().setDate(new Date().getDate() + 2))
  }
];

// AI responses for different queries
const aiResponses = {
  default: "Hi there! I'm your Gage AI assistant. How can I help with your schedule today?",
  workout: "Your morning workout is designed to target all major muscle groups with a focus on strength building. It includes 4 sets of compound exercises with progressive overload based on your previous performance. Would you like me to adjust the intensity or focus?",
  nutrition: "I've planned your meals based on your macronutrient targets of 40% protein, 30% carbs, and 30% fat. Your lunch has extra protein to support recovery from your morning workout. Would you like to see alternatives or adjust your meal plan?",
  sleep: "Your sleep schedule is optimized for your circadian rhythm. Based on your recent HRV data, I recommend getting to bed by 10:30 PM to ensure optimal recovery. Would you like me to adjust your wind-down routine?",
  reschedule: "I can help you reschedule. Based on your calendar and recovery metrics, the best alternative time for your workout would be tomorrow at 7:30 AM or this evening at 5:00 PM. Which would you prefer?",
  intensity: "I've analyzed your recent training load and recovery metrics. Your body is showing good recovery signs, so we can increase intensity by 5-10% today. Would you like me to update your workout plan?"
};

// Message interface
interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const SchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [showEditEventForm, setShowEditEventForm] = useState(false);
  const [scheduleData, setScheduleData] = useState(initialScheduleData);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: aiResponses.default,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  // Calendar is the only view mode now
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle date navigation
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking and responding
    setTimeout(() => {
      let responseText = aiResponses.default;

      // Simple keyword matching for demo purposes
      const lowercaseInput = inputValue.toLowerCase();
      if (lowercaseInput.includes('workout') || lowercaseInput.includes('exercise')) {
        responseText = aiResponses.workout;
      } else if (lowercaseInput.includes('food') || lowercaseInput.includes('meal') || lowercaseInput.includes('eat')) {
        responseText = aiResponses.nutrition;
      } else if (lowercaseInput.includes('sleep') || lowercaseInput.includes('rest')) {
        responseText = aiResponses.sleep;
      } else if (lowercaseInput.includes('reschedule') || lowercaseInput.includes('change time')) {
        responseText = aiResponses.reschedule;
      } else if (lowercaseInput.includes('intensity') || lowercaseInput.includes('harder')) {
        responseText = aiResponses.intensity;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Handle key press in input field
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Get icon based on event type
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return <Dumbbell size={16} />;
      case 'nutrition':
        return <Utensils size={16} />;
      case 'recovery':
        return <Activity size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  // Get events for the current date
  const getCurrentDateEvents = () => {
    return scheduleData.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === currentDate.getDate() &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  // Handle saving a new event
  const handleSaveEvent = (event: any) => {
    // Add the current date to the event
    const eventWithDate = {
      ...event,
      date: currentDate
    };
    
    // Check if this is an edit or a new event
    if (scheduleData.some(e => e.id === event.id)) {
      // Update existing event
      setScheduleData(prev => 
        prev.map(e => e.id === event.id ? eventWithDate : e)
      );
    } else {
      // Add new event
      setScheduleData(prev => [...prev, eventWithDate]);
    }
    
    setShowAddEventForm(false);
    setShowEditEventForm(false);
  };

  // Handle deleting an event
  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setScheduleData(prev => prev.filter(e => e.id !== selectedEvent.id));
      setSelectedEvent(null);
      setShowEditEventForm(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <MainLayout>
      <div className="w-full max-w-md mx-auto px-4 pt-6 pb-24">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            icon={<ArrowLeft size={16} />}
            className="text-white"
          >
            Back
          </Button>
          <h1 className="text-sm font-bold text-white">Schedule</h1>
          <div className="w-8"></div> {/* Empty div for balance */}
        </div>

        {/* Date Navigation */}
        <motion.div 
          className="flex items-center justify-between mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigateDate('prev')}
            className="text-white"
          >
            <ChevronLeft size={16} />
          </Button>
          <div className="flex items-center bg-white/5 px-3 py-1.5 rounded-lg">
            <CalendarIcon className="text-primary-cyan-400 mr-2" size={14} />
            <h2 className="text-sm font-bold text-white">{formatDate(currentDate)}</h2>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigateDate('next')}
            className="text-white"
          >
            <ChevronRight size={16} />
          </Button>
        </motion.div>

        {/* Calendar View Title */}
        <motion.div 
          className="flex justify-center mb-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white/5 rounded-lg p-2 px-3 flex items-center">
            <Calendar size={14} className="mr-2 text-primary-cyan-400" />
            <span className="text-xs font-bold text-white">Calendar View</span>
          </div>
        </motion.div>

        {/* Calendar View */}
        <motion.div 
          key="calendar"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <MonthCalendar 
            selectedDate={currentDate}
            onDateSelect={setCurrentDate}
            events={scheduleData}
          />
          
          {/* Events list for selected day in calendar view */}
          <div className="mt-3">
            <h3 className="text-xs font-bold text-white mb-2">Events</h3>
            {getCurrentDateEvents().length === 0 ? (
              <div className="text-center py-4 text-white/50">
                <Calendar size={16} className="mx-auto mb-2 opacity-50" />
                <p className="text-xs">No events scheduled for this day</p>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-1"
              >
                {getCurrentDateEvents().map((event) => (
                  <motion.div
                    key={event.id}
                    variants={itemVariants}
                    className={`p-2 rounded-lg border-l-2 border-${event.color} bg-white/5 cursor-pointer hover:bg-white/10 transition-colors duration-200`}
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowEditEventForm(true);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`p-1 rounded-full text-${event.color} mr-2`}>
                          {getEventIcon(event.type)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white">{event.title}</h4>
                          <div className="flex items-center text-xs text-white/60">
                            <Clock size={10} className="mr-1" />
                            <span>{event.time} · {event.duration >= 60 
                              ? `${Math.floor(event.duration / 60)}h ${event.duration % 60 > 0 ? `${event.duration % 60}m` : ''}`
                              : `${event.duration}m`}</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-1 text-white/50 hover:text-white">
                        <MoreHorizontal size={12} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
        
        {/* Quick Summary */}
        <motion.div 
          className="mb-4 bg-white/5 p-2 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-bold text-white">Summary</h3>
            <span className="text-xs text-white/60">{getCurrentDateEvents().length} events today</span>
          </div>
          
          <div className="flex justify-between items-center">
            {/* Event type counts */}
            <div className="flex space-x-2">
              <div className="flex items-center">
                <Dumbbell size={12} className="text-primary-cyan-400 mr-1" />
                <span className="text-xs text-white">
                  {getCurrentDateEvents().filter(e => e.type === 'workout').length}
                </span>
              </div>
              <div className="flex items-center">
                <Utensils size={12} className="text-primary-teal-400 mr-1" />
                <span className="text-xs text-white">
                  {getCurrentDateEvents().filter(e => e.type === 'nutrition').length}
                </span>
              </div>
              <div className="flex items-center">
                <Activity size={12} className="text-primary-teal-400 mr-1" />
                <span className="text-xs text-white">
                  {getCurrentDateEvents().filter(e => e.type === 'recovery').length}
                </span>
              </div>
            </div>
            
            {/* Next event */}
            {getCurrentDateEvents().length > 0 && (
              <div className="flex items-center">
                <Clock size={12} className="text-white/60 mr-1" />
                <span className="text-xs text-white/60">
                  Next: {getCurrentDateEvents()[0]?.time}
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Add New Event Button */}
        <motion.div 
          className="flex justify-center mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="border-primary-cyan-500 text-primary-cyan-400"
            icon={<Plus size={14} />}
            onClick={() => setShowAddEventForm(true)}
          >
            Add Event
          </Button>
        </motion.div>

        {/* AI Chat Button */}
        <div className="fixed bottom-6 right-6 z-20">
          <motion.button
            className="p-3 rounded-full bg-primary-cyan-500 text-white shadow-lg shadow-cyan-primary/20"
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 204, 255, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowChat(!showChat)}
          >
            {showChat ? <X size={18} /> : <MessageSquare size={18} />}
          </motion.button>
        </div>

        {/* AI Chat Interface */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              className="fixed bottom-20 right-6 w-[90%] max-w-sm z-20"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <GlassCard
                variant="default"
                size="lg"
                className="w-full backdrop-blur-lg border border-glass-highlight overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-ui-border">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary-cyan-500/20 flex items-center justify-center mr-2">
                      <Sparkles className="text-primary-cyan-400" size={12} />
                    </div>
                    <h3 className="text-xs font-bold text-white">Gage AI</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/60"
                    onClick={() => setShowChat(false)}
                  >
                    <X size={14} />
                  </Button>
                </div>

                {/* Messages Container */}
                <div className="h-[300px] overflow-y-auto mb-3 pr-2 scrollbar-thin scrollbar-thumb-ui-border scrollbar-track-transparent">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                    >
                      <div
                        className={`inline-block max-w-[80%] px-2 py-1 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-primary-cyan-500/20 text-white'
                            : 'bg-white/5 text-white'
                        }`}
                      >
                        <div className="text-xs">{message.text}</div>
                      </div>
                      <div className="text-xs text-white/60 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
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
                    type="text"
                    className="flex-1 bg-white/5 text-white rounded-l-lg px-2 py-1.5 outline-none border border-ui-border focus:border-primary-cyan-500 text-xs"
                    placeholder="Ask about your schedule..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    className="bg-primary-cyan-500 text-white rounded-r-lg px-2 py-1.5 disabled:opacity-50"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                  >
                    <Send size={14} />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Event Form */}
        <AnimatePresence>
          {showAddEventForm && (
            <EventForm
              onSave={handleSaveEvent}
              onCancel={() => setShowAddEventForm(false)}
            />
          )}
        </AnimatePresence>

        {/* Edit Event Form */}
        <AnimatePresence>
          {showEditEventForm && selectedEvent && (
            <EventForm
              event={selectedEvent}
              onSave={handleSaveEvent}
              onCancel={() => {
                setSelectedEvent(null);
                setShowEditEventForm(false);
              }}
              onDelete={handleDeleteEvent}
            />
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default SchedulePage;