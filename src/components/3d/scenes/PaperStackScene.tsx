import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import modelUrl from '/models/document_file_folder/document_file_folder-transformed.glb?url';

const PaperStackScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  // Load optimized model
  const { nodes, materials } = useGLTF(modelUrl) as any;

  return (
    <group ref={groupRef} dispose={null}>
      <group name="Sketchfab_Scene">
        <mesh
          name="A4_Page3Shape_2_0"
          geometry={nodes.A4_Page3Shape_2_0.geometry}
          material={materials.A4_Page3Shape}
        />
        <mesh
          name="Folder_1Shape"
          geometry={nodes.Folder_1Shape.geometry}
          material={materials.Folder_1Shape}
          morphTargetDictionary={nodes.Folder_1Shape.morphTargetDictionary}
          morphTargetInfluences={nodes.Folder_1Shape.morphTargetInfluences}
        />
      </group>

      {/* Ambient particles specific to this object */}
      <pointLight position={[2, 2, 2]} intensity={1.0} color="#d4a574" />
    </group>
  );
};

// Preload the specific model path
useGLTF.preload(modelUrl);

export default PaperStackScene;
