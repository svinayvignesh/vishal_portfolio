import React, { useRef, Suspense } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

interface ModelLoaderProps {
  url?: string;
  fallbackGeometry?: 'box' | 'sphere' | 'cylinder' | 'cone' | 'torus';
  fallbackColor?: string;
  fallbackScale?: [number, number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
}

// Fallback component when model fails or no URL provided
const FallbackGeometry: React.FC<{
  geometry: 'box' | 'sphere' | 'cylinder' | 'cone' | 'torus';
  color: string;
  scale: [number, number, number];
}> = ({ geometry, color, scale }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const getGeometry = () => {
    switch (geometry) {
      case 'sphere':
        return <sphereGeometry args={[1, 32, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.5, 0.5, 2, 32]} />;
      case 'cone':
        return <coneGeometry args={[0.5, 1.5, 32]} />;
      case 'torus':
        return <torusGeometry args={[1, 0.3, 16, 48]} />;
      case 'box':
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh ref={meshRef} scale={scale}>
      {getGeometry()}
      <meshStandardMaterial
        color={color}
        metalness={0.6}
        roughness={0.3}
      />
    </mesh>
  );
};

// GLTF Model component
const GLTFModel: React.FC<{
  url: string;
  scale: number | [number, number, number];
}> = ({ url, scale }) => {
  const gltf = useLoader(GLTFLoader, url);
  
  return (
    <primitive 
      object={gltf.scene.clone()} 
      scale={scale}
    />
  );
};

// Error boundary wrapper for model loading
const ModelWithFallback: React.FC<ModelLoaderProps> = ({
  url,
  fallbackGeometry = 'box',
  fallbackColor = '#4a90a4',
  fallbackScale = [1, 1, 1],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // If no URL provided, render fallback immediately
  if (!url) {
    return (
      <group ref={groupRef} position={position} rotation={rotation}>
        <FallbackGeometry
          geometry={fallbackGeometry}
          color={fallbackColor}
          scale={fallbackScale}
        />
      </group>
    );
  }

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <Suspense
        fallback={
          <FallbackGeometry
            geometry={fallbackGeometry}
            color={fallbackColor}
            scale={fallbackScale}
          />
        }
      >
        <ErrorBoundary
          fallback={
            <FallbackGeometry
              geometry={fallbackGeometry}
              color={fallbackColor}
              scale={fallbackScale}
            />
          }
        >
          <GLTFModel url={url} scale={scale} />
        </ErrorBoundary>
      </Suspense>
    </group>
  );
};

// Simple error boundary for catching model load errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default ModelWithFallback;
