import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

// Cloud shader material
const CloudMaterial = shaderMaterial(
  {
    uTime: 0,
    uFogColor: new THREE.Color('#E6F0FF'),
    uFogDensity: 0.05,
    uNoiseScale: 1.5,
    uNoiseIntensity: 0.3,
    uSpeed: 0.03,
    uCloudColor: new THREE.Color('#FFFFFF'),
    uSkyColor: new THREE.Color('#0A1A40'),
  },
  // Vertex shader
  `
    varying vec3 vPosition;
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float uTime;
    uniform vec3 uFogColor;
    uniform float uFogDensity;
    uniform float uNoiseScale;
    uniform float uNoiseIntensity;
    uniform float uSpeed;
    uniform vec3 uCloudColor;
    uniform vec3 uSkyColor;
    
    varying vec3 vPosition;
    varying vec2 vUv;
    
    // Classic Perlin 3D Noise by Stefan Gustavson
    vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }
    
    float noise(vec3 P) {
      vec3 Pi0 = floor(P);
      vec3 Pi1 = Pi0 + vec3(1.0);
      Pi0 = mod(Pi0, 289.0);
      Pi1 = mod(Pi1, 289.0);
      vec3 Pf0 = fract(P);
      vec3 Pf1 = Pf0 - vec3(1.0);
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.yy, Pi1.yy);
      vec4 iz0 = Pi0.zzzz;
      vec4 iz1 = Pi1.zzzz;
    
      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0);
      vec4 ixy1 = permute(ixy + iz1);
    
      vec4 gx0 = ixy0 / 7.0;
      vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
      gx0 = fract(gx0);
      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
      vec4 sz0 = step(gz0, vec4(0.0));
      gx0 -= sz0 * (step(0.0, gx0) - 0.5);
      gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    
      vec4 gx1 = ixy1 / 7.0;
      vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
      gx1 = fract(gx1);
      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
      vec4 sz1 = step(gz1, vec4(0.0));
      gx1 -= sz1 * (step(0.0, gx1) - 0.5);
      gy1 -= sz1 * (step(0.0, gy1) - 0.5);
    
      vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
      vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
      vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
      vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
      vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
      vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
      vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
      vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);
    
      vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g100, g100), dot(g010, g010), dot(g110, g110)));
      g000 *= norm0.x;
      g100 *= norm0.y;
      g010 *= norm0.z;
      g110 *= norm0.w;
      vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g101, g101), dot(g011, g011), dot(g111, g111)));
      g001 *= norm1.x;
      g101 *= norm1.y;
      g011 *= norm1.z;
      g111 *= norm1.w;
    
      float n000 = dot(g000, Pf0);
      float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
      float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
      float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
      float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
      float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
      float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
      float n111 = dot(g111, Pf1);
    
      vec3 fade_xyz = fade(Pf0);
      vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
      vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
      float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
      return 2.2 * n_xyz;
    }
    
    // Fractal Brownian Motion
    float fbm(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 0.0;
      
      for(int i = 0; i < 6; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
      }
      
      return value;
    }
    
    void main() {
      // Create shifting cloud pattern
      vec3 p = vPosition * uNoiseScale;
      p.x += uTime * uSpeed;
      p.y += uTime * uSpeed * 0.5;
      
      // Generate base noise
      float noise = fbm(p);
      
      // Create more detailed noise layers
      float detail = fbm(p * 3.0) * 0.5;
      
      // Combine noise layers
      float cloudShape = noise + detail * uNoiseIntensity;
      
      // Create soft edges
      cloudShape = smoothstep(0.1, 0.6, cloudShape);
      
      // Add some variation to the cloud density
      float density = cloudShape * (0.7 + 0.3 * sin(uTime * 0.2 + vPosition.x * 0.1));
      
      // Create depth effect
      float depth = length(vPosition) * 0.2;
      density *= exp(-depth * uFogDensity);
      
      // Mix cloud color with sky color based on density
      vec3 finalColor = mix(uSkyColor, uCloudColor, density);
      
      // Apply fog effect
      float fogFactor = 1.0 - exp(-depth * uFogDensity * 2.0);
      finalColor = mix(finalColor, uFogColor, fogFactor * 0.5);
      
      gl_FragColor = vec4(finalColor, density);
    }
  `
);

// Register the shader material
extend({ CloudMaterial });

// Declare the CloudMaterial as a JSX element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'cloudMaterial': any;
    }
  }
}

interface VolumetricCloudsProps {
  count?: number;
  height?: number;
  color?: string;
  fogColor?: string;
  skyColor?: string;
}

const VolumetricClouds: React.FC<VolumetricCloudsProps> = ({
  count = 8,
  height = 45,
  color = '#FFFFFF',
  fogColor = '#E6F0FF',
  skyColor = '#0A1A40',
}) => {
  const cloudRefs = useRef<THREE.Mesh[]>([]);
  const materialRefs = useRef<THREE.ShaderMaterial[]>([]);
  
  // Animation loop
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Update each cloud's material time uniform
    materialRefs.current.forEach((material, i) => {
      if (material) {
        material.uniforms.uTime.value = time;
        
        // Add some movement to the clouds
        const cloud = cloudRefs.current[i];
        if (cloud) {
          cloud.rotation.y = time * 0.02 * (i % 2 === 0 ? 1 : -1) * 0.1;
          cloud.position.y = height + Math.sin(time * 0.05 + i * 0.5) * 2;
        }
      }
    });
  });
  
  // Generate cloud positions
  const cloudPositions = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const radius = 40 + Math.random() * 40;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const y = height + (Math.random() - 0.5) * 20;
    const scale = 15 + Math.random() * 25;
    
    return { x, y, z, scale };
  });
  
  return (
    <group>
      {cloudPositions.map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) cloudRefs.current[i] = el; }}
          position={[pos.x, pos.y, pos.z]}
          scale={[pos.scale, pos.scale * 0.3, pos.scale]}
          rotation={[0, Math.random() * Math.PI * 2, 0]}
        >
          <planeGeometry args={[1, 1, 32, 32]} />
          <cloudMaterial
            ref={(el) => { if (el) materialRefs.current[i] = el; }}
            transparent
            depthWrite={false}
            uCloudColor={new THREE.Color(color)}
            uFogColor={new THREE.Color(fogColor)}
            uSkyColor={new THREE.Color(skyColor)}
            uNoiseScale={1.5 + Math.random() * 0.5}
            uNoiseIntensity={0.3 + Math.random() * 0.2}
            uSpeed={0.03 + Math.random() * 0.02}
            uFogDensity={0.05 + Math.random() * 0.03}
          />
        </mesh>
      ))}
    </group>
  );
};

export default VolumetricClouds;
