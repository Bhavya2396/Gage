import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  X, 
  Check,
  Info,
  AlertTriangle,
  AlertCircle,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { usePersonalization } from '@/contexts/PersonalizationContext';

/**
 * Notification Center component for cross-feature integration
 * Provides a centralized system for displaying notifications from various features
 */
export const NotificationCenter: React.FC = () => {
  const navigate = useNavigate();
  const { appState, markNotificationAsRead, clearNotifications } = useApp();
  const { preferences } = usePersonalization();
  const [isOpen, setIsOpen] = useState(false);
  
  // Get unread notifications count
  const unreadCount = appState.notifications.filter(n => !n.read).length;
  
  // Toggle notification panel
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  
  // Handle notification click
  const handleNotificationClick = (notification: typeof appState.notifications[0]) => {
    // Mark as read
    markNotificationAsRead(notification.id);
    
    // Navigate if action URL is provided
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setIsOpen(false);
    }
  };
  
  // Get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Check size={16} className="text-green-400" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-amber-400" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-400" />;
      case 'info':
      default:
        return <Info size={16} className="text-primary-cyan-500" />;
    }
  };
  
  // Format timestamp
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than a minute
    if (diff < 60000) {
      return 'Just now';
    }
    
    // Less than an hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }
    
    // Less than a day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }
    
    // Format as date
    return date.toLocaleDateString();
  };
  
  return (
    <div className="relative z-50">
      {/* Notification bell button */}
      <button
        className="fixed top-4 right-4 p-2 rounded-full bg-glass-backgroundDark backdrop-blur-md border border-glass-border"
        onClick={togglePanel}
      >
        <Bell size={20} className="text-white" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary-cyan-500 text-white text-xs flex items-center justify-center">
            {unreadCount}
          </div>
        )}
      </button>
      
      {/* Notification panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-14 right-4 w-80 max-h-[80vh] bg-glass-backgroundDark backdrop-blur-md border border-glass-border rounded-lg shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b border-glass-border">
              <div className="flex items-center">
                <Bell size={16} className="text-primary-cyan-500 mr-2" />
                <h3 className="text-white font-medium">Notifications</h3>
              </div>
              <div className="flex items-center">
                {appState.notifications.length > 0 && (
                  <button
                    className="p-1 text-white/60 hover:text-white mr-1"
                    onClick={clearNotifications}
                    title="Clear all notifications"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <button
                  className="p-1 text-white/60 hover:text-white"
                  onClick={togglePanel}
                  title="Close notifications"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            {/* Notification list */}
            <div className="overflow-y-auto max-h-[calc(80vh-48px)]">
              {appState.notifications.length === 0 ? (
                <div className="p-4 text-center text-white/60">
                  <p>No notifications</p>
                </div>
              ) : (
                <div>
                  {appState.notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      className={cn(
                        "p-3 border-b border-glass-border cursor-pointer hover:bg-glass-highlight transition-colors",
                        notification.read ? "opacity-70" : ""
                      )}
                      onClick={() => handleNotificationClick(notification)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    >
                      <div className="flex items-start">
                        <div className="mr-3 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-white text-sm font-medium">{notification.title}</h4>
                            <span className="text-white/50 text-xs">
                              {formatTime(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-white/80 text-xs mb-1">
                            {notification.message}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-white/50 text-xs">
                              {notification.source}
                            </span>
                            {notification.actionLabel && (
                              <div className="flex items-center text-primary-cyan-500 text-xs">
                                {notification.actionLabel}
                                <ChevronRight size={12} className="ml-0.5" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
