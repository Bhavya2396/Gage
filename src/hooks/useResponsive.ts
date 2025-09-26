import { useState, useEffect } from 'react';
import { breakpoints } from '@/design/tokens';

type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Convert breakpoint string values to numbers
 */
const breakpointValues: Record<BreakpointKey, number> = {
  xs: parseInt(breakpoints.xs),
  sm: parseInt(breakpoints.sm),
  md: parseInt(breakpoints.md),
  lg: parseInt(breakpoints.lg),
  xl: parseInt(breakpoints.xl),
};

/**
 * Hook to handle responsive design logic
 * @returns Object with boolean flags for each breakpoint
 */
export function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures effect runs only on mount and unmount

  // Return responsive flags
  return {
    width: windowSize.width,
    height: windowSize.height,
    isXs: windowSize.width < breakpointValues.sm,
    isSm: windowSize.width >= breakpointValues.sm && windowSize.width < breakpointValues.md,
    isMd: windowSize.width >= breakpointValues.md && windowSize.width < breakpointValues.lg,
    isLg: windowSize.width >= breakpointValues.lg && windowSize.width < breakpointValues.xl,
    isXl: windowSize.width >= breakpointValues.xl,
    isMobile: windowSize.width < breakpointValues.md,
    isTablet: windowSize.width >= breakpointValues.md && windowSize.width < breakpointValues.lg,
    isDesktop: windowSize.width >= breakpointValues.lg,
    // Utility methods for comparison
    isLessThan: (breakpoint: BreakpointKey) => windowSize.width < breakpointValues[breakpoint],
    isGreaterThan: (breakpoint: BreakpointKey) => windowSize.width > breakpointValues[breakpoint],
    isEqual: (breakpoint: BreakpointKey) => {
      const nextBreakpoint = 
        breakpoint === 'xs' ? 'sm' :
        breakpoint === 'sm' ? 'md' :
        breakpoint === 'md' ? 'lg' :
        breakpoint === 'lg' ? 'xl' : null;
      
      if (nextBreakpoint === null) {
        return windowSize.width >= breakpointValues[breakpoint];
      }
      
      return windowSize.width >= breakpointValues[breakpoint] && 
             windowSize.width < breakpointValues[nextBreakpoint as BreakpointKey];
    },
  };
}

export default useResponsive;
