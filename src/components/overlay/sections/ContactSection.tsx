import React from 'react';
import { portfolioData } from '@/data/portfolioData';
import { Mail, Phone, Linkedin, GraduationCap, Download } from 'lucide-react';

const ContactSection: React.FC = () => {
  const { personal, education, expertise } = portfolioData;

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-20">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Card */}
        <div className="card-steel p-8">
          <h2 className="heading-technical text-3xl text-foreground mb-6">
            Let's Connect
          </h2>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            I'm always open to discussing process improvement opportunities,
            manufacturing challenges, or potential collaborations.
          </p>

          <div className="space-y-4 mb-8">
            <a
              href={`mailto:${personal.email}`}
              className="flex items-center gap-4 p-4 rounded-lg bg-secondary border border-transparent hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative z-20 group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="text-foreground transition-colors group-hover:text-primary">{personal.email}</div>
              </div>
            </a>

            <a
              href={`tel:${personal.phone}`}
              className="flex items-center gap-4 p-4 rounded-lg bg-secondary border border-transparent hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative z-20 group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <div className="text-foreground transition-colors group-hover:text-primary">{personal.phone}</div>
              </div>
            </a>

            <a
              href={`https://${personal.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-lg bg-secondary border border-transparent hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative z-20 group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Linkedin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">LinkedIn</div>
                <div className="text-foreground transition-colors group-hover:text-primary">Connect on LinkedIn</div>
              </div>
            </a>
          </div>

          <a
            href={personal.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-copper w-full flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Resume
          </a>
        </div>

        {/* Education & Expertise */}
        <div className="space-y-8">
          {/* Education */}
          <div className="card-steel p-8">
            <h3 className="heading-technical text-xl text-foreground mb-6 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-accent" />
              Education
            </h3>

            <div className="space-y-6">
              {education.map((edu, i) => (
                <div key={i} className="border-l-2 border-primary/30 pl-4">
                  {edu.logo && (
                    <img
                      src={edu.logo}
                      alt={edu.school}
                      className="w-full h-auto object-contain mb-4"
                    />
                  )}
                  <div>
                    <div className="font-medium text-foreground">{edu.degree}</div>
                    <div className="text-sm text-muted-foreground">{edu.school}</div>
                    <div className="text-xs text-muted-foreground font-mono">{edu.period}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expertise Areas */}
          <div className="card-steel p-8">
            <h3 className="heading-technical text-xl text-foreground mb-6">
              Areas of Expertise
            </h3>

            <div className="space-y-6">
              {expertise.map((area, i) => (
                <div key={i}>
                  <h4 className="text-sm font-mono text-primary uppercase tracking-wider mb-3">
                    {area.category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {area.skills.map((skill, j) => (
                      <span key={j} className="badge-industrial text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 text-center">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} {personal.name}. Built with precision engineering.
        </p>
      </div>
    </div>
  );
};

export default ContactSection;
