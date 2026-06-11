import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import RobotModel from './RobotModel';

// Model path - use optimized shaded model (544 KB, 94% smaller)
const MODEL_PATH = new URL('../assets/3dmodel/base_basic_shaded_optimized.glb', import.meta.url).href;

interface RobotProps {
  mousePosition: { x: number; y: number };
}

function Robot({ mousePosition }: RobotProps) {
  const robotRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  
  useFrame((state, delta) => {
    if (!robotRef.current) return;

    // Smooth interpolation (lerp) for natural movement
    const lerpFactor = 5.0 * delta;
    
    // Calculate target rotation based on mouse position
    // Limit rotation to avoid unnatural angles
    const maxRotationX = 0.4; // Vertical tilt limit (increased for more responsiveness)
    const maxRotationY = 0.7; // Horizontal rotation limit (increased for more responsiveness)
    
    targetRotation.current.x = THREE.MathUtils.lerp(
      targetRotation.current.x,
      mousePosition.y * maxRotationX,
      lerpFactor
    );
    
    targetRotation.current.y = THREE.MathUtils.lerp(
      targetRotation.current.y,
      mousePosition.x * maxRotationY,
      lerpFactor
    );
    
    // Apply rotation with smooth damping
    robotRef.current.rotation.x = THREE.MathUtils.lerp(
      robotRef.current.rotation.x,
      targetRotation.current.x,
      lerpFactor
    );
    
    robotRef.current.rotation.y = THREE.MathUtils.lerp(
      robotRef.current.rotation.y,
      targetRotation.current.y,
      lerpFactor
    );
  });

  return (
    <group ref={robotRef} position={[0, -0.8, -1]} scale={1.5}>
      <RobotModel modelPath={MODEL_PATH} />
    </group>
  );
}

function Scene({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const { size } = useThree();
  
  return (
    <>
      {/* Camera setup */}
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 7]}
        fov={45}
        near={0.1}
        far={100}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <hemisphereLight skyColor={0xffffff} groundColor={0x202030} intensity={0.35} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0025}
      />
      <directionalLight
        position={[-4, 3, -5]}
        intensity={0.6}
      />
      <spotLight
        position={[0, 6, 5]}
        angle={0.35}
        intensity={0.8}
        penumbra={0.4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[1, 2, -4]} intensity={0.4} />
      
      {/* Environment for realistic reflections */}
      <Environment preset="studio" background={false} resolution={512} />
      
      {/* Contact shadows for grounding */}
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />
      
      {/* Robot model */}
      <Robot mousePosition={mousePosition} />
    </>
  );
}

interface HeroRobotProps {
  className?: string;
}

export default function HeroRobot({ className = '' }: HeroRobotProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate normalized mouse position (-1 to 1)
      const rawX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const rawY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      const x = THREE.MathUtils.clamp(rawX, -1, 1);
      const y = THREE.MathUtils.clamp(rawY, -1, 1);
      
      setMousePosition({ x, y });
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!containerRef.current || event.touches.length === 0) return;

      const rect = containerRef.current.getBoundingClientRect();
      const touch = event.touches[0];
      
      // Calculate normalized touch position (-1 to 1)
      const rawX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      const rawY = ((touch.clientY - rect.top) / rect.height) * 2 - 1;
      const x = THREE.MathUtils.clamp(rawX, -1, 1);
      const y = THREE.MathUtils.clamp(rawY, -1, 1);
      
      setMousePosition({ x, y });
    };

    // Use window-level event listeners to capture movement anywhere
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-0 ${className}`}
      style={{ pointerEvents: 'auto' }}
    >
      <Canvas
        shadows
        dpr={[1, 1.5]} // Further limit pixel ratio for faster load
        gl={{
          antialias: false, // Disable antialiasing for performance
          alpha: true, // Transparent background
          powerPreference: 'high-performance',
        }}
        performance={{ min: 0.5 }}
        frameloop="always"
        onCreated={(state) => {
          state.gl.shadowMap.enabled = true;
          state.gl.shadowMap.type = THREE.PCFSoftShadowMap;
          setIsLoading(false);
        }}
      >
        <Suspense fallback={null}>
          <Scene mousePosition={mousePosition} />
        </Suspense>
      </Canvas>
    </div>
  );
}
