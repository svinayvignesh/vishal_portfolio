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
 * Detects device performance level based on GPU capability (unified for all devices)
 */
export const detectDevicePerformance = (): PerformanceLevel => {
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  const deviceMemory = (navigator as any).deviceMemory;
  const hasLowMemory = deviceMemory && deviceMemory < 4;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'low';

    const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';

    // === HIGH-END GPUs ===
    // Desktop: RTX 30/40 series, RX 6000/7000, Arc
    // Mobile: iPhone 12+, flagship Android 2020+
    const isHighEnd = /RTX [34]0|RX [67][0-9]{3}|Arc A[57]|Radeon Pro|Apple GPU|Apple A1[4-9]|Apple M[1-9]|Adreno \(TM\) [67]|Mali-G7[7-9]|Mali-G[89]/i.test(renderer);

    // === MID-RANGE GPUs ===
    // Desktop: GTX 10/16 series, RTX 20, RX 5000, older Radeon
    // Mobile: iPhone 8-11, mid-tier Android
    const isMidRange = /GTX 1[0-9]{3}|RTX 20|RX 5[0-9]{3}|Radeon [RV]|GeForce [789][0-9]{2}|Apple A1[0-3]|Adreno \(TM\) [45]|Mali-G7[1-6]|Mali-G5/i.test(renderer);

    // === LOW-END GPUs ===
    // Desktop: Intel HD/UHD, old GeForce GT, integrated AMD
    // Mobile: iPhone 7-, budget Android
    const isLowEnd = /Intel.*HD|Intel.*UHD|Intel.*Iris|GeForce GT|Mali-[TG][0-4]|Adreno [1-3]|PowerVR|AMD.*Radeon.*Vega|Radeon HD/i.test(renderer);

    // Memory check - low memory forces down one tier
    if (hasLowMemory) {
      if (isHighEnd) return 'medium';
      return 'low';
    }

    if (isHighEnd) return 'high';
    if (isMidRange) return 'medium';
    if (isLowEnd) return 'low';

    // Unknown GPU - use medium as safe default for mobile, high for desktop
    return isMobile ? 'medium' : 'high';
  } catch (e) {
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
      envIntensity: 0, // DISABLED - environment map is expensive
      maxLights: 2, // Only 2 lights total
      pixelRatio: 1,
      // Performance optimizations for low-end devices
      enableMouseParallax: false, // Disable mouse tracking
      enableFloating: false, // Disable sine animations
      maxDrawCalls: 20, // Force LOD switching
      textureMaxSize: 512, // Downsample textures
      useSimplifiedShaders: true, // Use basic materials instead of PBR
      targetFPS: 24, // Target 24 FPS for smoother experience on low-end
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
