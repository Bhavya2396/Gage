import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Eye, 
  Layout, 
  Bell, 
  User, 
  MessageSquare,
  Lightbulb,
  Palette,
  Gauge,
  Clock,
  ChevronRight,
  Save,
  RotateCcw
} from 'lucide-react';
import { usePersonalization, PersonalizationPreferences } from '@/contexts/PersonalizationContext';
import GlassCard from '@/components/ui/GlassCard';
import TabbedContent from '@/components/ui/TabbedContent';
import { cn } from '@/lib/utils';

/**
 * Personalization settings component
 * Allows users to customize their experience with the app
 */
export const PersonalizationSettings: React.FC = () => {
  const { 
    preferences, 
    updatePreferences, 
    updateUserDetails, 
    resetPreferences 
  } = usePersonalization();
  
  const [activeTab, setActiveTab] = useState('appearance');
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  
  // Handle save confirmation animation
  const handleSave = () => {
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 2000);
  };
  
  // Handle reset confirmation
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const handleReset = () => {
    if (showResetConfirm) {
      resetPreferences();
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 5000);
    }
  };
  
  // Toggle switch component
  const ToggleSwitch: React.FC<{
    label: string;
    value: boolean;
    onChange: (newValue: boolean) => void;
    description?: string;
  }> = ({ label, value, onChange, description }) => (
    <div className="flex justify-between items-center py-2 border-b border-glass-border last:border-b-0">
      <div>
        <div className="text-white text-sm font-medium">{label}</div>
        {description && <div className="text-white/60 text-xs mt-0.5">{description}</div>}
      </div>
      <button
        className={cn(
          "w-12 h-6 rounded-full p-1 transition-colors",
          value ? "bg-cyan-primary" : "bg-glass-highlight"
        )}
        onClick={() => onChange(!value)}
      >
        <motion.div
          className="w-4 h-4 bg-white rounded-full"
          animate={{ x: value ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
  
  // Radio option component
  const RadioOption: React.FC<{
    label: string;
    value: string;
    currentValue: string;
    onChange: (newValue: string) => void;
    description?: string;
  }> = ({ label, value, currentValue, onChange, description }) => (
    <div 
      className={cn(
        "flex items-center p-2 rounded-lg cursor-pointer transition-colors",
        value === currentValue ? "bg-cyan-primary/20" : "hover:bg-glass-highlight"
      )}
      onClick={() => onChange(value)}
    >
      <div className="mr-3">
        <div className="w-4 h-4 rounded-full border-2 border-cyan-primary flex items-center justify-center">
          {value === currentValue && (
            <motion.div 
              className="w-2 h-2 bg-cyan-primary rounded-full" 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </div>
      </div>
      <div>
        <div className="text-white text-sm font-medium">{label}</div>
        {description && <div className="text-white/60 text-xs mt-0.5">{description}</div>}
      </div>
    </div>
  );
  
  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <Settings size={20} className="text-cyan-primary mr-2" />
        <h2 className="text-white text-lg font-medium">Personalization</h2>
      </div>
      
      <TabbedContent
        tabs={[
          {
            id: 'appearance',
            label: 'Appearance',
            icon: <Palette size={16} />,
            content: (
              <div className="space-y-4">
                <GlassCard>
                  <h3 className="text-white font-medium mb-3">Visual Preferences</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-white/70 text-sm mb-2 block">Color Theme</label>
                      <div className="grid grid-cols-5 gap-2">
                        {['default', 'high-contrast', 'muted', 'warm', 'cool'].map((theme) => (
                          <button
                            key={theme}
                            className={cn(
                              "h-8 rounded-lg transition-all",
                              theme === preferences.colorTheme 
                                ? "ring-2 ring-cyan-primary" 
                                : "ring-1 ring-white/10 hover:ring-white/30",
                              theme === 'default' && "bg-gradient-to-br from-cyan-primary/80 to-teal-primary/80",
                              theme === 'high-contrast' && "bg-gradient-to-br from-indigo-600 to-purple-700",
                              theme === 'muted' && "bg-gradient-to-br from-slate-600 to-slate-800",
                              theme === 'warm' && "bg-gradient-to-br from-amber-500 to-red-600",
                              theme === 'cool' && "bg-gradient-to-br from-blue-500 to-cyan-600"
                            )}
                            onClick={() => updatePreferences({ 
                              colorTheme: theme as PersonalizationPreferences['colorTheme'] 
                            })}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <ToggleSwitch
                      label="Reduced Motion"
                      value={preferences.reducedMotion}
                      onChange={(value) => updatePreferences({ reducedMotion: value })}
                      description="Minimize animations throughout the app"
                    />
                    
                    <ToggleSwitch
                      label="Reduced Transparency"
                      value={preferences.reducedTransparency}
                      onChange={(value) => updatePreferences({ reducedTransparency: value })}
                      description="Use solid backgrounds instead of glass effects"
                    />
                    
                    <ToggleSwitch
                      label="High Contrast"
                      value={preferences.highContrast}
                      onChange={(value) => updatePreferences({ highContrast: value })}
                      description="Increase text and UI element contrast"
                    />
                  </div>
                </GlassCard>
                
                <GlassCard>
                  <h3 className="text-white font-medium mb-3">Environmental Effects</h3>
                  
                  <ToggleSwitch
                    label="Show Journey Landmarks"
                    value={preferences.showJourneyLandmarks}
                    onChange={(value) => updatePreferences({ showJourneyLandmarks: value })}
                    description="Display milestones on the mountain"
                  />
                  
                  <ToggleSwitch
                    label="Show Friend Progress"
                    value={preferences.showFriendProgress}
                    onChange={(value) => updatePreferences({ showFriendProgress: value })}
                    description="See friends on the mountain"
                  />
                  
                  <ToggleSwitch
                    label="Weather Effects"
                    value={preferences.showWeatherEffects}
                    onChange={(value) => updatePreferences({ showWeatherEffects: value })}
                    description="Show dynamic weather on the mountain"
                  />
                  
                  <ToggleSwitch
                    label="Haptic Feedback"
                    value={preferences.enableHapticFeedback}
                    onChange={(value) => updatePreferences({ enableHapticFeedback: value })}
                    description="Enable vibration feedback on interactions"
                  />
                </GlassCard>
              </div>
            ),
          },
          {
            id: 'content',
            label: 'Content',
            icon: <Eye size={16} />,
            content: (
              <div className="space-y-4">
                <GlassCard>
                  <h3 className="text-white font-medium mb-3">Content Display</h3>
                  
                  <div className="mb-4">
                    <label className="text-white/70 text-sm mb-2 block">Detail Level</label>
                    <div className="space-y-2">
                      <RadioOption
                        label="Concise"
                        value="concise"
                        currentValue={preferences.detailLevel}
                        onChange={(value) => updatePreferences({ 
                          detailLevel: value as PersonalizationPreferences['detailLevel'] 
                        })}
                        description="Show minimal information and metrics"
                      />
                      
                      <RadioOption
                        label="Balanced"
                        value="balanced"
                        currentValue={preferences.detailLevel}
                        onChange={(value) => updatePreferences({ 
                          detailLevel: value as PersonalizationPreferences['detailLevel'] 
                        })}
                        description="Show moderate level of detail (recommended)"
                      />
                      
                      <RadioOption
                        label="Detailed"
                        value="detailed"
                        currentValue={preferences.detailLevel}
                        onChange={(value) => updatePreferences({ 
                          detailLevel: value as PersonalizationPreferences['detailLevel'] 
                        })}
                        description="Show comprehensive information and metrics"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-white/70 text-sm mb-2 block">Measurement System</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className={cn(
                          "py-2 rounded-lg transition-colors text-sm",
                          preferences.metricSystem === 'imperial'
                            ? "bg-cyan-primary/20 text-cyan-primary font-medium"
                            : "bg-glass-highlight text-white/70 hover:text-white"
                        )}
                        onClick={() => updatePreferences({ metricSystem: 'imperial' })}
                      >
                        Imperial (lb, ft)
                      </button>
                      
                      <button
                        className={cn(
                          "py-2 rounded-lg transition-colors text-sm",
                          preferences.metricSystem === 'metric'
                            ? "bg-cyan-primary/20 text-cyan-primary font-medium"
                            : "bg-glass-highlight text-white/70 hover:text-white"
                        )}
                        onClick={() => updatePreferences({ metricSystem: 'metric' })}
                      >
                        Metric (kg, cm)
                      </button>
                    </div>
                  </div>
                </GlassCard>
                
                <GlassCard>
                  <h3 className="text-white font-medium mb-3">Insights Preferences</h3>
                  
                  <ToggleSwitch
                    label="Nutrition Insights"
                    value={preferences.insightCategories.nutrition}
                    onChange={(value) => updatePreferences({ 
                      insightCategories: { ...preferences.insightCategories, nutrition: value } 
                    })}
                  />
                  
                  <ToggleSwitch
                    label="Recovery Insights"
                    value={preferences.insightCategories.recovery}
                    onChange={(value) => updatePreferences({ 
                      insightCategories: { ...preferences.insightCategories, recovery: value } 
                    })}
                  />
                  
                  <ToggleSwitch
                    label="Performance Insights"
                    value={preferences.insightCategories.performance}
                    onChange={(value) => updatePreferences({ 
                      insightCategories: { ...preferences.insightCategories, performance: value } 
                    })}
                  />
                  
                  <ToggleSwitch
                    label="Social Insights"
                    value={preferences.insightCategories.social}
                    onChange={(value) => updatePreferences({ 
                      insightCategories: { ...preferences.insightCategories, social: value } 
                    })}
                  />
                  
                  <ToggleSwitch
                    label="Trend Analysis"
                    value={preferences.insightCategories.trends}
                    onChange={(value) => updatePreferences({ 
                      insightCategories: { ...preferences.insightCategories, trends: value } 
                    })}
                  />
                </GlassCard>
              </div>
            ),
          },
          {
            id: 'notifications',
            label: 'Notifications',
            icon: <Bell size={16} />,
            content: (
              <GlassCard>
                <h3 className="text-white font-medium mb-3">Notification Preferences</h3>
                
                <ToggleSwitch
                  label="Workout Reminders"
                  value={preferences.notifyWorkoutReminders}
                  onChange={(value) => updatePreferences({ notifyWorkoutReminders: value })}
                  description="Receive reminders for scheduled workouts"
                />
                
                <ToggleSwitch
                  label="Recovery Alerts"
                  value={preferences.notifyRecoveryAlerts}
                  onChange={(value) => updatePreferences({ notifyRecoveryAlerts: value })}
                  description="Get alerts about recovery status"
                />
                
                <ToggleSwitch
                  label="Friend Activity"
                  value={preferences.notifyFriendActivity}
                  onChange={(value) => updatePreferences({ notifyFriendActivity: value })}
                  description="Notifications when friends complete activities"
                />
                
                <ToggleSwitch
                  label="Milestone Achievements"
                  value={preferences.notifyMilestones}
                  onChange={(value) => updatePreferences({ notifyMilestones: value })}
                  description="Celebrate when you reach milestones"
                />
              </GlassCard>
            ),
          },
          {
            id: 'coaching',
            label: 'Coaching',
            icon: <MessageSquare size={16} />,
            content: (
              <GlassCard>
                <h3 className="text-white font-medium mb-3">AI Coach Personalization</h3>
                
                <div className="space-y-2 mb-4">
                  <label className="text-white/70 text-sm block">Coaching Style</label>
                  
                  <RadioOption
                    label="Encouraging"
                    value="encouraging"
                    currentValue={preferences.coachingStyle}
                    onChange={(value) => updatePreferences({ 
                      coachingStyle: value as PersonalizationPreferences['coachingStyle'] 
                    })}
                    description="Positive, supportive coaching with lots of encouragement"
                  />
                  
                  <RadioOption
                    label="Direct"
                    value="direct"
                    currentValue={preferences.coachingStyle}
                    onChange={(value) => updatePreferences({ 
                      coachingStyle: value as PersonalizationPreferences['coachingStyle'] 
                    })}
                    description="Straightforward, no-nonsense coaching style"
                  />
                  
                  <RadioOption
                    label="Analytical"
                    value="analytical"
                    currentValue={preferences.coachingStyle}
                    onChange={(value) => updatePreferences({ 
                      coachingStyle: value as PersonalizationPreferences['coachingStyle'] 
                    })}
                    description="Data-focused coaching with detailed explanations"
                  />
                  
                  <RadioOption
                    label="Motivational"
                    value="motivational"
                    currentValue={preferences.coachingStyle}
                    onChange={(value) => updatePreferences({ 
                      coachingStyle: value as PersonalizationPreferences['coachingStyle'] 
                    })}
                    description="High-energy coaching that pushes you to excel"
                  />
                </div>
              </GlassCard>
            ),
          },
          {
            id: 'profile',
            label: 'Profile',
            icon: <User size={16} />,
            content: (
              <GlassCard>
                <h3 className="text-white font-medium mb-3">Personal Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-white/70 text-xs mb-1 block">Your Name</label>
                    <input
                      type="text"
                      value={preferences.userDetails.name}
                      onChange={(e) => updateUserDetails({ name: e.target.value })}
                      className="w-full bg-glass-background border border-glass-border rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="text-white/70 text-xs mb-1 block">Fitness Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['beginner', 'intermediate', 'advanced'].map((level) => (
                        <button
                          key={level}
                          className={cn(
                            "py-2 rounded-lg transition-colors text-sm",
                            preferences.userDetails.fitnessLevel === level
                              ? "bg-cyan-primary/20 text-cyan-primary font-medium"
                              : "bg-glass-highlight text-white/70 hover:text-white"
                          )}
                          onClick={() => updateUserDetails({ 
                            fitnessLevel: level as PersonalizationPreferences['userDetails']['fitnessLevel'] 
                          })}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-white/70 text-xs mb-1 block">Preferred Workout Time</label>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {['morning', 'afternoon'].map((time) => (
                        <button
                          key={time}
                          className={cn(
                            "py-2 rounded-lg transition-colors text-sm",
                            preferences.userDetails.preferredWorkoutTime === time
                              ? "bg-cyan-primary/20 text-cyan-primary font-medium"
                              : "bg-glass-highlight text-white/70 hover:text-white"
                          )}
                          onClick={() => updateUserDetails({ 
                            preferredWorkoutTime: time as PersonalizationPreferences['userDetails']['preferredWorkoutTime'] 
                          })}
                        >
                          {time.charAt(0).toUpperCase() + time.slice(1)}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['evening', 'flexible'].map((time) => (
                        <button
                          key={time}
                          className={cn(
                            "py-2 rounded-lg transition-colors text-sm",
                            preferences.userDetails.preferredWorkoutTime === time
                              ? "bg-cyan-primary/20 text-cyan-primary font-medium"
                              : "bg-glass-highlight text-white/70 hover:text-white"
                          )}
                          onClick={() => updateUserDetails({ 
                            preferredWorkoutTime: time as PersonalizationPreferences['userDetails']['preferredWorkoutTime'] 
                          })}
                        >
                          {time.charAt(0).toUpperCase() + time.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-white/70 text-xs mb-1 block">Workout Duration</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['short', 'medium', 'long'].map((duration) => (
                        <button
                          key={duration}
                          className={cn(
                            "py-2 rounded-lg transition-colors text-sm",
                            preferences.userDetails.workoutDuration === duration
                              ? "bg-cyan-primary/20 text-cyan-primary font-medium"
                              : "bg-glass-highlight text-white/70 hover:text-white"
                          )}
                          onClick={() => updateUserDetails({ 
                            workoutDuration: duration as PersonalizationPreferences['userDetails']['workoutDuration'] 
                          })}
                        >
                          {duration.charAt(0).toUpperCase() + duration.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-white/70 text-xs mb-1 block">Fitness Goals (select multiple)</label>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {['strength', 'endurance', 'flexibility', 'skill'].map((goal) => (
                        <button
                          key={goal}
                          className={cn(
                            "py-2 rounded-lg transition-colors text-sm",
                            preferences.userDetails.fitnessGoals.includes(goal)
                              ? "bg-cyan-primary/20 text-cyan-primary font-medium"
                              : "bg-glass-highlight text-white/70 hover:text-white"
                          )}
                          onClick={() => {
                            const currentGoals = [...preferences.userDetails.fitnessGoals];
                            const goalIndex = currentGoals.indexOf(goal);
                            
                            if (goalIndex >= 0) {
                              currentGoals.splice(goalIndex, 1);
                            } else {
                              currentGoals.push(goal);
                            }
                            
                            updateUserDetails({ fitnessGoals: currentGoals });
                          }}
                        >
                          {goal.charAt(0).toUpperCase() + goal.slice(1)}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['weight loss', 'muscle gain', 'health', 'sports'].map((goal) => (
                        <button
                          key={goal}
                          className={cn(
                            "py-2 rounded-lg transition-colors text-sm",
                            preferences.userDetails.fitnessGoals.includes(goal)
                              ? "bg-cyan-primary/20 text-cyan-primary font-medium"
                              : "bg-glass-highlight text-white/70 hover:text-white"
                          )}
                          onClick={() => {
                            const currentGoals = [...preferences.userDetails.fitnessGoals];
                            const goalIndex = currentGoals.indexOf(goal);
                            
                            if (goalIndex >= 0) {
                              currentGoals.splice(goalIndex, 1);
                            } else {
                              currentGoals.push(goal);
                            }
                            
                            updateUserDetails({ fitnessGoals: currentGoals });
                          }}
                        >
                          {goal.charAt(0).toUpperCase() + goal.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            ),
          },
        ]}
        variant="pills"
        size="md"
        onTabChange={setActiveTab}
      />
      
      {/* Action buttons */}
      <div className="flex justify-between mt-6">
        <button
          className={cn(
            "flex items-center px-4 py-2 rounded-lg transition-colors",
            showResetConfirm 
              ? "bg-red-500/80 text-white" 
              : "bg-glass-highlight text-white/70 hover:text-white"
          )}
          onClick={handleReset}
        >
          <RotateCcw size={16} className="mr-2" />
          {showResetConfirm ? "Confirm Reset" : "Reset to Default"}
        </button>
        
        <button
          className="flex items-center px-4 py-2 bg-cyan-primary/80 hover:bg-cyan-primary text-white rounded-lg transition-colors"
          onClick={handleSave}
        >
          <Save size={16} className="mr-2" />
          Save Preferences
        </button>
      </div>
      
      {/* Save confirmation toast */}
      <AnimatePresence>
        {showSaveConfirmation && (
          <motion.div
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-teal-primary/90 text-white px-4 py-2 rounded-lg shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            Preferences saved successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersonalizationSettings;
