import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStore } from '@/store/useStore';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import ExpertiseSection from './sections/ExpertiseSection';
import ProjectsSection from './sections/ProjectsSection';
import ExperienceSection from './sections/ExperienceSection';
import EducationSection from './sections/EducationSection';
import ContactSection from './sections/ContactSection';
import { useIsMobile } from '@/hooks/use-mobile';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const ScrollOverlay: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setCurrentSection, setSectionProgress, setTotalProgress } = useStore();
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
      {/* 1. Hero Section */}
      <section className="scroll-section min-h-screen flex items-center justify-center snap-start snap-always">
        <HeroSection />
      </section>

      {/* 2. About Section */}
      <section className="scroll-section min-h-screen flex items-center justify-center snap-start snap-always">
        <AboutSection />
      </section>

      {/* 3. Expertise Section */}
      <section className="scroll-section min-h-screen flex items-center justify-center snap-start snap-always">
        <ExpertiseSection />
      </section>

      {/* 4. Projects Section */}
      <section className="scroll-section min-h-screen flex items-center justify-center snap-start snap-always">
        <ProjectsSection />
      </section>

      {/* 5. Experience Section (Tabbed Timeline) */}
      <section className="scroll-section min-h-screen flex items-center justify-center snap-start snap-always">
        <ExperienceSection isMobile={isMobile} />
      </section>

      {/* 6. Education Section */}
      <section className="scroll-section min-h-screen flex items-center justify-center snap-start snap-always">
        <EducationSection />
      </section>

      {/* 7. Contact Section */}
      <section className="scroll-section min-h-screen flex items-center justify-center snap-start snap-always">
        <ContactSection />
      </section>
    </div>
  );
};

export default ScrollOverlay;
