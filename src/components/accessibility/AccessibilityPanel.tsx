import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Eye, Moon, Type, ZoomIn, XCircle, Loader2, RefreshCcw } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { cn } from '@/lib/utils';
import { fadeInRight } from '@/design/animations';
import InteractiveButton from '@/components/ui/InteractiveButton';
import InteractiveSlider from '@/components/ui/InteractiveSlider';
import GlassCard from '@/components/ui/GlassCard';

interface AccessibilityPanelProps {
  triggerClassName?: string;
}

/**
 * AccessibilityPanel component
 * A comprehensive settings panel for all accessibility options
 */
const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ triggerClassName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    reduceMotion,
    highContrast,
    largeText,
    focusMode,
    dyslexicFont,
    invertColors,
    disableAnimations,
    fontScale,
    contrastScale,
    toggleReduceMotion,
    toggleHighContrast,
    toggleLargeText,
    toggleFocusMode,
    toggleDyslexicFont,
    toggleInvertColors,
    toggleDisableAnimations,
    setFontScale,
    setContrastScale,
    resetSettings,
  } = useAccessibility();
  
  // Tabs for different settings categories
  const [activeTab, setActiveTab] = useState<'visual' | 'motion' | 'text'>('visual');
  
  const tabs = [
    { id: 'visual', label: 'Display', icon: <Eye size={16} /> },
    { id: 'motion', label: 'Motion', icon: <Loader2 size={16} /> },
    { id: 'text', label: 'Text', icon: <Type size={16} /> },
  ];
  
  const toggle = () => setIsOpen(!isOpen);
  
  return (
    <>
      {/* Accessibility toggle button */}
      <InteractiveButton
        variant="glass"
        size="md"
        className={cn("fixed right-4 top-4 z-40", triggerClassName)}
        onClick={toggle}
        aria-label={isOpen ? "Close accessibility settings" : "Open accessibility settings"}
        aria-expanded={isOpen}
        hapticFeedback
      >
        <Settings size={18} />
      </InteractiveButton>
      
      {/* Settings panel */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={toggle}
              aria-hidden="true"
            />
            
            {/* Panel */}
            <motion.div
              variants={fadeInRight}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm z-50"
              role="dialog"
              aria-modal="true"
              aria-labelledby="a11y-panel-title"
            >
              <GlassCard 
                className="h-full overflow-auto flex flex-col"
                variant="frosted"
                elevation={4}
                noise
                borderHighlight
                noPadding={false}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 
                    id="a11y-panel-title" 
                    className="text-xl font-semibold text-alpine-mist"
                  >
                    Accessibility Settings
                  </h2>
                  
                  <InteractiveButton
                    variant="ghost"
                    size="sm"
                    onClick={toggle}
                    aria-label="Close accessibility settings"
                    className="text-alpine-mist/80 hover:text-alpine-light"
                  >
                    <XCircle size={18} />
                  </InteractiveButton>
                </div>
                
                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-glass-border pb-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        activeTab === tab.id
                          ? "bg-glass-active text-alpine-light"
                          : "text-alpine-mist/80 hover:text-alpine-light hover:bg-glass-highlight"
                      )}
                      aria-selected={activeTab === tab.id}
                      role="tab"
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-auto pr-1 -mr-1">
                  {/* Visual settings */}
                  {activeTab === 'visual' && (
                    <div className="space-y-6">
                      <SettingToggle
                        id="high-contrast"
                        label="High Contrast"
                        description="Increases contrast for better readability"
                        checked={highContrast}
                        onChange={toggleHighContrast}
                        icon={<Moon size={18} />}
                      />
                      
                      <SettingToggle
                        id="invert-colors"
                        label="Invert Colors"
                        description="Inverts colors (dark mode alternative)"
                        checked={invertColors}
                        onChange={toggleInvertColors}
                        icon={<Eye size={18} />}
                      />
                      
                      <SettingToggle
                        id="focus-mode"
                        label="Focus Mode"
                        description="Reduces distractions by highlighting only the focused element"
                        checked={focusMode}
                        onChange={toggleFocusMode}
                      />
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-alpine-mist">
                          Contrast Scale
                        </label>
                        <InteractiveSlider
                          value={contrastScale}
                          onChange={setContrastScale}
                          min={0.8}
                          max={1.5}
                          step={0.05}
                          showTicks
                          showValue
                          formatValue={val => val.toFixed(2) + 'x'}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Motion settings */}
                  {activeTab === 'motion' && (
                    <div className="space-y-6">
                      <SettingToggle
                        id="reduce-motion"
                        label="Reduced Motion"
                        description="Reduces animations and motion effects"
                        checked={reduceMotion}
                        onChange={toggleReduceMotion}
                        icon={<Loader2 size={18} />}
                      />
                      
                      <SettingToggle
                        id="disable-animations"
                        label="Disable All Animations"
                        description="Completely turns off all animations"
                        checked={disableAnimations}
                        onChange={toggleDisableAnimations}
                      />
                    </div>
                  )}
                  
                  {/* Text settings */}
                  {activeTab === 'text' && (
                    <div className="space-y-6">
                      <SettingToggle
                        id="large-text"
                        label="Large Text"
                        description="Increases text size throughout the app"
                        checked={largeText}
                        onChange={toggleLargeText}
                        icon={<ZoomIn size={18} />}
                      />
                      
                      <SettingToggle
                        id="dyslexic-font"
                        label="Dyslexia Friendly Font"
                        description="Uses a font designed for readers with dyslexia"
                        checked={dyslexicFont}
                        onChange={toggleDyslexicFont}
                        icon={<Type size={18} />}
                      />
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-alpine-mist">
                          Font Size Scale
                        </label>
                        <InteractiveSlider
                          value={fontScale}
                          onChange={setFontScale}
                          min={0.8}
                          max={1.5}
                          step={0.05}
                          showTicks
                          showValue
                          formatValue={val => val.toFixed(2) + 'x'}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Footer */}
                <div className="mt-8 pt-4 border-t border-glass-border flex justify-between">
                  <button
                    onClick={resetSettings}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-alpine-mist/80 hover:text-alpine-light hover:bg-glass-highlight transition-colors"
                    aria-label="Reset all accessibility settings to defaults"
                  >
                    <RefreshCcw size={14} />
                    Reset to Defaults
                  </button>
                  
                  <button
                    onClick={toggle}
                    className="px-4 py-2 rounded-md text-sm font-medium bg-primary-cyan-500 text-white hover:bg-primary-cyan-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

interface SettingToggleProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
  icon?: React.ReactNode;
}

const SettingToggle: React.FC<SettingToggleProps> = ({
  id,
  label,
  description,
  checked,
  onChange,
  icon,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon && (
          <div className={cn(
            "p-1.5 rounded-md",
            checked ? "bg-primary-cyan-500/30" : "bg-glass-highlight"
          )}>
            {icon}
          </div>
        )}
        
        <div>
          <label htmlFor={id} className="text-sm font-medium text-alpine-mist">
            {label}
          </label>
          
          {description && (
            <p className="text-xs text-alpine-mist/70">
              {description}
            </p>
          )}
        </div>
      </div>
      
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="sr-only"
          aria-checked={checked}
        />
        
        <div
          onClick={onChange}
          className={cn(
            "w-11 h-6 rounded-full p-1 transition-colors cursor-pointer",
            checked ? "bg-primary-cyan-500" : "bg-glass-active"
          )}
        >
          <motion.div
            layout
            className={cn(
              "w-4 h-4 rounded-full bg-white shadow-md",
              checked ? "ml-5" : "ml-0"
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPanel;
