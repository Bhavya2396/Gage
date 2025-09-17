import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera,
  useGLTF,
  Sky
} from '@react-three/drei';
import * as THREE from 'three';
// import { useActivityPoints } from '@/contexts/ActivityPointsContext';
import { getTimeOfDay } from '@/lib/utils';
import WeatherEffects from './WeatherEffects';

interface Mountain3DProps {
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
}

// Create a mountain mesh using the GLB model
function MountainModel() {
  const mountainRef = useRef<THREE.Group>(null);
  const [modelLoadError, setModelLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Create a fallback mesh in case model loading fails
  const FallbackMesh = () => (
    <mesh position={[0, 0, 0]} scale={[50, 50, 50]}>
      <coneGeometry args={[1, 2, 32]} />
      <meshStandardMaterial color="#4A6FA5" roughness={0.8} />
    </mesh>
  );

  // Standardize on a single model path and preload it
  const MODEL_PATH = '/mountainpeak.glb';
  useGLTF.preload(MODEL_PATH);
  
  // Load the model with proper error handling
  const { scene: modelScene } = useGLTF(MODEL_PATH, undefined, undefined, (error) => {
    console.error("Error loading mountain model:", error);
    setModelLoadError(true);
  });
  
  // Create a clone of the scene to avoid modifying the cached original
  const mountainModel = useMemo(() => {
    setIsLoading(false);
    
    if (!modelScene) {
      console.warn("Model scene is undefined");
      return null;
    }
    
    try {
      // Create a deep clone of the original scene
      const clonedScene = modelScene.clone(true);
      
      // Apply any modifications to the model if needed
      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          // Enable shadows
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Ensure materials are properly set up
          if ((child as THREE.Mesh).material) {
            const material = (child as THREE.Mesh).material as THREE.Material;
            (child as THREE.Mesh).material = material.clone();
            material.needsUpdate = true;
          }
        }
      });
      
      return clonedScene;
    } catch (error) {
      console.error("Error processing mountain model:", error);
      return null;
    }
  }, [modelScene]);
  
  // If model failed to load or process, use fallback
  if (modelLoadError || !mountainModel) {
    return <FallbackMesh />;
  }
  
  // Show loading indicator while model is loading
  if (isLoading) {
    return (
      <mesh position={[0, 15, 0]}>
        <sphereGeometry args={[5, 16, 16]} />
        <meshStandardMaterial color="#4A6FA5" wireframe />
      </mesh>
    );
  }
  
  // Render the loaded model
  return (
    <group ref={mountainRef}>
      <primitive 
        object={mountainModel} 
        position={[0, 15, 0]} 
        rotation={[0, -Math.PI / 4, 0]}
        scale={[100, 100, 100]}
      />
    </group>
  );
}

// Enhanced responsive camera that adapts to screen size with journey animation
function ResponsiveCamera() {
  const { size } = useThree();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const positionRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const isMobile = size.width < 768;
  
  // Position camera to zoom in and hide ground while keeping mountain peak near logo
  const initialPosition = isMobile ? [0, 45, 80] : [0, 40, 70];
  // Initialize position ref with initial position
  positionRef.current.set(initialPosition[0], initialPosition[1], initialPosition[2]);
  const cameraFOV = isMobile ? 60 : 50; // Narrower FOV to zoom in more
  
  // Store camera animation parameters in a ref to avoid recreating them on each frame
  const cameraAnimationRef = useRef({
    lastUpdate: 0,
    angle: 0,
    radius: isMobile ? 80 : 70, // Adjusted radius for proper framing
    height: isMobile ? 45 : 40,  // Increased height significantly to hide ground
    rotationSpeed: 0.0005 // Extremely slow rotation speed as requested by user
  });
  
  // Update animation parameters when screen size changes
  useEffect(() => {
    cameraAnimationRef.current.radius = isMobile ? 80 : 70;
    cameraAnimationRef.current.height = isMobile ? 45 : 40;
  }, [isMobile]);
  
  // Use useFrame to animate camera position for a dynamic view - optimized for performance
  useFrame(() => {
    if (cameraRef.current) {
      const params = cameraAnimationRef.current;
      
      // Use fixed time increments instead of clock for smoother animation
      params.angle += params.rotationSpeed;
      
      // Calculate new position using refs to avoid React state updates
      positionRef.current.set(
        Math.sin(params.angle) * params.radius,
        params.height,
        Math.cos(params.angle) * params.radius
      );
      
      // Apply position directly to camera instead of using state
      cameraRef.current.position.copy(positionRef.current);
      cameraRef.current.updateMatrixWorld();
    }
  });
  
  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[positionRef.current.x, positionRef.current.y, positionRef.current.z]}
        fov={cameraFOV}
        near={0.1}
        far={1000}
        onUpdate={(self) => self.updateProjectionMatrix()}
      />
      
      {/* Controls with position to match reference image - optimized for smoother rotation */}
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        autoRotate={false} // Disable auto-rotation as we're handling it manually
        minPolarAngle={Math.PI / 6} // More restricted upward angle to prevent seeing below mountain
        maxPolarAngle={Math.PI / 3} // More restricted downward angle to keep focus on upper mountain
        minDistance={65} // Minimum zoom distance to prevent seeing ground
        maxDistance={100} // Maximum zoom distance
        target={[0, 35, 0]} // Target much higher up on the mountain to hide ground
        rotateSpeed={0.5} // Slower manual rotation for better control
        zoomSpeed={0.5} // Slower zoom for better control
        enableDamping={true} // Smooth camera movements
        dampingFactor={0.05} // Lower damping for smoother feel
      />
    </>
  );
}

