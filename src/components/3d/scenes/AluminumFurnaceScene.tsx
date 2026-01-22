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
    <group ref={groupRef} dispose={null} scale={0.5} position={[0, -1.5, 0]} rotation={[0.2792526803190927, 0, 0]}>
      <mesh geometry={nodes['Mc_channel_MC4X138(1)1_Silver_Painted_Metal_0'].geometry} material={materials.PaletteMaterial001} rotation={[0, Math.PI / 2, 0]} scale={0.026} />
      <mesh geometry={nodes['Cut-Extrude4_Refractory_0'].geometry} material={materials.PaletteMaterial002} rotation={[0, Math.PI / 2, 0]} scale={0.026} />
      <mesh geometry={nodes.NONE_Mesh_guard_0.geometry} material={materials.Mesh_guard} position={[-0.667, 3.48, 4.629]} rotation={[0, -Math.PI / 2, 0]} scale={0.026} />
      <mesh geometry={nodes.Plane001_Catwalk_0.geometry} material={materials.Catwalk} position={[0.792, 3.329, 1.879]} rotation={[-Math.PI / 2, 0, 0]} scale={0.026} />
    </group>
  );
};

useGLTF.preload(modelUrl);

export default RoofingScene;
