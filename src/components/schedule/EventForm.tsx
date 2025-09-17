import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, Calendar, AlignLeft, Tag, Save, Trash2 } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';

interface EventFormProps {
  event?: any;
  onSave: (event: any) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const EventForm: React.FC<EventFormProps> = ({
  event,
  onSave,
  onCancel,
  onDelete
}) => {
  const isEditing = !!event;
  
  const [formData, setFormData] = useState({
    id: event?.id || Date.now().toString(),
    title: event?.title || '',
    type: event?.type || 'workout',
    time: event?.time || '9:00 AM',
    duration: event?.duration || 30,
    details: event?.details || '',
    color: event?.color || 'cyan-primary'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-30 flex items-center justify-center p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className="w-full max-w-sm"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <GlassCard
          variant="default"
          size="lg"
          className="w-full backdrop-blur-lg border border-glass-highlight"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-alpine-mist">
              {isEditing ? 'Edit Event' : 'New Event'}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="text-text-secondary"
              onClick={onCancel}
            >
              <X size={18} />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm text-alpine-mist/70 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-glass-background text-alpine-mist rounded-lg px-3 py-2 outline-none border border-glass-border focus:border-cyan-primary"
                  placeholder="Event title"
                  required
                />
              </div>
              
              {/* Type */}
              <div>
                <label className="block text-sm text-alpine-mist/70 mb-1">Type</label>
                <div className="relative">
                  <Tag size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-alpine-mist/50" />
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full bg-glass-background text-alpine-mist rounded-lg pl-9 pr-3 py-2 outline-none border border-glass-border focus:border-cyan-primary appearance-none"
                  >
                    <option value="workout">Workout</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="recovery">Recovery</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L6 5L11 1" stroke="#A0AEC0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Time and Duration */}
              <div className="flex space-x-3">
                <div className="flex-1">
                  <label className="block text-sm text-alpine-mist/70 mb-1">Time</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-alpine-mist/50" />
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full bg-glass-background text-alpine-mist rounded-lg pl-9 pr-3 py-2 outline-none border border-glass-border focus:border-cyan-primary appearance-none"
                    >
                      {Array.from({ length: 24 }).map((_, hour) => {
                        const isPM = hour >= 12;
                        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                        
                        return [0, 30].map(minute => {
                          const timeStr = `${displayHour}:${minute === 0 ? '00' : minute} ${isPM ? 'PM' : 'AM'}`;
                          return (
                            <option key={`${hour}-${minute}`} value={timeStr}>
                              {timeStr}
                            </option>
                          );
                        });
                      }).flat()}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L6 5L11 1" stroke="#A0AEC0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm text-alpine-mist/70 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="5"
                    max="1440"
                    step="5"
                    className="w-full bg-glass-background text-alpine-mist rounded-lg px-3 py-2 outline-none border border-glass-border focus:border-cyan-primary"
                  />
                </div>
              </div>
              
              {/* Details */}
              <div>
                <label className="block text-sm text-alpine-mist/70 mb-1">Details</label>
                <div className="relative">
                  <AlignLeft size={16} className="absolute left-3 top-3 text-alpine-mist/50" />
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-glass-background text-alpine-mist rounded-lg pl-9 pr-3 py-2 outline-none border border-glass-border focus:border-cyan-primary"
                    placeholder="Additional details..."
                  />
                </div>
              </div>
              
              {/* Color */}
              <div>
                <label className="block text-sm text-alpine-mist/70 mb-1">Color</label>
                <div className="flex space-x-2">
                  {['cyan-primary', 'teal-primary', 'teal-secondary'].map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-white' : 'border-transparent'}`}
                      style={{ backgroundColor: getColorValue(color) }}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                    />
                  ))}
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex justify-between pt-2">
                {isEditing && onDelete && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-400"
                    icon={<Trash2 size={16} />}
                    onClick={onDelete}
                  >
                    Delete
                  </Button>
                )}
                <div className={`${isEditing ? '' : 'ml-auto'} flex space-x-2`}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    icon={<Save size={16} />}
                  >
                    {isEditing ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

// Helper function to get CSS color values
const getColorValue = (color: string): string => {
  switch (color) {
    case 'cyan-primary':
      return '#00CCFF';
    case 'teal-primary':
      return '#00B8B8';
    case 'teal-secondary':
      return '#20C5A0';
    default:
      return '#00CCFF';
  }
};

export default EventForm;
