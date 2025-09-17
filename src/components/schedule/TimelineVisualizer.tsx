import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

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

interface TimelineVisualizerProps {
  events: ScheduleEvent[];
  onSelectEvent: (event: ScheduleEvent) => void;
  className?: string;
}

const TimelineVisualizer: React.FC<TimelineVisualizerProps> = ({ 
  events, 
  onSelectEvent,
  className = '' 
}) => {
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
  
  // Get background color based on event type
  const getEventColor = (color: string) => {
    switch (color) {
      case 'cyan-primary':
        return 'from-cyan-primary/20 to-cyan-primary/5';
      case 'teal-primary':
        return 'from-teal-primary/20 to-teal-primary/5';
      case 'teal-secondary':
        return 'from-teal-secondary/20 to-teal-secondary/5';
      default:
        return 'from-cyan-primary/20 to-cyan-primary/5';
    }
  };
  
  // Get border color based on event type
  const getBorderColor = (color: string) => {
    switch (color) {
      case 'cyan-primary':
        return 'border-cyan-primary';
      case 'teal-primary':
        return 'border-teal-primary';
      case 'teal-secondary':
        return 'border-teal-secondary';
      default:
        return 'border-cyan-primary';
    }
  };

  return (
    <div className={`relative w-full h-[400px] bg-glass-background bg-opacity-20 rounded-lg overflow-hidden ${className}`}>
      {/* Time markers */}
      <div className="absolute left-0 top-0 h-full w-16 border-r border-glass-border">
        {/* Only show time markers for hours within our view range with 2-hour steps */}
        {Array.from({ length: 24 }).map((_, i) => {
          // Only show markers for hours within our range and every 2 hours
          if (i * 60 >= startTime - 60 && i * 60 <= endTime + 60 && i % 2 === 0) {
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
      
      {/* Current time indicator */}
      <div 
        className="absolute left-0 right-0 h-0.5 bg-cyan-primary z-10"
        style={{ 
          top: `${((new Date().getHours() * 60 + new Date().getMinutes()) - startTime) / totalMinutes * 100}%` 
        }}
      >
        <div className="absolute -left-1 -top-1.5 w-4 h-4 rounded-full bg-cyan-primary"></div>
      </div>
      
      {/* Events */}
      <div className="absolute left-16 right-0 top-0 h-full">
        {events.map((event, index) => {
          const position = getEventPosition(event);
          
          return (
            <motion.div
              key={event.id}
              className={`absolute left-2 right-2 rounded-lg border-l-2 ${getBorderColor(event.color)} bg-gradient-to-r ${getEventColor(event.color)} cursor-pointer`}
              style={{ 
                top: position.top, 
                height: position.height,
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => onSelectEvent(event)}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 0 10px rgba(0, 204, 255, 0.3)'
              }}
            >
              <div className="p-2 h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-alpine-mist">{event.title}</span>
                  <span className="text-xs text-alpine-mist/70">{formatTime(event.time)}</span>
                </div>
                {position.height.replace('%', '') > 10 && (
                  <span className="text-xs text-alpine-mist/70 mt-1">{event.details}</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineVisualizer;





