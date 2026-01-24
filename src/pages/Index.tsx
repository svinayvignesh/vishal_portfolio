import React from 'react';
import GlobalScene from '@/components/3d/GlobalScene';
import ScrollOverlay from '@/components/overlay/ScrollOverlay';
import ProgressIndicator from '@/components/overlay/ProgressIndicator';

interface IndexProps {
  gyroEnabled?: boolean;
}

const Index: React.FC<IndexProps> = ({ gyroEnabled = false }) => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Fixed 3D Background */}
      <GlobalScene gyroEnabled={gyroEnabled} />

      {/* Scrollable HTML Content */}
      <ScrollOverlay />

      {/* Navigation Progress Indicator */}
      <ProgressIndicator />
    </div>
  );
};

export default Index;
