import React, { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';

interface GyroscopePermissionProps {
  onPermissionGranted: () => void;
}

const GyroscopePermission: React.FC<GyroscopePermissionProps> = ({ onPermissionGranted }) => {
  const [needsPermission, setNeedsPermission] = useState(false);
  const [permissionChecked, setPermissionChecked] = useState(false);

  useEffect(() => {
    // Check if we need to request permission (iOS 13+)
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      setNeedsPermission(true);
      setPermissionChecked(true);
    } else {
      // Android or older iOS - permission not needed
      setNeedsPermission(false);
      setPermissionChecked(true);
      onPermissionGranted();
    }
  }, [onPermissionGranted]);

  const requestPermission = async () => {
    try {
      const permissionState = await (DeviceOrientationEvent as any).requestPermission();
      if (permissionState === 'granted') {
        setNeedsPermission(false);
        onPermissionGranted();
      } else {
        console.warn('Gyroscope permission denied');
      }
    } catch (error) {
      console.error('Error requesting gyroscope permission:', error);
    }
  };

  if (!permissionChecked || !needsPermission) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm"
      style={{
        touchAction: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      <div
        className="card-steel p-8 max-w-md mx-4"
        style={{ touchAction: 'manipulation' }}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-primary" />
          </div>
          <h3 className="heading-technical text-xl text-foreground">
            Enable Motion Controls
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            This portfolio uses your device's gyroscope to create interactive 3D effects.
            Tap below to enable motion controls for the best experience.
          </p>
          <button
            onClick={requestPermission}
            onTouchEnd={(e) => {
              e.preventDefault();
              requestPermission();
            }}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 transition-colors font-medium cursor-pointer select-none"
            style={{
              touchAction: 'manipulation',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
          >
            Enable Gyroscope
          </button>
          <button
            onClick={() => setNeedsPermission(false)}
            onTouchEnd={(e) => {
              e.preventDefault();
              setNeedsPermission(false);
            }}
            className="text-muted-foreground text-sm hover:text-foreground active:text-foreground transition-colors cursor-pointer select-none"
            style={{
              touchAction: 'manipulation',
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default GyroscopePermission;
