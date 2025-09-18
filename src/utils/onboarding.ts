// Utility functions for managing onboarding state

export const isOnboardingComplete = (): boolean => {
  return localStorage.getItem('onboardingComplete') === 'true';
};

export const markOnboardingComplete = (): void => {
  localStorage.setItem('onboardingComplete', 'true');
  console.log('Onboarding marked as complete');
};

export const resetOnboardingStatus = (): void => {
  localStorage.removeItem('onboardingComplete');
  console.log('Onboarding status reset - user will see onboarding flow again');
};

export const skipOnboarding = (): void => {
  markOnboardingComplete();
  console.log('Onboarding skipped - user will go directly to main app');
};

// Debug function to check current onboarding status
export const getOnboardingStatus = (): { 
  isComplete: boolean; 
  canReset: boolean; 
  message: string 
} => {
  const isComplete = isOnboardingComplete();
  
  return {
    isComplete,
    canReset: true,
    message: isComplete 
      ? 'User has completed onboarding and will see the main app'
      : 'User has not completed onboarding and will see the welcome screen'
  };
};

// Add to window for easy console access
if (typeof window !== 'undefined') {
  (window as any).onboardingUtils = {
    reset: resetOnboardingStatus,
    skip: skipOnboarding,
    status: getOnboardingStatus,
    complete: markOnboardingComplete
  };
}
