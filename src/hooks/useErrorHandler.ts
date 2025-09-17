import { useState, useCallback } from 'react';

/**
 * Custom hook for handling errors in components with proper error reporting
 * 
 * @param componentName - Name of the component using this hook (for better error reporting)
 * @returns Object containing error state and error handling functions
 */
const useErrorHandler = (componentName: string) => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Logs the error to console and optionally to an error reporting service
   */
  const logError = useCallback((error: Error, additionalInfo?: any) => {
    console.error(`Error in ${componentName}:`, error);
    
    if (additionalInfo) {
      console.error('Additional info:', additionalInfo);
    }
    
    // In a production app, you would send this to a logging service
    // logErrorToService(error, { component: componentName, ...additionalInfo });
  }, [componentName]);

  /**
   * Handles async operations with proper error handling
   */
  const handleAsyncOperation = useCallback(async <T>(
    operation: () => Promise<T>,
    onSuccess?: (result: T) => void
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await operation();
      if (onSuccess) {
        onSuccess(result);
      }
      setIsLoading(false);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      logError(error);
      setIsLoading(false);
      return null;
    }
  }, [logError]);

  /**
   * Clears the current error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    isLoading,
    handleAsyncOperation,
    logError,
    clearError
  };
};

export default useErrorHandler;
