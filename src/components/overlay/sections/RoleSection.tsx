import React from 'react';
import { CareerRole } from '@/data/portfolioData';
import { Calendar, MapPin, Briefcase } from 'lucide-react';

interface RoleSectionProps {
  role: CareerRole;
  index: number;
}

const RoleSection: React.FC<RoleSectionProps> = ({ role, index }) => {
  const isEven = index % 2 === 0;

  return (
    <div className={`w-full max-w-6xl mx-auto px-6 py-20 ${isEven ? 'md:pr-[40%]' : 'md:pl-[40%]'}`}>
      <div className="card-steel p-8 md:p-10">
        {/* Role header */}
        <div className="mb-6">
          {/* Index badge */}
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent text-accent-foreground font-mono font-bold mb-4">
            {String(index + 1).padStart(2, '0')}
          </div>

          <h2 className="heading-technical text-2xl md:text-3xl text-foreground mb-2">
            {role.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <span className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              {role.company}
            </span>
            {role.location && (
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {role.location}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {role.period}
            </span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {role.summary}
        </p>

        {/* Highlights */}
        <div className="mb-6">
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
        <div>
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

        {/* Timeline connector decoration */}
        <div className="absolute top-0 bottom-0 left-6 md:left-auto md:right-0 w-px opacity-30">
          <div className="timeline-line h-full" />
        </div>
      </div>
    </div>
  );
};

export default RoleSection;
