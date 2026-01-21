import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import StageManager from './StageManager';

const GlobalScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      style={{ 
        background: 'linear-gradient(180deg, hsl(220 20% 8%) 0%, hsl(220 25% 4%) 100%)'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <Suspense fallback={null}>
          {/* Ambient lighting for base visibility */}
          <ambientLight intensity={0.3} />
          
          {/* Main directional light with steel-blue tint */}
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            color="#88b4d4"
            castShadow
          />
          
          {/* Accent light with copper tint */}
          <pointLight 
            position={[-5, 5, 5]} 
            intensity={0.5} 
            color="#d4a574"
          />
          
          {/* Fill light from below */}
          <pointLight 
            position={[0, -5, 5]} 
            intensity={0.2} 
            color="#4a6d8c"
          />

          {/* Scene manager handles all 3D scene transitions */}
          <StageManager />
          
          <Preload all />
        </Suspense>
      </Canvas>

      {/* Gradient overlay for depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, transparent 0%, hsl(220 20% 8% / 0.4) 70%)'
        }}
      />

      {/* Noise texture overlay */}
      <div className="noise-overlay" />
    </div>
  );
};

export default GlobalScene;
