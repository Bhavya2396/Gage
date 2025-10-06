// Design tokens for consistent styling across the application

// Colors
export const colors = {
  // Primary brand colors
  primary: {
    cyan: {
      50: '#E6FBFF',
      100: '#CCF7FF',
      200: '#99EEFF',
      300: '#66E6FF',
      400: '#33DDFF',
      500: '#00CCFF', // Primary cyan
      600: '#00A3CC',
      700: '#007A99',
      800: '#005266',
      900: '#002933',
    },
    teal: {
      50: '#E6FFFA',
      100: '#B2F5EA',
      200: '#81E6D9',
      300: '#4FD1C5',
      400: '#38B2AC',
      500: '#319795', // Primary teal
      600: '#2C7A7B',
      700: '#285E61',
      800: '#234E52',
      900: '#1D4044',
    },
  },
  
  // UI colors - Updated for ultra-transparent cards with no borders
  ui: {
    background: '#0F172A', // Dark blue background
    card: 'rgba(255, 255, 255, 0.1)', // Ultra transparent for seamless glassmorphism
    cardDark: 'rgba(15, 23, 42, 0.6)', // Dark card for contrast
    cardGlass: 'rgba(255, 255, 255, 0.05)', // Glass effect card
    border: 'transparent', // No borders for seamless look
    borderLight: 'transparent', // No borders for seamless look
    highlight: 'rgba(0, 204, 255, 0.2)', // Cyan highlight
    text: {
      primary: '#FFFFFF', // White text for translucent cards
      secondary: '#FFFFFF', // Pure white for better contrast
      muted: '#E2E8F0', // Brighter medium gray
      white: '#FFFFFF', // White text
      accent: '#00CCFF', // Cyan accent text
    },
  },
  
  // Functional colors
  functional: {
    success: '#4ADE80', // Green
    warning: '#FBBF24', // Yellow
    error: '#F87171', // Red
    info: '#60A5FA', // Blue
  },
  
  // Glass effect colors
  glass: {
    background: 'rgba(15, 23, 42, 0.7)',
    backgroundDark: 'rgba(15, 23, 42, 0.85)',
    border: 'rgba(255, 255, 255, 0.1)',
    highlight: 'rgba(255, 255, 255, 0.05)',
  },
  
  // Specific named colors
  alpine: {
    mist: '#E2E8F0', // Light gray for text
  },
};

// Spacing
export const spacing = {
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
};

// Border radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  DEFAULT: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

// Typography - Enhanced for better hierarchy and readability
export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    display: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
    '8xl': '6rem',      // 96px
    '9xl': '8rem',      // 128px
  },
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  // Text styles for consistent usage
  textStyles: {
    heading: {
      fontFamily: 'Inter',
      fontWeight: '600',
      lineHeight: '1.2',
      letterSpacing: '-0.025em',
    },
    subheading: {
      fontFamily: 'Inter',
      fontWeight: '500',
      lineHeight: '1.3',
      letterSpacing: '-0.01em',
    },
    body: {
      fontFamily: 'Inter',
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0',
    },
    caption: {
      fontFamily: 'Inter',
      fontWeight: '400',
      lineHeight: '1.4',
      letterSpacing: '0.025em',
    },
    label: {
      fontFamily: 'Inter',
      fontWeight: '500',
      lineHeight: '1.4',
      letterSpacing: '0.025em',
    },
  },
};

// Shadows - Updated to match golf app aesthetic
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
  
  // Card shadows - Clean and modern like golf app
  card: {
    light: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    strong: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  
  // Elevation levels
  elevation: {
    1: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    2: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    3: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    4: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    5: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
  },
  // Glow effects
  glow: {
    cyan: {
      sm: '0 0 5px rgba(0, 204, 255, 0.3)',
      md: '0 0 10px rgba(0, 204, 255, 0.5)',
      lg: '0 0 15px rgba(0, 204, 255, 0.7), 0 0 5px rgba(0, 204, 255, 0.4)',
    },
    teal: {
      sm: '0 0 5px rgba(49, 151, 149, 0.3)',
      md: '0 0 10px rgba(49, 151, 149, 0.5)',
      lg: '0 0 15px rgba(49, 151, 149, 0.7), 0 0 5px rgba(49, 151, 149, 0.4)',
    },
  },
};

// Transitions
export const transitions = {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },
  timing: {
    ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    linear: 'linear',
    easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
    easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
  },
};

// Z-index
export const zIndex = {
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  auto: 'auto',
};

// Breakpoints
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Utility functions
export const glassEffect = (opacity = 0.7, blur = 8) => ({
  backgroundColor: `rgba(15, 23, 42, ${opacity})`,
  backdropFilter: `blur(${blur}px)`,
  WebkitBackdropFilter: `blur(${blur}px)`,
  border: '1px solid rgba(255, 255, 255, 0.1)',
});

export const getRecoveryColor = (score: number) => {
  if (score < 40) return '#F87171'; // Red
  if (score < 60) return '#FBBF24'; // Yellow
  if (score < 80) return '#60A5FA'; // Blue
  return '#4ADE80'; // Green
};

export default {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  glassEffect,
  getRecoveryColor,
};