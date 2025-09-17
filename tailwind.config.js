/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'midnight-slate': '#0F1923',  // Dark background
        'alpine-mist': '#E8F0FF',     // Light text
        'cyan-primary': '#00CCFF',    // Primary accent
        'cyan-secondary': '#00A3CC',  // Secondary accent
        'teal-primary': '#00B8B8',    // Alternative accent
        'teal-secondary': '#008080',  // Alternative secondary accent
        'bg-primary': '#071630',      // Dark Blue
        'bg-secondary': '#1A2530',    // Slightly lighter shade
        'text-primary': '#E8F0FF',    // Alpine Mist
        'text-secondary': 'rgba(232, 240, 255, 0.7)',
        'accent-primary': '#00CCFF',  // Cyan
        'accent-secondary': '#00B8B8', // Teal
        'glass': 'rgba(7, 22, 48, 0.7)',
        'glass-background': 'rgba(7, 22, 48, 0.7)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
        'glass-highlight': 'rgba(255, 255, 255, 0.05)',
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