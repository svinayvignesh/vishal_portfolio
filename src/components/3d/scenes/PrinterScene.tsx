import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
// @ts-ignore
import modelUrl from '/models/resin_3d_printer/resin_3d_printer-transformed.glb?url';

const PrinterScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  // Refs for individual meshes to animate
  const mesh1Ref = useRef<THREE.Mesh>(null);
  const mesh2Ref = useRef<THREE.Mesh>(null);
  const mesh3Ref = useRef<THREE.Mesh>(null); // capac - moves up
  const mesh4Ref = useRef<THREE.Mesh>(null);

  // Load optimized model
  const { nodes, materials } = useGLTF(modelUrl) as any;

  // Base positions
  const basePositions = {
    mesh1: { y: 0.228 },
    mesh2: { y: -0.008 },
    mesh3: { y: 0.187 }, // capac - will go to 0.5
    mesh4: { y: -0.052 },
  };

  // Animate meshes based on scroll progress
  useFrame(() => {
    const rawProgress = useStore.getState().sectionProgress;

    // Only start animation halfway through scroll (remap 0.5-1.0 to 0-1)
    const progress = rawProgress < 0.5 ? 0 : (rawProgress - 0.5) * 2;

    // Mesh 3 (capac): moves UP from 0.187 to 0.5
    if (mesh3Ref.current) {
      const targetY = THREE.MathUtils.lerp(basePositions.mesh3.y, 0.5, progress);
      mesh3Ref.current.position.y = THREE.MathUtils.lerp(
        mesh3Ref.current.position.y,
        targetY,
        0.1
      );
    }

    // Other meshes: move DOWN (negative y direction)
    const downOffset = progress * 0.15; // How far they move down

    if (mesh1Ref.current) {
      const targetY = basePositions.mesh1.y - downOffset;
      mesh1Ref.current.position.y = THREE.MathUtils.lerp(
        mesh1Ref.current.position.y,
        targetY,
        0.1
      );
    }

    if (mesh2Ref.current) {
      const targetY = basePositions.mesh2.y - downOffset;
      mesh2Ref.current.position.y = THREE.MathUtils.lerp(
        mesh2Ref.current.position.y,
        targetY,
        0.1
      );
    }

    if (mesh4Ref.current) {
      const targetY = basePositions.mesh4.y - downOffset;
      mesh4Ref.current.position.y = THREE.MathUtils.lerp(
        mesh4Ref.current.position.y,
        targetY,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef} dispose={null} scale={12} position={[0, -1.5, 0]}>
      <mesh
        ref={mesh1Ref}
        geometry={nodes.mgn12h_Material001_0.geometry}
        material={materials.PaletteMaterial001}
        position={[0, 0.228, 0.007]}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
        scale={1.25}
      />
      <mesh
        ref={mesh2Ref}
        geometry={nodes.baza_lcd_0.geometry}
        material={materials.material}
        position={[0, -0.008, 0.095]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        ref={mesh3Ref}
        geometry={nodes.capac_Material029_0.geometry}
        material={materials.PaletteMaterial002}
        position={[0, 0.187, 0.095]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        ref={mesh4Ref}
        geometry={nodes.BUTTON_Material004_0.geometry}
        material={materials.PaletteMaterial003}
        position={[0.048, -0.052, 0.191]}
        scale={0.001}
      />

      {/* Ambient lighting specific to this object to highlight details */}
      <pointLight position={[2, 2, 2]} intensity={0.5} color="#4a90a4" />
      <pointLight position={[-2, 1, 2]} intensity={0.3} color="#d4a574" />
    </group>
  );
};

// Preload the specific model path
useGLTF.preload(modelUrl);

export default PrinterScene;
