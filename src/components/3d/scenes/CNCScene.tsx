import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CNCSceneProps {
  progress: number;
}

const CNCScene: React.FC<CNCSceneProps> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);
  const drillRef = useRef<THREE.Group>(null);
  const woodBlockRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -0.3 + Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }

    // Drill bit rotation
    if (drillRef.current) {
      drillRef.current.rotation.y = state.clock.elapsedTime * 10;
      // Move drill down based on progress
      drillRef.current.position.y = 2 - progress * 2;
    }

    // Move wood block along conveyor based on progress
    if (woodBlockRef.current) {
      woodBlockRef.current.position.x = -3 + progress * 3;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, -4]}>
      {/* CNC Frame */}
      <group>
        {/* Main frame structure */}
        <mesh position={[0, 2, -1.5]}>
          <boxGeometry args={[5, 0.3, 0.3]} />
          <meshStandardMaterial color="#3a4a5a" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Vertical supports */}
        {[[-2.5, -1.5], [2.5, -1.5]].map(([x, z], i) => (
          <mesh key={i} position={[x, 1, z]}>
            <boxGeometry args={[0.3, 4, 0.3]} />
            <meshStandardMaterial color="#3a4a5a" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}

        {/* Back plate */}
        <mesh position={[0, 1, -1.7]}>
          <boxGeometry args={[5.3, 4, 0.1]} />
          <meshStandardMaterial color="#2a3a4a" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>

      {/* Spindle/Drill Assembly */}
      <group ref={drillRef} position={[0, 2, 0]}>
        {/* Motor housing */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 1, 16]} />
          <meshStandardMaterial color="#4a6070" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Drill bit */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.08, 0.02, 1.2, 8]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Cutting sparks effect */}
        <pointLight 
          position={[0, -0.8, 0]} 
          intensity={progress > 0.3 ? 0.8 : 0} 
          color="#ff8844" 
          distance={1} 
        />
      </group>

      {/* Conveyor Belt */}
      <group position={[0, -0.5, 0]}>
        {/* Belt surface */}
        <mesh>
          <boxGeometry args={[8, 0.1, 2]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.2} roughness={0.9} />
        </mesh>

        {/* Rollers */}
        {[-3.5, 3.5].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 2.2, 16]} />
            <meshStandardMaterial color="#4a5060" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Wood Block (workpiece) */}
      <mesh ref={woodBlockRef} position={[-3, 0.3, 0]} castShadow>
        <boxGeometry args={[1.5, 1, 1.2]} />
        <meshStandardMaterial 
          color="#8b6914" 
          metalness={0.1} 
          roughness={0.8}
        />
      </mesh>

      {/* Cut groove in wood (appears as progress increases) */}
      {progress > 0.4 && (
        <mesh position={[-3 + progress * 3, 0.5, 0]}>
          <boxGeometry args={[0.1, 0.3, 0.1]} />
          <meshStandardMaterial color="#5a4010" metalness={0.1} roughness={0.9} />
        </mesh>
      )}

      {/* Work table */}
      <mesh position={[0, -1.2, 0]} receiveShadow>
        <boxGeometry args={[6, 0.4, 3]} />
        <meshStandardMaterial color="#3a4a5a" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Control panel */}
      <group position={[3, 0.5, 1]}>
        <mesh>
          <boxGeometry args={[0.8, 1.5, 0.3]} />
          <meshStandardMaterial color="#2a3a4a" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0.3, 0.16]}>
          <boxGeometry args={[0.5, 0.4, 0.02]} />
          <meshStandardMaterial color="#4a90a4" emissive="#4a90a4" emissiveIntensity={0.3} />
        </mesh>
      </group>
    </group>
  );
};

export default CNCScene;
