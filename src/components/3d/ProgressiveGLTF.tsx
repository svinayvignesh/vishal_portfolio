import React, { useState, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';

interface ProgressiveGLTFProps {
  lowPolyUrl: string;
  highPolyUrl: string;
  upgradeDelay?: number; // Delay before upgrading to high-poly (ms)
  children?: (scene: THREE.Object3D, nodes: any, materials: any, isHighQuality: boolean) => React.ReactNode;
}

/**
 * Progressive GLTF Loader
 *
 * Loads a low-poly version immediately for fast initial render,
 * then progressively upgrades to high-poly version after a delay.
 *
 * This prevents frame drops during fast scrolling by showing
 * simplified geometry first, then upgrading once the user stops.
 *
 * Example:
 * <ProgressiveGLTF
 *   lowPolyUrl="/models/ford/ford_f150_raptor-low.glb"
 *   highPolyUrl="/models/ford/ford_f150_raptor-high.glb"
 *   upgradeDelay={1000}
 * >
 *   {(scene, nodes, materials, isHighQuality) => (
 *     <primitive object={scene} />
 *   )}
 * </ProgressiveGLTF>
 */
export function ProgressiveGLTF({
  lowPolyUrl,
  highPolyUrl,
  upgradeDelay = 1000,
  children
}: ProgressiveGLTFProps) {
  const [useHighPoly, setUseHighPoly] = useState(false);
  const performanceLevel = useStore((state) => state.performanceLevel);

  // Low-end devices skip progressive loading and stick with low-poly
  const shouldUpgrade = performanceLevel !== 'low';

  // Load low-poly immediately
  const lowPoly = useGLTF(lowPolyUrl) as any;

  // Preload high-poly in background if we plan to upgrade
  useEffect(() => {
    if (!shouldUpgrade) return;

    const timer = setTimeout(() => {
      // Preload high-poly model
      useGLTF.preload(highPolyUrl);

      // Switch to high-poly after preloading
      const switchTimer = setTimeout(() => {
        setUseHighPoly(true);
      }, 500); // Small delay after preload completes

      return () => clearTimeout(switchTimer);
    }, upgradeDelay);

    return () => clearTimeout(timer);
  }, [highPolyUrl, upgradeDelay, shouldUpgrade]);

  // Load high-poly only after state switches
  const highPoly = useHighPoly ? (useGLTF(highPolyUrl) as any) : null;

  // Use high-poly if loaded, otherwise use low-poly
  const model = useHighPoly && highPoly ? highPoly : lowPoly;

  if (children) {
    return <>{children(model.scene.clone(), model.nodes, model.materials, useHighPoly)}</>;
  }

  return <primitive object={model.scene.clone()} />;
}

/**
 * Preload both versions of a progressive model
 */
export function preloadProgressiveModel(lowPolyUrl: string, highPolyUrl: string) {
  useGLTF.preload(lowPolyUrl);
  useGLTF.preload(highPolyUrl);
}
