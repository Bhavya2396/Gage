import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { ChevronLeft, Calendar, Clock, Target, Plus, CheckCircle, Play, Pause, RotateCcw } from 'lucide-react';

const SchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  
  const today = new Date();
  const currentWeek = getWeekDates(today);
  
  const scheduleData = [
    {
      id: 1,
      title: 'Morning Cardio',
      time: '07:00',
      duration: 30,
      type: 'workout',
      status: 'completed',
      description: 'Light jogging and stretching',
      location: 'Home'
    },
    {
      id: 2,
      title: 'Nutrition Planning',
      time: '08:30',
      duration: 15,
      type: 'nutrition',
      status: 'upcoming',
      description: 'Plan meals for the day',
      location: 'Kitchen'
    },
    {
      id: 3,
      title: 'Strength Training',
      time: '18:00',
      duration: 45,
      type: 'workout',
      status: 'upcoming',
      description: 'Upper body strength session',
      location: 'Gym'
    },
    {
      id: 4,
      title: 'Recovery Session',
      time: '20:00',
      duration: 20,
      type: 'recovery',
      status: 'upcoming',
      description: 'Meditation and stretching',
      location: 'Home'
    }
  ];

  function getWeekDates(date: Date) {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      week.push(day);
    }
    return week;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'workout': return 'from-cyan-500 to-teal-500';
      case 'nutrition': return 'from-green-500 to-emerald-500';
      case 'recovery': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'workout': return '💪';
      case 'nutrition': return '🍎';
      case 'recovery': return '🧘';
      default: return '📅';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="text-green-400" size={16} />;
      case 'upcoming': return <Clock className="text-cyan-400" size={16} />;
      case 'in-progress': return <Play className="text-yellow-400" size={16} />;
      default: return <Pause className="text-gray-400" size={16} />;
    }
  };

  const formatTime = (time: string) => {
    return time;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <MainLayout>
      {showContent && (
        <div className="absolute inset-0 z-10 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <motion.button
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft size={20} />
              <span>Back</span>
            </motion.button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">Schedule</h1>
              <p className="text-white/60 text-sm">Your daily plan</p>
            </div>
            
            <motion.button
              className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={16} />
            </motion.button>
          </div>

          {/* View Mode Toggle */}
          <div className="px-6 mb-6">
            <div className="flex space-x-2">
              {[
                { key: 'calendar', label: 'Calendar', icon: Calendar },
                { key: 'list', label: 'List', icon: Clock }
              ].map(({ key, label, icon: Icon }) => (
                <motion.button
                  key={key}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    viewMode === key
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                  onClick={() => setViewMode(key as any)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Week Navigation */}
          {viewMode === 'calendar' && (
            <div className="px-6 mb-6">
              <div className="flex space-x-2">
                {currentWeek.map((date, index) => (
                  <motion.button
                    key={index}
                    className={`flex-1 flex flex-col items-center py-3 px-2 rounded-xl transition-all ${
                      date.toDateString() === selectedDate.toDateString()
                        ? 'bg-cyan-500 text-white'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                    onClick={() => setSelectedDate(date)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                  >
                    <span className="text-xs font-medium">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span className="text-lg font-bold">{date.getDate()}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Schedule Content */}
          <div className="flex-1 px-6 pb-6">
            {viewMode === 'calendar' ? (
              <div className="space-y-4">
                <h3 className="text-white font-semibold text-lg mb-4">
                  {formatDate(selectedDate)}
                </h3>
                
                {scheduleData.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                          {getTypeIcon(item.type)}
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-lg">{item.title}</h4>
                          <p className="text-white/60 text-sm">{item.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          {getStatusIcon(item.status)}
                          <span className="text-white font-bold">{formatTime(item.time)}</span>
                        </div>
                        <p className="text-white/60 text-xs">{item.duration} min</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-white/60">📍 {item.location}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getTypeColor(item.type)} text-white`}>
                          {item.type}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        {item.status === 'upcoming' && (
                          <motion.button
                            className="bg-cyan-500 text-white px-4 py-2 rounded-xl font-medium text-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Start
                          </motion.button>
                        )}
                        {item.status === 'completed' && (
                          <motion.button
                            className="bg-green-500 text-white px-4 py-2 rounded-xl font-medium text-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Completed
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {scheduleData.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">
                          {getTypeIcon(item.type)}
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">{item.title}</h4>
                          <p className="text-white/60 text-sm">{item.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          {getStatusIcon(item.status)}
                          <span className="text-white font-bold">{formatTime(item.time)}</span>
                        </div>
                        <p className="text-white/60 text-xs">{item.duration} min</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Quick Actions */}
            <motion.div
              className="mt-6 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 backdrop-blur-md rounded-2xl p-6 border border-cyan-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h3 className="text-white font-semibold text-lg mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  className="bg-white/10 backdrop-blur-md text-white py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Target size={16} />
                  <span>Add Workout</span>
                </motion.button>
                <motion.button
                  className="bg-white/10 backdrop-blur-md text-white py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Calendar size={16} />
                  <span>Plan Week</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default SchedulePage;