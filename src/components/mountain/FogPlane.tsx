import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';

// Fog shader material
const FogMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#E6F0FF'),
    uOpacity: 0.4,
    uNoiseScale: 2.0,
    uNoiseIntensity: 0.5,
    uSpeed: 0.01,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uNoiseScale;
    uniform float uNoiseIntensity;
    uniform float uSpeed;
    
    varying vec2 vUv;
    
    // 2D Perlin Noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                          0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                          -0.577350269189626,  // -1.0 + 2.0 * C.x
                          0.024390243902439); // 1.0 / 41.0
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    
    // Fractal Brownian Motion
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      
      for(int i = 0; i < 6; i++) {
        value += amplitude * snoise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      
      return value;
    }
    
    void main() {
      // Create shifting fog pattern
      vec2 p = vUv * uNoiseScale;
      p.x += uTime * uSpeed;
      p.y += uTime * uSpeed * 0.5;
      
      // Generate noise pattern
      float noise = fbm(p);
      
      // Add some detail
      float detail = fbm(p * 3.0) * 0.5;
      
      // Combine noise layers
      float fogPattern = noise + detail * uNoiseIntensity;
      
      // Create soft edges
      fogPattern = smoothstep(0.2, 0.8, fogPattern);
      
      // Adjust opacity based on pattern
      float opacity = fogPattern * uOpacity;
      
      // Add some variation based on position
      opacity *= 0.7 + 0.3 * sin(vUv.x * 10.0 + uTime * 0.1);
      
      // Apply distance fade from center
      float distFromCenter = length(vUv - 0.5) * 2.0;
      opacity *= 1.0 - smoothstep(0.5, 1.0, distFromCenter);
      
      gl_FragColor = vec4(uColor, opacity);
    }
  `
);

// Register the shader material
extend({ FogMaterial });

// Declare the FogMaterial as a JSX element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'fogMaterial': any;
    }
  }
}

interface FogPlaneProps {
  color?: string;
  height?: number;
  size?: number;
  opacity?: number;
}

const FogPlane: React.FC<FogPlaneProps> = ({
  color = '#E6F0FF',
  height = 10,
  size = 200,
  opacity = 0.4,
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Animation loop
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });
  
  return (
    <mesh position={[0, height, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[size, size, 1, 1]} />
      <fogMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        uColor={new THREE.Color(color)}
        uOpacity={opacity}
        uNoiseScale={2.0}
        uNoiseIntensity={0.5}
        uSpeed={0.01}
      />
    </mesh>
  );
};

export default FogPlane;
