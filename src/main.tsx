import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/index.css";
import { ActivityPointsProvider } from "./contexts/ActivityPointsContext";
import { AppProvider } from "./contexts/AppContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import { AnimationProvider } from "./contexts/AnimationContext";
import PersonalizationProvider from "./contexts/PersonalizationContext";
import { accessibilityStyles } from "./contexts/AccessibilityContext";
import ErrorBoundary from "./components/ErrorBoundary";

// Configure React Router future flags to eliminate warnings
import { 
  createBrowserRouter, 
  RouterProvider 
} from "react-router-dom";

// Create a centralized error logging service
const logError = (error: Error, info?: any) => {
  // In production, you would send this to a logging service
  console.error('Application error:', error);
  console.error('Additional info:', info);
};

// Set up global error handlers
window.addEventListener('error', (event) => {
  logError(event.error || new Error('Unknown error event'), { type: 'window.error', event });
});

window.addEventListener('unhandledrejection', (event) => {
  logError(event.reason || new Error('Unhandled Promise rejection'), { type: 'unhandledrejection', event });
});

// Inject accessibility styles
const injectAccessibilityStyles = () => {
  const styleId = 'accessibility-styles';
  if (!document.getElementById(styleId)) {
    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = accessibilityStyles;
    document.head.appendChild(styleEl);
  }
};

// Initialize keyboard navigation detection
const initKeyboardNavDetection = () => {
  const handleFirstTab = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
    }
  };
  window.addEventListener('keydown', handleFirstTab);
};

// Component to handle initialization
const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    injectAccessibilityStyles();
    initKeyboardNavDetection();
  }, []);
  
  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: "*",
    element: <App />
  }
], {
  future: {
    v7_startTransition: true
  }
});

// App rendering with proper context hierarchy
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppInitializer>
        <AccessibilityProvider>
          <AnimationProvider>
            <PersonalizationProvider>
              <AppProvider>
                <ActivityPointsProvider>
                  <RouterProvider router={router} />
                </ActivityPointsProvider>
              </AppProvider>
            </PersonalizationProvider>
          </AnimationProvider>
        </AccessibilityProvider>
      </AppInitializer>
    </ErrorBoundary>
  </React.StrictMode>
);