import React from 'react';
import { portfolioData } from '@/data/portfolioData';
import { Mail, Phone, Linkedin, ChevronDown } from 'lucide-react';

const HeroSection: React.FC = () => {
  const { personal, certifications } = portfolioData;

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-20">
      <div className="stagger-children">
        {/* Name and Title */}
        <div className="mb-8">
          <h1 className="heading-technical text-5xl md:text-7xl text-foreground mb-4">
            {personal.name}
          </h1>
          <p className="text-xl md:text-2xl text-primary font-mono">
            {personal.title}
          </p>
        </div>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-8 leading-relaxed">
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
            {certifications.map((cert, i) => (
              <span key={i} className="px-3 py-1 text-sm rounded bg-secondary text-secondary-foreground">
                {cert}
              </span>
            ))}
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
          <a 
            href={`mailto:${personal.email}`}
            className="btn-steel"
          >
            Get in Touch
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </div>
    </div>
  );
};

export default HeroSection;
