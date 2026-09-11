import React, { useState } from 'react';
import { ProjectItem, ProjectCategory } from '../types';
import { PROJECTS } from '../data/portfolioData';
import { usePortfolio } from '../hooks/usePortfolio';
import { ArrowUpRight, ArrowRight, Layers, Sparkles, BarChart2 } from 'lucide-react';

interface WorkViewProps {
  onSelectProject: (project: ProjectItem) => void;
}

export const WorkView: React.FC<WorkViewProps> = ({ onSelectProject }) => {
  const { projects } = usePortfolio();
  const allProjects = projects && projects.length > 0 ? projects : PROJECTS;
  const [filter, setFilter] = useState<ProjectCategory>('all');

  const filteredProjects = filter === 'all'
    ? allProjects
    : allProjects.filter((p) => p.category === filter);

  return (
    <div className="w-full pt-28 pb-28">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-neutral-200 gap-6">
          <div>
            <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#B89047] block mb-3">
              WORK // CASE STUDIES & ARCHITECTURES
            </span>
            <h1 className="font-serif-editorial text-4xl sm:text-6xl md:text-7xl font-normal text-[#111111] tracking-tight">
              Selected Projects
            </h1>
          </div>

          <p className="text-sm sm:text-base text-neutral-500 font-light max-w-md leading-relaxed">
            Full-stack web architectures, AI-integrated platforms, and enterprise data analytics dashboards engineered for production validity.
          </p>
        </div>

        {/* Filter Tabs — Editorial Style */}
        <div className="flex items-center gap-6 sm:gap-10 pb-4 mb-20 border-b border-neutral-200/60 overflow-x-auto text-xs font-mono tracking-[0.2em] uppercase">
          <button
            onClick={() => setFilter('all')}
            className={`pb-3 relative transition-colors focus:outline-none whitespace-nowrap ${
              filter === 'all' ? 'text-[#111111] font-semibold' : 'text-neutral-400 hover:text-[#111111]'
            }`}
          >
            <span>ALL PROJECTS ({allProjects.length})</span>
            {filter === 'all' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B89047]" />
            )}
          </button>

          <button
            onClick={() => setFilter('fullstack')}
            className={`pb-3 relative transition-colors focus:outline-none whitespace-nowrap ${
              filter === 'fullstack' ? 'text-[#111111] font-semibold' : 'text-neutral-400 hover:text-[#111111]'
            }`}
          >
            <span>FULL-STACK WEB ({allProjects.filter((p) => p.category === 'fullstack').length})</span>
            {filter === 'fullstack' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B89047]" />
            )}
          </button>

          <button
            onClick={() => setFilter('ai-backend')}
            className={`pb-3 relative transition-colors focus:outline-none whitespace-nowrap ${
              filter === 'ai-backend' ? 'text-[#111111] font-semibold' : 'text-neutral-400 hover:text-[#111111]'
            }`}
          >
            <span>AI & SYSTEMS ({allProjects.filter((p) => p.category === 'ai-backend').length})</span>
            {filter === 'ai-backend' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B89047]" />
            )}
          </button>

          <button
            onClick={() => setFilter('data-bi')}
            className={`pb-3 relative transition-colors focus:outline-none whitespace-nowrap ${
              filter === 'data-bi' ? 'text-[#111111] font-semibold' : 'text-neutral-400 hover:text-[#111111]'
            }`}
          >
            <span>DATA & BI ({allProjects.filter((p) => p.category === 'data-bi').length})</span>
            {filter === 'data-bi' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B89047]" />
            )}
          </button>
        </div>

        {/* Major Editorial Project Showcase */}
        <div className="space-y-36">
          {filteredProjects.map((project, index) => {
            const projectNumber = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;
            return (
              <article
                key={project.id}
                className="group border-t border-neutral-200 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14"
              >
                {/* Left Side: Editorial Details */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="flex items-center gap-3">
                    <span className="font-serif-editorial text-4xl sm:text-5xl text-[#B89047] font-light">
                      {projectNumber}
                    </span>
                    <div className="w-8 h-[1px] bg-[#B89047]/40" />
                    <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-400">
                      {project.categoryLabel} • {project.period}
                    </span>
                  </div>

                  <h2 className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-[#111111] leading-tight">
                    {project.title}
                  </h2>

                  <p className="text-sm font-medium text-neutral-700 font-sans">
                    {project.subtitle}
                  </p>

                  <div className="space-y-4 pt-2 border-t border-neutral-100 text-xs sm:text-sm">
                    {/* The Problem */}
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#B89047] block mb-1">
                        THE PROBLEM
                      </span>
                      <p className="text-neutral-600 font-light leading-relaxed">
                        {project.problemSolved}
                      </p>
                    </div>

                    {/* What I Built */}
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-400 block mb-1">
                        WHAT I BUILT & SOLUTION
                      </span>
                      <p className="text-neutral-600 font-light leading-relaxed">
                        {project.solution}
                      </p>
                    </div>

                    {/* My Contribution */}
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-400 block mb-1">
                        MY DIRECT CONTRIBUTION
                      </span>
                      <ul className="space-y-1.5 text-neutral-600 font-light">
                        {project.contributions.slice(0, 2).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full bg-[#B89047] mt-2 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technology Stack */}
                    <div className="pt-2">
                      <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-400 block mb-2">
                        TECHNOLOGY STACK
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.map((t) => (
                          <span
                            key={t}
                            className="text-[11px] font-mono text-neutral-700 px-2 py-0.5 border border-neutral-200 bg-white"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-6 flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-[0.18em] uppercase bg-[#111111] text-white hover:bg-[#B89047] transition-all duration-200 focus:outline-none"
                    >
                      <span>VIEW CASE STUDY</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold tracking-[0.18em] uppercase border border-neutral-200 text-neutral-700 hover:border-[#B89047] hover:text-[#111111] transition-all"
                      >
                        <span>SOURCE CODE</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#B89047]" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Side: Large Architectural Presentation Showcase */}
                <div
                  onClick={() => onSelectProject(project)}
                  className="lg:col-span-7 cursor-pointer border border-neutral-200 bg-white p-8 sm:p-14 hover:border-[#B89047] transition-all duration-300 relative group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.05)] flex flex-col justify-between min-h-[440px]"
                >
                  <div className="flex items-center justify-between pb-6 border-b border-neutral-100 text-[11px] font-mono text-neutral-400">
                    <span className="text-[#B89047] uppercase tracking-wider">{project.statusBadge}</span>
                    <span>ARCHITECTURE OVERVIEW</span>
                  </div>

                  {/* Center Architectural Typography & Blueprint Layout */}
                  <div className="py-12 sm:py-20 text-center space-y-4">
                    <span className="text-[11px] font-mono text-neutral-400 tracking-[0.25em] uppercase block">
                      SYSTEM IDENTIFIER // {project.id.toUpperCase()}
                    </span>
                    <h3 className="font-serif-editorial text-4xl sm:text-6xl font-light text-[#111111] tracking-tight group-hover:text-[#B89047] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-500 font-mono max-w-lg mx-auto leading-relaxed">
                      {project.architectureDetails}
                    </p>
                  </div>

                  {/* Bottom Metadata bar */}
                  <div className="pt-6 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-500">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Validated Codebase</span>
                    </div>
                    <span className="text-[#B89047] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      READ ARCHITECTURE DEEP DIVE →
                    </span>
                  </div>

                  {/* Subtle Gold line on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B89047] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};
