import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import modelUrl from '/models/aluminum_furnace/schaefer_gas_aluminum_furnace-transformed.glb?url';

const RoofingScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  // Load the model
  const { nodes, materials } = useGLTF(modelUrl) as any;

  return (
    <group ref={groupRef} dispose={null}>
      <mesh geometry={nodes['Mc_channel_MC4X138(1)1_Silver_Painted_Metal_0'].geometry} material={materials.PaletteMaterial001} />
      <mesh geometry={nodes['Cut-Extrude4_Refractory_0'].geometry} material={materials.PaletteMaterial002} />
      <mesh geometry={nodes.NONE_Mesh_guard_0.geometry} material={materials.Mesh_guard} />
      <mesh geometry={nodes.Plane001_Catwalk_0.geometry} material={materials.Catwalk} />
    </group>
  );
};

useGLTF.preload(modelUrl);

export default RoofingScene;
