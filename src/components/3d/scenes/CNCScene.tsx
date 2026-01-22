import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import modelUrl from '/transformed_models/cnc_machine/cnc_machine-transformed.glb?url';

interface CNCSceneProps {
  progress: number;
}

const CNCScene: React.FC<CNCSceneProps> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);
  //Load the model
  const { nodes, materials, animations } = useGLTF(modelUrl) as any;
  const { actions } = useAnimations(animations, groupRef);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation similar to other scenes
      // X-axis: 0 (centered)
      // Y-axis: oscillation for floating effect
      // Z-axis: 0 (default depth)
      groupRef.current.position.y = -0.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.y = -0.5 + Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    // Scale reduced to 1.5 for manageable size (was 10)
    <group ref={groupRef} position={[0, -0.5, 0]} scale={[1.5, 1.5, 1.5]} dispose={null}>
      <mesh geometry={nodes.Object_5.geometry} material={materials.PaletteMaterial001} position={[-0.491, 2.149, -0.06]} rotation={[-Math.PI, 0, Math.PI / 2]} scale={0.025} />
      <mesh geometry={nodes.Object_302.geometry} material={materials.PaletteMaterial002} position={[0.563, 1.375, 1.233]} scale={0.025} />
      <mesh geometry={nodes.Object_322.geometry} material={materials.M_14___Default} position={[1.569, 1.044, 1.947]} rotation={[1.857, 0.445, 0.971]} scale={0.025} />
    </group>
  );
};

useGLTF.preload(modelUrl);

export default CNCScene;
