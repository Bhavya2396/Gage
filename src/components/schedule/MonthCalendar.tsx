import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';

interface MonthCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  events: any[]; // Events to mark on the calendar
  className?: string;
}

const MonthCalendar: React.FC<MonthCalendarProps> = ({
  selectedDate,
  onDateSelect,
  events,
  className = '',
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  
  // Generate calendar days for the current month
  useEffect(() => {
    const days: Date[] = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    
    // Get the day of the week (0-6, where 0 is Sunday)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Get the last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
    
    // Add days from previous month to fill the first week
    const daysFromPrevMonth = firstDayOfWeek;
    const prevMonth = new Date(year, month, 0);
    const prevMonthLastDay = prevMonth.getDate();
    
    for (let i = prevMonthLastDay - daysFromPrevMonth + 1; i <= prevMonthLastDay; i++) {
      days.push(new Date(year, month - 1, i));
    }
    
    // Add days of the current month
    for (let i = 1; i <= lastDayOfMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add days from next month to complete the last week
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    setCalendarDays(days);
  }, [currentMonth]);
  
  // Navigate to previous month
  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Format month and year for display
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  // Check if a date is the selected date
  const isSelectedDate = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };
  
  // Check if a date is today
  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };
  
  // Check if a date is in the current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };
  
  // Check if a date has events
  const hasEvents = (date: Date) => {
    return events.some(event => {
      const eventDate = new Date(event.date || new Date());
      return eventDate.toDateString() === date.toDateString();
    });
  };
  
  // Get the number of events for a date
  const getEventCount = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date || new Date());
      return eventDate.toDateString() === date.toDateString();
    }).length;
  };
  
  // Day name headers
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className={`bg-glass-background bg-opacity-30 rounded-lg p-3 ${className}`}>
      {/* Calendar header */}
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={goToPrevMonth}
          className="text-alpine-mist"
        >
          <ChevronLeft size={18} />
        </Button>
        <h3 className="text-md font-medium text-alpine-mist">
          {formatMonthYear(currentMonth)}
        </h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={goToNextMonth}
          className="text-alpine-mist"
        >
          <ChevronRight size={18} />
        </Button>
      </div>
      
      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day, index) => (
          <div 
            key={index} 
            className="text-center text-xs text-alpine-mist/70 font-medium py-1"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => (
          <motion.button
            key={index}
            className={`
              relative aspect-square rounded-md flex flex-col items-center justify-center
              ${isSelectedDate(date) ? 'bg-primary-cyan-500/30 text-white' : ''}
              ${isToday(date) && !isSelectedDate(date) ? 'border border-primary-cyan-500/50' : ''}
              ${!isCurrentMonth(date) ? 'text-alpine-mist/30' : 'text-alpine-mist'}
              hover:bg-glass-highlight transition-colors duration-200
            `}
            onClick={() => onDateSelect(date)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-xs">{date.getDate()}</span>
            
            {/* Event indicator */}
            {hasEvents(date) && (
              <div className="absolute bottom-1 flex space-x-0.5">
                {getEventCount(date) > 0 && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-cyan-500"></div>
                )}
                {getEventCount(date) > 1 && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-teal-500"></div>
                )}
                {getEventCount(date) > 2 && (
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-secondary"></div>
                )}
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default MonthCalendar;
