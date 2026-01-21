import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RoofingSceneProps {
  progress: number;
}

// Single corrugated sheet component
const CorrugatedSheet: React.FC<{
  position: [number, number, number];
  delay: number;
  progress: number;
}> = ({ position, delay, progress }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Calculate animation progress with delay
  const animProgress = Math.max(0, Math.min(1, (progress - delay) / 0.15));

  useFrame(() => {
    if (meshRef.current) {
      // Slide in from right
      meshRef.current.position.x = position[0] + (1 - animProgress) * 5;
      meshRef.current.position.y = position[1];
      meshRef.current.position.z = position[2];
      meshRef.current.scale.setScalar(animProgress);
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={[0.3, 0, 0]}>
      {/* Simplified corrugated shape using box with wave effect */}
      <boxGeometry args={[3, 0.05, 1.5]} />
      <meshStandardMaterial
        color="#8fa4af"
        metalness={0.9}
        roughness={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Corrugated texture simulation
const CorrugatedRib: React.FC<{ 
  position: [number, number, number];
  rotation: [number, number, number];
}> = ({ position, rotation }) => {
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[0.03, 0.03, 3, 8]} />
      <meshStandardMaterial color="#7a8a9a" metalness={0.9} roughness={0.2} />
    </mesh>
  );
};

const RoofingScene: React.FC<RoofingSceneProps> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Create array of sheets with staggered positions
  const sheets = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      position: [-2 + i * 0.4, 1 + i * 0.15, i * 0.2] as [number, number, number],
      delay: i * 0.1,
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -0.4 + Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, -4]}>
      {/* Corrugated sheets forming roof */}
      {sheets.map((sheet, i) => (
        <CorrugatedSheet
          key={i}
          position={sheet.position}
          delay={sheet.delay}
          progress={progress}
        />
      ))}

      {/* Roof ridge beam */}
      <mesh position={[-0.5, 2.2, -0.5]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[4, 0.2, 0.2]} />
        <meshStandardMaterial color="#5a3a1a" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Support structure */}
      <group>
        {/* Rafters */}
        {[-1.5, 0, 1.5].map((x, i) => (
          <mesh key={i} position={[x, 0.5, 0]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.15, 3, 0.1]} />
            <meshStandardMaterial color="#4a3a2a" metalness={0.1} roughness={0.9} />
          </mesh>
        ))}

        {/* Wall structure */}
        <mesh position={[-2, -1, 0]}>
          <boxGeometry args={[0.2, 3, 3]} />
          <meshStandardMaterial color="#3a4a5a" metalness={0.3} roughness={0.7} />
        </mesh>

        <mesh position={[2, -1, 0]}>
          <boxGeometry args={[0.2, 3, 3]} />
          <meshStandardMaterial color="#3a4a5a" metalness={0.3} roughness={0.7} />
        </mesh>
      </group>

      {/* Ground/foundation */}
      <mesh position={[0, -2.7, 0]} receiveShadow>
        <boxGeometry args={[6, 0.3, 5]} />
        <meshStandardMaterial color="#2a3a4a" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Stack of unused sheets (source) */}
      <group position={[4, -2, 1]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0, i * 0.08, 0]}>
            <boxGeometry args={[2, 0.05, 1]} />
            <meshStandardMaterial color="#8fa4af" metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Ambient lighting for metallic effect */}
      <pointLight position={[0, 3, 2]} intensity={0.6} color="#ffffff" />
    </group>
  );
};

export default RoofingScene;
