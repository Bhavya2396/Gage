import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera,
  useGLTF,
  Sky
} from '@react-three/drei';
import * as THREE from 'three';
import { getTimeOfDay } from '@/lib/utils';
import WeatherEffects from './WeatherEffects';
import { useResponsive } from '@/hooks/useResponsive';

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

/**
 * MountainModel - Loads and renders the 3D mountain model
 * Includes fallback rendering and proper error handling
 */
function MountainModel() {
  const mountainRef = useRef<THREE.Group>(null);
  const [modelLoadError, setModelLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Standardize on a single model path and preload it
  const MODEL_PATH = '/models/mountainpeak.glb';
  useGLTF.preload(MODEL_PATH);
  
  // Create a fallback mesh in case model loading fails
  const FallbackMesh = () => (
    <mesh position={[0, 0, 0]} scale={[50, 50, 50]}>
      <coneGeometry args={[1, 2, 32]} />
      <meshStandardMaterial color="#4A6FA5" roughness={0.8} />
    </mesh>
  );
  
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

/**
 * ResponsiveCamera - Handles camera positioning and movement
 * Adapts to screen size and provides smooth animation
 */
function ResponsiveCamera() {
  const { isMobile } = useResponsive();
  const { size } = useThree();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const positionRef = useRef<THREE.Vector3>(new THREE.Vector3());
  
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
    height: isMobile ? 45 : 40,  // Increased height to hide ground
    rotationSpeed: 0.0005 // Extremely slow rotation speed
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
      
      // Use fixed time increments for smoother animation
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
      
      {/* Controls with position to match reference image */}
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        autoRotate={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 3}
        minDistance={65}
        maxDistance={100}
        target={[0, 35, 0]}
        rotateSpeed={0.5}
        zoomSpeed={0.5}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  );
}

/**
 * TerrainBase - Creates the ground beneath the mountain
 * Positioned low to be mostly out of view
 */
function TerrainBase() {
  return (
    <group position={[0, -40, 0]}>
      {/* Large grass terrain base - positioned lower to be out of view */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[500, 500, 128, 128]} />
        <meshStandardMaterial 
          color="#0A3B0B"
          roughness={0.9}
          metalness={0.1}
          displacementScale={3}
          displacementBias={-1}
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

/**
 * Main Mountain3D component
 * Renders the 3D mountain scene with environment effects
 */
export const Mountain3D: React.FC<Mountain3DProps> = React.memo(({
  timeOfDay: forcedTimeOfDay,
  weatherCondition = 'clear',
  className,
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
  // Handle animation callbacks for plotting and journey animations
  useEffect(() => {
    if (showPlottingAnimation && onPlottingComplete) {
      const timer = setTimeout(() => {
        onPlottingComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPlottingAnimation, onPlottingComplete]);
  
  useEffect(() => {
    if (showJourneyAnimation && onJourneyComplete) {
      const timer = setTimeout(() => {
        onJourneyComplete();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showJourneyAnimation, onJourneyComplete]);
  
  // Time of day management
  const [timeOfDay, setTimeOfDay] = useState<'dawn' | 'day' | 'dusk' | 'night'>(
    forcedTimeOfDay || getTimeOfDay()
  );
  
  // Update time of day based on current time if not forced
  useEffect(() => {
    if (forcedTimeOfDay) {
      setTimeOfDay(forcedTimeOfDay);
    } else {
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
        performance={{ min: 0.5, max: 1 }}
        gl={{ 
          powerPreference: "high-performance",
          antialias: true,
          alpha: false,
          stencil: false,
          depth: true
        }}
      >
        {/* Camera system */}
        <ResponsiveCamera />
        
        {/* Mountain model */}
        <MountainModel />
        
        {/* Terrain base */}
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
        
        {/* Lighting */}
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
        
        {/* Fog for depth */}
        <fog attach="fog" args={['#071630', 80, 200]} />
        
        {/* Progress path rendering would go here */}
      </Canvas>
      
      {/* Apply blur effect when needed */}
      {blurred && (
        <div className="absolute inset-0 backdrop-blur-[1px] bg-black/10 z-10" />
      )}
    </div>
  );
});

export default Mountain3D;