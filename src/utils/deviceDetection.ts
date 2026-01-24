export type PerformanceLevel = 'low' | 'medium' | 'high';

export interface QualitySettings {
  dpr: [number, number];
  antialias: boolean;
  shadows: boolean;
  envIntensity: number;
  maxLights: number;
  pixelRatio: number;
  // New performance options
  enableMouseParallax: boolean;
  enableFloating: boolean;
  maxDrawCalls: number;
  textureMaxSize: number;
  useSimplifiedShaders: boolean;
  targetFPS: number;
}

/**
 * Detects device performance level based on GPU, device type, and memory
 */
export const detectDevicePerformance = (): PerformanceLevel => {
  // Check for mobile devices
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

  // Check device memory (if available)
  const deviceMemory = (navigator as any).deviceMemory;
  const hasLowMemory = deviceMemory && deviceMemory < 4;

  // Try to detect GPU
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl) return 'low';

    const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';

    // Check for integrated/low-end GPUs
    const isIntegratedGPU = /Intel|AMD.*Radeon.*Vega|Mali|Adreno [1-5]|PowerVR/i.test(renderer);

    // Mobile devices always get low settings
    if (isMobile || hasLowMemory) return 'low';

    // Integrated GPUs get medium settings
    if (isIntegratedGPU) return 'medium';

    // Discrete GPUs get high settings
    return 'high';
  } catch (e) {
    // Fallback to low if detection fails
    console.warn('GPU detection failed, defaulting to low performance mode');
    return 'low';
  }
};

/**
 * Returns quality settings optimized for the detected performance level
 */
export const getQualitySettings = (performance: PerformanceLevel): QualitySettings => {
  const settings: Record<PerformanceLevel, QualitySettings> = {
    low: {
      dpr: [1, 1], // No super-sampling
      antialias: false, // Disable anti-aliasing
      shadows: false, // No shadows
      envIntensity: 0.1, // Minimal environment reflections
      maxLights: 2, // Only 2 lights total
      pixelRatio: 1,
      // Performance optimizations for low-end devices
      enableMouseParallax: false, // Disable mouse tracking
      enableFloating: false, // Disable sine animations
      maxDrawCalls: 20, // Force LOD switching
      textureMaxSize: 512, // Downsample textures
      useSimplifiedShaders: true, // Use basic materials instead of PBR
      targetFPS: 30, // Target 30 FPS instead of 60
    },
    medium: {
      dpr: [1, 1.5], // Limited super-sampling
      antialias: true, // Enable anti-aliasing
      shadows: false, // Still no shadows (expensive)
      envIntensity: 0.3, // Moderate environment reflections
      maxLights: 3, // Up to 3 lights
      pixelRatio: 1.5,
      enableMouseParallax: true,
      enableFloating: true,
      maxDrawCalls: 40,
      textureMaxSize: 1024,
      useSimplifiedShaders: false,
      targetFPS: 60,
    },
    high: {
      dpr: [1, 2], // Full super-sampling on high-DPI
      antialias: true, // Full anti-aliasing
      shadows: false, // Disabled for performance (can enable if needed)
      envIntensity: 0.5, // Full environment reflections
      maxLights: 4, // Up to 4 lights
      pixelRatio: 2,
      enableMouseParallax: true,
      enableFloating: true,
      maxDrawCalls: 100,
      textureMaxSize: 2048,
      useSimplifiedShaders: false,
      targetFPS: 60,
    },
  };

  return settings[performance];
};

/**
 * Hook to get current device performance settings
 */
export const useDevicePerformance = () => {
  const performance = detectDevicePerformance();
  const settings = getQualitySettings(performance);

  return {
    performance,
    settings,
  };
};
