import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { useMouse } from '@/hooks/use-mouse';
import { optimizeModel } from '@/utils/modelOptimizer';
// @ts-ignore
import modelUrl from '/models/document_file_folder/document_file_folder-transformed.glb?url';

const PaperStackScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const pageRef = useRef<THREE.Mesh>(null);
  const reverseStartTimeRef = useRef<number | null>(null);
  const reverseStartValueRef = useRef<number>(0);
  const mouse = useMouse();

  // Load optimized model with animations
  const { scene, nodes, materials, animations } = useGLTF(modelUrl) as any;
  const { actions, names } = useAnimations(animations, groupRef);

  // Get quality settings from store
  const qualitySettings = useStore((state) => state.qualitySettings);

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

  // Initialize animation for scroll-driven control
  useEffect(() => {
    if (names.length > 0) {
      const action = actions[names[0]];
      if (action) {
        action.reset();
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.paused = true; // Pause immediately to control via scroll
        action.play(); // Play must be called to activate the action, but it's paused
      }
    }
  }, [actions, names]);

  // Ensure folder is fully open when this scene becomes active (e.g., clicked from dots)
  useEffect(() => {
    if (names.length === 0) return;
    const action = actions[names[0]];
    if (!action) return;
    const clip = action.getClip();

    // Subscribe to activeSceneId and handle activation/deactivation
    const unsubscribe = useStore.subscribe(
      (state) => {
        const activeSceneId = state.activeSceneId;
        if (activeSceneId !== 'paper-stack') {
          // Scene becomes inactive - prepare to reverse
          reverseStartValueRef.current = action.time;
          reverseStartTimeRef.current = null;
        }
      }
    );

    return () => unsubscribe();
  }, [actions, names]);

  useFrame((state) => {
    const { sectionProgress: progress, activeSceneId } = useStore.getState();
    const isSceneActive = activeSceneId === 'paper-stack';
    const elapsed = state.clock.elapsedTime;

    // Check if scene is visible - skip animations when invisible
    if (!groupRef.current) return;
    const isVisible = groupRef.current.parent && groupRef.current.parent.scale.x > 0.05;
    if (!isVisible) return;

    if (groupRef.current) {
      // Mouse-based rotation (subtle, applied to base rotation) - only if enabled
      const baseRotationX = 0.9;
      const baseRotationY = 0.2;

      if (qualitySettings.enableMouseParallax) {
        const targetRotationY = baseRotationY + mouse.x * 0.15;
        const targetRotationX = baseRotationX + mouse.y * 0.1;
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

      // Gentle floating animation - only if enabled
      if (qualitySettings.enableFloating) {
        const floatY = Math.sin(elapsed * 0.3) * 0.1;
        groupRef.current.position.y = floatY;
      } else {
        groupRef.current.position.y = 0;
      }

      if (names.length > 0) {
        const action = actions[names[0]];
        if (action) {
          const clip = action.getClip();
          if (!clip) return;

          if (isSceneActive) {
            // Scroll-driven animation: directly map scroll progress to folder opening (0-50%)
            const clamped = Math.min(Math.max(progress, 0), 0.5);
            action.time = clip.duration * clamped;
          } else {
            // Scene is inactive - reverse animation from current position to 0
            if (reverseStartValueRef.current > 0) {
              if (reverseStartTimeRef.current === null) {
                reverseStartTimeRef.current = elapsed;
              }
              const timeSinceReverseStart = elapsed - reverseStartTimeRef.current;
              const reverseDuration = 1.5; // Take 1.5 seconds to reverse
              const t = Math.min(timeSinceReverseStart, reverseDuration) / reverseDuration;
              action.time = reverseStartValueRef.current * (1 - t);

              if (t >= 1) {
                reverseStartValueRef.current = 0;
              }
            }
          }
        }
      }

      // Page lifting animation - only starts after folder has opened enough
      if (pageRef.current) {
        // Compute page lift from the animation's normalized time so pages
        // rise as the folder opens and fall back down as it closes.
        const action = names.length > 0 ? actions[names[0]] : null;
        let liftFactor = 0;
        if (action) {
          const clip = action.getClip();
          if (clip && clip.duration > 0) {
            const normalized = THREE.MathUtils.clamp(action.time / clip.duration, 0, 1);
            // Triangular waveform: 0 at 0, 1 at 0.5, 0 at 1
            liftFactor = Math.max(0, 1 - Math.abs((normalized * 1.5) - 1));
          }
        } else {
          // Fallback: use progress after 40% like before
          const liftStart = 0.4;
          liftFactor = Math.max(0, (progress - liftStart) / (1 - liftStart));
        }

        const targetY = 0.032 + (liftFactor * 0.3);
        const pageFloat = Math.sin(state.clock.elapsedTime * 1) * 0.02;
        pageRef.current.position.y = targetY + pageFloat;
      }
    }
  });

  return (
    <group ref={groupRef} dispose={null} rotation={[0.9, 0.2, 0.15]} position={[2, 0, 0]} scale={1.5}>
      <group name="Sketchfab_Scene">
        <mesh
          ref={pageRef}
          name="A4_Page3Shape_2_0"
          geometry={nodes.A4_Page3Shape_2_0.geometry}
          material={materials.A4_Page3Shape}
          position={[0, 0.032, 0.06]}
        />
        <mesh
          name="Folder_1Shape"
          geometry={nodes.Folder_1Shape.geometry}
          material={materials.Folder_1Shape}
          morphTargetDictionary={nodes.Folder_1Shape.morphTargetDictionary}
          morphTargetInfluences={nodes.Folder_1Shape.morphTargetInfluences}
          position={[0, -0.068, 0.06]}
        />
      </group>

      {/* Ambient lighting */}

    </group>
  );
};

// Preload the specific model path
useGLTF.preload(modelUrl);

export default PaperStackScene;
