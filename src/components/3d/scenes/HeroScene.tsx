import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface HeroSceneProps {
  progress: number;
}

const HeroScene: React.FC<HeroSceneProps> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Create floating geometric shapes representing engineering precision
  const shapes = useMemo(() => {
    return [
      { position: [-3, 2, -2] as [number, number, number], scale: 0.6, rotationSpeed: 0.5 },
      { position: [3.5, -1, -3] as [number, number, number], scale: 0.8, rotationSpeed: 0.3 },
      { position: [-2, -2, -1] as [number, number, number], scale: 0.5, rotationSpeed: 0.7 },
      { position: [2, 2.5, -2] as [number, number, number], scale: 0.4, rotationSpeed: 0.4 },
      { position: [0, -3, -4] as [number, number, number], scale: 0.7, rotationSpeed: 0.6 },
    ];
  }, []);

  // Particle system for ambient effect
  const particles = useMemo(() => {
    const count = 100;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Floating geometric shapes */}
      {shapes.map((shape, i) => (
        <Float
          key={i}
          speed={1.5}
          rotationIntensity={0.5}
          floatIntensity={0.5}
        >
          <mesh position={shape.position} scale={shape.scale}>
            {i % 3 === 0 ? (
              <octahedronGeometry args={[1, 0]} />
            ) : i % 3 === 1 ? (
              <icosahedronGeometry args={[1, 0]} />
            ) : (
              <dodecahedronGeometry args={[1, 0]} />
            )}
            <meshStandardMaterial
              color={i % 2 === 0 ? "#4a90a4" : "#d4a574"}
              metalness={0.8}
              roughness={0.2}
              wireframe={i % 2 === 0}
            />
          </mesh>
        </Float>
      ))}

      {/* Ambient particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#4a90a4"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Central glowing orb */}
      <mesh position={[0, 0, -5]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#1a3a4a"
          emissive="#4a90a4"
          emissiveIntensity={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
};

export default HeroScene;
