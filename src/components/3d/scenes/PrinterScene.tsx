import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import modelUrl from '/models/resin_3d_printer/resin_3d_printer-transformed.glb?url';

const PrinterScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  // Load optimized model
  const { nodes, materials } = useGLTF(modelUrl) as any;

  return (
    <group ref={groupRef} dispose={null}>
      <mesh
        geometry={nodes.mgn12h_Material001_0.geometry}
        material={materials.PaletteMaterial001}
      />
      <mesh
        geometry={nodes.baza_lcd_0.geometry}
        material={materials.material}
      />
      <mesh
        geometry={nodes.capac_Material029_0.geometry}
        material={materials.PaletteMaterial002}
      />
      <mesh
        geometry={nodes.BUTTON_Material004_0.geometry}
        material={materials.PaletteMaterial003}
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
