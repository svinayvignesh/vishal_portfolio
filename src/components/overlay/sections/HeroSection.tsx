import React, { useState } from 'react';
import { portfolioData, Certification } from '@/data/portfolioData';
import { Mail, Phone, Linkedin, ChevronDown, ExternalLink, Award } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const HeroSection: React.FC = () => {
  const { personal, certifications } = portfolioData;
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  const scrollToContact = () => {
    // Scroll to the last section (Contact section)
    // Total sections = 1 hero + 6 roles + 1 contact = 8
    // So contact section is at index 7, which means scroll to 7 * window.innerHeight
    window.scrollTo({
      top: window.innerHeight * (portfolioData.roles.length + 1),
      behavior: 'smooth',
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-20">
      <div className="flex flex-col md:flex-row items-center gap-12 stagger-children">
        {/* Profile Image (Mobile: Top, Desktop: Left) */}
        <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl">
          <img
            src="/images/profile.jpg"
            alt={personal.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          {/* Name and Title */}
          <div className="mb-8">
            <h1 className="heading-technical text-5xl md:text-7xl text-foreground mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              {personal.name}
            </h1>
            <p className="text-xl md:text-2xl text-primary font-mono drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] bg-background/40 backdrop-blur-sm px-4 py-2 rounded-lg inline-block">
              {personal.title}
            </p>
          </div>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8 leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] bg-background/30 backdrop-blur-sm px-4 py-3 rounded-lg">
            {personal.tagline}
          </p>

          {/* Contact Info */}
          <div className="flex flex-wrap gap-4 mb-12">
            <a
              href={`mailto:${personal.email}`}
              className="badge-industrial flex items-center gap-2 hover:border-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              {personal.email}
            </a>
            <a
              href={`tel:${personal.phone}`}
              className="badge-industrial flex items-center gap-2 hover:border-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              {personal.phone}
            </a>
            <a
              href={`https://${personal.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="badge-industrial flex items-center gap-2 hover:border-primary transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          </div>

          {/* Certifications */}
          <div className="mb-12">
            <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4">
              Certifications
            </h3>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert, i) => {
                if (cert.link) {
                  // Clickable certification with external link
                  return (
                    <a
                      key={i}
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-sm rounded bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-1.5 cursor-pointer group shadow-sm hover:shadow-md"
                    >
                      <Award className="w-3.5 h-3.5" />
                      {cert.name}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  );
                } else {
                  // Certification with modal dialog
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedCert(cert)}
                      className="px-3 py-1.5 text-sm rounded bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all flex items-center gap-1.5 cursor-pointer group shadow-sm hover:shadow-md"
                    >
                      <Award className="w-3.5 h-3.5" />
                      {cert.name}
                    </button>
                  );
                }
              })}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4">
            <button
              onClick={scrollToContent}
              className="btn-copper flex items-center gap-2"
            >
              View Experience
              <ChevronDown className="w-4 h-4" />
            </button>
            <button
              onClick={scrollToContact}
              className="btn-steel"
            >
              Get in Touch
            </button>
          </div>
        </div>
      </div>


      {/* Certification Details Modal */}
      <Dialog open={selectedCert !== null} onOpenChange={() => setSelectedCert(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              {selectedCert?.name}
            </DialogTitle>
            <DialogDescription className="space-y-3 pt-4">
              {selectedCert?.issuer && (
                <div>
                  <span className="font-semibold text-foreground">Issuer:</span>{' '}
                  <span className="text-muted-foreground">{selectedCert.issuer}</span>
                </div>
              )}
              {selectedCert?.issueDate && (
                <div>
                  <span className="font-semibold text-foreground">Issued:</span>{' '}
                  <span className="text-muted-foreground">{selectedCert.issueDate}</span>
                </div>
              )}
              {selectedCert?.credentialId && (
                <div>
                  <span className="font-semibold text-foreground">Credential ID:</span>{' '}
                  <span className="text-muted-foreground font-mono text-sm">{selectedCert.credentialId}</span>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeroSection;
