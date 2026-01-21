import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PaperStackSceneProps {
  progress: number;
}

// Paper plane component representing ISO documents
const PaperPlane: React.FC<{
  initialPosition: THREE.Vector3;
  initialRotation: THREE.Euler;
  targetPosition: THREE.Vector3;
  targetRotation: THREE.Euler;
  progress: number;
  index: number;
}> = ({ initialPosition, initialRotation, targetPosition, targetRotation, progress, index }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      // Lerp position based on scroll progress
      meshRef.current.position.lerpVectors(initialPosition, targetPosition, progress);
      
      // Lerp rotation
      meshRef.current.rotation.x = THREE.MathUtils.lerp(initialRotation.x, targetRotation.x, progress);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(initialRotation.y, targetRotation.y, progress);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(initialRotation.z, targetRotation.z, progress);
    }
  });

  return (
    <mesh ref={meshRef} position={initialPosition} castShadow receiveShadow>
      {/* Thin box to represent paper/document */}
      <boxGeometry args={[2, 0.02, 2.8]} />
      <meshStandardMaterial
        color="#f5f5f0"
        metalness={0.1}
        roughness={0.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Document lines texture simulation
const DocumentLines: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, 0.015, -0.8 + i * 0.4]}>
          <boxGeometry args={[1.6, 0.005, 0.05]} />
          <meshBasicMaterial color="#cccccc" />
        </mesh>
      ))}
    </group>
  );
};

const PaperStackScene: React.FC<PaperStackSceneProps> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Define scattered positions and final stacked positions
  const papers = useMemo(() => {
    const count = 6;
    return Array.from({ length: count }, (_, i) => ({
      initialPosition: new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4 - 2
      ),
      initialRotation: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      targetPosition: new THREE.Vector3(0, -1.5 + i * 0.15, 0),
      targetRotation: new THREE.Euler(0, 0, (Math.random() - 0.5) * 0.1),
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -3]}>
      {/* Paper planes */}
      {papers.map((paper, i) => (
        <PaperPlane
          key={i}
          index={i}
          progress={progress}
          initialPosition={paper.initialPosition}
          initialRotation={paper.initialRotation}
          targetPosition={paper.targetPosition}
          targetRotation={paper.targetRotation}
        />
      ))}

      {/* Platform/desk surface */}
      <mesh position={[0, -2, 0]} receiveShadow>
        <boxGeometry args={[5, 0.2, 4]} />
        <meshStandardMaterial
          color="#2a3a4a"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* Ambient particles */}
      <pointLight position={[2, 3, 2]} intensity={0.5} color="#d4a574" />
    </group>
  );
};

export default PaperStackScene;
