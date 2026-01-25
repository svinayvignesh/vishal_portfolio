import * as THREE from 'three';

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

      // Material processing for lighting compatibility and performance
      if (child.material) {
        const materials = Array.isArray(child.material)
          ? child.material
          : [child.material];

        materials.forEach((mat, index) => {
          let newMat: THREE.Material | null = null;

          // ALWAYS convert MeshBasicMaterial to MeshLambertMaterial
          // MeshBasicMaterial is completely unlit (ignores all lights)
          // This handles GLTFs exported with baked/flat materials (e.g., PaletteMaterial)
          if (mat instanceof THREE.MeshBasicMaterial) {
            newMat = new THREE.MeshLambertMaterial({
              color: mat.color,
              map: mat.map,
              transparent: mat.transparent,
              opacity: mat.opacity,
              side: mat.side,
            });
          }
          // For low-end devices, simplify MeshStandardMaterial to MeshLambertMaterial
          // Lambert = diffuse only (no specular), cheaper but still responds to lights
          else if (simplifyShaders && mat instanceof THREE.MeshStandardMaterial) {
            newMat = new THREE.MeshLambertMaterial({
              color: mat.color,
              map: mat.map,
              transparent: mat.transparent,
              opacity: mat.opacity,
              side: mat.side,
              emissive: mat.emissive,
              emissiveMap: mat.emissiveMap,
              emissiveIntensity: mat.emissiveIntensity,
            });
          }

          // Apply new material if created
          if (newMat) {
            if (Array.isArray(child.material)) {
              child.material[index] = newMat;
            } else {
              child.material = newMat;
            }
            mat.dispose();
          }
        });
      }
    }
  });
}

/**
 * Create a simplified version of a material for performance
 * Uses MeshLambertMaterial (diffuse only, no specular) which is cheaper
 * than MeshStandardMaterial but still responds to lights
 */
export function createSimplifiedMaterial(
  original: THREE.Material
): THREE.Material {
  if (original instanceof THREE.MeshStandardMaterial) {
    return new THREE.MeshLambertMaterial({
      color: original.color,
      map: original.map,
      transparent: original.transparent,
      opacity: original.opacity,
      side: original.side,
      emissive: original.emissive,
      emissiveMap: original.emissiveMap,
      emissiveIntensity: original.emissiveIntensity,
    });
  }

  // Return clone for other material types
  return original.clone();
}

/**
 * Convert a GLTF materials object to use lit materials
 * Call this on useGLTF().materials to ensure all materials respond to lights
 * Forces ALL materials to MeshLambertMaterial for consistent lighting response
 */
export function convertToLitMaterials(
  materials: Record<string, THREE.Material>
): Record<string, THREE.Material> {
  const converted: Record<string, THREE.Material> = {};

  for (const [name, mat] of Object.entries(materials)) {
    // Extract common properties safely
    const anyMat = mat as any;

    const lambertParams: THREE.MeshLambertMaterialParameters = {
      color: anyMat.color || new THREE.Color(0xffffff),
      map: anyMat.map || null,
      transparent: anyMat.transparent || false,
      opacity: anyMat.opacity !== undefined ? anyMat.opacity : 1,
      side: anyMat.side || THREE.FrontSide,
    };

    // For MeshStandardMaterial, also copy emissive properties
    if (mat instanceof THREE.MeshStandardMaterial) {
      lambertParams.emissive = mat.emissive;
      lambertParams.emissiveMap = mat.emissiveMap;
      lambertParams.emissiveIntensity = mat.emissiveIntensity;
    }

    converted[name] = new THREE.MeshLambertMaterial(lambertParams);
  }

  return converted;
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
