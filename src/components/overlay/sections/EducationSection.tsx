import React, { useState } from 'react';
import { portfolioData, Certification } from '@/data/portfolioData';
import { GraduationCap, Award, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const EducationSection: React.FC = () => {
  const { education, certifications } = portfolioData;
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="heading-technical text-3xl md:text-4xl text-foreground mb-4">
          Education & Certifications
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Academic foundation and professional credentials supporting my engineering expertise.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Education */}
        <div className="card-steel p-8">
          <h3 className="heading-technical text-xl text-foreground mb-6 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-accent" />
            Education
          </h3>

          <div className="space-y-8">
            {education.map((edu, i) => (
              <div key={i} className="relative pl-6 border-l-2 border-primary/30">
                {/* Timeline dot */}
                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary" />

                {edu.logo && (
                  <img
                    src={edu.logo}
                    alt={edu.school}
                    className="w-full max-w-[200px] h-auto object-contain mb-4"
                  />
                )}
                <div>
                  <div className="font-semibold text-lg text-foreground">{edu.degree}</div>
                  <div className="text-muted-foreground">{edu.school}</div>
                  <div className="text-sm text-muted-foreground font-mono mt-1">{edu.period}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="card-steel p-8">
          <h3 className="heading-technical text-xl text-foreground mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-accent" />
            Certifications
          </h3>

          <div className="space-y-3">
            {certifications.map((cert, i) => {
              if (cert.link) {
                return (
                  <a
                    key={i}
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/30 hover:border-primary/50 hover:bg-secondary/40 transition-all group relative z-20"
                  >
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-primary" />
                      <span className="font-medium text-foreground">{cert.name}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                );
              } else {
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedCert(cert)}
                    className="w-full flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border/30 hover:border-primary/50 hover:bg-secondary/40 transition-all group text-left relative z-20"
                  >
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-primary" />
                      <div>
                        <span className="font-medium text-foreground">{cert.name}</span>
                        {cert.issuer && (
                          <div className="text-xs text-muted-foreground">{cert.issuer}</div>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                      View Details
                    </span>
                  </button>
                );
              }
            })}
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

export default EducationSection;
