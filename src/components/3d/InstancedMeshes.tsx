import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface InstancedMeshProps {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  positions: THREE.Vector3[];
  rotations?: THREE.Euler[];
  scales?: THREE.Vector3[];
  animate?: boolean;
}

/**
 * Instanced Mesh Component
 *
 * Renders many copies of the same mesh efficiently using GPU instancing.
 * Instead of 100 draw calls for 100 meshes, this uses 1 draw call.
 *
 * Best for: Repeated elements like screws, bolts, rivets, particles.
 *
 * Example:
 * <InstancedMeshes
 *   geometry={boltGeometry}
 *   material={metalMaterial}
 *   positions={[
 *     new THREE.Vector3(0, 0, 0),
 *     new THREE.Vector3(1, 0, 0),
 *     new THREE.Vector3(2, 0, 0),
 *   ]}
 * />
 */
export function InstancedMeshes({
  geometry,
  material,
  positions,
  rotations,
  scales,
  animate = false,
}: InstancedMeshProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Create transformation matrix for each instance
  useMemo(() => {
    if (!meshRef.current) return;

    const dummy = new THREE.Object3D();

    positions.forEach((position, i) => {
      dummy.position.copy(position);

      if (rotations && rotations[i]) {
        dummy.rotation.copy(rotations[i]);
      }

      if (scales && scales[i]) {
        dummy.scale.copy(scales[i]);
      } else {
        dummy.scale.set(1, 1, 1);
      }

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [positions, rotations, scales]);

  // Optional animation
  useFrame((state) => {
    if (!animate || !meshRef.current) return;

    const dummy = new THREE.Object3D();
    const time = state.clock.elapsedTime;

    positions.forEach((position, i) => {
      dummy.position.copy(position);
      dummy.position.y += Math.sin(time + i * 0.5) * 0.1;

      if (rotations && rotations[i]) {
        dummy.rotation.copy(rotations[i]);
      }

      if (scales && scales[i]) {
        dummy.scale.copy(scales[i]);
      } else {
        dummy.scale.set(1, 1, 1);
      }

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, positions.length]}
      frustumCulled
    />
  );
}

/**
 * Helper function to generate grid positions for instanced meshes
 */
export function generateGridPositions(
  rows: number,
  cols: number,
  spacing: number
): THREE.Vector3[] {
  const positions: THREE.Vector3[] = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      positions.push(
        new THREE.Vector3(
          (i - rows / 2) * spacing,
          0,
          (j - cols / 2) * spacing
        )
      );
    }
  }

  return positions;
}

/**
 * Helper function to generate random positions within a volume
 */
export function generateRandomPositions(
  count: number,
  bounds: { x: number; y: number; z: number }
): THREE.Vector3[] {
  const positions: THREE.Vector3[] = [];

  for (let i = 0; i < count; i++) {
    positions.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * bounds.x,
        (Math.random() - 0.5) * bounds.y,
        (Math.random() - 0.5) * bounds.z
      )
    );
  }

  return positions;
}

/**
 * Helper function to generate random rotations
 */
export function generateRandomRotations(count: number): THREE.Euler[] {
  const rotations: THREE.Euler[] = [];

  for (let i = 0; i < count; i++) {
    rotations.push(
      new THREE.Euler(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      )
    );
  }

  return rotations;
}

/**
 * Example Usage Component
 */
export function InstancedBoltsExample() {
  const boltGeometry = useMemo(
    () => new THREE.CylinderGeometry(0.05, 0.05, 0.2, 6),
    []
  );

  const boltMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.8,
        roughness: 0.2,
      }),
    []
  );

  const positions = useMemo(
    () => [
      new THREE.Vector3(-1, 0, -1),
      new THREE.Vector3(1, 0, -1),
      new THREE.Vector3(-1, 0, 1),
      new THREE.Vector3(1, 0, 1),
    ],
    []
  );

  return (
    <InstancedMeshes
      geometry={boltGeometry}
      material={boltMaterial}
      positions={positions}
    />
  );
}
