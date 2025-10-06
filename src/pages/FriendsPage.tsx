import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { ChevronLeft, Users, Trophy, Target, TrendingUp, MessageCircle, Plus, Crown, Zap, Heart } from 'lucide-react';

const FriendsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [activeTab, setActiveTab] = useState<'friends' | 'leaderboard' | 'challenges'>('friends');
  
  const friends = [
    {
      id: 1,
      name: 'Alex Chen',
      avatar: '👨‍💻',
      status: 'online',
      progress: 78,
      currentGoal: 'Run 5K in 25 minutes',
      streak: 12,
      lastActivity: '2 hours ago',
      achievements: ['First 5K', 'Week Warrior']
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      avatar: '👩‍🏃‍♀️',
      status: 'offline',
      progress: 65,
      currentGoal: 'Complete 100 push-ups',
      streak: 8,
      lastActivity: '5 hours ago',
      achievements: ['Push-up Master', 'Consistency King']
    },
    {
      id: 3,
      name: 'Mike Rodriguez',
      avatar: '👨‍💪',
      status: 'online',
      progress: 92,
      currentGoal: 'Deadlift 200lbs',
      streak: 15,
      lastActivity: '30 minutes ago',
      achievements: ['Strength Builder', 'Iron Will']
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Mike Rodriguez', points: 2840, avatar: '👨‍💪', badge: 'Crown' },
    { rank: 2, name: 'Alex Chen', points: 2650, avatar: '👨‍💻', badge: 'Trophy' },
    { rank: 3, name: 'Sarah Johnson', points: 2420, avatar: '👩‍🏃‍♀️', badge: 'Medal' },
    { rank: 4, name: 'You', points: 2180, avatar: '🏔️', badge: 'Mountain' },
    { rank: 5, name: 'Emma Wilson', points: 1950, avatar: '👩‍🚀', badge: 'Star' }
  ];

  const challenges = [
    {
      id: 1,
      title: '30-Day Fitness Challenge',
      description: 'Complete 30 workouts in 30 days',
      participants: 24,
      daysLeft: 12,
      reward: 'Exclusive Badge + 500 Points',
      type: 'group',
      difficulty: 'medium'
    },
    {
      id: 2,
      title: 'Weekend Warrior',
      description: 'Complete 2 intense workouts this weekend',
      participants: 8,
      daysLeft: 2,
      reward: '200 Points',
      type: 'individual',
      difficulty: 'hard'
    },
    {
      id: 3,
      title: 'Hydration Hero',
      description: 'Drink 2.5L of water daily for a week',
      participants: 15,
      daysLeft: 5,
      reward: '150 Points',
      type: 'group',
      difficulty: 'easy'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'Crown': return <Crown className="text-yellow-400" size={16} />;
      case 'Trophy': return <Trophy className="text-orange-400" size={16} />;
      case 'Medal': return <Target className="text-blue-400" size={16} />;
      case 'Mountain': return <Zap className="text-cyan-400" size={16} />;
      case 'Star': return <Heart className="text-pink-400" size={16} />;
      default: return <Trophy className="text-gray-400" size={16} />;
    }
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
              <h1 className="text-2xl font-bold text-white">Community</h1>
              <p className="text-white/60 text-sm">Connect with friends</p>
            </div>
            
            <motion.button
              className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus size={16} />
            </motion.button>
          </div>

          {/* Tab Navigation */}
          <div className="px-6 mb-6">
            <div className="flex space-x-2">
              {[
                { key: 'friends', label: 'Friends', icon: Users },
                { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
                { key: 'challenges', label: 'Challenges', icon: Target }
              ].map(({ key, label, icon: Icon }) => (
                <motion.button
                  key={key}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    activeTab === key
                      ? 'bg-cyan-500 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                  onClick={() => setActiveTab(key as any)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 px-6 pb-6">
            {activeTab === 'friends' && (
              <div className="space-y-4">
                {friends.map((friend, index) => (
                  <motion.div
                    key={friend.id}
                    className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">
                            {friend.avatar}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${
                            friend.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                          }`} />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">{friend.name}</h3>
                          <p className="text-white/60 text-sm">{friend.currentGoal}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-cyan-400 font-bold text-lg">{friend.progress}%</div>
                        <p className="text-white/60 text-xs">Progress</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white/5 rounded-xl p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <Zap className="text-cyan-400" size={16} />
                          <span className="text-white/80 text-sm">Streak</span>
                        </div>
                        <span className="text-white font-bold text-lg">{friend.streak} days</span>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <Heart className="text-teal-400" size={16} />
                          <span className="text-white/80 text-sm">Last Active</span>
                        </div>
                        <span className="text-white font-bold text-lg">{friend.lastActivity}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        {friend.achievements.map((achievement, i) => (
                          <div key={i} className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-lg text-xs font-medium">
                            {achievement}
                          </div>
                        ))}
                      </div>
                      <motion.button
                        className="bg-cyan-500 text-white px-4 py-2 rounded-xl font-medium text-sm flex items-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <MessageCircle size={16} />
                        <span>Chat</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.rank}
                    className={`bg-black/20 backdrop-blur-md rounded-2xl p-4 border ${
                      entry.rank <= 3 ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-white/10'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-bold text-lg w-6">#{entry.rank}</span>
                          {getBadgeIcon(entry.badge)}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">
                          {entry.avatar}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{entry.name}</h3>
                          <p className="text-white/60 text-sm">{entry.points} points</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-cyan-400 font-bold text-lg">{entry.points}</div>
                        <p className="text-white/60 text-xs">Points</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'challenges' && (
              <div className="space-y-4">
                {challenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-2">{challenge.title}</h3>
                        <p className="text-white/80 text-sm mb-3">{challenge.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-white/60">{challenge.participants} participants</span>
                          <span className="text-white/60">{challenge.daysLeft} days left</span>
                          <span className={`font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-cyan-400 font-bold text-lg">{challenge.daysLeft}</div>
                        <p className="text-white/60 text-xs">Days Left</p>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 text-sm">Reward</span>
                        <span className="text-cyan-400 font-medium text-sm">{challenge.reward}</span>
                      </div>
                    </div>

                    <motion.button
                      className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white py-3 rounded-xl font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Join Challenge
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default FriendsPage;