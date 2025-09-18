import React, { lazy, Suspense, useState } from 'react';
import LightweightMountain from './LightweightMountain';

// Lazy load the heavy Mountain3D component
const Mountain3D = lazy(() => import('./Mountain3D'));

interface MountainLoaderProps {
  progressPercentage?: number;
  blurred?: boolean;
  interactive?: boolean;
  timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night';
  weatherCondition?: 'clear' | 'cloudy' | 'rainy' | 'snowy';
  showFriends?: boolean;
  className?: string;
  alwaysShowIndicators?: boolean;
  showPlottingAnimation?: boolean;
  showJourneyAnimation?: boolean;
  onPlottingComplete?: () => void;
  onJourneyComplete?: () => void;
  // New prop to control when to load the heavy 3D component
  use3D?: boolean;
  // Prop to automatically upgrade to 3D after delay
  autoUpgradeTo3D?: boolean;
  autoUpgradeDelay?: number;
}

const MountainLoader: React.FC<MountainLoaderProps> = ({
  use3D = false,
  autoUpgradeTo3D = false,
  autoUpgradeDelay = 3000,
  ...props
}) => {
  const [shouldLoad3D, setShouldLoad3D] = useState(use3D);

  // Auto upgrade to 3D after delay if enabled
  React.useEffect(() => {
    if (autoUpgradeTo3D && !shouldLoad3D) {
      const timer = setTimeout(() => {
        setShouldLoad3D(true);
      }, autoUpgradeDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoUpgradeTo3D, autoUpgradeDelay, shouldLoad3D]);

  // If 3D is not needed, use lightweight version
  if (!shouldLoad3D) {
    return (
      <LightweightMountain
        progressPercentage={props.progressPercentage}
        blurred={props.blurred}
        className={props.className}
        timeOfDay={props.timeOfDay}
      />
    );
  }

  // Load the heavy 3D component with suspense fallback
  return (
    <Suspense fallback={
      <LightweightMountain
        progressPercentage={props.progressPercentage}
        blurred={props.blurred}
        className={props.className}
        timeOfDay={props.timeOfDay}
      />
    }>
      <Mountain3D {...props} />
    </Suspense>
  );
};

export default MountainLoader;
