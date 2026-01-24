import React, { useRef, useMemo } from 'react';
import { Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMouse } from '@/hooks/use-mouse';

const HeroScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const mouse = useMouse();

  // Animate the entire group based on mouse and time
  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;

    if (groupRef.current) {
      // Mouse-based rotation (subtle)
      const targetRotationY = mouse.x * 0.15;
      const targetRotationX = mouse.y * 0.1;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotationY,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotationX,
        0.05
      );

      // Group-level floating effect
      const floatY = Math.sin(elapsed * 0.4) * 0.1;
      groupRef.current.position.y = floatY;
    }
  });

  // Create floating geometric shapes representing engineering precision
  const shapes = useMemo(() => {
    return [
      { position: [-3, 2, -2] as [number, number, number], scale: 0.6 },
      { position: [3.5, -1, -3] as [number, number, number], scale: 0.8 },
      { position: [-2, -2, -1] as [number, number, number], scale: 0.5 },
      { position: [2, 2.5, -2] as [number, number, number], scale: 0.4 },
      { position: [0, -3, -4] as [number, number, number], scale: 0.7 },
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
