import React, { useState } from 'react';
import { CareerRole, portfolioData } from '@/data/portfolioData';
import { Calendar, MapPin, ChevronRight, ChevronLeft, FileCheck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RoleSectionProps {
  role: CareerRole;
  index: number;
  isMobile?: boolean;
}

const RoleSection: React.FC<RoleSectionProps> = ({ role, index, isMobile = false }) => {
  const isEven = index % 2 === 0;
  const totalRoles = portfolioData.roles.length;
  const isFirst = index === 0;
  const isLast = index === totalRoles - 1;
  const [showCertificate, setShowCertificate] = useState(false);

  const scrollToNext = () => {
    if (!isLast) {
      // On mobile: each role has a small 3D peek section (h-64 = 16rem = 256px) after it
      // On desktop: roles are adjacent (no 3D sections)
      // We need to scroll past current role + 3D peek + to next role
      const modelPeekHeight = 256; // h-64 in pixels
      const currentScrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;

      if (isMobile) {
        // Scroll past this role section (1 viewport) + model peek (256px) to next role
        window.scrollTo({
          top: currentScrollTop + viewportHeight + modelPeekHeight,
          behavior: 'smooth',
        });
      } else {
        // Desktop: just scroll one viewport down
        window.scrollTo({
          top: currentScrollTop + viewportHeight,
          behavior: 'smooth',
        });
      }
    } else {
      // Last role - scroll to contact section
      const modelPeekHeight = 256;
      const currentScrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;

      if (isMobile) {
        window.scrollTo({
          top: currentScrollTop + viewportHeight + modelPeekHeight,
          behavior: 'smooth',
        });
      } else {
        window.scrollTo({
          top: currentScrollTop + viewportHeight,
          behavior: 'smooth',
        });
      }
    }
  };

  const scrollToPrev = () => {
    if (!isFirst) {
      // Scroll back past 3D peek section and previous role
      const modelPeekHeight = 256;
      const currentScrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;

      if (isMobile) {
        // Scroll back: - current role (1 viewport) - model peek (256px) - previous role to center
        window.scrollTo({
          top: currentScrollTop - viewportHeight - modelPeekHeight,
          behavior: 'smooth',
        });
      } else {
        // Desktop: just scroll one viewport up
        window.scrollTo({
          top: currentScrollTop - viewportHeight,
          behavior: 'smooth',
        });
      }
    } else {
      // First role - scroll to hero
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 py-20 ${isEven ? 'md:pr-[35%]' : 'md:pl-[35%]'}`}>
      <div className={`card-steel p-8 md:p-10 relative overflow-hidden ${isMobile ? 'opacity-80' : ''}`}>
        {/* Logo watermark background */}
        {role.logo && (
          <div className="absolute top-4 right-4 w-32 h-32 opacity-[0.5] pointer-events-none">
            <img
              src={role.logo}
              alt=""
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        {/* Role header */}
        <div className="mb-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            {/* Index badge */}
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent text-accent-foreground font-mono font-bold">
              {String(index + 1).padStart(2, '0')}
            </div>
          </div>

          <h2 className="heading-technical text-2xl md:text-3xl text-foreground mb-2">
            {role.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-2.5">
              {role.logo && (
                <img
                  src={role.logo}
                  alt={`${role.company} logo`}
                  className="w-7 h-7 object-contain rounded"
                  onError={(e) => {
                    // Hide image if it fails to load
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <span className="font-medium">{role.company}</span>
            </span>
            {role.location && (
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {role.location}
              </span>
            )}
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {role.period}
              </span>
              {/* Certificate badge if available */}
              {role.certificate && (
                <button
                  onClick={() => setShowCertificate(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 hover:bg-primary/30 text-primary transition-colors group"
                  title="View Certificate"
                >
                  <FileCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">View Certificate</span>
                </button>
              )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <p className="text-muted-foreground mb-6 leading-relaxed relative z-10">
            {role.summary}
          </p>

          {/* Highlights */}
          <div className="mb-6 relative z-10">
            <h4 className="text-sm font-mono text-primary uppercase tracking-wider mb-3">
              Key Achievements
            </h4>
            <ul className="space-y-2">
              {role.highlights.map((highlight, i) => (
                <li key={i} className="flex items-start gap-3 text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <span className="text-sm leading-relaxed">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills */}
          <div className="relative z-10 mb-6">
            <h4 className="text-sm font-mono text-primary uppercase tracking-wider mb-3">
              Skills Applied
            </h4>
            <div className="flex flex-wrap gap-2">
              {role.skills.map((skill, i) => (
                <span
                  key={i}
                  className="badge-industrial"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="relative z-10 flex justify-between items-center border-t border-border/50 pt-6">
            <button
              onClick={scrollToPrev}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Previous</span>
            </button>
            <button
              onClick={scrollToNext}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors group"
            >
              <span className="text-sm font-medium">{isLast ? 'Contact' : 'Next'}</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Timeline connector decoration */}
          <div className="absolute top-0 bottom-0 left-6 md:left-auto md:right-0 w-px opacity-30">
            <div className="timeline-line h-full" />
          </div>
        </div>

        {/* Certificate Modal */}
        {role.certificate && (
          <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-primary" />
                  Certificate of Completion - {role.company}
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <img
                  src={role.certificate}
                  alt={`${role.company} certificate`}
                  className="w-full h-auto rounded-lg shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-certificate.jpg';
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      );
};

      export default RoleSection;
