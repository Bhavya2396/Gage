import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import GlassCard from './GlassCard';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
  onClick?: () => void;
  className?: string;
  gradient?: string;
  buttonText?: string;
  accentColor?: string;
  isNew?: boolean;
  isPopular?: boolean;
  badge?: string;
  badgeColor?: string;
  vertical?: boolean;
  contentClassName?: string;
  tilt?: boolean;
}

/**
 * FeatureCard component for showcasing features with visual appeal
 * Includes optional image, icon, action button, and badge
 */
const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  image,
  onClick,
  className,
  gradient,
  buttonText = 'Learn More',
  accentColor = 'from-primary-cyan-400 to-primary-teal-400',
  isNew = false,
  isPopular = false,
  badge,
  badgeColor = 'bg-primary-cyan-500',
  vertical = false,
  contentClassName,
  tilt = true,
}) => {
  // Custom badge text based on props
  const badgeText = badge || (isNew ? 'New' : isPopular ? 'Popular' : null);

  return (
    <GlassCard
      className={cn(
        "overflow-hidden",
        vertical ? "flex flex-col" : "md:flex md:flex-row",
        className
      )}
      variant="frosted"
      interactive={!!onClick}
      onClick={onClick}
      tilt={tilt}
      tiltIntensity={0.5}
      noise
      borderHighlight
      noPadding
      elevation={2}
    >
      {/* Image container */}
      {image && (
        <div 
          className={cn(
            "relative overflow-hidden bg-cover bg-center",
            vertical 
              ? "w-full h-48" 
              : "md:w-2/5 h-full md:min-h-[200px]"
          )}
          style={{ backgroundImage: `url(${image})` }}
        >
          {/* Gradient overlay for better text visibility */}
          <div 
            className={cn(
              "absolute inset-0 opacity-60",
              gradient || "bg-gradient-to-tr from-black/60 to-transparent"
            )}
          />
          
          {/* Image badge - positioned top-left */}
          {badgeText && (
            <span 
              className={cn(
                "absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium text-white",
                badgeColor
              )}
            >
              {badgeText}
            </span>
          )}
        </div>
      )}
      
      {/* Content container */}
      <div 
        className={cn(
          "flex flex-col p-5",
          vertical 
            ? "flex-1" 
            : image ? "md:w-3/5" : "w-full",
          contentClassName
        )}
      >
        {/* Icon and title row */}
        <div className="flex items-center mb-2">
          {icon && (
            <div className={cn(
              "mr-3 p-2 rounded-lg bg-gradient-to-br",
              accentColor
            )}>
              {icon}
            </div>
          )}
          
          <h3 className="text-lg font-semibold text-alpine-mist">
            {title}
          </h3>
          
          {/* Badge when there's no image */}
          {!image && badgeText && (
            <span 
              className={cn(
                "ml-auto px-2 py-0.5 rounded text-xs font-medium text-white",
                badgeColor
              )}
            >
              {badgeText}
            </span>
          )}
        </div>
        
        {/* Description */}
        <p className="text-sm text-alpine-mist/80 mt-1 mb-4">
          {description}
        </p>
        
        {/* Action button */}
        {onClick && (
          <div className="mt-auto">
            <motion.div
              className={cn(
                "inline-flex items-center text-sm font-medium",
                `bg-gradient-to-r ${accentColor} bg-clip-text text-transparent`
              )}
              whileHover={{ x: 5 }}
              whileTap={{ x: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {buttonText}
              <ArrowRight size={16} className={`ml-1 ${accentColor} text-transparent bg-clip-text bg-gradient-to-r`} />
            </motion.div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default FeatureCard;
