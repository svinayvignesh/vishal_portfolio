import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { useMouse } from '@/hooks/use-mouse';
import { optimizeModel } from '@/utils/modelOptimizer';
// @ts-ignore
import modelUrl from '/models/turbine/turbine-transformed.glb?url';

const TurbineScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const mouse = useMouse();

  // Load the model (including animations)
  const { scene, nodes, materials, animations } = useGLTF(modelUrl) as any;
  const { actions, names } = useAnimations(animations, groupRef);

  // Get quality settings from store
  const qualitySettings = useStore((state) => state.qualitySettings);

  // Frame counter for skipping frames on low-end devices
  const frameCountRef = useRef(0);

  // Optimize model on load
  useEffect(() => {
    if (scene) {
      optimizeModel(scene, {
        enableBackfaceCulling: true,
        simplifyShaders: qualitySettings.useSimplifiedShaders,
        enableOcclusion: true,
      });
    }
  }, [scene, qualitySettings.useSimplifiedShaders]);

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

    // Check if scene is visible - skip animations when invisible
    if (!groupRef.current) return;
    const isVisible = groupRef.current.parent && groupRef.current.parent.scale.x > 0.05;
    if (!isVisible) return;

    // Read scroll progress and active scene
    const { sectionProgress, activeSceneId } = useStore.getState();
    const isSceneActive = activeSceneId === 'gas-turbine';

    // Run animation when visible (needed for smooth transitions)
    if (isSceneActive) {
      // Map progress to animation time (full range)
      const clip = action.getClip();
      if (!clip) return;
      const targetTime = THREE.MathUtils.clamp(sectionProgress, 0, 1) * clip.duration;

      // Directly set time for tight scrubbing (could lerp for smoothing)
      action.time = targetTime;
    }

    // Mouse tracking and floating on group - with frame skipping for performance
    frameCountRef.current++;
    const skipFrame = qualitySettings.targetFPS < 30 && frameCountRef.current % 3 !== 0;

    if (groupRef.current && !skipFrame) {
      // Base rotation values
      const baseRotationX = 0.5;
      const baseRotationY = -1.3;

      // Mouse-based rotation (subtle) - only if enabled
      if (qualitySettings.enableMouseParallax) {
        const targetRotationY = baseRotationY + mouse.x * 0.2;
        const targetRotationX = baseRotationX + mouse.y * 0.15;
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          targetRotationY,
          0.08 // Increased lerp speed to compensate for fewer updates
        );
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          targetRotationX,
          0.08
        );
      }

      // Floating effect - only if enabled
      if (qualitySettings.enableFloating) {
        const floatY = Math.sin(elapsed * 0.5) * 0.08;
        groupRef.current.position.y = floatY;
      } else {
        groupRef.current.position.y = 0;
      }
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
