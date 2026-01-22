import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import modelUrl from '/models/cnc_machine/cnc_machine-transformed.glb?url';

const CNCScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  //Load the model
  const { nodes, materials } = useGLTF(modelUrl) as any;

  return (
    <group ref={groupRef} dispose={null}>
      <mesh geometry={nodes.Object_5.geometry} material={materials.PaletteMaterial001} />
      <mesh geometry={nodes.Object_302.geometry} material={materials.PaletteMaterial002} />
      <mesh geometry={nodes.Object_322.geometry} material={materials.M_14___Default} />
    </group>
  );
};

useGLTF.preload(modelUrl);

export default CNCScene;
