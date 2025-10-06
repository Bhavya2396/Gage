import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { Users, ArrowUpRight } from 'lucide-react';

interface FriendsCardProps {
  className?: string;
}

const FriendsCard: React.FC<FriendsCardProps> = ({ className = '' }) => {
  const friends = [
    { initials: "JS", color: "bg-primary-cyan-500" },
    { initials: "KM", color: "bg-primary-teal-500" },
    { initials: "AR", color: "bg-primary-cyan-500" }
  ];

  return (
    <GlassCard 
      variant="default" 
      size="md" 
      className={`w-full ${className}`}
      interactive
      animate
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="mr-3 p-2 rounded-full bg-white/10">
            <Users className="text-primary-cyan-400" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Friends</h3>
            <span className="text-sm bg-primary-cyan-500/30 text-white font-semibold px-3 py-1 rounded-full border border-primary-cyan-500/50">
              3 active
            </span>
          </div>
        </div>
        <ArrowUpRight className="text-white/60" size={20} />
      </div>
      
      <div className="flex items-center space-x-2 mb-3">
        {friends.map((friend, index) => (
          <div
            key={index}
            className={`w-10 h-10 rounded-full ${friend.color} flex items-center justify-center text-white font-bold text-sm`}
          >
            {friend.initials}
          </div>
        ))}
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm border-2 border-dashed border-white/30">
          +2
        </div>
      </div>
      
      <div className="text-sm text-white/60 font-medium">
        3 friends active now
      </div>
    </GlassCard>
  );
};

export default FriendsCard;
