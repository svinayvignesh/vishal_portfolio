import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { useMouse } from '@/hooks/use-mouse';
// @ts-ignore
import modelUrl from '/models/resin_3d_printer/resin_3d_printer-transformed.glb?url';

const PrinterScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const mouse = useMouse();

  // Refs for individual meshes to animate
  const mesh1Ref = useRef<THREE.Mesh>(null);
  const mesh2Ref = useRef<THREE.Mesh>(null);
  const mesh3Ref = useRef<THREE.Mesh>(null); // capac - moves up
  const mesh4Ref = useRef<THREE.Mesh>(null);

  // Load optimized model
  const { nodes, materials } = useGLTF(modelUrl) as any;

  // Cache previous frame values to skip unchanged calculations
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const frameCountRef = useRef(0);

  // Base positions
  const basePositions = {
    mesh1: { y: 0.228 },
    mesh2: { y: -0.008 },
    mesh3: { y: 0.187 }, // capac - will go to 0.5
    mesh4: { y: -0.052 },
  };

  // Animate meshes based on scroll progress, plus mouse tracking and floating
  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
    const { sectionProgress: rawProgress, activeSceneId } = useStore.getState();
    const isSceneActive = activeSceneId === '3d-printer';

    // Check if scene is currently in view (not the same as active)
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

    // Only start animation halfway through scroll (remap 0.5-1.0 to 0-1)
    const progress = rawProgress < 0.5 ? 0 : (rawProgress - 0.5) * 2;

    // Skip expensive mesh animations if not active (only do mouse + float)
    const shouldAnimateMeshes = isSceneActive;

    // Mesh animations when scene is active
    if (shouldAnimateMeshes) {
      // Mesh 3 (capac): moves UP from 0.187 to 0.5
      if (mesh3Ref.current) {
        const targetY = THREE.MathUtils.lerp(basePositions.mesh3.y, 0.5, progress);
        mesh3Ref.current.position.y = THREE.MathUtils.lerp(
          mesh3Ref.current.position.y,
          targetY,
          0.1
        );
      }

      // Other meshes: move DOWN (negative y direction)
      const downOffset = progress * 0.15; // How far they move down

      if (mesh1Ref.current) {
        const targetY = basePositions.mesh1.y - downOffset;
        mesh1Ref.current.position.y = THREE.MathUtils.lerp(
          mesh1Ref.current.position.y,
          targetY,
          0.1
        );
      }

      if (mesh2Ref.current) {
        const targetY = basePositions.mesh2.y - downOffset;
        mesh2Ref.current.position.y = THREE.MathUtils.lerp(
          mesh2Ref.current.position.y,
          targetY,
          0.1
        );
      }

      if (mesh4Ref.current) {
        const targetY = basePositions.mesh4.y - downOffset;
        mesh4Ref.current.position.y = THREE.MathUtils.lerp(
          mesh4Ref.current.position.y,
          targetY,
          0.1
        );
      }
    }

    // Mouse tracking and floating on group
    if (groupRef.current) {
      // Only update rotation if mouse moved significantly (threshold 0.01)
      const mouseDeltaX = Math.abs(mouse.x - prevMouseRef.current.x);
      const mouseDeltaY = Math.abs(mouse.y - prevMouseRef.current.y);

      if (mouseDeltaX > 0.01 || mouseDeltaY > 0.01) {
        const targetRotationY = mouse.x * 0.2;
        const targetRotationX = mouse.y * 0.15;
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

      // Floating effect - only calculate every 2nd frame
      frameCountRef.current++;
      if (frameCountRef.current % 2 === 0) {
        const floatY = Math.sin(elapsed * 0.5) * 0.05;
        groupRef.current.position.y = -1.5 + floatY;
      }
    }

    // Animate light y position from -0.14 to 0.25
    if (lightRef.current) {
      const targetY = THREE.MathUtils.lerp(-0.14, 0.25, rawProgress);
      lightRef.current.position.y = targetY;

      // Fade intensity based on scroll progress, but only when scene is active
      const targetIntensity = isSceneActive ? 1000 * rawProgress : 0;
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetIntensity, 0.1);
    }
  });

  return (
    <group ref={groupRef} dispose={null} scale={12} position={[0, -1.5, 0]}>
      <mesh
        ref={mesh1Ref}
        geometry={nodes.mgn12h_Material001_0.geometry}
        material={materials.PaletteMaterial001}
        position={[0, 0.228, 0.007]}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
        scale={1.25}
      />
      <mesh
        ref={mesh2Ref}
        geometry={nodes.baza_lcd_0.geometry}
        material={materials.material}
        position={[0, -0.008, 0.095]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        ref={mesh3Ref}
        geometry={nodes.capac_Material029_0.geometry}
        material={materials.PaletteMaterial002}
        position={[0, 0.187, 0.095]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        ref={mesh4Ref}
        geometry={nodes.BUTTON_Material004_0.geometry}
        material={materials.PaletteMaterial003}
        position={[0.048, -0.052, 0.191]}
        scale={0.001}
      />

      {/* Single accent light for performance - removed 2 static point lights */}
      <pointLight ref={lightRef} position={[0.14, -0.14, 0.29]} intensity={0} color={"#ffffff"} />
    </group>
  );
};

// Preload the specific model path
useGLTF.preload(modelUrl);

export default PrinterScene;
