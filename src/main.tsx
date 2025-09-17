import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/index.css";
import { ActivityPointsProvider } from "./contexts/ActivityPointsContext";
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

const router = createBrowserRouter([
  {
    path: "*",
    element: <App />
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ActivityPointsProvider>
        <RouterProvider router={router} />
      </ActivityPointsProvider>
    </ErrorBoundary>
  </React.StrictMode>
);