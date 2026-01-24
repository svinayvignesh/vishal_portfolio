import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useStore } from '@/store/useStore';
import * as THREE from 'three';

interface LODModelProps {
  baseUrl: string; // Base path without extension, e.g., "/models/ford/ford_f150_raptor"
  distance?: number; // Distance threshold for LOD switching (default: 5)
  hasLowPoly?: boolean; // Whether low-poly version exists
  hasMediumPoly?: boolean; // Whether medium-poly version exists
  children?: (scene: THREE.Object3D, nodes: any, materials: any) => React.ReactNode;
}

/**
 * LOD (Level of Detail) Model Component
 *
 * Automatically switches between low/medium/high quality models based on:
 * - Camera distance from the model
 * - Device performance tier
 *
 * Expected file naming:
 * - {baseUrl}-low.glb (simplified geometry, ~25% triangles)
 * - {baseUrl}-medium.glb (moderate geometry, ~50% triangles)
 * - {baseUrl}-high.glb or {baseUrl}.glb (full quality)
 *
 * Example:
 * <LODModel
 *   baseUrl="/models/ford/ford_f150_raptor"
 *   distance={5}
 *   hasLowPoly={true}
 *   hasMediumPoly={true}
 * >
 *   {(scene, nodes, materials) => (
 *     <primitive object={scene} />
 *   )}
 * </LODModel>
 */
export function LODModel({
  baseUrl,
  distance = 5,
  hasLowPoly = false,
  hasMediumPoly = false,
  children
}: LODModelProps) {
  const camera = useThree((state) => state.camera);
  const performanceLevel = useStore((state) => state.performanceLevel);

  // Calculate distance from camera to origin (where model typically sits)
  const cameraDistance = useMemo(() => {
    return camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
  }, [camera.position]);

  // Choose LOD based on distance + device capability
  const modelUrl = useMemo(() => {
    // Low-end devices always get low poly (if available)
    if (performanceLevel === 'low' && hasLowPoly) {
      return `${baseUrl}-low.glb`;
    }

    // Distance-based LOD switching
    if (hasLowPoly && cameraDistance > distance * 1.5) {
      return `${baseUrl}-low.glb`;
    } else if (hasMediumPoly && (cameraDistance > distance || performanceLevel === 'medium')) {
      return `${baseUrl}-medium.glb`;
    }

    // High quality for close-up or high-end devices
    return `${baseUrl}-high.glb`;
  }, [baseUrl, cameraDistance, distance, performanceLevel, hasLowPoly, hasMediumPoly]);

  // Load the selected model
  const { scene, nodes, materials } = useGLTF(modelUrl) as any;

  if (children) {
    return <>{children(scene.clone(), nodes, materials)}</>;
  }

  return <primitive object={scene.clone()} />;
}

/**
 * Preload all LOD versions of a model
 */
export function preloadLODModel(baseUrl: string, hasLowPoly = true, hasMediumPoly = true) {
  if (hasLowPoly) {
    useGLTF.preload(`${baseUrl}-low.glb`);
  }
  if (hasMediumPoly) {
    useGLTF.preload(`${baseUrl}-medium.glb`);
  }
  useGLTF.preload(`${baseUrl}-high.glb`);
}
