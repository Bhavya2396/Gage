import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Calendar, AlertCircle, Check } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';

interface GoalCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalCreated: (goal: any) => void;
}

const GoalCreationModal: React.FC<GoalCreationModalProps> = ({
  isOpen,
  onClose,
  onGoalCreated
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'fitness',
    target: '',
    unit: '',
    deadline: '',
    priority: 'medium'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'fitness', label: 'Fitness', color: 'primary-cyan' },
    { value: 'nutrition', label: 'Nutrition', color: 'primary-teal' },
    { value: 'health', label: 'Health', color: 'primary-purple' },
    { value: 'personal', label: 'Personal', color: 'primary-orange' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'green' },
    { value: 'medium', label: 'Medium', color: 'yellow' },
    { value: 'high', label: 'High', color: 'red' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.target || isNaN(Number(formData.target))) newErrors.target = 'Valid target is required';
    if (!formData.unit.trim()) newErrors.unit = 'Unit is required';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const goal = {
        id: Date.now().toString(),
        ...formData,
        target: Number(formData.target),
        current: 0,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      onGoalCreated(goal);
      setFormData({
        title: '',
        description: '',
        category: 'fitness',
        target: '',
        unit: '',
        deadline: '',
        priority: 'medium'
      });
      setErrors({});
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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
                    <Target className="text-primary-cyan-400" size={16} />
                  </div>
                  <h2 className="text-sm font-bold text-white">Create New Goal</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  icon={<X size={14} />}
                  className="text-white/60"
                />
              </div>

              {/* Form */}
              <div className="space-y-4 mb-4">
                <div>
                  <label className="text-xs text-white/60 mb-1 block">Goal Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter your goal title"
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:border-primary-cyan-500 outline-none"
                  />
                  {errors.title && (
                    <p className="text-xs text-red-400 mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-white/60 mb-1 block">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your goal"
                    rows={3}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:border-primary-cyan-500 outline-none resize-none"
                  />
                  {errors.description && (
                    <p className="text-xs text-red-400 mt-1">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:border-primary-cyan-500 outline-none"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:border-primary-cyan-500 outline-none"
                    >
                      {priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Target Value</label>
                    <input
                      type="number"
                      value={formData.target}
                      onChange={(e) => handleInputChange('target', e.target.value)}
                      placeholder="100"
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:border-primary-cyan-500 outline-none"
                    />
                    {errors.target && (
                      <p className="text-xs text-red-400 mt-1">{errors.target}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Unit</label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => handleInputChange('unit', e.target.value)}
                      placeholder="kg, reps, days"
                      className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:border-primary-cyan-500 outline-none"
                    />
                    {errors.unit && (
                      <p className="text-xs text-red-400 mt-1">{errors.unit}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/60 mb-1 block">Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-xs focus:border-primary-cyan-500 outline-none"
                  />
                  {errors.deadline && (
                    <p className="text-xs text-red-400 mt-1">{errors.deadline}</p>
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
                  className="bg-primary-cyan-500 text-white"
                >
                  Create Goal
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GoalCreationModal;
