import React, { lazy, Suspense } from 'react';
import { 
  Routes, 
  Route, 
  Navigate,
  useLocation
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/ui/PageTransition';
import { isOnboardingComplete } from './utils/onboarding';
import { ActivityPointsProvider } from './contexts/ActivityPointsContext';
import PersonalizationProvider from './contexts/PersonalizationContext';
import AppProvider from './contexts/AppContext';

// Loading component for suspense fallback
const LoadingScreen = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-bg-primary">
    <div className="text-accent-primary text-xl">Loading Gage...</div>
  </div>
);

// Onboarding screens
const WelcomeScreen = lazy(() => import('./pages/onboarding/WelcomeScreen'));
const BiometricsScreen = lazy(() => import('./pages/onboarding/BiometricsScreen'));
const ActivityScreen = lazy(() => import('./pages/onboarding/ActivityScreen'));
const NutritionScreen = lazy(() => import('./pages/onboarding/NutritionScreen'));
const GoalsScreen = lazy(() => import('./pages/onboarding/GoalsScreen'));
const CompleteScreen = lazy(() => import('./pages/onboarding/CompleteScreen'));

// Main app screens
const HomePage = lazy(() => import('./pages/HomePage'));
const SlideHomePage = lazy(() => import('./pages/SlideHomePage'));
const HealthDashboardPage = lazy(() => import('./pages/HealthDashboardPage'));
const HealthTrendsPage = lazy(() => import('./pages/HealthTrendsPage'));
const GoalProgressPage = lazy(() => import('./pages/GoalProgressPage'));
const WorkoutPage = lazy(() => import('./pages/WorkoutPage'));
const WorkoutCompletePage = lazy(() => import('./pages/WorkoutCompletePage'));
const NutritionPage = lazy(() => import('./pages/NutritionPage'));
const FoodScreen = lazy(() => import('./pages/FoodScreen')); // Added Food Screen
const FriendsPage = lazy(() => import('./pages/FriendsPage'));
const SchedulePage = lazy(() => import('./pages/SchedulePage'));
const CoachPage = lazy(() => import('./pages/CoachPage'));
const InsightsPage = lazy(() => import('./pages/InsightsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// Other screens
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  const location = useLocation();
  
  console.log("Rendering App component with routes - v2");
  console.log("Current location:", location.pathname);
  
  // Check if user has completed onboarding
  const hasCompletedOnboarding = isOnboardingComplete();
  
  console.log("Onboarding status:", hasCompletedOnboarding ? "Complete" : "Not complete");

  return (
    <Suspense fallback={<LoadingScreen />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
              {/* Onboarding Flow */}
          <Route path="/onboarding">
            <Route index element={<Navigate to="/onboarding/welcome" replace />} />
            <Route path="welcome" element={<PageTransition><WelcomeScreen /></PageTransition>} />
            <Route path="biometrics" element={<PageTransition><BiometricsScreen /></PageTransition>} />
            <Route path="activity" element={<PageTransition><ActivityScreen /></PageTransition>} />
            <Route path="nutrition" element={<PageTransition><NutritionScreen /></PageTransition>} />
            <Route path="goals" element={<PageTransition><GoalsScreen /></PageTransition>} />
            <Route path="complete" element={<PageTransition><CompleteScreen /></PageTransition>} />
          </Route>
          
          {/* Main App Routes */}
          <Route path="/" element={
            hasCompletedOnboarding ? (
              <PageTransition>
                <HomePage />
              </PageTransition>
            ) : (
              <Navigate to="/onboarding/welcome" replace />
            )
          } />
          <Route path="/slide" element={<PageTransition><SlideHomePage /></PageTransition>} />
          <Route path="/health" element={<PageTransition><HealthTrendsPage /></PageTransition>} /> {/* Enhanced health dashboard with trends */}
          <Route path="/health/trends" element={<PageTransition><HealthTrendsPage /></PageTransition>} /> {/* Health trends and analytics page */}
          <Route path="/goals/progress" element={<PageTransition><GoalProgressPage /></PageTransition>} /> {/* Goal progress tracking page */}
          <Route path="/workout" element={<PageTransition><WorkoutPage /></PageTransition>} />
          <Route path="/workout-complete" element={<PageTransition><WorkoutCompletePage /></PageTransition>} />
          <Route path="/nutrition" element={<PageTransition><NutritionPage /></PageTransition>} />
          <Route path="/food" element={<PageTransition><FoodScreen /></PageTransition>} /> {/* The Fuel Depot */}
          <Route path="/friends" element={<PageTransition><FriendsPage /></PageTransition>} />
          <Route path="/mountain" element={<PageTransition><HomePage /></PageTransition>} /> {/* Placeholder - would show focused mountain view */}
          <Route path="/journey" element={<PageTransition><HomePage /></PageTransition>} /> {/* Placeholder - would show journey progress */}
          <Route path="/calendar" element={<PageTransition><SchedulePage /></PageTransition>} /> {/* Schedule page with AI chat interface */}
          <Route path="/settings" element={<PageTransition><SettingsPage /></PageTransition>} /> {/* User settings and personalization */}
          <Route path="/coach" element={<PageTransition><CoachPage /></PageTransition>} /> {/* AI coach chat interface */}
          
          {/* 404 Page */}
          <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default App;