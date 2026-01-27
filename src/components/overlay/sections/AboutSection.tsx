import React from 'react';
import { portfolioData } from '@/data/portfolioData';
import { Sparkles, Target, Users, TrendingUp } from 'lucide-react';

const valueIcons: Record<string, React.ReactNode> = {
  "Continuous Improvement": <TrendingUp className="w-5 h-5" />,
  "Data-Driven Decisions": <Target className="w-5 h-5" />,
  "Operational Excellence": <Sparkles className="w-5 h-5" />,
  "Team Empowerment": <Users className="w-5 h-5" />,
};

const AboutSection: React.FC = () => {
  const { about } = portfolioData;

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-16">
      <div className="card-steel p-8 md:p-12">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="heading-technical text-3xl md:text-4xl text-foreground mb-4">
            About Me
          </h2>
          <p className="text-xl md:text-2xl text-primary font-mono">
            {about.headline}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Highlights */}
          <div className="md:col-span-1 flex flex-col items-center">
            {/* Quick Stats */}
            <div className="w-full space-y-3">
              {about.highlights.map((highlight, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30"
                >
                  <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                  <span className="text-sm font-medium text-foreground">{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Story & Values */}
          <div className="md:col-span-2 space-y-8">
            {/* Story */}
            <div>
              <h3 className="text-sm font-mono text-primary uppercase tracking-wider mb-4">
                My Journey
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {about.story}
              </p>
            </div>

            {/* Values */}
            <div>
              <h3 className="text-sm font-mono text-primary uppercase tracking-wider mb-4">
                What Drives Me
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {about.values.map((value, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 rounded-lg bg-secondary/20 border border-border/20 hover:border-primary/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary">
                      {valueIcons[value] || <Sparkles className="w-5 h-5" />}
                    </div>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
