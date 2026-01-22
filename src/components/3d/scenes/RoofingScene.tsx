import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import modelUrl from '/transformed_models/aluminum_furnace/schaefer_gas_aluminum_furnace-transformed.glb?url';

interface RoofingSceneProps {
  progress: number;
}

const RoofingScene: React.FC<RoofingSceneProps> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);
  // Load the model
  const { nodes, materials } = useGLTF(modelUrl) as any;

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      // X-axis: 0 (centered)
      // Y-axis: oscillation for floating effect
      // Z-axis: 0 (default depth)
      groupRef.current.position.y = -1.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.y = -0.5 + Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    // Scale reduced to 0.8 for manageable size (was 5)
    <group ref={groupRef} position={[0, -1.0, -3]} scale={[0.8, 0.8, 0.8]} dispose={null}>
      <mesh geometry={nodes['Mc_channel_MC4X138(1)1_Silver_Painted_Metal_0'].geometry} material={materials.PaletteMaterial001} rotation={[0, Math.PI / 2, 0]} scale={0.026} />
      <mesh geometry={nodes['Cut-Extrude4_Refractory_0'].geometry} material={materials.PaletteMaterial002} rotation={[0, Math.PI / 2, 0]} scale={0.026} />
      <mesh geometry={nodes.NONE_Mesh_guard_0.geometry} material={materials.Mesh_guard} position={[-0.667, 3.48, 4.629]} rotation={[0, -Math.PI / 2, 0]} scale={0.026} />
      <mesh geometry={nodes.Plane001_Catwalk_0.geometry} material={materials.Catwalk} position={[0.792, 3.329, 1.879]} rotation={[-Math.PI / 2, 0, 0]} scale={0.026} />
    </group>
  );
};

useGLTF.preload(modelUrl);

export default RoofingScene;
