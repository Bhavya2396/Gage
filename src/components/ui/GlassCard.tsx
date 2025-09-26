import React, { ReactNode, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { shadows, colors, glassEffect } from '@/design/tokens';
import { cardTiltAnimation, scaleIn } from '@/design/animations';
import { useResponsive } from '@/hooks/useResponsive';
import { ChevronDown } from 'lucide-react';

export interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'highlight' | 'muted' | 'accent' | 'frosted' | 'dark' | 'elevated' | 'primary';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  onClick?: () => void;
  interactive?: boolean;
  animate?: boolean;
  initial?: object;
  whileHover?: object;
  whileTap?: object;
  tilt?: boolean;
  tiltIntensity?: number;
  glow?: boolean;
  glowIntensity?: 'subtle' | 'medium' | 'strong';
  glowColor?: string;
  noise?: boolean;
  raised?: boolean;
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  borderHighlight?: boolean;
  borderWidth?: 'none' | 'thin' | 'normal' | 'thick';
  noPadding?: boolean;
  overflow?: 'visible' | 'hidden' | 'scroll';
  testId?: string;
  expandable?: boolean;
  expandedContent?: ReactNode;
  defaultExpanded?: boolean;
  expandButtonLabel?: string;
  collapseButtonLabel?: string;
}

