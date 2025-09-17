# Gage: AI Health Coach

Gage is a premium health and wellness application that redefines the journey to personal fitness. It transcends traditional metric-tracking by integrating a powerful, agentic AI into a gamified, cinematic user experience.

## Core Concept

The core of the app is the "super-coach," an AI that provides proactive, real-time guidance based on a holistic analysis of a user's biometric, nutritional, and performance data collected via a proprietary wearable.

The user's journey is visualized as a solo climb up a unique, procedurally generated virtual mountain. Every action—a completed workout, a consistent sleep schedule, a well-balanced meal—translates directly into altitude gained. This creates a powerful, intrinsic motivation system where progress is not just a number on a chart, but a tangible, visual ascent toward a personal summit.

## Features

- **Immersive 3D Mountain Visualization**: A dynamic, procedurally-generated mountain that represents your fitness journey
- **AI-Powered Coaching**: Personalized guidance based on your biometrics, activities, and goals
- **Comprehensive Health Dashboard**: Deep insights into recovery, HRV, sleep quality, and more
- **Workout Tracking**: Interactive workout sessions with real-time feedback
- **Nutrition Planning**: Meal tracking with automatic recalibration based on your activities
- **Social Features**: Climb together with friends, share achievements, and chat

## Design Philosophy: "The Glass Ascent"

The user interface is a fusion of two core aesthetics: the atmospheric, cinematic minimalism of Mont Fort and the tactile, layered "glassmorphism" of modern UI design. This creates an experience that is both immersive and intuitively functional. The UI elements float like panes of frosted glass over a stunning, dynamic mountain landscape.

- **Color Palette**: Dominated by a dynamic mountainscape background, translucent Frosted Glass cards, soft Alpine Mist text, a vibrant Amber Glow accent for action, and a calm Glacial Blue accent for recovery.
- **Typography**: A clean, geometric sans-serif is used in Bold, Regular, and Light weights to establish a clear hierarchy.
- **Card Style & Interactivity**: Translucent cards with a 1px border, a subtle glimmer effect, and a soft drop shadow. Tapping provides haptic feedback and a subtle scaling animation.

## Technology Stack

- **Frontend**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **3D Rendering**: Three.js with React Three Fiber
- **Animation**: Framer Motion
- **Routing**: React Router
- **Icons**: Lucide React
- **Data Visualization**: Recharts

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/gage.git
cd gage
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` (Vite's default port)

## Project Structure

```
gage/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, and other assets
│   ├── components/      # Reusable UI components
│   │   ├── backgrounds/ # Background components (e.g., Mountain)
│   │   ├── mountain/    # 3D mountain visualization components
│   │   ├── ui/          # Basic UI components (buttons, cards, etc.)
│   │   └── ...          # Other component categories
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Page layout components
│   ├── lib/             # Utility functions and helpers
│   ├── pages/           # Page components
│   │   ├── onboarding/  # Onboarding flow pages
│   │   └── ...          # Main app pages
│   ├── styles/          # Global styles and CSS variables
│   ├── App.tsx          # Main App component with routes
│   └── main.tsx         # Entry point
├── package.json         # Project dependencies and scripts
└── ...                  # Configuration files
```

## User Journey

1. **Onboarding**: A cinematic, step-by-step process that collects user data and visualizes the creation of their unique mountain path
2. **Home Screen**: The user's daily hub with at-a-glance status and plan information
3. **Health Dashboard**: Detailed health metrics and insights
4. **Workout Screen**: Interactive workout guidance and tracking
5. **Nutrition Screen**: Meal planning and logging
6. **Social Features**: Mountain view showing friends' progress and group chat

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Acknowledgments

- Design inspiration from Mont Fort
- Icons from Lucide React
- 3D rendering powered by Three.js and React Three Fiber