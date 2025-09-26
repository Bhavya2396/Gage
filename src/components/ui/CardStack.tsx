import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import GlassCard, { GlassCardProps } from './GlassCard';

interface CardStackProps {
  cards: {
    id: string | number;
    content: ReactNode;
    cardProps?: Omit<GlassCardProps, 'children'>;
  }[];
  spacing?: number;
  maxVisibleCards?: number;
  offset?: { x?: number; y?: number };
  staggered?: boolean;
  direction?: 'forward' | 'backward';
  className?: string;
  onCardClick?: (id: string | number) => void;
  activeCardId?: string | number;
  centered?: boolean;
}

/**
 * CardStack component for creating layered stacks of cards
 * Useful for dashboards, galleries, or stacked content views
 */
export const CardStack: React.FC<CardStackProps> = ({
  cards,
  spacing = 4,
  maxVisibleCards = 3,
  offset = { x: 0, y: 4 },
  staggered = true,
  direction = 'backward',
  className,
  onCardClick,
  activeCardId,
  centered = false,
}) => {
  // Limit the number of visible cards
  const visibleCards = cards.slice(0, maxVisibleCards);
  
  // Calculate if card is active
  const isCardActive = (id: string | number) => {
    return activeCardId === id;
  };
  
  // Get cards in proper order based on direction
  const orderedCards = direction === 'forward' 
    ? visibleCards 
    : [...visibleCards].reverse();

  return (
    <div className={cn("relative", className)}>
      {orderedCards.map((card, index) => {
        // Calculate z-index and transform offset
        const zIndex = direction === 'forward' 
          ? orderedCards.length - index 
          : index + 1;
          
        // Calculate offsets for this card
        const xOffset = offset.x !== undefined ? offset.x * index : 0;
        const yOffset = offset.y !== undefined ? offset.y * index : 0;
        
        // Determine if this is the active card
        const isActive = isCardActive(card.id);
        
        return (
          <motion.div
            key={card.id}
            className={cn(
              "absolute inset-0 transform transition-all duration-300",
              staggered && 'origin-top',
              centered && 'left-0 right-0 mx-auto'
            )}
            initial={staggered ? {
              scale: 0.95 - (index * 0.02),
              opacity: 1 - (index * 0.1),
              y: yOffset * index,
              x: xOffset * index,
              zIndex,
            } : {}}
            animate={{
              scale: isActive ? 1 : 0.95 - (index * 0.02),
              opacity: isActive ? 1 : 1 - (index * 0.1),
              y: isActive ? 0 : yOffset * index,
              x: isActive ? 0 : xOffset * index,
              zIndex,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
              delay: staggered ? index * 0.05 : 0,
            }}
            style={{
              width: centered ? 'calc(100% - ' + (spacing * index * 2) + 'px)' : '100%',
            }}
          >
            <GlassCard
              onClick={() => onCardClick && onCardClick(card.id)}
              interactive={!!onCardClick}
              animate={false}
              className={cn(
                isActive && 'ring-1 ring-primary-cyan-400/30',
                centered && 'mx-auto'
              )}
              {...(card.cardProps || {})}
            >
              {card.content}
            </GlassCard>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CardStack;
