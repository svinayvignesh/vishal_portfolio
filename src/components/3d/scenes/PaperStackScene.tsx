import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
// @ts-ignore
import modelUrl from '/models/document_file_folder/document_file_folder-transformed.glb?url';

const PaperStackScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const pageRef = useRef<THREE.Mesh>(null);

  // Load optimized model with animations
  const { nodes, materials, animations } = useGLTF(modelUrl) as any;
  const { actions, names } = useAnimations(animations, groupRef);

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

    // Subscribe to activeSceneId and force-open when this scene activates
    const unsubscribe = useStore.subscribe(
      (s) => s.activeSceneId,
      (activeSceneId) => {
        if (activeSceneId === 'paper-stack') {
          if (clip) {
            // Set to clip midpoint (assumes open state is near the middle of the clip)
            action.time = clip.duration * 0.5;
          }
          if (pageRef.current) {
            // lift page fully (match liftFactor = 1)
            pageRef.current.position.y = 0.032 + 0.3;
          }
        }
      }
    );

    return () => unsubscribe();
  }, [actions, names]);

  useFrame((state) => {
    const progress = useStore.getState().sectionProgress;

    if (groupRef.current) {
      // Gentle floating animation
      const floatY = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.position.y = floatY;

      // Scroll-driven animation scrubbing (full range)
      if (names.length > 0) {
        const action = actions[names[0]];
        if (action) {
          // Map progress (0 to 1) to full animation duration (0 to 1)
          const clamped = Math.min(Math.max(progress, 0), 1);
          action.time = action.getClip().duration * clamped;
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
            liftFactor = Math.max(0, 1 - Math.abs((normalized * 2) - 1));
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
      <pointLight position={[2, 2, 2]} intensity={1.0} color="#d4a574" />
    </group>
  );
};

// Preload the specific model path
useGLTF.preload(modelUrl);

export default PaperStackScene;
