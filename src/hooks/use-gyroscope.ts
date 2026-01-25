import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from './use-mobile';

interface GyroscopeData {
  x: number; // -1 to 1 (left to right tilt)
  y: number; // -1 to 1 (forward to back tilt)
}

/**
 * Custom hook to handle gyroscope data on mobile devices
 * Requires user permission on iOS 13+
 */
export const useGyroscope = (enabled: boolean = true) => {
  const isMobile = useIsMobile();
  const gyroRef = useRef<GyroscopeData>({ x: 0.5, y: 0.5 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isMobile || !enabled) {
      setIsActive(false);
      return;
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      // beta: front-back tilt (-180 to 180)
      // gamma: left-right tilt (-90 to 90)
      const beta = event.beta || 0;
      const gamma = event.gamma || 0;

      // Normalize to 0-1 range for BackgroundCanvas (0.5 is center)
      // EXTRA SENSITIVE: ~15 degrees of tilt reaches full range
      gyroRef.current = {
        x: 0.5 + Math.max(-0.5, Math.min(0.5, gamma / 30)), // 0-1 range
        y: 0.5 + Math.max(-0.5, Math.min(0.5, beta / 30)),  // 0-1 range
      };
    };

    window.addEventListener('deviceorientation', handleOrientation);
    setIsActive(true);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      setIsActive(false);
    };
  }, [isMobile, enabled]);

  return {
    gyroData: gyroRef.current,
    gyroRef,
    isActive,
    isMobile,
  };
};

/**
 * Normalized gyroscope data for 3D scene rotation (-1 to 1)
 */
export const useGyroscopeNormalized = (enabled: boolean = true) => {
  const isMobile = useIsMobile();
  const gyroRef = useRef({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isMobile || !enabled) {
      setIsActive(false);
      return;
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const beta = event.beta || 0;
      const gamma = event.gamma || 0;

      // Normalize to -1 to 1 range for 3D rotation
      // EXTRA SENSITIVE: ~15 degrees of tilt reaches full range
      gyroRef.current = {
        x: Math.max(-1, Math.min(1, gamma / 15)), // -1 to 1 range
        y: Math.max(-1, Math.min(1, beta / 15)),  // -1 to 1 range
      };
    };

    window.addEventListener('deviceorientation', handleOrientation);
    setIsActive(true);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      setIsActive(false);
    };
  }, [isMobile, enabled]);

  return {
    gyroData: gyroRef.current,
    gyroRef,
    isActive,
    isMobile,
  };
};
