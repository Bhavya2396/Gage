import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import GeneralAIChat from '@/components/ai/GeneralAIChat';
import { ChevronLeft, MessageCircle, Mountain, Users, Send, Heart, Trophy, Activity, TrendingUp } from 'lucide-react';
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
    <GlassCard variant="default" size="sm" className="w-full mb-3" interactive animate>
      <div className="flex items-center">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center mr-3 text-lg"
          style={{ backgroundColor: `${color}20`, border: `2px solid ${color}60` }}
        >
          {avatar}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-bold text-white">{name}</h3>
            <span className="text-xs text-white/60">{timeAgo}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-xs text-white/70">{lastActivity}</p>
            <div className="flex items-center">
              <Mountain size={12} className="text-white/60 mr-1" />
              <span className="text-xs font-bold" style={{ color }}>
                {formatAltitude(altitude)}
              </span>
            </div>
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
    <div className={`mb-3 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
      <div className={`inline-block max-w-[80%] ${isCurrentUser ? 'ml-auto' : 'mr-auto'}`}>
        {!isCurrentUser && (
          <div className="text-white/60 text-xs mb-1">{sender}</div>
        )}
        
        <div 
          className={`p-2 rounded-lg ${
            isCurrentUser 
              ? 'bg-primary-cyan-500/20 text-white' 
              : 'bg-white/5 text-white'
          }`}
        >
          <div className="text-xs">{content}</div>
        </div>
        
        <div className="text-white/50 text-xs mt-1">{timestamp}</div>
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
    <div className="mb-3">
      <div className="text-white/60 text-xs mb-1">{user}</div>
      <GlassCard variant="default" size="sm" className="w-full">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary-cyan-500/20 flex items-center justify-center mr-3">
            <Activity className="text-primary-cyan-400" size={16} />
          </div>
          
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white">{workoutType}</h3>
            <div className="flex justify-between mt-1">
              <span className="text-white/70 text-xs">{duration}</span>
              <span className="text-primary-cyan-400 text-xs font-bold">{calories} kcal</span>
            </div>
          </div>
        </div>
      </GlassCard>
      <div className="text-white/50 text-xs mt-1 text-right">{timestamp}</div>
    </div>
  );
};

// Social stats component
const SocialStats: React.FC = () => {
  return (
    <GlassCard variant="default" size="sm" className="w-full mb-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full bg-primary-cyan-500/20 flex items-center justify-center mx-auto mb-2">
            <Users className="text-primary-cyan-400" size={16} />
          </div>
          <div className="text-lg font-bold text-white">12</div>
          <div className="text-xs text-white/60">Friends</div>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 rounded-full bg-primary-teal-500/20 flex items-center justify-center mx-auto mb-2">
            <Trophy className="text-primary-teal-400" size={16} />
          </div>
          <div className="text-lg font-bold text-white">8</div>
          <div className="text-xs text-white/60">Challenges</div>
        </div>
        <div className="text-center">
          <div className="w-8 h-8 rounded-full bg-primary-purple-500/20 flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="text-primary-purple-400" size={16} />
          </div>
          <div className="text-lg font-bold text-white">24</div>
          <div className="text-xs text-white/60">Activities</div>
        </div>
      </div>
    </GlassCard>
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
      <div className="w-full max-w-md mx-auto px-4 pt-20 pb-24">
        {/* Header */}
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
        
        {/* Social Stats */}
        <SocialStats />
        
        {/* AI Chat */}
        <div className="mb-4">
          <GeneralAIChat topic="social" />
        </div>
        
        {/* Tabs */}
        <div className="flex mb-4">
          <Button 
            variant={activeTab === 'mountain' ? 'primary' : 'ghost'} 
            size="sm" 
            className="flex-1 rounded-r-none"
            onClick={() => setActiveTab('mountain')}
            icon={<Mountain size={14} />}
          >
            Mountain View
          </Button>
          
          <Button 
            variant={activeTab === 'chat' ? 'primary' : 'ghost'} 
            size="sm" 
            className="flex-1 rounded-l-none"
            onClick={() => setActiveTab('chat')}
            icon={<MessageCircle size={14} />}
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
            <GlassCard variant="default" size="sm" className="w-full mb-4">
              <div className="flex items-center">
                <Users className="text-primary-cyan-400 mr-2" size={16} />
                <h2 className="text-sm font-bold text-white">Climbing Together</h2>
              </div>
              <p className="text-white/70 text-xs mt-1">
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
            <GlassCard variant="default" size="sm" className="w-full mb-4">
              <div className="flex items-center mb-3">
                <MessageCircle className="text-primary-cyan-400 mr-2" size={16} />
                <h2 className="text-sm font-bold text-white">Group Chat</h2>
              </div>
              
              <div className="max-h-80 overflow-y-auto mb-3">
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
                  className="flex-1 bg-white/5 border border-white/20 rounded-full py-2 px-3 text-white text-xs focus:border-primary-cyan-500 outline-none"
                />
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="ml-2 w-8 h-8 p-0 flex items-center justify-center"
                  onClick={handleSendMessage}
                >
                  <Send size={12} />
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



