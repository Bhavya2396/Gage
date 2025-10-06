import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronUp, ChevronDown, Dumbbell, Utensils, Activity, Zap } from 'lucide-react';

interface ScheduleEvent {
  id: string;
  title: string;
  type: string;
  time: string;
  duration: number;
  details: string;
  color: string;
  icon?: React.ReactNode;
}

interface EnhancedTimelineVisualizerProps {
  events: ScheduleEvent[];
  onSelectEvent: (event: ScheduleEvent) => void;
  className?: string;
}

const EnhancedTimelineVisualizer: React.FC<EnhancedTimelineVisualizerProps> = ({ 
  events, 
  onSelectEvent,
  className = '' 
}) => {
  const [expanded, setExpanded] = useState(true);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Convert time string to minutes from midnight for positioning
  const timeToMinutes = (timeStr: string): number => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
  };
  
  // Find the earliest and latest times in the schedule
  // Use 6 AM as default start if no events are earlier
  const earliestEventTime = Math.min(...events.map(event => timeToMinutes(event.time)));
  const startTime = Math.min(earliestEventTime, 6 * 60); // Start at 6 AM or earlier event
  
  // Use 10 PM as default end if no events are later
  const latestEventEndTime = Math.max(...events.map(event => timeToMinutes(event.time) + event.duration));
  const endTime = Math.max(latestEventEndTime, 22 * 60); // End at 10 PM or later event
  
  // Total minutes in the timeline
  const totalMinutes = endTime - startTime + 60; // Add padding
  
  // Get position and height for an event
  const getEventPosition = (event: ScheduleEvent) => {
    const eventStart = timeToMinutes(event.time);
    const topPosition = ((eventStart - startTime) / totalMinutes) * 100;
    const height = (event.duration / totalMinutes) * 100;
    
    return { top: `${topPosition}%`, height: `${Math.max(height, 5)}%` };
  };
  
  // Format time for display
  const formatTime = (timeStr: string): string => {
    return timeStr;
  };
  
  // Get background gradient based on event type
  const getEventGradient = (color: string) => {
    switch (color) {
      case 'cyan-primary':
        return 'from-primary-cyan-500/30 to-cyan-primary/10';
      case 'teal-primary':
        return 'from-teal-primary/30 to-primary-teal-500/10';
      case 'teal-secondary':
        return 'from-teal-secondary/30 to-teal-secondary/10';
      default:
        return 'from-primary-cyan-500/30 to-cyan-primary/10';
    }
  };
  
  // Get border color based on event type
  const getBorderColor = (color: string) => {
    switch (color) {
      case 'cyan-primary':
        return 'border-primary-cyan-500';
      case 'teal-primary':
        return 'border-primary-teal-500';
      case 'teal-secondary':
        return 'border-teal-secondary';
      default:
        return 'border-primary-cyan-500';
    }
  };

  // Get text color based on event type
  const getTextColor = (color: string) => {
    switch (color) {
      case 'cyan-primary':
        return 'text-primary-cyan-500';
      case 'teal-primary':
        return 'text-primary-teal-500';
      case 'teal-secondary':
        return 'text-teal-secondary';
      default:
        return 'text-primary-cyan-500';
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

  // Scroll to current time on component mount
  useEffect(() => {
    if (timelineRef.current) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const scrollPercentage = (currentMinutes - startTime) / totalMinutes;
      
      // Calculate scroll position (minus some offset to position current time in the middle)
      const scrollPos = timelineRef.current.scrollHeight * scrollPercentage - 150;
      timelineRef.current.scrollTop = Math.max(0, scrollPos);
      setScrollPosition(scrollPos);
    }
  }, [startTime, totalMinutes]);

  // Handle timeline scroll
  const handleScroll = () => {
    if (timelineRef.current) {
      setScrollPosition(timelineRef.current.scrollTop);
    }
  };

  return (
    <div className={`relative w-full ${expanded ? 'h-[450px]' : 'h-[200px]'} transition-all duration-300 ${className}`}>
      {/* Toggle expand/collapse button */}
      <button 
        className="absolute top-2 right-2 z-10 bg-glass-highlight p-1 rounded-full text-alpine-mist"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      <div 
        className="relative w-full h-full bg-glass-background bg-opacity-30 rounded-lg overflow-hidden border border-glass-border"
      >
        <div 
          ref={timelineRef} 
          className="absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-glass-border scrollbar-track-transparent"
          onScroll={handleScroll}
        >
          <div className="relative min-h-full">
            {/* Time markers */}
            <div className="absolute left-0 top-0 h-full w-16 border-r border-glass-border">
              {/* Only show time markers for hours within our view range with 1-hour steps */}
              {Array.from({ length: 24 }).map((_, i) => {
                // Only show markers for hours within our range
                if (i * 60 >= startTime - 60 && i * 60 <= endTime + 60) {
                  return (
                    <div 
                      key={i} 
                      className="absolute w-full flex items-center justify-center text-xs text-alpine-mist/70"
                      style={{ top: `${(i * 60 - startTime) / totalMinutes * 100}%` }}
                    >
                      <div className="flex items-center">
                        <Clock size={10} className="mr-1 opacity-70" />
                        <span>{i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`}</span>
                      </div>
                      <div className="absolute right-0 w-2 h-0.5 bg-glass-border"></div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
            
            {/* Hour grid lines */}
            <div className="absolute left-16 right-0 top-0 h-full">
              {Array.from({ length: 24 }).map((_, i) => {
                if (i * 60 >= startTime - 60 && i * 60 <= endTime + 60) {
                  return (
                    <div 
                      key={i} 
                      className="absolute w-full h-px bg-glass-border/30"
                      style={{ top: `${(i * 60 - startTime) / totalMinutes * 100}%` }}
                    />
                  );
                }
                return null;
              })}
            </div>
            
            {/* Current time indicator */}
            <div 
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-primary-cyan-500 to-primary-teal-500 z-10"
              style={{ 
                top: `${((new Date().getHours() * 60 + new Date().getMinutes()) - startTime) / totalMinutes * 100}%` 
              }}
            >
              <div className="absolute -left-1 -top-1.5 w-4 h-4 rounded-full bg-primary-cyan-500 shadow-glow-sm animate-pulse"></div>
            </div>
            
            {/* Events */}
            <div className="absolute left-16 right-2 top-0 h-full">
              {events.map((event, index) => {
                const position = getEventPosition(event);
                const isHovered = hoveredEvent === event.id;
                
                return (
                  <motion.div
                    key={event.id}
                    className={`absolute left-2 right-0 rounded-lg border-l-2 ${getBorderColor(event.color)} bg-gradient-to-r ${getEventGradient(event.color)} cursor-pointer backdrop-blur-sm shadow-lg transition-all duration-200`}
                    style={{ 
                      top: position.top, 
                      height: position.height,
                      zIndex: isHovered ? 20 : 10
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      scale: isHovered ? 1.02 : 1,
                      boxShadow: isHovered ? '0 0 15px rgba(0, 204, 255, 0.4)' : 'none'
                    }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => onSelectEvent(event)}
                    onMouseEnter={() => setHoveredEvent(event.id)}
                    onMouseLeave={() => setHoveredEvent(null)}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: '0 0 15px rgba(0, 204, 255, 0.4)'
                    }}
                  >
                    <div className="p-2 h-full flex flex-col">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`p-1 rounded-full ${getTextColor(event.color)} mr-2`}>
                            {getEventIcon(event.type)}
                          </div>
                          <span className="text-sm font-medium text-alpine-mist">{event.title}</span>
                        </div>
                        <span className="text-xs text-alpine-mist/70 font-medium">{formatTime(event.time)}</span>
                      </div>
                      {position.height.replace('%', '') > 10 && (
                        <span className="text-xs text-alpine-mist/70 mt-1">{event.details}</span>
                      )}
                      
                      {/* Duration indicator */}
                      {position.height.replace('%', '') > 8 && (
                        <div className="mt-auto flex items-center">
                          <Clock size={12} className="text-alpine-mist/50 mr-1" />
                          <span className="text-xs text-alpine-mist/50">
                            {event.duration >= 60 
                              ? `${Math.floor(event.duration / 60)}h ${event.duration % 60 > 0 ? `${event.duration % 60}m` : ''}`
                              : `${event.duration}m`
                            }
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTimelineVisualizer;
