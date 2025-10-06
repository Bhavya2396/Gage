import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface ReadMoreProps {
  children: React.ReactNode;
  maxHeight?: number;
  maxLines?: number;
  className?: string;
  buttonClassName?: string;
  showMoreText?: string;
  showLessText?: string;
  fadeColor?: string;
  defaultExpanded?: boolean;
  onToggle?: (expanded: boolean) => void;
}

/**
 * Progressive disclosure component for truncating long content
 * with a "Read More" / "Show Less" toggle
 */
export const ReadMore: React.FC<ReadMoreProps> = ({
  children,
  maxHeight = 150,
  maxLines,
  className,
  buttonClassName,
  showMoreText = 'Read more',
  showLessText = 'Show less',
  fadeColor = 'rgba(0, 0, 0, 0.8)',
  defaultExpanded = false,
  onToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [shouldRenderButton, setShouldRenderButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Check if content exceeds the max height or lines
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    if (maxLines) {
      const lineHeight = parseInt(getComputedStyle(content).lineHeight);
      const maxHeightForLines = lineHeight * maxLines;
      setShouldRenderButton(content.scrollHeight > maxHeightForLines);
    } else {
      setShouldRenderButton(content.scrollHeight > maxHeight);
    }
  }, [children, maxHeight, maxLines]);

  const toggleExpand = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onToggle) onToggle(newExpandedState);
  };

  // Style for line-based truncation
  const getLineClampStyle = () => {
    if (!maxLines || isExpanded) return {};
    return {
      display: '-webkit-box',
      WebkitLineClamp: maxLines,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    };
  };

  // Style for height-based truncation
  const getHeightStyle = () => {
    if (maxLines || isExpanded) return {};
    return {
      maxHeight: `${maxHeight}px`,
      overflow: 'hidden',
    };
  };

  return (
    <div className={cn('relative', className)}>
      {/* Content container */}
      <div
        ref={contentRef}
        className={cn(
          'transition-all duration-300',
          !isExpanded && !maxLines && 'overflow-hidden'
        )}
        style={{
          ...getLineClampStyle(),
          ...getHeightStyle(),
        }}
      >
        {children}
        
        {/* Gradient fade overlay when collapsed */}
        {!isExpanded && shouldRenderButton && (
          <div 
            className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, transparent, ${fadeColor})`,
            }}
          />
        )}
      </div>
      
      {/* Toggle button */}
      <AnimatePresence>
        {shouldRenderButton && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-1 text-center"
          >
            <button
              onClick={toggleExpand}
              className={cn(
                'inline-flex items-center text-xs font-medium text-primary-cyan-500 hover:text-primary-cyan-500/80 transition-colors',
                buttonClassName
              )}
            >
              <span>{isExpanded ? showLessText : showMoreText}</span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="ml-1"
              >
                <ChevronDown size={14} />
              </motion.div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReadMore;
