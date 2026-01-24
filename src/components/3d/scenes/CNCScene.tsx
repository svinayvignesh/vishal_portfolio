import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMouse } from '@/hooks/use-mouse';
import { useStore } from '@/store/useStore';
import { optimizeModel } from '@/utils/modelOptimizer';
// @ts-ignore
import modelUrl from '/models/cnc_machine/cnc_machine-transformed.glb?url';

const CNCScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const mouse = useMouse();

  // Load the model
  const { scene, nodes, materials } = useGLTF(modelUrl) as any;

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

  // Animate light color, mouse tracking, and floating
  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;

    // Check if scene is visible - skip animations when invisible
    if (!groupRef.current) return;
    const isVisible = groupRef.current.parent && groupRef.current.parent.scale.x > 0.05;
    if (!isVisible) return;

    // Light color cycling
    if (lightRef.current) {
      const hue = (elapsed * 0.3) % 1;
      const color = new THREE.Color();
      color.setHSL(hue, 1, 0.6);
      lightRef.current.color.copy(color);
    }

    // Mouse tracking and floating - with frame skipping for performance
    frameCountRef.current++;
    const skipFrame = qualitySettings.targetFPS < 30 && frameCountRef.current % 3 !== 0;

    if (groupRef.current && !skipFrame) {
      // Mouse-based rotation (subtle) - only if enabled
      if (qualitySettings.enableMouseParallax) {
        const targetRotationY = -0.4 + mouse.x * 0.3;
        const targetRotationX = mouse.y * 0.2;
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
        const floatY = Math.sin(elapsed * 0.5) * 0.1;
        groupRef.current.position.y = -2.3 + floatY;
      } else {
        groupRef.current.position.y = -2.3;
      }
    }
  });

  return (
    <group ref={groupRef} dispose={null} position={[0.3, -2.3, 0]} scale={1.5} rotation={[0, -0.4, 0]}>
      <mesh geometry={nodes.Object_5.geometry} material={materials.PaletteMaterial001} position={[-0.491, 2.149, -0.06]} rotation={[-Math.PI, 0, Math.PI / 2]} scale={0.025} />

      <mesh geometry={nodes.Object_322.geometry} material={materials.M_14___Default} position={[1.569, 1.044, 1.947]} rotation={[1.857, 0.445, 0.971]} scale={0.025} />

      {/* Point light for CNC machine detail - color changes over time */}
      <pointLight ref={lightRef} position={[-0.46, 1.77, 0.236136437489527]} intensity={10} color={"#eae206"} scale={0} />
    </group>
  );
};

useGLTF.preload(modelUrl);

export default CNCScene;
