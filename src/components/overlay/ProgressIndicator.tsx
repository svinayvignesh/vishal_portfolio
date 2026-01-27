import React from 'react';
import { useStore } from '@/store/useStore';

const ProgressIndicator: React.FC = () => {
  const { currentSection, totalProgress } = useStore();

  // New section structure
  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'expertise', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-2">
      {sections.map((section, i) => (
        <button
          key={section.id}
          onClick={() => {
            const targetSection = document.querySelectorAll('.scroll-section')[i];
            targetSection?.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            currentSection === i
              ? 'bg-accent scale-125'
              : 'bg-muted hover:bg-muted-foreground'
          }`}
          title={section.label}
        />
      ))}

      {/* Progress bar */}
      <div className="mt-4 w-0.5 h-20 bg-muted rounded-full overflow-hidden">
        <div
          className="w-full bg-primary transition-all duration-150"
          style={{ height: `${totalProgress * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressIndicator;
