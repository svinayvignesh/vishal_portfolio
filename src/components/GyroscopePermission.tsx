import React, { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';

interface GyroscopePermissionProps {
  onPermissionGranted: () => void;
}

const GyroscopePermission: React.FC<GyroscopePermissionProps> = ({ onPermissionGranted }) => {
  const [showModal, setShowModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Check if this is a mobile/tablet device
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));

    // Desktop - skip entirely
    if (!isMobileDevice) {
      console.log('[Gyroscope] Desktop detected, skipping');
      onPermissionGranted();
      return;
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));
    setIsIOS(isIOSDevice);

    // Check if DeviceOrientationEvent.requestPermission exists (iOS 13+)
    const hasRequestPermission = typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function';

    if (isIOSDevice && hasRequestPermission) {
      // iOS 13+ needs permission - show modal
      setShowModal(true);
    } else if (isIOSDevice) {
      // Older iOS - no permission needed
      onPermissionGranted();
    } else if (window.DeviceOrientationEvent) {
      // Android - show modal for opt-in
      setShowModal(true);
    } else {
      // No gyroscope support
      onPermissionGranted();
    }
  }, [onPermissionGranted]);

  // Lock body scroll when modal is shown
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
      };
    }
  }, [showModal]);

  // Handle enable - MUST be synchronous for iOS
  // Using both onClick and onTouchEnd for maximum compatibility
  // isProcessing prevents double-firing from both events
  const handleEnable = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessing) return;
    setIsProcessing(true);

    console.log('[Gyroscope] Enable triggered, isIOS:', isIOS);

    if (isIOS) {
      // iOS - request permission SYNCHRONOUSLY from user gesture
      const requestPermission = (DeviceOrientationEvent as any).requestPermission;
      if (typeof requestPermission === 'function') {
        requestPermission()
          .then((state: string) => {
            console.log('[Gyroscope] iOS permission:', state);
            if (state === 'granted') {
              setShowModal(false);
              onPermissionGranted();
            } else {
              setPermissionDenied(true);
            }
          })
          .catch((err: Error) => {
            console.error('[Gyroscope] Error:', err);
            setPermissionDenied(true);
          });
      }
    } else {
      // Android - just enable
      console.log('[Gyroscope] Android enabled');
      setShowModal(false);
      onPermissionGranted();
    }
  };

  const handleSkip = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessing) return;
    setIsProcessing(true);

    console.log('[Gyroscope] Skipped');
    setShowModal(false);
    onPermissionGranted();
  };

  if (!showModal) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        touchAction: 'manipulation',
      }}
    >
      <div
        style={{
          backgroundColor: '#1a1a2e',
          borderRadius: '16px',
          padding: '32px',
          margin: '16px',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <Smartphone style={{ width: '32px', height: '32px', color: '#3b82f6' }} />
        </div>

        <h3
          style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '12px',
          }}
        >
          Enable Motion Controls
        </h3>

        <p
          style={{
            fontSize: '14px',
            color: '#a0a0a0',
            lineHeight: '1.6',
            marginBottom: '24px',
          }}
        >
          This portfolio uses your device's gyroscope to create interactive 3D effects.
          {isIOS ? ' Tap below to grant permission.' : ' Tap below to enable.'}
        </p>

        {permissionDenied && (
          <p
            style={{
              fontSize: '14px',
              color: '#ef4444',
              marginBottom: '16px',
            }}
          >
            Permission denied. Please enable motion sensors in your device settings.
          </p>
        )}

        {/* Primary button - CRITICAL: cursor:pointer and touch events for iOS */}
        <button
          type="button"
          onClick={handleEnable}
          onTouchEnd={handleEnable}
          style={{
            width: '100%',
            padding: '16px 24px',
            fontSize: '16px',
            fontWeight: '500',
            color: '#ffffff',
            backgroundColor: '#3b82f6',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
        >
          {isIOS ? 'Allow Gyroscope Access' : 'Enable Motion Controls'}
        </button>

        {/* Skip button */}
        <button
          type="button"
          onClick={handleSkip}
          onTouchEnd={handleSkip}
          style={{
            marginTop: '12px',
            padding: '12px',
            fontSize: '14px',
            color: '#a0a0a0',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

export default GyroscopePermission;
