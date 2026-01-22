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
    <group ref={groupRef} dispose={null} position={[0.3, -2.3, 0]} scale={1.5} rotation={[0, -0.4, 0]}>
      <mesh geometry={nodes.Object_5.geometry} material={materials.PaletteMaterial001} position={[-0.491, 2.149, -0.06]} rotation={[-Math.PI, 0, Math.PI / 2]} scale={0.025} />
      <mesh geometry={nodes.Object_302.geometry} material={materials.PaletteMaterial002} position={[0.563, 1.375, 1.233]} scale={0.025} />
      <mesh geometry={nodes.Object_322.geometry} material={materials.M_14___Default} position={[1.569, 1.044, 1.947]} rotation={[1.857, 0.445, 0.971]} scale={0.025} />
    </group>
  );
};

useGLTF.preload(modelUrl);

export default CNCScene;