/**
 * Enhanced GlassCard component with advanced visual treatment
 * Features physical interactions, realistic glass effects, and accessibility improvements
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  onClick,
  interactive = false,
  animate = true,
  initial,
  whileHover,
  whileTap,
  tilt = false,
  tiltIntensity = 1,
  glow = false,
  glowIntensity = 'medium',
  glowColor,
  noise = false,
  raised = false,
  elevation = 0,
  borderHighlight = false,
  borderWidth = 'normal',
  noPadding = false,
  overflow = 'hidden',
  testId,
  expandable = false,
  expandedContent,
  defaultExpanded = false,
  expandButtonLabel = 'Show more',
  collapseButtonLabel = 'Show less',
  ...props
}) => {
  // State for hover and expansion
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { isMobile } = useResponsive();
  
  // For mouse position tracking on tilt effect
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  
  // Smooth values for tilt effect
  const springConfig = { stiffness: 150, damping: 15 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);
  
  // Define variant styles - enhanced with more options
  const variants = {
    default: 'bg-glass-background border-glass-border',
    highlight: 'bg-glass-background border-primary-cyan-500/30',
    muted: 'bg-glass-background/50 border-glass-border/50',
    accent: 'bg-glass-background border-primary-cyan-500',
    frosted: 'bg-white/5 backdrop-blur-xl border-white/10',
    dark: 'bg-glass-backgroundDark border-glass-border',
    elevated: 'bg-glass-background border-white/5',
    primary: 'bg-primary-cyan-900/30 backdrop-blur-lg border-primary-cyan-400/20',
  };
  
  // Padding based on size (with no padding option)
  const sizes = noPadding ? {
    xs: '',
    sm: '',
    md: '',
    lg: '',
    xl: '',
    full: 'w-full',
  } : {
    xs: 'p-1.5 sm:p-2',
    sm: 'p-2 sm:p-3',
    md: 'p-3 sm:p-4',
    lg: 'p-4 sm:p-6',
    xl: 'p-5 sm:p-8',
    full: 'p-4 sm:p-6 w-full',
  };
  
  // Border radius based on size
  const radius = {
    xs: 'rounded sm:rounded-md',
    sm: 'rounded-md sm:rounded-lg',
    md: 'rounded-lg sm:rounded-xl',
    lg: 'rounded-xl sm:rounded-2xl',
    xl: 'rounded-2xl sm:rounded-3xl',
    full: 'rounded-xl sm:rounded-2xl',
  };
  
  // Border width styles
  const borderWidths = {
    none: 'border-0',
    thin: 'border-[0.5px]',
    normal: 'border',
    thick: 'border-2',
  };
  
  // Shadow intensities based on elevation
  const shadowLevels = {
    0: '',
    1: shadows.elevation[1],
    2: shadows.elevation[2],
    3: shadows.elevation[3],
    4: shadows.elevation[4],
    5: shadows.elevation[5],
  };
  
  // Glow effect intensities
  const glowIntensities = {
    subtle: glowColor ? `0 0 10px ${glowColor}30` : shadows.glow.cyan.sm,
    medium: glowColor ? `0 0 15px ${glowColor}50` : shadows.glow.cyan.md,
    strong: glowColor ? `0 0 20px ${glowColor}70, 0 0 10px ${glowColor}40` : shadows.glow.cyan.lg,
  };
  
  // Calculate active shadow based on state and props
  const getActiveShadow = () => {
    let shadow = raised ? shadowLevels[3] : shadowLevels[elevation];
    
    if (glow && isHovered) {
      shadow = shadow + ', ' + glowIntensities[glowIntensity];
    } else if (glow) {
      shadow = shadow + ', ' + glowIntensities.subtle;
    }
    
    return shadow;
  };
  
  // Base component with conditional motion wrapper
  const CardComponent = animate || tilt || interactive ? motion.div : 'div';
  
  // Handle mouse move for tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || isMobile) return;
    
    const card = cardRef.current;
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    mouseX.set(x);
    mouseY.set(y);
  };
  
  // Reset tilt on mouse leave
  const handleMouseLeave = () => {
    if (tilt) {
      mouseX.set(0.5);
      mouseY.set(0.5);
    }
    setIsHovered(false);
  };

  // Animation variants with tilt effect
  const cardVariants = cardTiltAnimation(tiltIntensity);
  
  // Apply tilt transform based on mouse position
  const rotateX = useTransform(smoothMouseY, [0, 1], [tiltIntensity * 10, tiltIntensity * -10]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [tiltIntensity * -10, tiltIntensity * 10]);
  
  // Animation properties
  const motionProps = animate
    ? {
        initial: initial || scaleIn.initial,
        animate: scaleIn.animate,
        exit: scaleIn.exit,
        transition: { type: 'spring', stiffness: 200, damping: 20 },
        
        whileHover: whileHover || (interactive ? { 
          y: -2, 
          boxShadow: getActiveShadow(),
        } : {}),
        
        whileTap: whileTap || (interactive ? { 
          scale: 0.98, 
          y: 0,
        } : {}),
      }
    : {};

  // Handle expand/collapse toggle
  const handleToggleExpand = (e: React.MouseEvent) => {
    if (expandable) {
      e.stopPropagation(); // Prevent triggering card onClick
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <CardComponent
      ref={cardRef}
      data-testid={testId}
      className={cn(
        'backdrop-blur transition-all',
        variants[variant],
        sizes[size],
        radius[size],
        borderWidths[borderWidth],
        overflow === 'visible' ? 'overflow-visible' : overflow === 'scroll' ? 'overflow-auto' : 'overflow-hidden',
        interactive && !expandable && 'cursor-pointer',
        className
      )}
      style={{
        boxShadow: getActiveShadow(),
        perspective: '1000px',
        ...(tilt && {
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        })
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={interactive && !expandable ? onClick : undefined}
      {...motionProps}
      {...props}
    >
      {/* Border highlight effect - subtle inner border glow */}
      {borderHighlight && (
        <div className="absolute inset-[1px] rounded-[inherit] pointer-events-none 
                        border border-white/10 opacity-50" />
      )}
      
      {/* Noise texture overlay for visual richness */}
      {noise && (
        <div 
          className="absolute inset-0 mix-blend-soft-light opacity-[0.04] pointer-events-none rounded-[inherit]" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }} 
        />
      )}
      
      {/* Subtle top highlight for glass effect */}
      <div 
        className={cn(
          "absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r pointer-events-none opacity-40",
          variant === 'dark' ? 'from-transparent via-white/20 to-transparent' : 'from-transparent via-white/40 to-transparent'
        )} 
      />
      
      {/* Card content with proper positioning */}
      <div className="relative">
        {children}
        
        {/* Progressive disclosure - expandable content */}
        {expandable && expandedContent && (
          <div className="mt-2">
            {/* Expand/Collapse button */}
            <motion.button
              className="w-full flex items-center justify-center py-1.5 mt-1 text-xs font-medium text-cyan-primary hover:text-cyan-primary/80 transition-colors"
              onClick={handleToggleExpand}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{isExpanded ? collapseButtonLabel : expandButtonLabel}</span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="ml-1"
              >
                <ChevronDown size={14} />
              </motion.div>
            </motion.button>
            
            {/* Expanded content with animation */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 mt-2 border-t border-glass-border">
                    {expandedContent}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </CardComponent>
  );
};

export default GlassCard;