// Animation components removed as requested by user

// Create simple grass terrain beneath the mountain - positioned lower to be out of view
function TerrainBase() {
  return (
    <group position={[0, -40, 0]}>
      {/* Large grass terrain base - positioned much lower to be out of view */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[500, 500, 128, 128]} />
        <meshStandardMaterial 
          color="#0A3B0B"
          roughness={0.9}
          metalness={0.1}
          displacementScale={3}
          displacementBias={-1}
          wireframe={false}
        >
        </meshStandardMaterial>
      </mesh>
      
      {/* Darker grass transition near mountain base */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
        <circleGeometry args={[80, 64]} />
        <meshStandardMaterial 
          color="#072A06"
          roughness={0.9}
          metalness={0.1}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

// Main mountain component with environment
export const Mountain3D: React.FC<Mountain3DProps> = React.memo(({
  timeOfDay: forcedTimeOfDay,
  weatherCondition = 'clear',
  className,
  // These props are used in the WelcomeScreen but not currently implemented
  // They are kept here to maintain the interface and avoid breaking changes
  progressPercentage = 0,
  blurred = false,
  interactive = false,
  showFriends = false,
  alwaysShowIndicators = false,
  showPlottingAnimation = false,
  showJourneyAnimation = false,
  onPlottingComplete,
  onJourneyComplete
}) => {
  // Props debugging removed to prevent console spam
  
  // Call plotting complete callback after a delay to simulate plotting animation
  useEffect(() => {
    if (showPlottingAnimation && onPlottingComplete) {
      console.log("Starting plotting animation");
      const timer = setTimeout(() => {
        console.log("Plotting animation complete");
        onPlottingComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPlottingAnimation, onPlottingComplete]);
  
  // Call journey complete callback after a delay to simulate journey animation
  useEffect(() => {
    if (showJourneyAnimation && onJourneyComplete) {
      console.log("Starting journey animation");
      const timer = setTimeout(() => {
        console.log("Journey animation complete");
        onJourneyComplete();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showJourneyAnimation, onJourneyComplete]);
  const [timeOfDay, setTimeOfDay] = useState<'dawn' | 'day' | 'dusk' | 'night'>(
    forcedTimeOfDay || getTimeOfDay()
  );
  
  // Update time of day based on current time if not forced
  useEffect(() => {
    if (!forcedTimeOfDay) {
      const interval = setInterval(() => {
        setTimeOfDay(getTimeOfDay());
      }, 60000); // Check every minute
      
      return () => clearInterval(interval);
    }
  }, [forcedTimeOfDay]);
  
  return (
    <div className={`relative w-full h-full ${className || ''}`}>
      <Canvas 
        shadows
        frameloop="always" 
        dpr={[1, 1.5]} // Lower DPR for better performance
        performance={{ min: 0.5, max: 1 }} // Allow performance scaling with max limit
        gl={{ 
          powerPreference: "high-performance",
          antialias: true,
          alpha: false, // Disable alpha for better performance
          stencil: false, // Disable stencil for better performance
          depth: true
        }}
      >
        {/* Responsive camera with better positioning */}
        <ResponsiveCamera />
        
        {/* GLB Mountain Model */}
        <MountainModel />
        
        {/* New terrain base and environment elements */}
        <TerrainBase />
        
        {/* Dynamic Sky with time-of-day changes */}
        <Sky 
          distance={450000}
          sunPosition={
            timeOfDay === 'dawn' ? [5, 0.5, 0] :
            timeOfDay === 'day' ? [0, 1, 0] :
            timeOfDay === 'dusk' ? [-5, 0.5, 0] :
            [0, -1, 0]
          }
          rayleigh={
            timeOfDay === 'night' ? 6 :
            timeOfDay === 'dawn' || timeOfDay === 'dusk' ? 2 : 1
          }
          turbidity={
            timeOfDay === 'night' ? 20 :
            timeOfDay === 'dawn' || timeOfDay === 'dusk' ? 10 : 5
          }
          mieCoefficient={0.005}
          mieDirectionalG={0.8}
        />
        
        {/* Weather effects with clouds and lighting */}
        <WeatherEffects timeOfDay={timeOfDay} weatherCondition={weatherCondition} />
        
        {/* Enhanced Environment lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[50, 50, 20]} 
          intensity={0.8} 
          castShadow 
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048}
          shadow-camera-far={100}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
        <pointLight position={[0, 30, 20]} intensity={0.5} color="#FFF" />
        <fog attach="fog" args={['#071630', 80, 200]} />
      </Canvas>
    </div>
  );
});

export default Mountain3D;