import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, Environment } from '@react-three/drei';
import StageManager from './StageManager';
import { useTheme } from '../theme-provider';

const GlobalScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  // State to track the ACTUAL active theme (resolving 'system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    if (theme === 'system') {
      const systemHandler = (e: MediaQueryListEvent) => {
        setResolvedTheme(e.matches ? 'dark' : 'light');
      };
      const matcher = window.matchMedia('(prefers-color-scheme: dark)');
      setResolvedTheme(matcher.matches ? 'dark' : 'light');
      matcher.addEventListener('change', systemHandler);
      return () => matcher.removeEventListener('change', systemHandler);
    } else {
      setResolvedTheme(theme as 'light' | 'dark');
    }
  }, [theme]);

  const isDark = resolvedTheme === 'dark';

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
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        shadows
      >
        <Suspense fallback={null}>
          {/* Ambient Light - Brighter in light mode to avoid harsh blacks */}
          <ambientLight intensity={isDark ? 0.6 : 1.5} />

          {/* Main Key Light */}
          <directionalLight
            position={[10, 10, 5]}
            intensity={isDark ? 2.5 : 1.5}
            color={isDark ? "#88b4d4" : "#ffffff"}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          {/* Rim/Accent Light */}
          <pointLight
            position={[-5, 5, 5]}
            intensity={isDark ? 3.0 : 0.5}
            color={isDark ? "#d4a574" : "#ffaa66"}
          />

          {/* Fill Light */}
          <pointLight
            position={[0, -5, 5]}
            intensity={isDark ? 1.0 : 0.8}
            color={isDark ? "#4a6d8c" : "#aaccff"}
          />

          {/* Environment map: 'city' for dark industrial feel, 'studio' for clean light mode */}
          <Environment preset={isDark ? "city" : "studio"} environmentIntensity={isDark ? 0.5 : 0.3} />

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
