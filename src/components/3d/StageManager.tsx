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
const SceneTransition: React.FC<{
  children: React.ReactNode;
  isActive: boolean;
}> = ({ children, isActive }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [render, setRender] = useState(isActive);

  useEffect(() => {
    if (isActive) setRender(true);
  }, [isActive]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      const targetScale = isActive ? 1 : 0;
      const targetOpacity = isActive ? 1 : 0;
      const speed = 4 * delta;

      // Smooth scale transition
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), speed);

      // If scaled down to near zero and not active, stop rendering to save resources
      if (!isActive && groupRef.current.scale.x < 0.01) {
        setRender(false);
      }
    }
  });

  if (!render) return null;

  return (
    <group ref={groupRef} scale={[0, 0, 0]}>
      {children}
    </group>
  );
};

const StageManager: React.FC = () => {
  const { activeSceneId, sectionProgress, currentSection } = useStore();

  // Helper to render scenes wrapped in transition
  const renderScene = (id: string, Component: React.FC<any>) => (
    <SceneTransition key={id} isActive={activeSceneId === id || (id === 'hero' && currentSection === 0)}>
      <Component progress={sectionProgress} />
    </SceneTransition>
  );

  return (
    <group>
      {/* We render ALL potential scenes but control their visibility/existence via SceneTransition */}
      {renderScene('hero', HeroScene)}
      {renderScene('paper-stack', PaperStackScene)}
      {renderScene('3d-printer', PrinterScene)}
      {renderScene('cnc-machine', CNCScene)}
      {renderScene('roofing-sheets', RoofingScene)}
      {renderScene('gas-turbine', TurbineScene)}
      {renderScene('automotive', AutomotiveScene)}
    </group>
  );
};

export default StageManager;
