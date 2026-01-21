import React from 'react';
import { useStore } from '@/store/useStore';
import PaperStackScene from './scenes/PaperStackScene';
import PrinterScene from './scenes/PrinterScene';
import CNCScene from './scenes/CNCScene';
import RoofingScene from './scenes/RoofingScene';
import TurbineScene from './scenes/TurbineScene';
import AutomotiveScene from './scenes/AutomotiveScene';
import HeroScene from './scenes/HeroScene';

const StageManager: React.FC = () => {
  const { activeSceneId, sectionProgress, currentSection } = useStore();

  // Hero section (currentSection === 0)
  if (currentSection === 0) {
    return <HeroScene progress={sectionProgress} />;
  }

  // Render scene based on active scene ID
  const renderScene = () => {
    switch (activeSceneId) {
      case 'paper-stack':
        return <PaperStackScene progress={sectionProgress} />;
      case '3d-printer':
        return <PrinterScene progress={sectionProgress} />;
      case 'cnc-machine':
        return <CNCScene progress={sectionProgress} />;
      case 'roofing-sheets':
        return <RoofingScene progress={sectionProgress} />;
      case 'gas-turbine':
        return <TurbineScene progress={sectionProgress} />;
      case 'automotive':
        return <AutomotiveScene progress={sectionProgress} />;
      default:
        return <HeroScene progress={sectionProgress} />;
    }
  };

  return (
    <group>
      {renderScene()}
    </group>
  );
};

export default StageManager;
