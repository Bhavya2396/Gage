import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture, Stars } from '@react-three/drei';
import * as THREE from 'three';
import VolumetricClouds from './VolumetricClouds';
import FogPlane from './FogPlane';

interface WeatherEffectsProps {
  timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night';
  weatherCondition?: 'clear' | 'cloudy' | 'rainy' | 'snowy';
}

// Environment variables interface
interface EnvironmentVariables {
  // Sky settings
  skyColor: string;
  horizonColor: string;
  groundColor: string;
  
  // Cloud settings
  cloudColor: string;
  cloudOpacity: number;
  cloudHeight: number;
  cloudDensity: number;
  
  // Lighting settings
  ambientColor: string;
  ambientIntensity: number;
  directionalColor: string;
  directionalIntensity: number;
  directionalPosition: [number, number, number];
  
  // Fog settings
  fogColor: string;
  fogNear: number;
  fogFar: number;
  fogEnabled: boolean;
  
  // Special effects
  hasStars: boolean;
  hasSunGlare: boolean;
  hasMoonGlow: boolean;
  hasLightBeams: boolean;
  
  // Ground settings
  groundTextureIntensity: number;
  groundReflectivity: number;
}

// Calculate environment variables based on time of day and weather
const calculateEnvironmentVariables = (
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night',
  weatherCondition: 'clear' | 'cloudy' | 'rainy' | 'snowy'
): EnvironmentVariables => {
  // Base variables that will be modified based on time and weather
  let variables: EnvironmentVariables = {
    skyColor: '#0A1A40',
    horizonColor: '#0C2D6C',
    groundColor: '#071630',
    
    cloudColor: '#FFFFFF',
    cloudOpacity: 1.0,
    cloudHeight: 45,
    cloudDensity: 0.95, // Always super cloudy regardless of weather condition
    
    ambientColor: '#FFFFFF',
    ambientIntensity: 0.5,
    directionalColor: '#FFFFFF',
    directionalIntensity: 1.0,
    directionalPosition: [10, 10, 5],
    
    fogColor: '#E6F0FF',
    fogNear: 20,
    fogFar: 120,
    fogEnabled: true, // Always enable fog for misty effect
    
    hasStars: false,
    hasSunGlare: false,
    hasMoonGlow: false,
    hasLightBeams: false,
    
    groundTextureIntensity: 1.0,
    groundReflectivity: 0.2
  };
  
  // Modify variables based on time of day
  switch (timeOfDay) {
    case 'dawn':
      variables.skyColor = '#0D2B5B';
      variables.horizonColor = '#2B3A73';
      variables.groundColor = '#071630';
      variables.ambientColor = '#FFE4B5';
      variables.ambientIntensity = 0.3;
      variables.directionalColor = '#FFD700';
      variables.directionalIntensity = 0.8;
      variables.directionalPosition = [10, 5, 5];
      variables.fogColor = '#E6DADA';
      variables.hasLightBeams = true;
      variables.cloudColor = '#FFC0CB';
      variables.cloudOpacity = 0.9;
      variables.groundReflectivity = 0.3;
      break;
      
    case 'day':
      variables.skyColor = '#0A1A40';
      variables.horizonColor = '#0C2D6C';
      variables.groundColor = '#071630';
      variables.ambientColor = '#FFFFFF';
      variables.ambientIntensity = 0.5;
      variables.directionalColor = '#FFFFFF';
      variables.directionalIntensity = 1.0;
      variables.directionalPosition = [10, 10, 5];
      variables.fogColor = '#E6F0FF';
      variables.hasSunGlare = true;
      variables.cloudColor = '#FFFFFF';
      variables.cloudOpacity = 0.9;
      variables.groundReflectivity = 0.2;
      break;
      
    case 'dusk':
      variables.skyColor = '#0F1D45';
      variables.horizonColor = '#2A2B59';
      variables.groundColor = '#071630';
      variables.ambientColor = '#FFA07A';
      variables.ambientIntensity = 0.3;
      variables.directionalColor = '#FF8C00';
      variables.directionalIntensity = 0.7;
      variables.directionalPosition = [-10, 5, 5];
      variables.fogColor = '#E6DADA';
      variables.hasLightBeams = true;
      variables.cloudColor = '#FF7F50';
      variables.cloudOpacity = 0.9;
      variables.groundReflectivity = 0.3;
      break;
      
    case 'night':
      variables.skyColor = '#050A20';
      variables.horizonColor = '#0A1025';
      variables.groundColor = '#030A18';
      variables.ambientColor = '#0A1025';
      variables.ambientIntensity = 0.1;
      variables.directionalColor = '#E6EAFF';
      variables.directionalIntensity = 0.3;
      variables.directionalPosition = [0, 10, -5];
      variables.fogColor = '#0A1025';
      variables.hasStars = true;
      variables.hasMoonGlow = true;
      variables.cloudColor = '#333366';
      variables.cloudOpacity = 0.7;
      variables.cloudHeight = 55;
      variables.groundReflectivity = 0.1;
      break;
  }
  
  // Further modify variables for misty, cloudy environment
  variables.fogEnabled = true;
  variables.fogNear = 10; // Closer fog for mistier effect
  variables.fogFar = 100; // Shorter distance for denser fog
  variables.cloudDensity = 0.95;
  variables.directionalIntensity *= 0.7; // Reduced sunlight through clouds
  variables.ambientIntensity *= 0.9;
  
  return variables;
};

