import React, { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
  icon?: ReactNode;
  badge?: string | number;
}

export interface TabbedContentProps {
  tabs: TabItem[];
  defaultTabId?: string;
  className?: string;
  tabClassName?: string;
  contentClassName?: string;
  variant?: 'default' | 'pills' | 'underlined' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  animated?: boolean;
  onTabChange?: (tabId: string) => void;
  scrollable?: boolean;
  centered?: boolean;
  vertical?: boolean;
}

/**
 * Progressive disclosure component for tabbed content
 * Provides an elegant interface for switching between related content sections
 */
export const TabbedContent: React.FC<TabbedContentProps> = ({
  tabs,
  defaultTabId,
  className,
  tabClassName,
  contentClassName,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  animated = true,
  onTabChange,
  scrollable = false,
  centered = false,
  vertical = false,
}) => {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  // Size variants
  const sizeClasses = {
    sm: 'text-xs py-1.5 px-2',
    md: 'text-sm py-2 px-3',
    lg: 'text-base py-2.5 px-4',
  };

  // Variant styles
  const getTabStyles = (isActive: boolean) => {
    switch (variant) {
      case 'pills':
        return isActive
          ? 'bg-cyan-primary/20 text-cyan-primary font-medium'
          : 'text-white/70 hover:text-white hover:bg-white/5';
      case 'underlined':
        return isActive
          ? 'text-cyan-primary font-medium border-b-2 border-cyan-primary'
          : 'text-white/70 hover:text-white border-b-2 border-transparent';
      case 'minimal':
        return isActive
          ? 'text-cyan-primary font-medium'
          : 'text-white/70 hover:text-white';
      default: // default
        return isActive
          ? 'bg-glass-highlight text-white font-medium'
          : 'text-white/70 hover:text-white hover:bg-glass-background';
    }
  };

  // Layout classes
  const layoutClasses = vertical
    ? 'flex flex-row'
    : 'flex flex-col';

  // Tab list classes
  const tabListClasses = vertical
    ? 'flex flex-col space-y-1 pr-2'
    : scrollable
      ? 'flex overflow-x-auto hide-scrollbar space-x-1 pb-1'
      : 'flex flex-wrap gap-1';

  if (vertical && fullWidth) {
    tabListClasses.concat(' w-1/3');
  }

  if (centered && !vertical) {
    tabListClasses.concat(' justify-center');
  }

  if (fullWidth && !vertical) {
    tabListClasses.concat(' w-full');
  }

  // Content container
  const contentContainerClasses = vertical
    ? 'flex-1 pl-4 border-l border-glass-border'
    : 'mt-3';

  // Find active tab
  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  return (
    <div className={cn('w-full', layoutClasses, className)}>
      {/* Tab list */}
      <div className={tabListClasses}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              className={cn(
                'rounded-lg transition-colors relative',
                sizeClasses[size],
                getTabStyles(isActive),
                fullWidth && !vertical && 'flex-1',
                tabClassName
              )}
              onClick={() => handleTabChange(tab.id)}
            >
              <div className="flex items-center justify-center">
                {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={cn(
                    'ml-1.5 px-1.5 py-0.5 text-xs rounded-full',
                    isActive ? 'bg-white/20' : 'bg-white/10'
                  )}>
                    {tab.badge}
                  </span>
                )}
              </div>
              
              {/* Active indicator for default variant */}
              {variant === 'default' && isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-primary"
                  layoutId="activeTabIndicator"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content area */}
      <div className={cn(contentContainerClasses, contentClassName)}>
        <AnimatePresence mode="wait">
          {animated ? (
            <motion.div
              key={activeTabId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab?.content}
            </motion.div>
          ) : (
            activeTab?.content
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TabbedContent;
