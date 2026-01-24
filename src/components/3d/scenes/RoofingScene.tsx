import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMouse } from '@/hooks/use-mouse';
import { useStore } from '@/store/useStore';
import { optimizeModel } from '@/utils/modelOptimizer';
// @ts-ignore
import modelUrl from '/models/aluminum_furnace/schaefer_gas_aluminum_furnace-transformed.glb?url';

const RoofingScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useMouse();

  // Load the model
  const { scene, nodes, materials } = useGLTF(modelUrl) as any;

  // Get quality settings from store
  const qualitySettings = useStore((state) => state.qualitySettings);

  // Optimize model on load
  useEffect(() => {
    if (scene) {
      optimizeModel(scene, {
        enableBackfaceCulling: true,
        simplifyShaders: qualitySettings.useSimplifiedShaders,
      });
    }
  }, [scene, qualitySettings.useSimplifiedShaders]);

  // Mouse tracking and floating animation
  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;

    // Check if scene is visible - skip animations when invisible
    if (!groupRef.current) return;
    const isVisible = groupRef.current.parent && groupRef.current.parent.scale.x > 0.05;
    if (!isVisible) return;

    if (groupRef.current) {
      // Base rotation values
      const baseRotationX = 0.2792526803190927;

      // Mouse-based rotation (subtle) - only if enabled
      if (qualitySettings.enableMouseParallax) {
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
      }

      // Floating effect - only if enabled
      if (qualitySettings.enableFloating) {
        const floatY = Math.sin(elapsed * 0.5) * 0.08;
        groupRef.current.position.y = -1.5 + floatY;
      } else {
        groupRef.current.position.y = -1.5;
      }
    }
  });

  return (
    <group ref={groupRef} dispose={null} scale={0.5} position={[0, -1.5, 0]} rotation={[0.2792526803190927, 0, 0]}>
      <mesh geometry={nodes['Mc_channel_MC4X138(1)1_Silver_Painted_Metal_0'].geometry} material={materials.PaletteMaterial001} rotation={[0, Math.PI / 2, 0]} scale={0.026} />
      <mesh geometry={nodes['Cut-Extrude4_Refractory_0'].geometry} material={materials.PaletteMaterial002} rotation={[0, Math.PI / 2, 0]} scale={0.026} />


    </group>
  );
};

useGLTF.preload(modelUrl);

export default RoofingScene;
