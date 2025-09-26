import { useCallback, useState } from 'react';
import { useAnimation } from '@/contexts/AnimationContext';

type PathSegment = {
  x: number;
  y: number;
  control1?: { x: number; y: number };
  control2?: { x: number; y: number };
};

interface MountainPathOptions {
  complexity?: 'low' | 'medium' | 'high';
  smoothness?: number;
  steepness?: number;
  width?: number;
  height?: number;
  seed?: number;
  baseHeight?: number;
  peaks?: number;
}

/**
 * Hook for mountain-specific animations and visual effects
 * Provides utilities for generating paths, simulating elevation, and creating 
 * mountain-themed visual effects
 */
export function useMountainAnimation() {
  const { isReducedMotion, globalAnimationSpeed } = useAnimation();
  const [animationState, setAnimationState] = useState<Record<string, any>>({});
  
  /**
   * Generate a procedural mountain path for SVG rendering
   */
  const generateMountainPath = useCallback((options: MountainPathOptions = {}) => {
    const {
      complexity = 'medium',
      smoothness = 0.5,
      steepness = 0.6,
      width = 1000,
      height = 500,
      seed = Math.random() * 10000,
      baseHeight = 0.6,
      peaks = 3
    } = options;
    
    // Determine number of points based on complexity
    const numPoints = complexity === 'low' ? 8 : 
                     complexity === 'medium' ? 16 : 24;
    
    const pointDensity = width / numPoints;
    const points: PathSegment[] = [];
    
    // Generate random seed for consistent randomness
    const seededRandom = (min: number, max: number) => {
      const x = Math.sin(seed + points.length) * 10000;
      const random = x - Math.floor(x);
      return min + random * (max - min);
    };
    
    // First point at bottom left
    points.push({ x: 0, y: height });
    
    // Generate peaks and valleys
    const peakPoints = [];
    for (let i = 1; i <= peaks; i++) {
      peakPoints.push(Math.floor(numPoints * i / (peaks + 1)));
    }
    
    // Generate points for the mountain silhouette
    for (let i = 1; i < numPoints; i++) {
      const x = i * pointDensity;
      
      // Determine if this is a peak point
      const isPeak = peakPoints.includes(i);
      
      // Calculate y position (height)
      let y;
      if (isPeak) {
        // Peaks are higher
        y = height * (1 - baseHeight - steepness * seededRandom(0.7, 1));
      } else {
        // Regular points vary in height
        y = height * (1 - baseHeight * seededRandom(0.6, 1));
      }
      
      points.push({ x, y });
    }
    
    // Last point at bottom right
    points.push({ x: width, y: height });
    
    // Convert points to SVG path data
    if (smoothness > 0) {
      // Add control points for smoother curves
      for (let i = 1; i < points.length - 1; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const next = points[i + 1];
        
        const controlLen = (pointDensity * smoothness) / 2;
        
        // Control points for smooth curves
        curr.control1 = {
          x: curr.x - controlLen,
          y: curr.y
        };
        curr.control2 = {
          x: curr.x + controlLen,
          y: curr.y
        };
      }
      
      // Generate smooth path with cubic bezier curves
      let pathData = `M ${points[0].x} ${points[0].y}`;
      
      for (let i = 1; i < points.length; i++) {
        const curr = points[i];
        const prev = points[i - 1];
        
        if (prev.control2 && curr.control1) {
          pathData += ` C ${prev.control2.x} ${prev.control2.y}, ${curr.control1.x} ${curr.control1.y}, ${curr.x} ${curr.y}`;
        } else {
          pathData += ` L ${curr.x} ${curr.y}`;
        }
      }
      
      return pathData;
    } else {
      // Generate straight line path
      let pathData = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        pathData += ` L ${points[i].x} ${points[i].y}`;
      }
      return pathData;
    }
  }, []);
  
  /**
   * Create a path animation sequence
   */
  const createPathAnimation = useCallback((options: {
    duration?: number;
    delay?: number;
    ease?: string;
    repeat?: number | boolean;
  } = {}) => {
    const {
      duration = 1.5,
      delay = 0,
      ease = "easeInOut",
      repeat = false
    } = options;
    
    // Adjust timing based on reduced motion preference and global speed
    const adjustedDuration = isReducedMotion ? 0.1 : duration / globalAnimationSpeed;
    
    return {
      initial: { pathLength: 0, opacity: 0 },
      animate: { 
        pathLength: 1, 
        opacity: 1,
        transition: { 
          pathLength: { 
            duration: adjustedDuration, 
            ease, 
            delay
          },
          opacity: { 
            duration: adjustedDuration * 0.5, 
            ease 
          }
        }
      },
      exit: { 
        opacity: 0,
        transition: { duration: 0.3 } 
      },
      transition: {
        repeat: isReducedMotion ? false : repeat,
        repeatType: "loop",
        repeatDelay: 0.5
      }
    };
  }, [isReducedMotion, globalAnimationSpeed]);
  
  /**
   * Create a glowing path effect
   */
  const createGlowingPath = useCallback((color: string = '#00CCFF', intensity: number = 0.5) => {
    return {
      filter: `drop-shadow(0 0 ${2 * intensity}px ${color}) drop-shadow(0 0 ${4 * intensity}px ${color}80)`,
      transition: { duration: 0.5 }
    };
  }, []);
  
  /**
   * Animate progress along a path
   */
  const animatePathProgress = useCallback((
    pathLength: number, 
    progress: number,
    options: { duration?: number; ease?: string } = {}
  ) => {
    const { duration = 1, ease = "easeOut" } = options;
    
    // Adjust timing based on reduced motion preference
    const adjustedDuration = isReducedMotion ? 0.1 : duration / globalAnimationSpeed;
    
    // Calculate the dash offset based on progress
    const dashOffset = pathLength * (1 - progress);
    
    return {
      strokeDasharray: pathLength,
      strokeDashoffset: dashOffset,
      transition: {
        strokeDashoffset: {
          duration: adjustedDuration,
          ease
        }
      }
    };
  }, [isReducedMotion, globalAnimationSpeed]);
  
  /**
   * Generate realistic terrain elevation data
   */
  const generateTerrainElevation = useCallback((
    width: number,
    depth: number,
    options: {
      detail?: number;
      roughness?: number;
      seed?: number;
    } = {}
  ) => {
    const { detail = 8, roughness = 0.6, seed = Math.random() * 10000 } = options;
    const grid: number[][] = Array(width).fill(0).map(() => Array(depth).fill(0));
    
    // Seed random function
    const seededRandom = () => {
      const x = Math.sin(seed + grid.length) * 10000;
      return x - Math.floor(x);
    };
    
    // Diamond-square algorithm for natural terrain generation
    const size = Math.max(width, depth);
    const maxSize = Math.pow(2, detail) + 1;
    const initialSize = maxSize - 1;
    
    // Set initial corner points
    grid[0][0] = seededRandom() * roughness;
    grid[initialSize][0] = seededRandom() * roughness;
    grid[0][initialSize] = seededRandom() * roughness;
    grid[initialSize][initialSize] = seededRandom() * roughness;
    
    // Diamond-square steps
    let step = initialSize;
    let r = roughness;
    
    while (step > 1) {
      const halfStep = Math.floor(step / 2);
      
      // Diamond step
      for (let y = halfStep; y < maxSize; y += step) {
        for (let x = halfStep; x < maxSize; x += step) {
          const avg = (
            grid[x - halfStep][y - halfStep] + // upper left
            grid[x + halfStep][y - halfStep] + // upper right
            grid[x - halfStep][y + halfStep] + // lower left
            grid[x + halfStep][y + halfStep]   // lower right
          ) / 4;
          
          grid[x][y] = avg + (seededRandom() * 2 - 1) * r;
        }
      }
      
      // Square step
      for (let y = 0; y < maxSize; y += halfStep) {
        for (let x = (y + halfStep) % step; x < maxSize; x += step) {
          const count = [
            y >= halfStep ? grid[x][y - halfStep] : 0,           // top
            y + halfStep < maxSize ? grid[x][y + halfStep] : 0,  // bottom
            x >= halfStep ? grid[x - halfStep][y] : 0,           // left
            x + halfStep < maxSize ? grid[x + halfStep][y] : 0   // right
          ].filter(v => v !== 0).length;
          
          const avg = [
            y >= halfStep ? grid[x][y - halfStep] : 0,
            y + halfStep < maxSize ? grid[x][y + halfStep] : 0,
            x >= halfStep ? grid[x - halfStep][y] : 0,
            x + halfStep < maxSize ? grid[x + halfStep][y] : 0
          ].reduce((sum, val) => sum + val, 0) / count;
          
          grid[x][y] = avg + (seededRandom() * 2 - 1) * r;
        }
      }
      
      step = halfStep;
      r *= roughness;
    }
    
    // Normalize values between 0 and 1
    let min = Infinity;
    let max = -Infinity;
    
    for (let y = 0; y < depth; y++) {
      for (let x = 0; x < width; x++) {
        if (grid[x] && grid[x][y] !== undefined) {
          min = Math.min(min, grid[x][y]);
          max = Math.max(max, grid[x][y]);
        }
      }
    }
    
    for (let y = 0; y < depth; y++) {
      for (let x = 0; x < width; x++) {
        if (grid[x] && grid[x][y] !== undefined) {
          grid[x][y] = (grid[x][y] - min) / (max - min);
        }
      }
    }
    
    return grid;
  }, []);
  
  /**
   * Set a specific animation state
   */
  const setAnimationStateValue = useCallback((key: string, value: any) => {
    setAnimationState(prev => ({ ...prev, [key]: value }));
  }, []);
  
  /**
   * Get current animation state
   */
  const getAnimationState = useCallback((key: string) => {
    return animationState[key];
  }, [animationState]);

  return {
    generateMountainPath,
    createPathAnimation,
    createGlowingPath,
    animatePathProgress,
    generateTerrainElevation,
    setAnimationState: setAnimationStateValue,
    getAnimationState,
    isReducedMotion,
  };
}

export default useMountainAnimation;
