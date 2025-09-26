import { useState, useEffect, useCallback } from 'react';

interface ScrollOptions {
  threshold?: number;
  direction?: 'up' | 'down' | 'both';
  offset?: number;
  throttle?: number;
}

/**
 * Hook to detect and respond to scroll events
 * Handles common scroll-based UI effects like headers, parallax, etc.
 * @param options Scroll detection options
 * @returns Object containing scroll state and utility methods
 */
export function useScrollEffect(options: ScrollOptions = {}) {
  const {
    threshold = 60,
    direction = 'both',
    offset = 0,
    throttle = 100,
  } = options;
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);
  
  // Track scroll position and direction with throttling for performance
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const previousScrollY = scrollY;
    
    // Update scroll position
    setScrollY(currentScrollY);
    
    // Determine if scrolled past threshold
    const hasScrolledPastThreshold = currentScrollY > (threshold + offset);
    
    // Update scrolled state based on direction setting
    if (direction === 'both') {
      setIsScrolled(hasScrolledPastThreshold);
    } else if (direction === 'down' && currentScrollY > previousScrollY) {
      setIsScrolled(hasScrolledPastThreshold);
    } else if (direction === 'up' && currentScrollY < previousScrollY) {
      setIsScrolled(hasScrolledPastThreshold);
    }
    
    // Determine scroll direction
    if (currentScrollY > previousScrollY) {
      setScrollDirection('down');
    } else if (currentScrollY < previousScrollY) {
      setScrollDirection('up');
    }
    
    // Check if at top or bottom of page
    setIsAtTop(currentScrollY <= 0);
    
    const isBottom = 
      Math.ceil(currentScrollY + window.innerHeight) >= 
      document.documentElement.scrollHeight;
      
    setIsAtBottom(isBottom);
  }, [scrollY, threshold, direction, offset]);

  // Set up scroll event listener with throttling
  useEffect(() => {
    let timeoutId: number | undefined;
    
    const throttledHandleScroll = () => {
      if (!timeoutId) {
        timeoutId = window.setTimeout(() => {
          handleScroll();
          timeoutId = undefined;
        }, throttle);
      }
    };
    
    // Initial check
    handleScroll();
    
    // Add event listener
    window.addEventListener('scroll', throttledHandleScroll);
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [handleScroll, throttle]);

  // Utility function to scroll to top
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  // Utility function to scroll to bottom
  const scrollToBottom = useCallback(() => {
    window.scrollTo({ 
      top: document.documentElement.scrollHeight,
      behavior: 'smooth' 
    });
  }, []);
  
  // Utility function to scroll to a specific element
  const scrollToElement = useCallback((element: HTMLElement, offsetPx = 0) => {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offsetPx;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }, []);

  return {
    isScrolled,
    scrollY,
    scrollDirection,
    isAtTop,
    isAtBottom,
    scrollToTop,
    scrollToBottom,
    scrollToElement,
  };
}

export default useScrollEffect;
