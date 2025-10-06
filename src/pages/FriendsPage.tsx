import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { ChevronLeft, MessageCircle, Mountain, Users, Send } from 'lucide-react';
import { formatAltitude } from '@/lib/utils';

// Friend activity component
interface FriendActivityProps {
  name: string;
  avatar: string;
  altitude: number;
  lastActivity: string;
  timeAgo: string;
  color: string;
}

const FriendActivity: React.FC<FriendActivityProps> = ({
  name,
  avatar,
  altitude,
  lastActivity,
  timeAgo,
  color
}) => {
  return (
    <GlassCard variant="default" size="sm" className="w-full mb-3">
      <div className="flex items-center">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
          style={{ backgroundColor: `${color}30`, border: `2px solid ${color}` }}
        >
          {avatar}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="text-text-primary font-medium">{name}</h3>
            <span className="text-text-secondary text-xs">{timeAgo}</span>
          </div>
          
          <div className="flex justify-between mt-1">
            <p className="text-text-secondary text-sm">{lastActivity}</p>
            <span className="text-xs" style={{ color }}>
              {formatAltitude(altitude)}
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

// Message component
interface MessageProps {
  content: string;
  sender: string;
  timestamp: string;
  isCurrentUser: boolean;
}

const Message: React.FC<MessageProps> = ({
  content,
  sender,
  timestamp,
  isCurrentUser
}) => {
  return (
    <div className={`mb-4 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
      <div className={`inline-block max-w-xs ${isCurrentUser ? 'ml-auto' : 'mr-auto'}`}>
        {!isCurrentUser && (
          <div className="text-text-secondary text-xs mb-1">{sender}</div>
        )}
        
        <div 
          className={`p-3 rounded-lg backdrop-blur ${
            isCurrentUser 
              ? 'bg-accent-primary/20 border border-accent-primary/30 text-text-primary' 
              : 'bg-glass border border-glass-border text-text-primary'
          }`}
        >
          {content}
        </div>
        
        <div className="text-text-secondary text-xs mt-1">{timestamp}</div>
      </div>
    </div>
  );
};

// Shared workout component
interface SharedWorkoutProps {
  user: string;
  workoutType: string;
  duration: string;
  calories: number;
  timestamp: string;
}

const SharedWorkout: React.FC<SharedWorkoutProps> = ({
  user,
  workoutType,
  duration,
  calories,
  timestamp
}) => {
  return (
    <div className="mb-4">
      <div className="text-text-secondary text-xs mb-1">{user}</div>
      <GlassCard variant="default" size="sm" className="w-full">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-primary">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M6 8H5a4 4 0 0 0 0 8h1"></path>
              <path d="M8 8a2 2 0 1 1 4 0v8"></path>
              <path d="M12 16a2 2 0 1 1 4 0"></path>
            </svg>
          </div>
          
          <div className="flex-1">
            <h3 className="text-text-primary font-medium">{workoutType}</h3>
            <div className="flex justify-between mt-1">
              <span className="text-text-secondary text-sm">{duration}</span>
              <span className="text-accent-primary text-sm">{calories} kcal</span>
            </div>
          </div>
        </div>
      </GlassCard>
      <div className="text-text-secondary text-xs mt-1 text-right">{timestamp}</div>
    </div>
  );
};

const FriendsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'mountain' | 'chat'>('mountain');
  const [messageInput, setMessageInput] = useState('');
  
  // Sample friends data
  const friends = [
    {
      name: 'Alex',
      avatar: '🧗‍♂️',
      altitude: 2450,
      lastActivity: 'Completed a HIIT workout',
      timeAgo: '2h ago',
      color: '#4CAF50'
    },
    {
      name: 'Sarah',
      avatar: '🏃‍♀️',
      altitude: 3200,
      lastActivity: 'Reached a new milestone',
      timeAgo: '5h ago',
      color: '#9C27B0'
    },
    {
      name: 'Mike',
      avatar: '🏋️‍♂️',
      altitude: 1800,
      lastActivity: 'Logged today\'s nutrition',
      timeAgo: '1d ago',
      color: '#FFC107'
    },
    {
      name: 'Emma',
      avatar: '🚴‍♀️',
      altitude: 2100,
      lastActivity: 'Completed a cycling session',
      timeAgo: '2d ago',
      color: '#00BCD4'
    }
  ];
  
  // Sample messages
  const messages = [
    {
      content: 'Just finished my morning run! Feeling great 🏃‍♂️',
      sender: 'Alex',
      timestamp: '9:15 AM',
      isCurrentUser: false
    },
    {
      content: 'Nice! I\'m heading to the gym in an hour. Anyone want to join?',
      sender: 'You',
      timestamp: '9:20 AM',
      isCurrentUser: true
    },
    {
      content: 'I can\'t today, but let\'s plan for tomorrow!',
      sender: 'Sarah',
      timestamp: '9:22 AM',
      isCurrentUser: false
    },
    {
      content: 'Check out my workout stats from yesterday:',
      sender: 'Mike',
      timestamp: '9:30 AM',
      isCurrentUser: false,
      isWorkout: true
    },
    {
      content: 'That\'s impressive! I need to step up my game.',
      sender: 'You',
      timestamp: '9:35 AM',
      isCurrentUser: true
    }
  ];
  
  // Handle send message
  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, we would add the message to the chat
      setMessageInput('');
    }
  };
  
  return (
    <MainLayout>
      <div className="mb-4 flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          icon={<ChevronLeft size={16} />}
          className="text-white"
        >
          Back
        </Button>
        <h1 className="text-sm font-bold text-white ml-2">Friends</h1>
      </div>
      
      <div className="max-w-md mx-auto pb-20">
        {/* Tabs */}
        <div className="flex mb-4">
          <Button 
            variant={activeTab === 'mountain' ? 'primary' : 'ghost'} 
            size="md" 
            className="flex-1 rounded-r-none"
            onClick={() => setActiveTab('mountain')}
            icon={<Mountain size={16} />}
          >
            Mountain View
          </Button>
          
          <Button 
            variant={activeTab === 'chat' ? 'primary' : 'ghost'} 
            size="md" 
            className="flex-1 rounded-l-none"
            onClick={() => setActiveTab('chat')}
            icon={<MessageCircle size={16} />}
          >
            Group Chat
          </Button>
        </div>
        
        {/* Mountain View Tab */}
        {activeTab === 'mountain' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard variant="default" size="md" className="w-full mb-4">
              <div className="flex items-center">
                <Users className="text-accent-primary mr-2" size={20} />
                <h2 className="text-xl font-medium text-text-primary">Climbing Together</h2>
              </div>
              <p className="text-text-secondary text-sm mt-2">
                See how your friends are progressing on their own mountains.
              </p>
            </GlassCard>
            
            {friends.map((friend, index) => (
              <FriendActivity 
                key={index}
                name={friend.name}
                avatar={friend.avatar}
                altitude={friend.altitude}
                lastActivity={friend.lastActivity}
                timeAgo={friend.timeAgo}
                color={friend.color}
              />
            ))}
          </motion.div>
        )}
        
        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <GlassCard variant="default" size="lg" className="w-full mb-4">
              <div className="flex items-center mb-4">
                <MessageCircle className="text-accent-primary mr-2" size={20} />
                <h2 className="text-xl font-medium text-text-primary">Group Chat</h2>
              </div>
              
              <div className="max-h-96 overflow-y-auto mb-4">
                {messages.map((message, index) => (
                  message.isWorkout ? (
                    <SharedWorkout 
                      key={index}
                      user={message.sender}
                      workoutType="Strength Training"
                      duration="45 minutes"
                      calories={320}
                      timestamp={message.timestamp}
                    />
                  ) : (
                    <Message 
                      key={index}
                      content={message.content}
                      sender={message.sender}
                      timestamp={message.timestamp}
                      isCurrentUser={message.isCurrentUser}
                    />
                  )
                ))}
              </div>
              
              <div className="flex items-center">
                <input 
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-glass border border-glass-border rounded-full py-2 px-4 text-text-primary focus:border-accent-primary outline-none"
                />
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="ml-2 w-10 h-10 p-0 flex items-center justify-center"
                  onClick={handleSendMessage}
                >
                  <Send size={16} />
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default FriendsPage;



