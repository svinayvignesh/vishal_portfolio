import { useState, useEffect } from 'react';

/**
 * Shared mouse tracking hook with requestAnimationFrame throttling
 * to prevent excessive state updates and re-renders
 */
export const useMouse = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let rafId: number | null = null;
    let latestEvent: MouseEvent | null = null;

    const handleMouseMove = (event: MouseEvent) => {
      latestEvent = event;

      // Skip if already queued for next frame
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        if (latestEvent) {
          setMouse({
            x: (latestEvent.clientX / window.innerWidth) * 2 - 1,
            y: -(latestEvent.clientY / window.innerHeight) * 2 + 1,
          });
        }
        rafId = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return mouse;
};
