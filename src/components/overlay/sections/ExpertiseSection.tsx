import React from 'react';
import { portfolioData } from '@/data/portfolioData';
import { Cog, LineChart, Wrench } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  "Process & Manufacturing": <Cog className="w-6 h-6" />,
  "Lean Manufacturing & CI": <LineChart className="w-6 h-6" />,
  "Design & Analytics": <Wrench className="w-6 h-6" />,
};

const ExpertiseSection: React.FC = () => {
  const { expertise } = portfolioData;

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="heading-technical text-3xl md:text-4xl text-foreground mb-4">
          Areas of Expertise
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Technical skills and methodologies developed across multiple industries.
        </p>
      </div>

      {/* Expertise Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {expertise.map((area, i) => (
          <div
            key={i}
            className="card-steel p-6 hover:border-primary/50 transition-all duration-300 group"
          >
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center text-primary group-hover:bg-primary/25 transition-colors">
                {categoryIcons[area.category] || <Cog className="w-6 h-6" />}
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {area.category}
              </h3>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2">
              {area.skills.map((skill, j) => (
                <span
                  key={j}
                  className="badge-industrial text-xs hover:border-primary/50 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpertiseSection;
