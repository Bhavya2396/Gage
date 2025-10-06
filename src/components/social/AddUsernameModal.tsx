import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Check, AlertCircle } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';

interface AddUsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUsernameAdded: (username: string) => void;
}

const AddUsernameModal: React.FC<AddUsernameModalProps> = ({
  isOpen,
  onClose,
  onUsernameAdded
}) => {
  const [username, setUsername] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const validateUsername = async (value: string) => {
    if (value.length < 3) {
      setError('Username must be at least 3 characters');
      setIsValid(false);
      return;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setError('Username can only contain letters, numbers, and underscores');
      setIsValid(false);
      return;
    }

    setIsValidating(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      // Simulate username availability check
      const isAvailable = Math.random() > 0.3; // 70% chance of being available
      setIsValid(isAvailable);
      if (!isAvailable) {
        setError('Username is already taken');
      }
      setIsValidating(false);
    }, 1000);
  };

  const handleSubmit = () => {
    if (isValid && username.trim()) {
      onUsernameAdded(username);
      setUsername('');
      setIsValid(null);
      setError('');
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setIsValid(null);
    setError('');
    
    if (value.length >= 3) {
      validateUsername(value);
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
                    <User className="text-primary-cyan-400" size={16} />
                  </div>
                  <h2 className="text-sm font-bold text-white">Add Username</h2>
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
              <div className="mb-4">
                <p className="text-xs text-white/70 mb-3">
                  Choose a unique username that your friends can use to find and connect with you.
                </p>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Username</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={username}
                        onChange={handleInputChange}
                        placeholder="Enter your username"
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:border-primary-cyan-500 outline-none"
                        maxLength={20}
                      />
                      {isValidating && (
                        <div className="absolute right-3 top-2.5">
                          <div className="w-4 h-4 border-2 border-primary-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      {isValid === true && (
                        <div className="absolute right-3 top-2.5">
                          <Check className="text-primary-cyan-400" size={16} />
                        </div>
                      )}
                      {isValid === false && (
                        <div className="absolute right-3 top-2.5">
                          <AlertCircle className="text-red-400" size={16} />
                        </div>
                      )}
                    </div>
                    
                    {error && (
                      <p className="text-xs text-red-400 mt-1">{error}</p>
                    )}
                    
                    {isValid === true && (
                      <p className="text-xs text-primary-cyan-400 mt-1">Username is available!</p>
                    )}
                  </div>
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
                  disabled={!isValid || isValidating}
                  className="bg-primary-cyan-500 text-white"
                >
                  Add Username
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddUsernameModal;
