import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassCard from './GlassCard';

interface BottomCardProps {
  children: React.ReactNode;
  expandedContent?: React.ReactNode;
  className?: string;
  initialExpanded?: boolean;
}

const BottomCard: React.FC<BottomCardProps> = ({
  children,
  expandedContent,
  className,
  initialExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(initialExpanded);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check initially
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 px-6 pb-8 bottom-card-container">
      <motion.div
        layout
        className={cn("w-full max-w-md mx-auto", className)}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.3 }}
      >
        <GlassCard 
          variant="default" 
          size={expanded ? "lg" : "md"}
          className="w-full backdrop-blur-md border-t border-glass-highlight shadow-lg overflow-hidden"
          onClick={() => setExpanded(!expanded)}
        >
          {/* Drag handle indicator */}
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-12 h-1.5 bg-glass-border rounded-full opacity-70"></div>
          
          {/* Main content - Always visible */}
          <div className="pt-6">
            {children}
          </div>
          
          {/* Expand/collapse indicator */}
          {expandedContent && (
            <div className="mt-4 flex justify-center items-center">
              {expanded ? (
                <motion.div 
                  className="flex items-center text-cyan-primary"
                  animate={{ y: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronDown size={22} />
                  <span className="text-sm ml-2">Collapse</span>
                </motion.div>
              ) : (
                <motion.div 
                  className="flex items-center text-cyan-primary"
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronUp size={22} />
                  <span className="text-sm ml-2">Expand for details</span>
                </motion.div>
              )}
            </div>
          )}
          
          {/* Expanded content */}
          {expandedContent && (
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 overflow-auto scrollbar-thin scrollbar-thumb-glass-border scrollbar-track-transparent"
                  style={{ maxHeight: isMobile ? 'calc(70vh - 120px)' : 'calc(80vh - 120px)' }}
                >
                  {expandedContent}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default BottomCard;