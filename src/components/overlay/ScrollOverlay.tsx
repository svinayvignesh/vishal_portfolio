import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '@/store/useStore';
import { portfolioData } from '@/data/portfolioData';
import HeroSection from './sections/HeroSection';
import RoleSection from './sections/RoleSection';
import ContactSection from './sections/ContactSection';
import { useIsMobile } from '@/hooks/use-mobile';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const ScrollOverlay: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCurrentSection, setSectionProgress, setTotalProgress, totalSections } = useStore();
  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sections = container.querySelectorAll('.scroll-section');

    // Create ScrollTrigger for each section
    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          setCurrentSection(index, isMobile);
        },
        onEnterBack: () => {
          setCurrentSection(index, isMobile);
        },
        onUpdate: (self) => {
          setSectionProgress(self.progress);
        },
      });
    });

    // Global scroll progress
    ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        setTotalProgress(self.progress);
      },
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [setCurrentSection, setSectionProgress, setTotalProgress, isMobile]);

  return (
    <div ref={containerRef} className="relative z-10">
      {/* Hero Section */}
      <section className="scroll-section min-h-screen flex items-center justify-center snap-start snap-always">
        <HeroSection />
      </section>

      {/* Role Sections - On mobile: alternating content and 3D space */}
      {portfolioData.roles.map((role, index) => (
        <React.Fragment key={role.id}>
          {/* Experience Card Section */}
          <section className="scroll-section min-h-screen flex items-center snap-start snap-always">
            <RoleSection role={role} index={index} isMobile={isMobile} />
          </section>

          {/* 3D Model Section - Only on mobile, small peek space for 3D model */}
          {isMobile && (
            <section
              className="scroll-section h-64 flex items-center justify-center snap-start snap-always"
              data-scene-index={index}
            >
              {/* Small section for 3D model to peek through (positioned fixed behind) */}
              <div className="w-full h-full" />
            </section>
          )}
        </React.Fragment>
      ))}

      {/* Contact Section */}
      <section className="scroll-section min-h-screen flex items-center justify-center snap-start snap-always">
        <ContactSection />
      </section>
    </div>
  );
};

export default ScrollOverlay;
