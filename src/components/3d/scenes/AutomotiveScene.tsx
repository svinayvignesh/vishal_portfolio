import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMouse } from '@/hooks/use-mouse';
import { useStore } from '@/store/useStore';
import { optimizeModel } from '@/utils/modelOptimizer';
// @ts-ignore
import modelUrl from '/models/ford/ford_f150_raptor-transformed.glb?url';

const AutomotiveScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const mouse = useMouse();

  // Load the model
  const { scene, nodes, materials } = useGLTF(modelUrl) as any;

  // Get quality settings from store
  const qualitySettings = useStore((state) => state.qualitySettings);

  // Cache previous frame values to skip unchanged calculations
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const frameCountRef = useRef(0);

  // Optimize model on load
  useEffect(() => {
    if (scene) {
      optimizeModel(scene, {
        enableBackfaceCulling: true,
        simplifyShaders: qualitySettings.useSimplifiedShaders,
        enableOcclusion: true,
        hiddenMeshNames: [
          'console',      // Interior console
          'pedals',       // Interior pedals
          'carpet',       // Interior carpet
          'stitch',       // Seat stitching (too small to see)
          'rivet',        // Rivets (too small to see)
          'undercarriage', // Bottom of car (never visible)
        ],
      });
    }
  }, [scene, qualitySettings.useSimplifiedShaders]);

  // Animate mouse tracking and floating
  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;

    // Check if scene is currently visible by checking parent scale
    // We need to keep animating during transitions for smooth rendering
    if (!groupRef.current) return;

    const isVisible = groupRef.current.parent && groupRef.current.parent.scale.x > 0.05;

    // Only skip animations when scene is completely invisible
    if (!isVisible) {
      // Fade out light intensity when invisible
      if (lightRef.current && lightRef.current.intensity > 0.01) {
        lightRef.current.intensity *= 0.9;
      }
      if (directionalLightRef.current && directionalLightRef.current.intensity > 0.01) {
        directionalLightRef.current.intensity *= 0.9;
      }
      return;
    }

    // Get scroll progress for light animation from store
    const { sectionProgress } = useStore.getState();

    // Calculate fade factor: fade in from 0-0.15, full brightness 0.15-0.85, fade out 0.85-1.0
    let fadeFactor = 1;
    if (sectionProgress < 0.15) {
      fadeFactor = sectionProgress / 0.15; // Fade in
    } else if (sectionProgress > 0.85) {
      fadeFactor = (1 - sectionProgress) / 0.15; // Fade out
    }
    fadeFactor = THREE.MathUtils.clamp(fadeFactor, 0, 1);

    // Scroll-driven light animation
    if (lightRef.current) {
      const targetX = THREE.MathUtils.lerp(0.8, -0.3, sectionProgress);
      lightRef.current.position.x = targetX;

      const targetIntensity = 100 * sectionProgress * fadeFactor;
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetIntensity, 0.1);
    }

    // Fade directional light
    if (directionalLightRef.current) {
      const targetIntensity = 30 * fadeFactor;
      directionalLightRef.current.intensity = THREE.MathUtils.lerp(
        directionalLightRef.current.intensity,
        targetIntensity,
        0.1
      );
    }

    // Mouse tracking and floating (when visible) - with frame skipping
    // Skip 2 out of 3 frames on low-end devices
    frameCountRef.current++;
    const skipFrame = qualitySettings.targetFPS < 30 && frameCountRef.current % 3 !== 0;

    if (groupRef.current && !skipFrame) {
      // Base rotation values
      const baseRotationX = -2.9722319608769;
      const baseRotationY = -0.4687061236053624;

      // Only update rotation if mouse parallax is enabled and mouse moved significantly
      if (qualitySettings.enableMouseParallax) {
        const mouseDeltaX = Math.abs(mouse.x - prevMouseRef.current.x);
        const mouseDeltaY = Math.abs(mouse.y - prevMouseRef.current.y);

        if (mouseDeltaX > 0.01 || mouseDeltaY > 0.01) {
          const targetRotationY = baseRotationY + mouse.x * 0.2;
          const targetRotationX = baseRotationX + mouse.y * 0.15;
          groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            targetRotationY,
            0.08 // Increased for fewer updates
          );
          groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x,
            targetRotationX,
            0.08
          );
          prevMouseRef.current = { x: mouse.x, y: mouse.y };
        }
      }

      // Floating effect - only calculate if enabled and every 2nd frame
      if (qualitySettings.enableFloating) {
        frameCountRef.current++;
        if (frameCountRef.current % 2 === 0) {
          const floatY = Math.sin(elapsed * 0.5) * 0.08;
          groupRef.current.position.y = floatY;
        }
      }
    }
  });

  return (
    <group ref={groupRef} rotation={[-3.0322319608769, -0.7, -3.06812904664661]} scale={2.3} position={[0.09, -3.28, 0]}>
      <mesh geometry={nodes.Object_8.geometry} material={materials.PaletteMaterial001} rotation={[Math.PI / 2, 0, 0.007]} />
      <mesh geometry={nodes.Object_14.geometry} material={materials.PaletteMaterial002} rotation={[Math.PI / 2, 0, 0.007]} />
      <mesh geometry={nodes.Object_26.geometry} material={materials['stitch.001']} rotation={[Math.PI / 2, 0, 0.007]} />
      <mesh geometry={nodes.Object_28.geometry} material={materials.PaletteMaterial003} rotation={[Math.PI / 2, 0, 0.007]} />
      <mesh geometry={nodes.Object_39.geometry} material={materials['vehicle_generic_tyrewallblack.001']} rotation={[1.6109140099536625, 0.0007077694913524425, -3.131100906233251]} position={[1.84835177573354, -0.520775418722115, -0.71]} />

      {/* Front-right accent light for car detail - slides across as you scroll */}
      <pointLight ref={lightRef} position={[1.76705953376299, -0.0907553081636627, -1.77]} intensity={0} color={"#1351d8"} />


      {/* Directional light - configure position and angle as needed */}
      <directionalLight ref={directionalLightRef} position={[-3.7883594057103, 3.00433744099801, -0.48]} intensity={0} />
    </group>
  );
};

useGLTF.preload(modelUrl);

export default AutomotiveScene;
