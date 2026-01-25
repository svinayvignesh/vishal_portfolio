import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { useMouse } from '@/hooks/use-mouse';
import { optimizeModel } from '@/utils/modelOptimizer';
// @ts-ignore
import modelUrl from '/models/resin_3d_printer/resin_3d_printer-transformed.glb?url';

const PrinterScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const mouse = useMouse();

  // Refs for individual meshes to animate
  const mesh1Ref = useRef<THREE.Mesh>(null);
  const mesh2Ref = useRef<THREE.Mesh>(null);
  const mesh3Ref = useRef<THREE.Mesh>(null); // capac - moves up
  const mesh4Ref = useRef<THREE.Mesh>(null);

  // Load optimized model
  const { scene, nodes, materials } = useGLTF(modelUrl) as any;


  // Get quality settings from store
  const qualitySettings = useStore((state) => state.qualitySettings);

  // Cache previous frame values to skip unchanged calculations
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const frameCountRef = useRef(0);

  // Cache store values to avoid reading 60x/sec
  const sectionProgress = useStore((state) => state.sectionProgress);
  const activeSceneId = useStore((state) => state.activeSceneId);
  const isSceneActive = activeSceneId === '3d-printer';

  // Optimize model on load with aggressive culling
  useEffect(() => {
    if (scene) {
      optimizeModel(scene, {
        enableBackfaceCulling: true,
        simplifyShaders: qualitySettings.useSimplifiedShaders,
        enableOcclusion: true,
        hiddenMeshNames: ['interior', 'hidden', 'back'], // Hide interior meshes
      });

      // Additional optimization: Freeze matrices for static objects
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Freeze world matrix for better performance
          child.matrixAutoUpdate = false;
          child.updateMatrix();
        }
      });
    }
  }, [scene, qualitySettings.useSimplifiedShaders]);

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
      if (directionalLightRef.current && directionalLightRef.current.intensity > 0.01) {
        directionalLightRef.current.intensity *= 0.9;
      }
      return;
    }

    // Calculate fade factor: fade in from 0-0.15, full brightness 0.15-0.85, fade out 0.85-1.0
    let fadeFactor = 1;
    if (sectionProgress < 0.15) {
      fadeFactor = sectionProgress / 0.15; // Fade in
    } else if (sectionProgress > 0.85) {
      fadeFactor = (1 - sectionProgress) / 0.15; // Fade out
    }
    fadeFactor = THREE.MathUtils.clamp(fadeFactor, 0, 1);

    // Only start animation halfway through scroll (remap 0.5-1.0 to 0-1)
    const progress = sectionProgress < 0.5 ? 0 : (sectionProgress - 0.5) * 2;

    // Skip expensive mesh animations if not active (only do mouse + float)
    const shouldAnimateMeshes = isSceneActive;

    // Frame skipping for low-end devices - skip 2 out of 3 frames
    frameCountRef.current++;
    const skipFrame = qualitySettings.targetFPS < 30 && frameCountRef.current % 3 !== 0;

    // Mesh animations when scene is active
    // OPTIMIZED: Direct assignment instead of double-lerp (was causing stuttering)
    if (shouldAnimateMeshes) {
      // Mesh 3 (capac): moves UP from 0.187 to 0.5
      if (mesh3Ref.current) {
        const targetY = THREE.MathUtils.lerp(basePositions.mesh3.y, 0.5, progress);
        // Use faster lerp with lower smoothing for less computation
        mesh3Ref.current.position.y = THREE.MathUtils.lerp(
          mesh3Ref.current.position.y,
          targetY,
          0.15 // Increased from 0.1 for snappier response, less lerp iterations
        );
        // Enable matrix updates for animated mesh
        mesh3Ref.current.matrixAutoUpdate = true;
        mesh3Ref.current.updateMatrix();
      }

      // Other meshes: move DOWN (negative y direction)
      const downOffset = progress * 0.15;

      if (mesh1Ref.current) {
        const targetY = basePositions.mesh1.y - downOffset;
        mesh1Ref.current.position.y = THREE.MathUtils.lerp(
          mesh1Ref.current.position.y,
          targetY,
          0.15
        );
        mesh1Ref.current.matrixAutoUpdate = true;
        mesh1Ref.current.updateMatrix();
      }

      if (mesh2Ref.current) {
        const targetY = basePositions.mesh2.y - downOffset;
        mesh2Ref.current.position.y = THREE.MathUtils.lerp(
          mesh2Ref.current.position.y,
          targetY,
          0.15
        );
        mesh2Ref.current.matrixAutoUpdate = true;
        mesh2Ref.current.updateMatrix();
      }

      if (mesh4Ref.current) {
        const targetY = basePositions.mesh4.y - downOffset;
        mesh4Ref.current.position.y = THREE.MathUtils.lerp(
          mesh4Ref.current.position.y,
          targetY,
          0.15
        );
        mesh4Ref.current.matrixAutoUpdate = true;
        mesh4Ref.current.updateMatrix();
      }
    }

    // Mouse tracking and floating on group - with frame skipping
    if (groupRef.current && !skipFrame) {
      // Only update rotation if mouse parallax is enabled and mouse moved significantly
      if (qualitySettings.enableMouseParallax) {
        const mouseDeltaX = Math.abs(mouse.x - prevMouseRef.current.x);
        const mouseDeltaY = Math.abs(mouse.y - prevMouseRef.current.y);

        if (mouseDeltaX > 0.01 || mouseDeltaY > 0.01) {
          const targetRotationY = mouse.x * 0.2;
          const targetRotationX = mouse.y * 0.15;
          groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            targetRotationY,
            0.08 // Increased lerp speed for fewer updates
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
          const floatY = Math.sin(elapsed * 0.5) * 0.05;
          groupRef.current.position.y = -1.5 + floatY;
        }
      } else {
        // Keep static position if floating is disabled
        groupRef.current.position.y = -1.5;
      }
    }

    // Animate light y position from -0.14 to 0.25
    if (lightRef.current) {
      const targetY = THREE.MathUtils.lerp(-0.14, 0.25, sectionProgress);
      lightRef.current.position.y = targetY;

      // Fade intensity based on scroll progress with fade factor, but only when scene is active
      const targetIntensity = isSceneActive ? 1000 * sectionProgress * fadeFactor : 0;
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetIntensity, 0.1);
    }

    // Fade directional light
    if (directionalLightRef.current) {
      const targetIntensity = isSceneActive ? 10 * fadeFactor : 0;
      directionalLightRef.current.intensity = THREE.MathUtils.lerp(
        directionalLightRef.current.intensity,
        targetIntensity,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef} dispose={null} scale={12} position={[0, -1.5, 0]}>
      {/* Local ambient light for this model */}

      {/* Directional light - configure position and angle as needed */}
      <directionalLight ref={directionalLightRef} position={[0.09, 0.27170478794734, 0.515761348478841]} intensity={0} />

      <mesh
        ref={mesh1Ref}
        geometry={nodes.mgn12h_Material001_0.geometry}
        material={materials.PaletteMaterial001}
        position={[0, 0.228, 0.007]}
        rotation={[-Math.PI / 2, Math.PI / 2, 0]}
        scale={1.25}
      />

      <mesh
        ref={mesh3Ref}
        geometry={nodes.capac_Material029_0.geometry}
        material={materials.PaletteMaterial002}
        position={[0, 0.187, 0.095]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  );
};

// Preload the specific model path
useGLTF.preload(modelUrl);

export default PrinterScene;
