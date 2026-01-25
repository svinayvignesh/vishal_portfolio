import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';
import StageManager from './StageManager';

import { useIsMobile } from '@/hooks/use-mobile';
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

interface GlobalSceneProps {
  gyroEnabled?: boolean;
}

const GlobalScene: React.FC<GlobalSceneProps> = ({ gyroEnabled = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = true;
  const isMobile = useIsMobile();

  // Get quality settings from store (computed once on app init)
  const quality = useStore((state) => state.qualitySettings);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 transition-colors duration-1000"
      style={{
        // Background is now transparent - the 2D BackgroundCanvas provides the gradient
        background: 'transparent'
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, isMobile ? 14 : 10],
          fov: 50,
          // Tight frustum - models are within ~20 units, no need for default far=2000
          // This improves depth buffer precision and reduces rendering volume
          near: 0.5,
          far: 40
        }}
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
        onCreated={({ gl, scene, camera }) => {
          // Enable hardware acceleration
          gl.setClearColor('#000000', 0);

          // Compile shaders ahead of time to prevent first-frame stuttering
          gl.compile(scene, camera);

          // Optimize scene rendering
          scene.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
              // Enable frustum culling - only render objects visible to camera
              obj.frustumCulled = true;

              // Optimize rendering by disabling auto-update on matrices when static
              if (obj.userData.isStatic) {
                obj.matrixAutoUpdate = false;
              }
            }
          });

          // Set up optimal frustum culling by configuring camera
          if (camera instanceof THREE.PerspectiveCamera) {
            // Update camera projection matrix to ensure accurate culling
            camera.updateProjectionMatrix();
          }
        }}
      >
        <Suspense fallback={null}>
          {/* Frame rate limiter for low-end devices */}
          {quality.targetFPS < 60 && <FrameRateLimiter />}

          {/*
            Global Lighting - Minimal computational approach
            Using hemisphereLight which is extremely cheap (no shadows, no calculations)
            It provides subtle sky/ground color differentiation without expensive computations
            Individual model lights can be added manually per-scene as needed
          */}
          <hemisphereLight
            args={[
              isDark ? "#8899bb" : "#ffffff",  // Sky color (from above)
              isDark ? "#445566" : "#d4c4a8",  // Ground color (from below)
              isDark ? 10 : 7               // Intensity - enough to see original colors
            ]}
          />

          {/* Removed expensive lighting:
              - directionalLight: Requires per-vertex calculations
              - pointLight: Requires distance attenuation calculations
              - Environment map: Most expensive - loads HDR textures and does IBL

              For model-specific lighting, add lights directly in scene components
          */}

          {/* Scene manager handles all 3D scene transitions */}
          <StageManager gyroEnabled={gyroEnabled} />

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
      <div className="noise-overlay mix-blend-overlay" />
    </div>
  );
};

export default GlobalScene;
