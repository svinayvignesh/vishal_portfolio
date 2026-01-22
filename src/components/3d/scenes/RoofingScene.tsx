import React, { useRef, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
// @ts-ignore
import modelUrl from '/models/aluminum_furnace/schaefer_gas_aluminum_furnace-transformed.glb?url';

const RoofingScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Load the model
  const { nodes, materials } = useGLTF(modelUrl) as any;

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Mouse tracking and floating animation
  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;

    if (groupRef.current) {
      // Base rotation values
      const baseRotationX = 0.2792526803190927;

      // Mouse-based rotation (subtle)
      const targetRotationY = mouse.x * 0.2;
      const targetRotationX = baseRotationX + mouse.y * 0.15;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotationY,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotationX,
        0.05
      );

      // Floating effect
      const floatY = Math.sin(elapsed * 0.5) * 0.08;
      groupRef.current.position.y = -1.5 + floatY;
    }
  });

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
