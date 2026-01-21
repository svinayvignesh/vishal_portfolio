import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PrinterSceneProps {
  progress: number;
}

const PrinterScene: React.FC<PrinterSceneProps> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);
  const nozzleRef = useRef<THREE.Group>(null);
  const printedObjectRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }

    // Nozzle movement - moves in a pattern as user scrolls
    if (nozzleRef.current) {
      const time = state.clock.elapsedTime;
      nozzleRef.current.position.x = Math.sin(time * 2) * 0.5;
      nozzleRef.current.position.z = Math.cos(time * 2) * 0.5;
    }

    // Scale up printed object based on progress (reveal effect)
    if (printedObjectRef.current) {
      printedObjectRef.current.scale.y = Math.max(0.01, progress);
      printedObjectRef.current.position.y = -1.5 + (progress * 1.5);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -3]}>
      {/* Printer Frame */}
      <group>
        {/* Vertical posts */}
        {[[-2, -2], [2, -2], [-2, 2], [2, 2]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0, z]}>
            <boxGeometry args={[0.15, 5, 0.15]} />
            <meshStandardMaterial color="#3a4a5a" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}

        {/* Top frame */}
        <mesh position={[0, 2.5, 0]}>
          <boxGeometry args={[4.3, 0.15, 4.3]} />
          <meshStandardMaterial color="#3a4a5a" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* Moving Gantry with Nozzle */}
      <group ref={nozzleRef} position={[0, 1.5, 0]}>
        {/* Gantry arm */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3, 0.2, 0.3]} />
          <meshStandardMaterial color="#4a90a4" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Nozzle (cone shape) */}
        <mesh position={[0, -0.3, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.15, 0.4, 16]} />
          <meshStandardMaterial color="#d4a574" metalness={0.8} roughness={0.2} emissive="#ff6600" emissiveIntensity={0.3} />
        </mesh>

        {/* Hot end glow */}
        <pointLight position={[0, -0.4, 0]} intensity={0.5} color="#ff6600" distance={2} />
      </group>

      {/* Build Platform */}
      <mesh position={[0, -2.2, 0]} receiveShadow>
        <boxGeometry args={[3.5, 0.3, 3.5]} />
        <meshStandardMaterial color="#2a3a4a" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Printed Object - Mechanical Part (revealed from bottom up) */}
      <mesh ref={printedObjectRef} position={[0, -1.5, 0]} castShadow>
        <cylinderGeometry args={[0.8, 1, 3, 6]} />
        <meshStandardMaterial
          color="#4a90a4"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* Decorative gear on top of printed object */}
      <mesh position={[0, progress * 1.5 - 0.5, 0]} scale={[1, 1, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.1, 8, 6]} />
        <meshStandardMaterial color="#d4a574" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Filament spool */}
      <group position={[3, 1, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.6, 0.6, 0.3, 32]} />
          <meshStandardMaterial color="#4a90a4" metalness={0.3} roughness={0.7} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.5, 0.08, 8, 32]} />
          <meshStandardMaterial color="#5aa0b4" metalness={0.2} roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};

export default PrinterScene;
