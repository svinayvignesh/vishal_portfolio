import React from 'react';
import { portfolioData } from '@/data/portfolioData';
import { Folder, TrendingUp, Cog, LineChart, FlaskConical, Wrench } from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  "Process Validation": <Cog className="w-4 h-4" />,
  "Lean Manufacturing": <TrendingUp className="w-4 h-4" />,
  "Process Improvement": <Wrench className="w-4 h-4" />,
  "Data Analytics": <LineChart className="w-4 h-4" />,
  "Research & Development": <FlaskConical className="w-4 h-4" />,
};

const ProjectsSection: React.FC = () => {
  const { projects } = portfolioData;

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="heading-technical text-3xl md:text-4xl text-foreground mb-4">
          Featured Projects
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Key initiatives and improvements that delivered measurable impact across manufacturing operations.
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="card-steel p-6 flex flex-col hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 group"
          >
            {/* Category Badge */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/15 text-accent text-xs font-medium">
                {categoryIcons[project.category] || <Folder className="w-4 h-4" />}
                <span>{project.category}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-grow">
              {project.description}
            </p>

            {/* Metrics */}
            <div className="mb-4">
              <h4 className="text-xs font-mono text-primary uppercase tracking-wider mb-2">
                Key Results
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.metrics.map((metric, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs rounded bg-primary/15 text-primary font-medium"
                  >
                    {metric}
                  </span>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className="border-t border-border/50 pt-4">
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className="badge-industrial text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;
