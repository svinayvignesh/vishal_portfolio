import React, { useState, useEffect, useCallback } from 'react';
import { Smartphone } from 'lucide-react';

interface GyroscopePermissionProps {
  onPermissionGranted: () => void;
}

const GyroscopePermission: React.FC<GyroscopePermissionProps> = ({ onPermissionGranted }) => {
  const [showModal, setShowModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'pending' | 'granted' | 'denied' | 'unavailable'>('pending');

  useEffect(() => {
    // Check if this is a mobile/tablet device (not desktop)
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent)); // iPad with desktop mode

    // If not a mobile device, skip the modal entirely
    if (!isMobileDevice) {
      console.log('[Gyroscope] Desktop detected, skipping modal');
      onPermissionGranted();
      return;
    }

    // Detect iOS specifically
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));

    setIsIOS(isIOSDevice);

    // Check if DeviceOrientationEvent exists and has requestPermission (iOS 13+)
    const hasRequestPermission = typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function';

    if (isIOSDevice && hasRequestPermission) {
      // iOS 13+ - need to show modal and request permission
      setShowModal(true);
    } else if (isIOSDevice && !hasRequestPermission) {
      // Older iOS - permission not needed, gyroscope available
      setPermissionStatus('granted');
      onPermissionGranted();
    } else {
      // Android - show modal to let user opt-in to motion controls
      if (window.DeviceOrientationEvent) {
        setShowModal(true);
      } else {
        setPermissionStatus('unavailable');
        onPermissionGranted();
      }
    }
  }, [onPermissionGranted]);

  // Block body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      // Save current scroll position and lock body
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';

      return () => {
        // Restore scroll position when modal closes
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [showModal]);

  // Handle enable button click - MUST be synchronous for iOS
  const handleEnable = useCallback(() => {
    console.log('[Gyroscope] Enable clicked, isIOS:', isIOS);

    if (isIOS) {
      // iOS - request permission synchronously from user gesture
      const requestPermission = (DeviceOrientationEvent as any).requestPermission;
      if (typeof requestPermission === 'function') {
        requestPermission()
          .then((state: string) => {
            console.log('[Gyroscope] iOS permission result:', state);
            if (state === 'granted') {
              setPermissionStatus('granted');
              setShowModal(false);
              onPermissionGranted();
            } else {
              setPermissionStatus('denied');
              console.warn('Gyroscope permission denied');
            }
          })
          .catch((err: Error) => {
            console.error('Error requesting gyroscope permission:', err);
            setPermissionStatus('denied');
          });
      }
    } else {
      // Android - no permission needed, just enable
      console.log('[Gyroscope] Android - enabling directly');
      setPermissionStatus('granted');
      setShowModal(false);
      onPermissionGranted();
    }
  }, [isIOS, onPermissionGranted]);

  const handleSkip = useCallback(() => {
    console.log('[Gyroscope] Skipped');
    setShowModal(false);
    onPermissionGranted();
  }, [onPermissionGranted]);

  // Don't render if modal shouldn't show
  if (!showModal) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gyro-title"
      style={{
        // Ensure this blocks all interactions with content behind
        touchAction: 'none',
        overscrollBehavior: 'contain',
      }}
      // Prevent any touch/scroll events from reaching background
      onTouchMove={(e) => e.preventDefault()}
      onWheel={(e) => e.preventDefault()}
    >
      {/* Backdrop - blocks clicks */}
      <div
        className="absolute inset-0 bg-background/90 backdrop-blur-md"
        onClick={handleSkip}
      />

      {/* Modal content */}
      <div
        className="relative card-steel p-8 max-w-md mx-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-primary" />
          </div>
          <h3 id="gyro-title" className="heading-technical text-xl text-foreground">
            Enable Motion Controls
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            This portfolio uses your device's gyroscope to create interactive 3D effects.
            {isIOS ? ' Tap below to grant permission.' : ' Tap below to enable motion controls.'}
          </p>

          {permissionStatus === 'denied' && (
            <p className="text-red-500 text-sm">
              Permission denied. Please enable motion sensors in your device settings.
            </p>
          )}

          <button
            type="button"
            onClick={handleEnable}
            className="w-full px-6 py-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 transition-colors font-medium text-lg"
          >
            {isIOS ? 'Allow Gyroscope Access' : 'Enable Motion Controls'}
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="text-muted-foreground text-sm hover:text-foreground active:text-foreground transition-colors py-2"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default GyroscopePermission;
