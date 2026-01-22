import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import modelUrl from '/models/document_file_folder/document_file_folder-transformed.glb?url';

interface PaperStackSceneProps {
  progress: number;
}

const PaperStackScene: React.FC<PaperStackSceneProps> = ({ progress = 0.5 }) => {
  const groupRef = useRef<THREE.Group>(null);
  const pageRef = useRef<THREE.Mesh>(null);

  // Load optimized model
  const { nodes, materials, animations } = useGLTF(modelUrl) as any;
  const { actions, names } = useAnimations(animations, groupRef);

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

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      // X-axis: 0 (centered)
      // Y-axis: moves up and down slightly (floating)
      // Z-axis: 0 (default depth)
      const floatY = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      groupRef.current.position.y = floatY;

      // Scroll-driven animation scrubbing
      if (names.length > 0) {
        const action = actions[names[0]];
        if (action) {
          // Map progress (0 to 1) to animation duration
          action.time = action.getClip().duration * Math.min(Math.max(progress, 0), 1);
        }
      }

      // Scroll-driven rotation (open towards camera)
      groupRef.current.rotation.y += progress * (Math.PI / 4);
      // Tilt slightly forward as it opens
      groupRef.current.rotation.x = progress * (Math.PI / 8);

      // Page lifting animation ("When fully open, go up slowly")
      // We map the last 50% of the progress to a slow lift of the page
      if (pageRef.current) {
        // Base Y is 0.032
        const liftStart = 0.1; // Start lifting when half open
        const liftFactor = Math.max(0, (progress - liftStart) / (1 - liftStart)); // 0 to 1
        // Lift by 0.5 units
        const targetY = 0.032 + (liftFactor * 0.5);
        // Add a tiny sine wave to the page itself for "aliveness"
        const pageFloat = Math.sin(state.clock.elapsedTime * 1) * 0.02;

        pageRef.current.position.y = targetY + pageFloat;
      }
    }
  });

  return (
    // Scale reduced to 1.5 to be less dominant
    <group ref={groupRef} position={[-1.5, 1, 0]} scale={[1, 1, 1]} dispose={null}>
      <group name="Sketchfab_Scene">
        <mesh
          ref={pageRef}
          name="A4_Page3Shape_2_0"
          geometry={nodes.A4_Page3Shape_2_0.geometry}
          material={materials.A4_Page3Shape}
          position={[0, 0.032, 4.06]}
        />
        <mesh
          name="Folder_1Shape"
          geometry={nodes.Folder_1Shape.geometry}
          material={materials.Folder_1Shape}
          morphTargetDictionary={nodes.Folder_1Shape.morphTargetDictionary}
          morphTargetInfluences={nodes.Folder_1Shape.morphTargetInfluences}
          position={[0, -0.068, 4.06]}
        />
      </group>

      {/* Ambient particles specific to this object */}
      <pointLight position={[2, 2, 2]} intensity={1.0} color="#d4a574" />
    </group>
  );
};

// Preload the specific model path
useGLTF.preload(modelUrl);

export default PaperStackScene;
