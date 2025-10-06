/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        'primary-cyan': {
          50: '#E6FBFF',
          100: '#CCF7FF',
          200: '#99EEFF',
          300: '#66E6FF',
          400: '#33DDFF',
          500: '#00CCFF',
          600: '#00A3CC',
          700: '#007A99',
          800: '#005266',
          900: '#002933',
        },
        'primary-teal': {
          50: '#E6FFFA',
          100: '#B2F5EA',
          200: '#81E6D9',
          300: '#4FD1C5',
          400: '#38B2AC',
          500: '#319795',
          600: '#2C7A7B',
          700: '#285E61',
          800: '#234E52',
          900: '#1D4044',
        },
        // UI colors - Updated for more transparent cards with strong text shadows
        'ui-background': '#0F172A',
        'ui-card': 'rgba(255, 255, 255, 0.2)',
        'ui-card-dark': 'rgba(15, 23, 42, 0.8)',
        'ui-card-glass': 'rgba(255, 255, 255, 0.1)',
        'ui-border': 'rgba(255, 255, 255, 0.3)',
        'ui-border-light': 'rgba(255, 255, 255, 0.4)',
        'ui-highlight': 'rgba(0, 204, 255, 0.3)',
        'ui-text-primary': '#FFFFFF',
        'ui-text-secondary': '#FFFFFF',
        'ui-text-muted': '#E2E8F0',
        'ui-text-white': '#FFFFFF',
        'ui-text-accent': '#00CCFF',
        // Glass effect colors
        'glass-background': 'rgba(15, 23, 42, 0.7)',
        'glass-backgroundDark': 'rgba(15, 23, 42, 0.85)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
        'glass-highlight': 'rgba(255, 255, 255, 0.05)',
        // Legacy colors for compatibility
        'midnight-slate': '#0F1923',
        'alpine-mist': '#E2E8F0',
        'cyan-primary': '#00CCFF',
        'cyan-secondary': '#00A3CC',
        'teal-primary': '#319795',
        'teal-secondary': '#2C7A7B',
        'bg-primary': '#0F172A',
        'bg-secondary': '#1A2530',
        'text-primary': '#FFFFFF',
        'text-secondary': '#94A3B8',
        'accent-primary': '#00CCFF',
        'accent-secondary': '#319795',
        'glass': 'rgba(15, 23, 42, 0.7)',
      },
      fontFamily: {
        'sans': ['Circular Std', 'Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        'xs': '2px',
      },
      dropShadow: {
        'glow': '0 0 8px rgba(0, 204, 255, 0.7)',
      }
    },
  },
  plugins: [],
}