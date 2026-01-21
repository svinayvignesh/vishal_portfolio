import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface TurbineSceneProps {
  progress: number;
}

// Turbine blade component
const TurbineBlade: React.FC<{ 
  rotation: number;
  radius: number;
}> = ({ rotation, radius }) => {
  return (
    <group rotation={[0, 0, rotation]}>
      <mesh position={[radius / 2, 0, 0]}>
        <boxGeometry args={[radius, 0.3, 0.05]} />
        <meshStandardMaterial 
          color="#6a8a9a" 
          metalness={0.9} 
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};

// Compressor stage
const CompressorStage: React.FC<{
  position: [number, number, number];
  bladeCount: number;
  radius: number;
  rotationSpeed: number;
  progress: number;
}> = ({ position, bladeCount, radius, rotationSpeed, progress }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Speed increases with scroll progress
      groupRef.current.rotation.x = state.clock.elapsedTime * rotationSpeed * (0.5 + progress * 2);
    }
  });

  const blades = useMemo(() => {
    return Array.from({ length: bladeCount }, (_, i) => ({
      rotation: (i / bladeCount) * Math.PI * 2,
    }));
  }, [bladeCount]);

  return (
    <group ref={groupRef} position={position}>
      {/* Hub */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 0.15, 16]} />
        <meshStandardMaterial color="#4a5a6a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Blades */}
      {blades.map((blade, i) => (
        <TurbineBlade key={i} rotation={blade.rotation} radius={radius} />
      ))}
    </group>
  );
};

const TurbineScene: React.FC<TurbineSceneProps> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -0.2 + Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -5]} rotation={[0, 0, Math.PI / 2]}>
      {/* Engine casing */}
      <mesh>
        <cylinderGeometry args={[2, 1.8, 6, 32, 1, true]} />
        <meshStandardMaterial 
          color="#3a4a5a" 
          metalness={0.7} 
          roughness={0.3}
          side={THREE.DoubleSide}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Inner casing */}
      <mesh>
        <cylinderGeometry args={[1.9, 1.7, 6, 32, 1, true]} />
        <meshStandardMaterial 
          color="#2a3a4a" 
          metalness={0.8} 
          roughness={0.2}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Compressor stages */}
      <CompressorStage position={[-2, 0, 0]} bladeCount={12} radius={1.5} rotationSpeed={3} progress={progress} />
      <CompressorStage position={[-1, 0, 0]} bladeCount={16} radius={1.3} rotationSpeed={4} progress={progress} />
      <CompressorStage position={[0, 0, 0]} bladeCount={20} radius={1.1} rotationSpeed={5} progress={progress} />
      <CompressorStage position={[1, 0, 0]} bladeCount={24} radius={0.9} rotationSpeed={6} progress={progress} />
      <CompressorStage position={[2, 0, 0]} bladeCount={28} radius={0.7} rotationSpeed={7} progress={progress} />

      {/* Combustion chamber glow */}
      <mesh position={[0.5, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 1.5, 16]} />
        <meshStandardMaterial 
          color="#ff6600" 
          emissive="#ff4400" 
          emissiveIntensity={0.3 + progress * 0.5}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Exhaust glow */}
      <pointLight 
        position={[3, 0, 0]} 
        intensity={progress * 2} 
        color="#ff6644" 
        distance={5} 
      />

      {/* Center shaft */}
      <mesh>
        <cylinderGeometry args={[0.15, 0.15, 7, 16]} />
        <meshStandardMaterial color="#8a8a8a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Front inlet cone */}
      <mesh position={[-3.5, 0, 0]}>
        <coneGeometry args={[0.5, 1.5, 16]} />
        <meshStandardMaterial color="#5a6a7a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Inlet ring */}
      <mesh position={[-2.8, 0, 0]}>
        <torusGeometry args={[1.9, 0.1, 8, 32]} />
        <meshStandardMaterial color="#4a5a6a" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Exhaust nozzle */}
      <mesh position={[3.5, 0, 0]}>
        <cylinderGeometry args={[1.6, 1.2, 1, 32, 1, true]} />
        <meshStandardMaterial 
          color="#4a5a6a" 
          metalness={0.6} 
          roughness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default TurbineScene;
