import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Preload, Environment } from '@react-three/drei';
import * as THREE from 'three';
import StageManager from './StageManager';

import { useIsMobile } from '@/hooks/use-mobile';
import { detectDevicePerformance, getQualitySettings } from '@/utils/deviceDetection';
import { useStore } from '@/store/useStore';

/**
 * Frame rate controller for low-end devices
 * Limits rendering to targetFPS to reduce GPU load
 */
function FrameRateLimiter() {
  const qualitySettings = useStore((state) => state.qualitySettings);
  const lastFrameTimeRef = useRef(0);

  useFrame((state) => {
    const targetFPS = qualitySettings.targetFPS;
    const frameInterval = 1000 / targetFPS;
    const currentTime = performance.now();

    // Skip frames if we're rendering too fast
    if (currentTime - lastFrameTimeRef.current < frameInterval) {
      return;
    }

    lastFrameTimeRef.current = currentTime;
  });

  return null;
}

const GlobalScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = true;
  const isMobile = useIsMobile();

  // Detect device performance and get quality settings
  const devicePerformance = detectDevicePerformance();
  const quality = getQualitySettings(devicePerformance);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 transition-colors duration-1000"
      style={{
        background: isDark
          ? 'linear-gradient(180deg, hsl(220 20% 8%) 0%, hsl(220 25% 4%) 100%)'
          : 'linear-gradient(180deg, hsl(40 33% 92%) 0%, hsl(40 33% 95%) 100%)'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, isMobile ? 14 : 10], fov: 50 }}
        dpr={quality.dpr}
        gl={{
          antialias: quality.antialias,
          alpha: true,
          powerPreference: 'high-performance',
          // Additional performance optimizations
          stencil: false, // Disable stencil buffer if not needed
          depth: true,
          logarithmicDepthBuffer: false, // Disable if not needed
        }}
        shadows={quality.shadows}
        frameloop="always" // Always render (frameloop="demand" would be more efficient but may cause issues)
        onCreated={({ gl, scene }) => {
          // Enable hardware acceleration
          gl.setClearColor('#000000', 0);

          // Optimize scene rendering
          scene.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
              // Enable frustum culling
              obj.frustumCulled = true;
            }
          });
        }}
      >
        <Suspense fallback={null}>
          {/* Frame rate limiter for low-end devices */}
          {quality.targetFPS < 60 && <FrameRateLimiter />}

          {/* Ambient Light - Adjusted for performance */}
          <ambientLight intensity={isDark ? 0.4 : 1.2} />

          {/* Main Key Light - Shadows disabled for performance */}
          <directionalLight
            position={[10, 10, 5]}
            intensity={isDark ? 2.0 : 1.2}
            color={isDark ? "#88b4d4" : "#ffffff"}
            castShadow={false}
          />

          {/* Rim/Accent Light - Reduced from 2 point lights to 1 */}
          {quality.maxLights >= 2 && (
            <pointLight
              position={[-5, 5, 5]}
              intensity={isDark ? 2.0 : 0.4}
              color={isDark ? "#d4a574" : "#ffaa66"}
            />
          )}

          {/* Environment map with adaptive intensity based on device performance */}
          {quality.envIntensity > 0 && (
            <Environment preset={isDark ? "city" : "studio"} environmentIntensity={quality.envIntensity} />
          )}

          {/* Scene manager handles all 3D scene transitions */}
          <StageManager />

          <Preload all />
        </Suspense>
      </Canvas>

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-1000"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse at 50% 30%, transparent 0%, hsl(220 20% 8% / 0.4) 70%)'
            : 'radial-gradient(ellipse at 50% 30%, transparent 0%, hsl(40 33% 92% / 0.4) 70%)'
        }}
      />

      {/* Noise texture overlay */}
      <div className="noise-overlay opacity-30 mix-blend-overlay" />
    </div>
  );
};

export default GlobalScene;
