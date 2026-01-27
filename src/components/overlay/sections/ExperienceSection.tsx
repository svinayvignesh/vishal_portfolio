import React, { useState } from 'react';
import { portfolioData, CareerRole } from '@/data/portfolioData';
import { useStore } from '@/store/useStore';
import { Calendar, MapPin, FileCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ExperienceSectionProps {
  isMobile?: boolean;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ isMobile = false }) => {
  const { roles } = portfolioData;
  const [activeRoleIndex, setActiveRoleIndex] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const setActiveSceneId = useStore((state) => state.setActiveSceneId);

  const activeRole = roles[activeRoleIndex];

  const handleRoleChange = (index: number) => {
    setActiveRoleIndex(index);
    // Update 3D scene when role changes
    const sceneId = roles[index]?.sceneId || 'hero';
    setActiveSceneId(sceneId);
  };

  const handlePrev = () => {
    if (activeRoleIndex > 0) {
      handleRoleChange(activeRoleIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeRoleIndex < roles.length - 1) {
      handleRoleChange(activeRoleIndex + 1);
    }
  };

  // Extract year from period string (e.g., "Aug 2024 - Jan 2026" -> "2024")
  const getYear = (period: string) => {
    const match = period.match(/\d{4}/);
    return match ? match[0] : '';
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-16">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="heading-technical text-3xl md:text-4xl text-foreground mb-4">
          Experience
        </h2>
        <p className="text-muted-foreground text-lg">
          My professional journey across manufacturing and engineering roles.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Timeline - Left Side */}
        <div className="lg:w-1/4 shrink-0">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border/30" />

            {/* Timeline Items */}
            <div className="space-y-2">
              {roles.map((role, index) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleChange(index)}
                  className={`relative w-full text-left pl-10 pr-4 py-3 rounded-lg transition-all duration-300 group ${
                    index === activeRoleIndex
                      ? 'bg-primary/15 border border-primary/40'
                      : 'hover:bg-secondary/30 border border-transparent'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-all ${
                      index === activeRoleIndex
                        ? 'bg-primary border-primary scale-125'
                        : 'bg-background border-muted-foreground group-hover:border-primary'
                    }`}
                  />

                  {/* Year */}
                  <div className={`text-xs font-mono mb-1 ${
                    index === activeRoleIndex ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {getYear(role.period)}
                  </div>

                  {/* Title & Company */}
                  <div className={`text-sm font-medium truncate ${
                    index === activeRoleIndex ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                  }`}>
                    {role.title}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {role.company}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Role Details - Right Side */}
        <div className="lg:w-3/4 flex-1">
          <div className={`card-steel p-6 md:p-8 relative overflow-hidden ${isMobile ? 'opacity-90' : ''}`}>
            {/* Logo watermark */}
            {activeRole.logo && (
              <div className="absolute top-4 right-4 w-24 h-24 opacity-30 pointer-events-none">
                <img
                  src={activeRole.logo}
                  alt=""
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Role Header */}
            <div className="mb-6 relative z-10">
              <div className="flex items-center gap-3 mb-3">
                {/* Index badge */}
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground font-mono font-bold text-sm">
                  {String(activeRoleIndex + 1).padStart(2, '0')}
                </div>

                {activeRole.logo && (
                  <img
                    src={activeRole.logo}
                    alt={`${activeRole.company} logo`}
                    className="w-8 h-8 object-contain rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>

              <h3 className="heading-technical text-xl md:text-2xl text-foreground mb-2">
                {activeRole.title}
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="font-medium">{activeRole.company}</span>
                {activeRole.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {activeRole.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {activeRole.period}
                </span>
                {activeRole.certificate && (
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/20 hover:bg-primary/30 text-primary transition-colors"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Certificate</span>
                  </button>
                )}
              </div>
            </div>

            {/* Summary */}
            <p className="text-muted-foreground mb-6 leading-relaxed relative z-10">
              {activeRole.summary}
            </p>

            {/* Highlights */}
            <div className="mb-6 relative z-10">
              <h4 className="text-sm font-mono text-primary uppercase tracking-wider mb-3">
                Key Achievements
              </h4>
              <ul className="space-y-2">
                {activeRole.highlights.map((highlight, i) => (
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
                {activeRole.skills.map((skill, i) => (
                  <span key={i} className="badge-industrial">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="relative z-10 flex justify-between items-center border-t border-border/50 pt-6">
              <button
                onClick={handlePrev}
                disabled={activeRoleIndex === 0}
                className={`flex items-center gap-2 transition-colors group ${
                  activeRoleIndex === 0
                    ? 'text-muted-foreground/50 cursor-not-allowed'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Previous</span>
              </button>

              <div className="flex items-center gap-1.5">
                {roles.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleRoleChange(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeRoleIndex
                        ? 'bg-primary scale-125'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={activeRoleIndex === roles.length - 1}
                className={`flex items-center gap-2 transition-colors group ${
                  activeRoleIndex === roles.length - 1
                    ? 'text-muted-foreground/50 cursor-not-allowed'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <span className="text-sm font-medium">Next</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {activeRole.certificate && (
        <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-primary" />
                Certificate - {activeRole.company}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <img
                src={activeRole.certificate}
                alt={`${activeRole.company} certificate`}
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

export default ExperienceSection;
