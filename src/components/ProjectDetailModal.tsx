import React, { useEffect } from 'react';
import { ProjectItem } from '../types';
import { X, ArrowUpRight, Check, Github, ExternalLink } from 'lucide-react';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-study-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white border border-neutral-200 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Minimal Bar */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-neutral-200 bg-[#FAFAFA]">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#B89047]">
              CASE STUDY // {project.categoryLabel}
            </span>
            <span className="w-1 h-1 rounded-full bg-neutral-300" />
            <span className="text-[11px] font-mono text-neutral-400">
              {project.period}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-[#111111] hover:bg-neutral-100 transition-colors focus:outline-none"
            aria-label="Close Case Study"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Editorial Content */}
        <div className="overflow-y-auto p-8 sm:p-12 space-y-12 text-[#111111]">
          {/* Header */}
          <div className="space-y-3 pb-8 border-b border-neutral-100">
            <h1 id="case-study-title" className="font-serif-editorial text-4xl sm:text-5xl font-normal text-[#111111]">
              {project.title}
            </h1>
            <p className="text-base sm:text-lg text-neutral-600 font-light max-w-2xl">
              {project.subtitle}
            </p>
          </div>

          {/* Quick Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 border border-neutral-200 bg-[#FAFAFA] text-xs font-mono">
            <div>
              <span className="text-neutral-400 uppercase tracking-wider block mb-1">CATEGORY</span>
              <span className="text-[#111111] font-semibold">{project.categoryLabel}</span>
            </div>
            <div>
              <span className="text-neutral-400 uppercase tracking-wider block mb-1">TIMELINE</span>
              <span className="text-[#111111] font-semibold">{project.period}</span>
            </div>
            <div>
              <span className="text-neutral-400 uppercase tracking-wider block mb-1">STATUS</span>
              <span className="text-[#B89047] font-semibold">{project.statusBadge}</span>
            </div>
            <div>
              <span className="text-neutral-400 uppercase tracking-wider block mb-1">ROLE</span>
              <span className="text-[#111111] font-semibold">Lead Developer</span>
            </div>
          </div>

          {/* Problem & Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#B89047] block">
                01 // THE PROBLEM
              </span>
              <h3 className="font-serif-editorial text-2xl text-[#111111]">
                Context & Operational Bottleneck
              </h3>
              <p className="text-sm text-neutral-600 font-light leading-relaxed">
                {project.problemSolved}
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#B89047] block">
                02 // THE SOLUTION
              </span>
              <h3 className="font-serif-editorial text-2xl text-[#111111]">
                Engineered System Design
              </h3>
              <p className="text-sm text-neutral-600 font-light leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Technical Architecture & Implementation */}
          <div className="space-y-4 pt-6 border-t border-neutral-100">
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#B89047] block">
              03 // TECHNICAL ARCHITECTURE
            </span>
            <h3 className="font-serif-editorial text-2xl text-[#111111]">
              System Implementation & Request Lifecycle
            </h3>
            <p className="text-sm text-neutral-600 font-mono leading-relaxed bg-[#FAFAFA] p-5 border border-neutral-200">
              {project.architectureDetails}
            </p>
          </div>

          {/* Personal Role & Contributions */}
          <div className="space-y-4 pt-6 border-t border-neutral-100">
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#B89047] block">
              04 // MY ROLE & DIRECT CONTRIBUTIONS
            </span>
            <h3 className="font-serif-editorial text-2xl text-[#111111]">
              Core Engineering Responsibilities
            </h3>
            <div className="space-y-3">
              {project.contributions.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-neutral-700 font-light">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B89047] mt-2 shrink-0" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="space-y-4 pt-6 border-t border-neutral-100">
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#B89047] block">
              05 // KEY SYSTEM FEATURES
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-neutral-200 bg-white flex items-start gap-2.5 text-xs text-neutral-700"
                >
                  <Check className="w-3.5 h-3.5 text-[#B89047] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technologies Used */}
          <div className="space-y-3 pt-6 border-t border-neutral-100">
            <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#B89047] block">
              06 // TECHNOLOGIES & TOOLS
            </span>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 text-xs font-mono text-neutral-800 border border-neutral-300 bg-[#FAFAFA]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-8 border-t border-neutral-200 flex flex-wrap items-center gap-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold tracking-[0.2em] uppercase bg-[#111111] text-white hover:bg-[#B89047] transition-all"
              >
                <span>VISIT LIVE PLATFORM</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold tracking-[0.2em] uppercase border border-neutral-300 text-neutral-800 hover:border-[#B89047] hover:text-[#111111] transition-all"
              >
                <Github className="w-3.5 h-3.5 text-[#B89047]" />
                <span>INSPECT REPOSITORY</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
              </a>
            ) : (
              <span className="text-xs font-mono text-neutral-400">
                SOURCE LINK COMING SOON
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
