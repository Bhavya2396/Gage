import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the accessibility settings type
export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  dyslexicFont: boolean;
  invertColors: boolean;
  reducedTransparency: boolean;
  monochromeMode: boolean;
}

// Context type
interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
}

// Default settings
const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  screenReader: false,
  dyslexicFont: false,
  invertColors: false,
  reducedTransparency: false,
  monochromeMode: false,
};

// Create context
const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// CSS to be injected for accessibility features
export const accessibilityStyles = `
  body.high-contrast {
    --text-primary: #ffffff;
    --text-secondary: #ffffff;
    --bg-primary: #000000;
    --bg-secondary: #0f0f0f;
    --accent-primary: #ffff00;
    --accent-secondary: #00ffff;
    --border-color: #ffffff;
  }
  
  body.large-text {
    font-size: 120%;
  }
  
  body.dyslexic-font {
    font-family: 'OpenDyslexic', 'Comic Sans MS', sans-serif;
  }
  
  body.reduced-motion * {
    animation-duration: 0.001s !important;
    transition-duration: 0.001s !important;
  }
  
  body.invert-colors {
    filter: invert(1) hue-rotate(180deg);
  }
  
  body.invert-colors img, 
  body.invert-colors video {
    filter: invert(1) hue-rotate(180deg);
  }
  
  body.reduced-transparency * {
    opacity: 1 !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    background-color: var(--bg-primary) !important;
  }
  
  body.monochrome-mode {
    filter: grayscale(1);
  }
  
  body.user-is-tabbing *:focus {
    outline: 3px solid var(--accent-primary, #00CCFF) !important;
    outline-offset: 2px !important;
  }
`;

// Provider component
export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Load settings from localStorage on initial render
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (error) {
        console.error('Error parsing saved accessibility settings:', error);
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Apply settings to the document body
  useEffect(() => {
    // Apply or remove classes based on settings
    document.body.classList.toggle('high-contrast', settings.highContrast);
    document.body.classList.toggle('large-text', settings.largeText);
    document.body.classList.toggle('reduced-motion', settings.reducedMotion);
    document.body.classList.toggle('dyslexic-font', settings.dyslexicFont);
    document.body.classList.toggle('invert-colors', settings.invertColors);
    document.body.classList.toggle('reduced-transparency', settings.reducedTransparency);
    document.body.classList.toggle('monochrome-mode', settings.monochromeMode);
    
    // Screen reader announcement
    if (settings.screenReader) {
      const announcer = document.createElement('div');
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
      
      return () => {
        document.body.removeChild(announcer);
      };
    }
  }, [settings]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  }, [settings]);

  // Update settings
  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
    }));
  };

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Custom hook for using the accessibility context
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export default AccessibilityProvider;