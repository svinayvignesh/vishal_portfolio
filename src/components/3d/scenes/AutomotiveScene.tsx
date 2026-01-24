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
      return;
    }

    // Get scroll progress for light animation from store
    const { sectionProgress } = useStore.getState();

    // Scroll-driven light animation
    if (lightRef.current) {
      const targetX = THREE.MathUtils.lerp(0.8, -0.3, sectionProgress);
      lightRef.current.position.x = targetX;

      const targetIntensity = 100 * sectionProgress;
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetIntensity, 0.1);
    }

    // Mouse tracking and floating (when visible)
    if (groupRef.current) {
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
            0.05
          );
          groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x,
            targetRotationX,
            0.05
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
    <group dispose={null} position={[-1.62, -1.5, -1.09]} scale={2}>
      <group ref={groupRef} rotation={[-2.9722319608769, -0.4687061236053624, -3.1081290466466123]}>
        <mesh geometry={nodes.Object_8.geometry} material={materials.PaletteMaterial001} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
        <mesh geometry={nodes.Object_12.geometry} material={materials['glass.006']} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
        <mesh geometry={nodes.Object_14.geometry} material={materials.PaletteMaterial002} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
        <mesh geometry={nodes.Object_16.geometry} material={materials['goma.002']} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
        <mesh geometry={nodes.Object_18.geometry} material={materials['crome.011']} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
        <mesh geometry={nodes.Object_20.geometry} material={materials['carpet.003']} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
        <mesh geometry={nodes.Object_22.geometry} material={materials['keyhole.001']} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
        <mesh geometry={nodes.Object_24.geometry} material={materials['symbols.001']} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
        <mesh geometry={nodes.Object_26.geometry} material={materials['stitch.001']} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
        <mesh geometry={nodes.Object_28.geometry} material={materials.PaletteMaterial003} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
        <mesh geometry={nodes.Object_32.geometry} material={materials.leathers} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
        <mesh geometry={nodes.Object_36.geometry} material={materials['rivet.001']} position={[-0.914, 1.06, -1.094]} rotation={[Math.PI / 2, 0, 0.007]} />
        <mesh geometry={nodes.Object_44.geometry} material={materials['discbrake.004']} position={[-0.901, 0.476, -1.827]} rotation={[-1.9, 0.001, 0]} />
        <mesh geometry={nodes.Object_81.geometry} material={materials['vehiclelights.010']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
        <mesh geometry={nodes.Object_101.geometry} material={materials['undercarriage.004']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
        <mesh geometry={nodes.Object_151.geometry} material={materials['vehicle_generic_carbon.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
        <mesh geometry={nodes.Object_157.geometry} material={materials['symbol3.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
        <mesh geometry={nodes.Object_166.geometry} material={materials['grill.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
        <mesh geometry={nodes.Object_169.geometry} material={materials['pedals.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
        <mesh geometry={nodes.Object_182.geometry} material={materials['665.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
        <mesh geometry={nodes.Object_286.geometry} material={materials['vehicle_generic_detail2.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
        <mesh geometry={nodes.Object_305.geometry} material={materials['MAATE_WhelenDominator.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
        <mesh geometry={nodes.Object_364.geometry} material={materials['11BLACK.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
        <mesh geometry={nodes.Object_393.geometry} material={materials['vehiclelights128.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
        <mesh geometry={nodes.Object_396.geometry} material={materials['lasluces.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
        <mesh geometry={nodes.Object_406.geometry} material={materials['genesis.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
        <mesh geometry={nodes.Object_412.geometry} material={materials['console.003']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
        <mesh geometry={nodes.Object_452.geometry} material={materials['for_badge.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
        <mesh geometry={nodes.Object_478.geometry} material={materials['deng.001']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />
        <mesh geometry={nodes.Object_39.geometry} material={materials['vehicle_generic_tyrewallblack.001']} position={[-0.919, 0.476, 1.924]} rotation={[Math.PI / 2, 0, 0.005]} />
        <mesh geometry={nodes.Object_42.geometry} material={materials['vehicle_generic_tyrewallblack.002']} position={[-0.901, 0.476, -1.827]} rotation={[-1.871, -0.136, 0.416]} />
        <mesh geometry={nodes.Object_409.geometry} material={materials['Coban_tex.003']} position={[0, 0.626, 0]} rotation={[Math.PI / 2, 0, 0.005]} />

        {/* Front-right accent light for car detail - slides across as you scroll */}
        <pointLight ref={lightRef} position={[0.8, 1, -3]} intensity={0} color={"#1351d8"} />
      </group>
    </group>
  );
};

useGLTF.preload(modelUrl);

export default AutomotiveScene;
