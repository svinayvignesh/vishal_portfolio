import React, { useRef, useEffect, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
// @ts-ignore
import modelUrl from '/models/turbine/turbine-transformed.glb?url';

const TurbineScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Load the model (including animations)
  const { nodes, materials, animations } = useGLTF(modelUrl) as any;
  const { actions, names } = useAnimations(animations, groupRef);

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

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
    if (!names || names.length === 0) return;
    const action = actions[names[0]];
    if (!action) return;

    // Read scroll progress and active scene
    const { sectionProgress, activeSceneId } = useStore.getState();
    const isSceneActive = activeSceneId === 'gas-turbine';

    // Only run animation when scene is active
    if (isSceneActive) {
      // Map progress to animation time (full range)
      const clip = action.getClip();
      if (!clip) return;
      const targetTime = THREE.MathUtils.clamp(sectionProgress, 0, 1) * clip.duration;

      // Directly set time for tight scrubbing (could lerp for smoothing)
      action.time = targetTime;
    }

    // Mouse tracking and floating on group
    if (groupRef.current) {
      // Base rotation values
      const baseRotationX = 0.5;
      const baseRotationY = -1.3;
      const baseRotationZ = 0.15;

      // Mouse-based rotation (subtle)
      const targetRotationY = baseRotationY + mouse.x * 0.2;
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
      groupRef.current.position.y = floatY;
    }

    // Fade light intensity in and out based on whether scene is active
    if (lightRef.current) {
      const targetIntensity = isSceneActive ? 2500 * sectionProgress : 0;
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetIntensity, 0.1);
    }
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
      <pointLight ref={lightRef} intensity={0} color={"#b08307"} position={[5, -1, 6]} />
    </group>
  );
};

useGLTF.preload(modelUrl);

export default TurbineScene;
