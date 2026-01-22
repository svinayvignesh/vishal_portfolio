import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import modelUrl from '/transformed_models/resin_3d_printer/resin_3d_printer-transformed.glb?url';

interface PrinterSceneProps {
  progress: number;
}

const PrinterScene: React.FC<PrinterSceneProps> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Load optimized model
  const { nodes, materials } = useGLTF(modelUrl) as any;

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      // X-axis: 0 (centered)
      // Y-axis: oscillation for floating effect
      // Z-axis: 0 (default depth)
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1 + (progress * Math.PI / 4);
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[-0.5, -0.5, 0]} scale={[2, 2, 2]} dispose={null}>
      <mesh
        geometry={nodes.mgn12h_Material001_0.geometry}
        material={materials.PaletteMaterial001}
        position={[0, 0.228, 0.007]}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
        scale={1.25}
      />
      <mesh
        geometry={nodes.baza_lcd_0.geometry}
        material={materials.material}
        position={[0, -0.008, 0.095]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes.capac_Material029_0.geometry}
        material={materials.PaletteMaterial002}
        position={[0, 0.187, 0.095]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
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
