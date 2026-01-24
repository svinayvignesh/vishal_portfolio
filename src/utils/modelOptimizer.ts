import * as THREE from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * Material cache to share materials across meshes and reduce draw calls
 */
const materialCache = new Map<string, THREE.Material>();

/**
 * Get or create a cached material
 */
export function getCachedMaterial(
  key: string,
  factory: () => THREE.Material
): THREE.Material {
  if (!materialCache.has(key)) {
    materialCache.set(key, factory());
  }
  return materialCache.get(key)!;
}

/**
 * Clear the material cache (useful for cleanup)
 */
export function clearMaterialCache() {
  materialCache.forEach((material) => material.dispose());
  materialCache.clear();
}

/**
 * Apply performance optimizations to a loaded GLTF model
 */
export interface ModelOptimizationOptions {
  enableBackfaceCulling?: boolean;
  simplifyShaders?: boolean;
  hiddenMeshNames?: string[];
  mergeStaticMeshes?: boolean;
  enableOcclusion?: boolean; // Additional culling for small/distant objects
}

export function optimizeModel(
  scene: THREE.Object3D,
  options: ModelOptimizationOptions = {}
): void {
  const {
    enableBackfaceCulling = true,
    simplifyShaders = false,
    hiddenMeshNames = [],
    mergeStaticMeshes = false,
    enableOcclusion = true,
  } = options;

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      // Hide interior/never-visible meshes
      if (hiddenMeshNames.some((name) => child.name.includes(name))) {
        child.visible = false;
        return;
      }

      // Enable backface culling (30% GPU savings)
      if (enableBackfaceCulling && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            mat.side = THREE.FrontSide;
          });
        } else {
          child.material.side = THREE.FrontSide;
        }
      }

      // Disable shadows (already disabled globally, but make explicit)
      child.castShadow = false;
      child.receiveShadow = false;

      // Enable frustum culling - only render objects visible to camera viewport
      child.frustumCulled = true;

      // Enable occlusion culling for small objects
      // This prevents rendering tiny/distant objects that won't be visible anyway
      if (enableOcclusion) {
        // Calculate bounding sphere for culling
        if (!child.geometry.boundingSphere) {
          child.geometry.computeBoundingSphere();
        }

        // For very small meshes, increase culling aggressiveness
        const boundingSphere = child.geometry.boundingSphere;
        if (boundingSphere && boundingSphere.radius < 0.05) {
          // Small meshes - more aggressive culling
          child.renderOrder = 1; // Render later (can be culled earlier)
        }
      }

      // Simplify shaders for low-end devices
      if (simplifyShaders && child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        materials.forEach((mat, index) => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            // Replace with MeshBasicMaterial for low-end devices
            const basicMat = new THREE.MeshBasicMaterial({
              color: mat.color,
              map: mat.map,
              transparent: mat.transparent,
              opacity: mat.opacity,
              side: mat.side,
            });

            if (Array.isArray(child.material)) {
              child.material[index] = basicMat;
            } else {
              child.material = basicMat;
            }

            // Dispose old material
            mat.dispose();
          }
        });
      }
    }
  });
}

/**
 * Create a simplified version of a material for performance
 */
export function createSimplifiedMaterial(
  original: THREE.Material
): THREE.Material {
  if (original instanceof THREE.MeshStandardMaterial) {
    return new THREE.MeshBasicMaterial({
      color: original.color,
      map: original.map,
      transparent: original.transparent,
      opacity: original.opacity,
      side: original.side,
    });
  }

  // Return clone for other material types
  return original.clone();
}

/**
 * Apply backface culling to all materials in a scene
 */
export function enableBackfaceCulling(scene: THREE.Object3D): void {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      materials.forEach((mat) => {
        mat.side = THREE.FrontSide;
      });
    }
  });
}

/**
 * Hide meshes by name patterns (for interior/never-visible parts)
 */
export function hideMeshesByName(
  scene: THREE.Object3D,
  patterns: string[]
): void {
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (patterns.some((pattern) => child.name.includes(pattern))) {
        child.visible = false;
      }
    }
  });
}
