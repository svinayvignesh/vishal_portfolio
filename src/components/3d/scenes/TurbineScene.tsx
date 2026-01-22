import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
// @ts-ignore
import modelUrl from '/models/turbine/turbine-transformed.glb?url';

const TurbineScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  // Load the model (including animations)
  const { nodes, materials, animations } = useGLTF(modelUrl) as any;
  const { actions, names } = useAnimations(animations, groupRef);

  // Initialize animation action and scrub it based on scroll progress
  useEffect(() => {
    if (!names || names.length === 0) return;
    const action = actions[names[0]];
    if (!action) return;
    action.reset();
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.paused = true; // We'll drive the time manually
    action.play();
  }, [actions, names]);

  useFrame(() => {
    if (!names || names.length === 0) return;
    const action = actions[names[0]];
    if (!action) return;

    // Read scroll progress for the current section (0-1)
    const progress = useStore.getState().sectionProgress;

    // Map progress to animation time (full range)
    const clip = action.getClip();
    if (!clip) return;
    const targetTime = THREE.MathUtils.clamp(progress, 0, 1) * clip.duration;

    // Directly set time for tight scrubbing (could lerp for smoothing)
    action.time = targetTime;
  });

  return (
    <group ref={groupRef} dispose={null} rotation={[0.5, -1.3, 0.15]} scale={2}>
      <group name="Sketchfab_Scene">
        <group name="turbine_01_obj">
          <group name="hull_turbine" position={[2.048, 0, 0]}>
            <mesh name="hull_turbine_Plastic-Black-PBR_0" geometry={nodes['hull_turbine_Plastic-Black-PBR_0'].geometry} material={materials.PaletteMaterial001} />
          </group>
          <group name="blades_turbine_003">
            <mesh name="blades_turbine_003_Nickel-Light-PBR_0" geometry={nodes['blades_turbine_003_Nickel-Light-PBR_0'].geometry} material={materials.PaletteMaterial001} />
          </group>
        </group>
        <mesh name="hull_turbine_004_Stainlesssteel-Black-PBR_0" geometry={nodes['hull_turbine_004_Stainlesssteel-Black-PBR_0'].geometry} material={materials.PaletteMaterial001} />
      </group>
    </group>
  );
};

useGLTF.preload(modelUrl);

export default TurbineScene;
