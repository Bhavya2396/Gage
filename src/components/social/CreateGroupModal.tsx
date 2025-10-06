import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Plus, Check, User } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';

interface Friend {
  id: string;
  name: string;
  username: string;
  initials: string;
  isSelected: boolean;
}

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated: (groupName: string, selectedFriends: Friend[]) => void;
  friends: Friend[];
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onGroupCreated,
  friends
}) => {
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFriendSelection = (friend: Friend) => {
    setSelectedFriends(prev => {
      const isSelected = prev.some(f => f.id === friend.id);
      if (isSelected) {
        return prev.filter(f => f.id !== friend.id);
      } else {
        return [...prev, friend];
      }
    });
  };

  const handleSubmit = () => {
    if (groupName.trim() && selectedFriends.length > 0) {
      onGroupCreated(groupName, selectedFriends);
      setGroupName('');
      setSelectedFriends([]);
      setSearchQuery('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard variant="default" size="md" className="w-full">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary-cyan-500/20 flex items-center justify-center mr-2">
                    <Users className="text-primary-cyan-400" size={16} />
                  </div>
                  <h2 className="text-sm font-bold text-white">Create Group</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  icon={<X size={14} />}
                  className="text-white/60"
                />
              </div>

              {/* Content */}
              <div className="mb-4 space-y-4">
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Group Name</label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name"
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:border-primary-cyan-500 outline-none"
                    maxLength={30}
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60 mb-1 block">Add Friends</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search friends..."
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:border-primary-cyan-500 outline-none mb-3"
                  />
                  
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {filteredFriends.map((friend) => {
                      const isSelected = selectedFriends.some(f => f.id === friend.id);
                      return (
                        <motion.div
                          key={friend.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center p-2 rounded-lg cursor-pointer ${
                            isSelected ? 'bg-primary-cyan-500/20' : 'bg-white/5'
                          }`}
                          onClick={() => toggleFriendSelection(friend)}
                        >
                          <div className="w-8 h-8 rounded-full bg-primary-cyan-500/20 flex items-center justify-center mr-3">
                            <span className="text-xs font-bold text-primary-cyan-400">
                              {friend.initials}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-bold text-white">{friend.name}</div>
                            <div className="text-xs text-white/60">@{friend.username}</div>
                          </div>
                          {isSelected && (
                            <Check className="text-primary-cyan-400" size={14} />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                  
                  {selectedFriends.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-white/60 mb-1">
                        Selected ({selectedFriends.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedFriends.map((friend) => (
                          <div
                            key={friend.id}
                            className="flex items-center bg-primary-cyan-500/20 rounded-full px-2 py-1"
                          >
                            <span className="text-xs text-primary-cyan-400 mr-1">
                              {friend.initials}
                            </span>
                            <span className="text-xs text-white">{friend.name}</span>
                            <button
                              onClick={() => toggleFriendSelection(friend)}
                              className="ml-1 text-white/60 hover:text-white"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white/60"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!groupName.trim() || selectedFriends.length === 0}
                  className="bg-primary-cyan-500 text-white"
                >
                  Create Group
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateGroupModal;