// Ground plane with grass texture
const GrassGround: React.FC<{ color: string, reflectivity: number }> = ({ color, reflectivity }) => {
  const grassTexture = useTexture('/textures/grass.jpg');
  
  // Configure texture
  useEffect(() => {
    if (grassTexture) {
      grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
      grassTexture.repeat.set(100, 100);
      grassTexture.anisotropy = 16;
    }
  }, [grassTexture]);
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]} receiveShadow>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial 
        map={grassTexture}
        color={color}
        roughness={0.8}
        metalness={reflectivity}
        envMapIntensity={0.5}
      />
    </mesh>
  );
};

// Main WeatherEffects component
const WeatherEffects: React.FC<WeatherEffectsProps> = ({ 
  timeOfDay = 'day',
  weatherCondition = 'cloudy' // Default to cloudy for misty effect
}) => {
  const { scene } = useThree();
  
  // Define environment variables based on time and weather
  const envVars = React.useMemo(() => {
    return calculateEnvironmentVariables(timeOfDay, weatherCondition);
  }, [timeOfDay, weatherCondition]);
  
  const [weatherData, setWeatherData] = useState({
    cloudiness: 0.95, // Always high cloudiness
    precipitation: 0,
    temperature: 18,
    windSpeed: 1.5
  });
  
  // Refs for animating elements
  const sunRef = useRef<THREE.Group>(null);
  const moonRef = useRef<THREE.Group>(null);
  const lightBeamsRef = useRef<THREE.Group>(null);
  
  // Set weather data based on condition
  useEffect(() => {
    setWeatherData({
      cloudiness: 0.95, // Always high cloudiness for super cloudy effect
      precipitation: weatherCondition === 'rainy' ? 0.6 : weatherCondition === 'snowy' ? 0.7 : 0,
      temperature: weatherCondition === 'clear' ? 25 : weatherCondition === 'cloudy' ? 18 : weatherCondition === 'rainy' ? 15 : -2,
      windSpeed: 1.5 // Gentle wind for cloud movement
    });
  }, [weatherCondition]);
  
  // Update scene background color based on environment variables
  useEffect(() => {
    if (scene) {
      scene.background = new THREE.Color(envVars.skyColor);
    }
  }, [scene, envVars.skyColor]);
  
  // Animate sun, moon, and light beams
  useFrame((state) => {
    const { clock } = state;
    const elapsedTime = clock.getElapsedTime();
    
    // Animate sun with realistic glow and position
    if (sunRef.current && (timeOfDay === 'day' || timeOfDay === 'dawn' || timeOfDay === 'dusk')) {
      const t = elapsedTime * 0.05;
      const xPos = Math.sin(t) * 100;
      
      // Position sun differently based on time of day
      if (timeOfDay === 'dawn') {
        sunRef.current.position.set(20, 15 + Math.sin(t * 0.5) * 5, -50);
      } else if (timeOfDay === 'day') {
        sunRef.current.position.set(xPos, 80 + Math.sin(t * 0.5) * 10, -50);
      } else if (timeOfDay === 'dusk') {
        sunRef.current.position.set(-20, 15 + Math.sin(t * 0.5) * 5, -50);
      }
      
      // Add pulsating glow effect
      const sunMesh = sunRef.current.children[0] as THREE.Mesh;
      if (sunMesh && sunMesh.material) {
        const material = sunMesh.material as THREE.MeshBasicMaterial;
        material.opacity = 0.3 + Math.sin(elapsedTime * 0.5) * 0.1;
      }
    }
    
    // Animate moon with realistic glow
    if (moonRef.current && timeOfDay === 'night') {
      const t = elapsedTime * 0.03;
      moonRef.current.position.x = Math.sin(t) * 80;
      moonRef.current.position.y = 70 + Math.sin(t * 0.2) * 5;
      
      // Add subtle glow pulsation
      const moonLight = moonRef.current.children[0] as THREE.PointLight;
      if (moonLight) {
        moonLight.intensity = 0.2 + Math.sin(elapsedTime * 0.3) * 0.05;
      }
    }
    
    // Animate light beams with more dramatic effects
    if (lightBeamsRef.current && (timeOfDay === 'dawn' || timeOfDay === 'dusk')) {
      lightBeamsRef.current.rotation.z = Math.sin(elapsedTime * 0.1) * 0.05;
      
      // Add pulsating opacity for more dramatic effect
      const beamMesh = lightBeamsRef.current.children[0] as THREE.Mesh;
      if (beamMesh && beamMesh.material) {
        const material = beamMesh.material as THREE.MeshBasicMaterial;
        material.opacity = 0.2 + Math.sin(elapsedTime * 0.2) * 0.05;
      }
    }
  });
  
  return (
    <>
      {/* Ambient and directional lighting */}
      <ambientLight color={envVars.ambientColor} intensity={envVars.ambientIntensity} />
      <directionalLight 
        position={envVars.directionalPosition} 
        color={envVars.directionalColor} 
        intensity={envVars.directionalIntensity} 
        castShadow 
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Sky elements */}
      {envVars.hasStars && (
        <Stars 
          radius={100} 
          depth={50} 
          count={5000} 
          factor={4} 
          saturation={0.5} 
          fade 
          speed={0.5} 
        />
      )}
      
      {/* Enhanced Day/Night specific environmental elements */}
      {envVars.hasSunGlare && (
        <group ref={sunRef} position={[0, 80, -50]}>
          {/* Main sun disc */}
          <mesh>
            <circleGeometry args={[15, 32]} />
            <meshBasicMaterial 
              color={timeOfDay === 'dawn' ? '#FF9E5E' : 
                     timeOfDay === 'day' ? '#FFFFFF' : '#FF7F50'} 
              transparent 
              opacity={0.9}
            />
          </mesh>
          
          {/* Inner glow */}
          <mesh>
            <circleGeometry args={[25, 32]} />
            <meshBasicMaterial 
              color={timeOfDay === 'dawn' ? '#FFCB8E' : 
                     timeOfDay === 'day' ? '#FFFAF0' : '#FFCB8E'} 
              transparent 
              opacity={0.5}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          
          {/* Outer glow */}
          <mesh>
            <circleGeometry args={[40, 32]} />
            <meshBasicMaterial 
              color={timeOfDay === 'dawn' ? '#FFF0D9' : 
                     timeOfDay === 'day' ? '#FFFFF0' : '#FFF0D9'} 
              transparent 
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          
          {/* Light rays */}
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <planeGeometry args={[100, 100]} />
            <meshBasicMaterial 
              color={timeOfDay === 'dawn' ? '#FFCB8E' : 
                     timeOfDay === 'day' ? '#FFFFF0' : '#FFCB8E'} 
              transparent 
              opacity={0.2}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          
          {/* Volumetric light */}
          <pointLight 
            color={timeOfDay === 'dawn' ? '#FF9E5E' : 
                   timeOfDay === 'day' ? '#FFFFFF' : '#FF7F50'} 
            intensity={1.5} 
            distance={300} 
            decay={2} 
          />
        </group>
      )}
      
      {envVars.hasMoonGlow && (
        <group ref={moonRef} position={[50, 70, -100]}>
          {/* Moon light */}
          <pointLight intensity={0.2} color="#E6EAFF" distance={200} decay={2} />
          
          {/* Moon disc */}
          <mesh>
            <sphereGeometry args={[5, 32, 32]} />
            <meshStandardMaterial 
              color="#E6EAFF" 
              emissive="#E6EAFF" 
              emissiveIntensity={0.3} 
              roughness={0.7} 
              metalness={0.1} 
            />
          </mesh>
          
          {/* Moon glow */}
          <mesh>
            <sphereGeometry args={[8, 32, 32]} />
            <meshBasicMaterial 
              color="#E6EAFF" 
              transparent 
              opacity={0.15} 
              blending={THREE.AdditiveBlending} 
            />
          </mesh>
          
          {/* Outer glow */}
          <mesh>
            <sphereGeometry args={[12, 32, 32]} />
            <meshBasicMaterial 
              color="#E6EAFF" 
              transparent 
              opacity={0.1} 
              blending={THREE.AdditiveBlending} 
            />
          </mesh>
        </group>
      )}
      
      {/* Enhanced light beams for dawn/dusk */}
      {envVars.hasLightBeams && (
        <group 
          ref={lightBeamsRef}
          position={timeOfDay === 'dawn' ? [50, 10, 0] : [-50, 10, 0]}
        >
          {/* Main light beam */}
          <mesh>
            <coneGeometry args={[40, 200, 32, 1, true]} />
            <meshBasicMaterial 
              color={timeOfDay === 'dawn' ? '#FFD580' : '#FF7F50'} 
              transparent 
              opacity={0.2} 
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          
          {/* Inner beam */}
          <mesh>
            <coneGeometry args={[25, 180, 32, 1, true]} />
            <meshBasicMaterial 
              color={timeOfDay === 'dawn' ? '#FFECB3' : '#FFBF80'} 
              transparent 
              opacity={0.3} 
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          
          {/* Beam light source */}
          <pointLight 
            position={[0, -10, 0]} 
            color={timeOfDay === 'dawn' ? '#FFD580' : '#FF7F50'} 
            intensity={0.8} 
            distance={100} 
            decay={2} 
          />
        </group>
      )}
      
      {/* Volumetric clouds */}
      <VolumetricClouds 
        count={12}
        height={envVars.cloudHeight}
        color={envVars.cloudColor}
        fogColor={envVars.fogColor}
        skyColor={envVars.skyColor}
      />
      
      {/* Fog planes at different heights */}
      <FogPlane 
        color={envVars.fogColor}
        height={5}
        size={300}
        opacity={0.3}
      />
      
      <FogPlane 
        color={envVars.fogColor}
        height={20}
        size={250}
        opacity={0.25}
      />
      
      <FogPlane 
        color={envVars.fogColor}
        height={35}
        size={200}
        opacity={0.2}
      />
      
      {/* Weather precipitation effects */}
      {weatherCondition === 'rainy' && (
        <group position={[0, 50, 0]}>
          {Array.from({ length: 50 }).map((_, i) => (
            <mesh 
              key={`rain-${i}`} 
              position={[
                Math.random() * 100 - 50, 
                Math.random() * 20 - 10, 
                Math.random() * 100 - 50
              ]}
            >
              <boxGeometry args={[0.1, 1, 0.1]} />
              <meshStandardMaterial color="#A9BCD0" transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      )}
      
      {weatherCondition === 'snowy' && (
        <group position={[0, 40, 0]}>
          {Array.from({ length: 100 }).map((_, i) => (
            <mesh 
              key={`snow-${i}`} 
              position={[
                Math.random() * 200 - 100,
                Math.random() * 40 - 20,
                Math.random() * 200 - 100
              ]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI]}
            >
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshStandardMaterial color="white" />
            </mesh>
          ))}
        </group>
      )}
      
      {/* Dynamic fog effect */}
      <fog 
        attach="fog" 
        color={envVars.fogColor} 
        near={envVars.fogNear} 
        far={envVars.fogFar} 
      />
      
      {/* Grass-textured ground plane */}
      <GrassGround color={envVars.groundColor} reflectivity={envVars.groundReflectivity} />
    </>
  );
};

export default WeatherEffects;