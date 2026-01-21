import React from 'react';
import GlobalScene from '@/components/3d/GlobalScene';
import ScrollOverlay from '@/components/overlay/ScrollOverlay';
import ProgressIndicator from '@/components/overlay/ProgressIndicator';

const Index: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Fixed 3D Background */}
      <GlobalScene />

      {/* Scrollable HTML Content */}
      <ScrollOverlay />

      {/* Navigation Progress Indicator */}
      <ProgressIndicator />
    </div>
  );
};

export default Index;
