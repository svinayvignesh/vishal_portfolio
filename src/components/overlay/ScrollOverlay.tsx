import React, { useEffect, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '@/store/useStore';
import { portfolioData } from '@/data/portfolioData';
import HeroSection from './sections/HeroSection';
import RoleSection from './sections/RoleSection';
import ContactSection from './sections/ContactSection';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const ScrollOverlay: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCurrentSection, setSectionProgress, setTotalProgress, totalSections } = useStore();

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
          setCurrentSection(index);
        },
        onEnterBack: () => {
          setCurrentSection(index);
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
  }, [setCurrentSection, setSectionProgress, setTotalProgress]);

  return (
    <div ref={containerRef} className="relative z-10">
      {/* Hero Section */}
      <section className="scroll-section min-h-screen flex items-center justify-center snap-start snap-always">
        <HeroSection />
      </section>

      {/* Role Sections */}
      {portfolioData.roles.map((role, index) => (
        <section key={role.id} className="scroll-section min-h-screen flex items-center snap-start snap-always">
          <RoleSection role={role} index={index} />
        </section>
      ))}

      {/* Contact Section */}
      <section className="scroll-section min-h-screen flex items-center justify-center snap-start snap-always">
        <ContactSection />
      </section>
    </div>
  );
};

export default ScrollOverlay;
