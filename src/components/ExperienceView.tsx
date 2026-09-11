import React from 'react';
import { EXPERIENCES } from '../data/portfolioData';
import { usePortfolio } from '../hooks/usePortfolio';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { PageView } from '../types';

interface ExperienceViewProps {
  onNavigate: (view: PageView) => void;
  onOpenResume: () => void;
  onOpenContact?: () => void;
}

export const ExperienceView: React.FC<ExperienceViewProps> = ({
  onNavigate,
  onOpenResume,
  onOpenContact,
}) => {
  const { experiences } = usePortfolio();
  const expList = experiences && experiences.length > 0 ? experiences : EXPERIENCES;

  return (
    <div className="w-full pt-28 pb-28">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-20 pb-8 border-b border-neutral-200">
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#B89047] block mb-3">
            EXPERIENCE // PROFESSIONAL TIMELINE
          </span>
          <h1 className="font-serif-editorial text-4xl sm:text-6xl md:text-7xl font-normal text-[#111111] tracking-tight">
            Work History & Leadership
          </h1>
          <p className="text-base sm:text-lg text-neutral-500 font-light mt-4 max-w-2xl leading-relaxed">
            Hands-on technical internships across mobile engineering, backend request pipelines, and cross-functional operations.
          </p>
        </div>

        {/* Sophisticated Editorial Timeline */}
        <div className="space-y-24">
          {expList.map((exp, index) => {
            const expNumber = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;
            return (
              <div
                key={exp.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 pt-12 border-t border-neutral-200"
              >
                {/* Left Column: Date & Metadata */}
                <div className="md:col-span-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="font-serif-editorial text-3xl sm:text-4xl text-[#B89047] font-light">
                      {expNumber}
                    </span>
                    <span className="w-8 h-[1px] bg-[#B89047]/40" />
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
                      {exp.period}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#111111]">
                      {exp.company}
                    </h3>
                    <p className="text-sm font-medium text-[#B89047] tracking-wide mt-1">
                      {exp.role}
                    </p>
                    <p className="text-xs text-neutral-400 font-mono mt-1">
                      {exp.location} • {exp.type}
                    </p>
                  </div>

                  <div className="pt-2">
                    <span className="inline-block px-2.5 py-1 text-[11px] font-mono text-neutral-600 border border-neutral-200 bg-[#FAFAFA]">
                      KEY IMPACT // {exp.keyImpact}
                    </span>
                  </div>
                </div>

                {/* Right Column: Narrative & Responsibilities */}
                <div className="md:col-span-8 space-y-6">
                  {exp.summary && (
                    <p className="text-base sm:text-lg font-serif-editorial text-[#111111] leading-relaxed">
                      {exp.summary}
                    </p>
                  )}

                  <div>
                    <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-400 block mb-3">
                      DELIVERABLES & RESPONSIBILITIES
                    </span>
                    <ul className="space-y-3">
                      {exp.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-neutral-600 font-light leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B89047] mt-2 shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div className="pt-4 border-t border-neutral-100">
                    <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-400 block mb-2">
                      TOOLS & DOMAINS
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 text-xs font-mono text-neutral-700 border border-neutral-200 bg-white"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-28 p-8 border border-neutral-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="font-serif-editorial text-2xl text-[#111111]">
              Seeking Full-Time Software Engineering & Data Roles
            </h4>
            <p className="text-xs sm:text-sm text-neutral-500 font-light mt-1">
              Available immediately in Bengaluru or remote teams.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenResume}
              className="px-5 py-2.5 text-xs font-semibold tracking-[0.18em] uppercase border border-[#B89047] text-[#111111] hover:bg-[#B89047] hover:text-white transition-all"
            >
              DOWNLOAD RESUME
            </button>
            <button
              onClick={onOpenContact || (() => onNavigate('contact'))}
              className="px-5 py-2.5 text-xs font-semibold tracking-[0.18em] uppercase bg-[#111111] text-white hover:bg-[#B89047] transition-all cursor-pointer"
            >
              LET'S TALK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
