import React from 'react';
import { portfolioData } from '@/data/portfolioData';
import { Mail, Phone, Linkedin, Download, ChevronUp } from 'lucide-react';

const ContactSection: React.FC = () => {
  const { personal } = portfolioData;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-16">
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="heading-technical text-3xl md:text-4xl text-foreground mb-4">
          Let's Connect
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          I'm always open to discussing process improvement opportunities,
          manufacturing challenges, or potential collaborations.
        </p>
      </div>

      {/* Contact Card */}
      <div className="card-steel p-8">
        <div className="space-y-4 mb-8">
          <a
            href={`mailto:${personal.email}`}
            className="flex items-center gap-4 p-4 rounded-lg bg-secondary/40 border border-border/30 hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative z-20 group"
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="text-lg text-foreground transition-colors group-hover:text-primary">{personal.email}</div>
            </div>
          </a>

          <a
            href={`tel:${personal.phone}`}
            className="flex items-center gap-4 p-4 rounded-lg bg-secondary/40 border border-border/30 hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative z-20 group"
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Phone</div>
              <div className="text-lg text-foreground transition-colors group-hover:text-primary">{personal.phone}</div>
            </div>
          </a>

          <a
            href={`https://${personal.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-lg bg-secondary/40 border border-border/30 hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative z-20 group"
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Linkedin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">LinkedIn</div>
              <div className="text-lg text-foreground transition-colors group-hover:text-primary">Connect on LinkedIn</div>
            </div>
          </a>
        </div>

        <a
          href={personal.resume}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-copper w-full flex items-center justify-center gap-2 text-lg py-4"
        >
          <Download className="w-5 h-5" />
          Download Resume
        </a>
      </div>

      {/* Scroll to Top Button */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary/20 hover:bg-primary/30 text-primary transition-all hover:shadow-lg group"
          title="Back to top"
        >
          <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          <span className="text-sm font-medium">Back to Top</span>
        </button>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center space-y-2">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} {personal.name}. All rights reserved.
        </p>
        <p className="text-muted-foreground text-xs">
          Website created by{' '}
          <a
            href="https://www.linkedin.com/in/vshasiofficial"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors underline"
          >
            Vinay Shasi
          </a>
        </p>
      </div>
    </div>
  );
};

export default ContactSection;
