import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AutomotiveSceneProps {
  progress: number;
}

// Simplified muscle car body
const CarBody: React.FC = () => {
  return (
    <group>
      {/* Main body */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[4.5, 0.8, 1.8]} />
        <meshStandardMaterial color="#1a1a2a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Cabin */}
      <mesh position={[0.3, 1, 0]}>
        <boxGeometry args={[2, 0.7, 1.6]} />
        <meshStandardMaterial color="#0a0a1a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Hood slope */}
      <mesh position={[-1.3, 0.7, 0]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[1.5, 0.3, 1.7]} />
        <meshStandardMaterial color="#1a1a2a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Trunk */}
      <mesh position={[1.8, 0.6, 0]}>
        <boxGeometry args={[1, 0.4, 1.7]} />
        <meshStandardMaterial color="#1a1a2a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Front bumper */}
      <mesh position={[-2.4, 0.2, 0]}>
        <boxGeometry args={[0.3, 0.4, 1.9]} />
        <meshStandardMaterial color="#2a2a3a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Rear bumper */}
      <mesh position={[2.4, 0.2, 0]}>
        <boxGeometry args={[0.3, 0.4, 1.9]} />
        <meshStandardMaterial color="#2a2a3a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Headlights */}
      {[-0.6, 0.6].map((z, i) => (
        <mesh key={i} position={[-2.3, 0.4, z]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffff88" 
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Taillights */}
      {[-0.6, 0.6].map((z, i) => (
        <mesh key={i} position={[2.3, 0.4, z]}>
          <boxGeometry args={[0.05, 0.2, 0.3]} />
          <meshStandardMaterial 
            color="#ff0000" 
            emissive="#ff0000" 
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}

      {/* Racing stripes */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[4.6, 0.02, 0.3]} />
        <meshStandardMaterial color="#d4a574" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Windows - front */}
      <mesh position={[-0.8, 1, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.8, 0.5, 1.4]} />
        <meshStandardMaterial color="#3a5a7a" metalness={0.2} roughness={0.1} transparent opacity={0.7} />
      </mesh>

      {/* Windows - rear */}
      <mesh position={[1.3, 1, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.6, 0.5, 1.4]} />
        <meshStandardMaterial color="#3a5a7a" metalness={0.2} roughness={0.1} transparent opacity={0.7} />
      </mesh>
    </group>
  );
};

// Wheel component
const Wheel: React.FC<{ position: [number, number, number]; spinning: boolean }> = ({ position, spinning }) => {
  const wheelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (wheelRef.current && spinning) {
      wheelRef.current.rotation.x = state.clock.elapsedTime * 8;
    }
  });

  return (
    <group ref={wheelRef} position={position} rotation={[0, Math.PI / 2, 0]}>
      {/* Tire */}
      <mesh>
        <torusGeometry args={[0.35, 0.15, 16, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.2} roughness={0.9} />
      </mesh>

      {/* Rim */}
      <mesh>
        <cylinderGeometry args={[0.25, 0.25, 0.2, 8]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Hub */}
      <mesh position={[0, 0, 0.11]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};

const AutomotiveScene: React.FC<AutomotiveSceneProps> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);
  const carRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -0.3 + Math.sin(state.clock.elapsedTime * 0.1) * 0.03;
    }

    // Car drives in from left based on progress
    if (carRef.current) {
      carRef.current.position.x = -10 + progress * 10;
    }
  });

  const isMoving = progress < 0.95;

  return (
    <group ref={groupRef} position={[0, -1, -5]}>
      {/* The car */}
      <group ref={carRef} position={[-10, 0, 0]}>
        <CarBody />

        {/* Wheels */}
        <Wheel position={[-1.5, 0, 1]} spinning={isMoving} />
        <Wheel position={[-1.5, 0, -1]} spinning={isMoving} />
        <Wheel position={[1.5, 0, 1]} spinning={isMoving} />
        <Wheel position={[1.5, 0, -1]} spinning={isMoving} />

        {/* Headlight beams */}
        <spotLight
          position={[-2.5, 0.4, 0]}
          angle={0.3}
          penumbra={0.5}
          intensity={isMoving ? 2 : 1}
          color="#ffff88"
          target-position={[-10, 0, 0]}
        />
      </group>

      {/* Road */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[25, 0.1, 5]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* Road markings */}
      {[-8, -4, 0, 4, 8].map((x, i) => (
        <mesh key={i} position={[x, -0.44, 0]}>
          <boxGeometry args={[1.5, 0.02, 0.15]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Side barriers */}
      <mesh position={[0, -0.2, 2.8]}>
        <boxGeometry args={[25, 0.4, 0.1]} />
        <meshStandardMaterial color="#4a5a6a" metalness={0.5} roughness={0.5} />
      </mesh>

      <mesh position={[0, -0.2, -2.8]}>
        <boxGeometry args={[25, 0.4, 0.1]} />
        <meshStandardMaterial color="#4a5a6a" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Factory building in background */}
      <group position={[5, 2, -8]}>
        <mesh>
          <boxGeometry args={[8, 5, 4]} />
          <meshStandardMaterial color="#3a4a5a" metalness={0.4} roughness={0.6} />
        </mesh>

        {/* Windows */}
        {[-2, 0, 2].map((x, i) => (
          <mesh key={i} position={[x, 0.5, 2.01]}>
            <boxGeometry args={[1, 2, 0.02]} />
            <meshStandardMaterial 
              color="#4a90a4" 
              emissive="#4a90a4" 
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}

        {/* Ford-style lettering placeholder */}
        <mesh position={[0, 2, 2.1]}>
          <boxGeometry args={[3, 0.5, 0.02]} />
          <meshStandardMaterial color="#d4a574" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>

      {/* Ground plane */}
      <mesh position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial color="#1a2a3a" metalness={0.2} roughness={0.9} />
      </mesh>
    </group>
  );
};

export default AutomotiveScene;
