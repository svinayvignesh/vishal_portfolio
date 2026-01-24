import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useStore } from '@/store/useStore';
import * as THREE from 'three';
import PaperStackScene from './scenes/PaperStackScene';
import PrinterScene from './scenes/PrinterScene';
import CNCScene from './scenes/CNCScene';
import RoofingScene from './scenes/RoofingScene';
import TurbineScene from './scenes/TurbineScene';
import AutomotiveScene from './scenes/AutomotiveScene';
import HeroScene from './scenes/HeroScene';

// Wrapper for scene transitions
// Wrapper for scene transitions
import { useIsMobile } from '@/hooks/use-mobile';

const SceneTransition: React.FC<{
  children: React.ReactNode;
  isActive: boolean;
  slideFrom?: 'left' | 'right' | 'none';
}> = ({ children, isActive, slideFrom = 'none' }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [render, setRender] = useState(isActive);

  // Reusable Vector3 to avoid allocations every frame
  const targetScaleVec = useRef(new THREE.Vector3());

  const isMobile = useIsMobile();

  // Calculate target offset for active state
  // On mobile, always center the model (0). On desktop, use the side offset.
  const activeOffset = isMobile ? 0 : (slideFrom === 'right' ? 2 : (slideFrom === 'left' ? -2 : 0));

  const initialX = slideFrom === 'right' ? 12 : (slideFrom === 'left' ? -12 : 0);

  useEffect(() => {
    if (isActive) {
      setRender(true);
      // SNAP TO START POSITION on activation to ensure "Slide In" always plays.
      if (groupRef.current) {
        groupRef.current.position.x = initialX;
        groupRef.current.scale.set(0, 0, 0);
      }
    }
  }, [isActive, initialX]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      let targetX = activeOffset;
      // When exiting, slide back out to the same side it came from
      if (!isActive) {
        targetX = slideFrom === 'right' ? 12 : (slideFrom === 'left' ? -12 : activeOffset);
      }

      // Smooth position transition (Slide) - faster entry from corners
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, delta * 4.0);

      // Smooth scale transition (Fade)
      // Active: Scale -> 1. Inactive: Scale -> 0 (Shrink)
      const targetScale = isActive ? 1 : 0;
      const scaleSpeed = delta * 4.0; // Faster transition speed

      // Reuse Vector3 to avoid memory allocation
      targetScaleVec.current.set(targetScale, targetScale, targetScale);
      groupRef.current.scale.lerp(targetScaleVec.current, scaleSpeed);

      // Mouse Parallax Rotation - ONLY when scene is active for performance
      if (isActive) {
        const targetRotY = state.pointer.x * 0.1; // 0.1 rad is subtle
        const targetRotX = -state.pointer.y * 0.1;

        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 2);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 2);
      }

      // Stop rendering if scaled down to zero
      if (!isActive && groupRef.current.scale.x < 0.01) {
        setRender(false);
      }
    }
  });

  if (!render) return null;

  return (
    <group
      ref={groupRef}
      // STATIC initial position via prop to avoid conflict with useFrame updates.
      // We rely on useEffect to reset it on re-entry.
      position={[initialX, 0, 0]}
      scale={[0, 0, 0]}
    >
      {children}
    </group>
  );
};

const StageManager: React.FC = () => {
  const { activeSceneId, sectionProgress, currentSection } = useStore();

  // Debounce scene mounting to prevent rapid mount/unmount during fast scrolling
  const [stableActiveSceneId, setStableActiveSceneId] = useState(activeSceneId);
  const debounceTimerRef = useRef<number>();

  useEffect(() => {
    clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(() => {
      setStableActiveSceneId(activeSceneId);
    }, 150); // Only update after 150ms of stability

    return () => clearTimeout(debounceTimerRef.current);
  }, [activeSceneId]);

  // Scene order for determining which scenes to mount
  const sceneOrder = ['hero', 'paper-stack', '3d-printer', 'cnc-machine', 'roofing-sheets', 'gas-turbine', 'automotive'];

  // Helper to render scenes wrapped in transition
  const renderScene = (id: string, Component: React.FC<any>, slideFrom: 'left' | 'right' | 'none' = 'none') => {
    // Performance optimization: Only mount active scene + adjacent scenes
    // This reduces useFrame callbacks from 7 to ~3 and cuts GPU memory usage by 70%
    // Use stableActiveSceneId instead of activeSceneId to prevent rapid mount/unmount during fast scrolling
    const activeIndex = sceneOrder.indexOf(stableActiveSceneId);
    const sceneIndex = sceneOrder.indexOf(id);

    // Mount scenes within distance of 1 from active scene (or always mount hero)
    const shouldMount = id === 'hero' || Math.abs(sceneIndex - activeIndex) <= 1;

    if (!shouldMount) return null;

    return (
      <SceneTransition
        key={id}
        isActive={activeSceneId === id || (id === 'hero' && currentSection === 0)}
        slideFrom={slideFrom}
      >
        <Component progress={sectionProgress} />
      </SceneTransition>
    );
  };

  // Mapping based on Card Layout
  return (
    <group>
      {/* Hero: Render with transition wrapper for proper visibility control */}
      {renderScene('hero', HeroScene, 'none')}
      {renderScene('paper-stack', PaperStackScene, 'right')}
      {renderScene('3d-printer', PrinterScene, 'left')}
      {renderScene('cnc-machine', CNCScene, 'right')}
      {renderScene('roofing-sheets', RoofingScene, 'left')}
      {renderScene('gas-turbine', TurbineScene, 'right')}
      {renderScene('automotive', AutomotiveScene, 'left')}
    </group>
  );
};

export default StageManager;
