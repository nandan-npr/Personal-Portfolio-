import React, { useState } from 'react';
import { PageView, ProjectItem } from '../types';
import { PERSONAL_INFO, PROJECTS } from '../data/portfolioData';
import { usePortfolio } from '../hooks/usePortfolio';
import { ArrowDown, ArrowUpRight, ArrowRight, Mail } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeViewProps {
  onNavigate: (view: PageView) => void;
  onSelectProject: (project: ProjectItem) => void;
  onOpenResume?: () => void;
  onOpenContact?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onSelectProject,
  onOpenResume,
  onOpenContact,
}) => {
  const { profile, homepage, projects } = usePortfolio();

  // Highlight featured projects for the cinematic preview
  const featuredProjects = (projects && projects.length > 0)
    ? projects.filter((p) => p.isFeatured).slice(0, 2)
    : PROJECTS.slice(0, 2);

  // Subtle hero coordinate micro-interaction
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x: x * 8, y: y * 6 });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  const scrollToWhoIAm = () => {
    const el = document.getElementById('who-i-am');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const heroAvailability = homepage?.availabilityLabel || profile?.availabilityText || `${profile?.availability || PERSONAL_INFO.availability} • ${profile?.location || PERSONAL_INFO.location}`.toUpperCase();
  const heroName = homepage?.heroName || profile?.name || PERSONAL_INFO.name;
  const primaryTitle = profile?.primaryTitle || PERSONAL_INFO.primaryTitle;
  const secondaryTitle = profile?.secondaryTitle || PERSONAL_INFO.secondaryTitle;
  const heroTagline = homepage?.heroDescription || "Building intelligent digital products, full-stack systems, and data-driven solutions.";
  const candidateBio = profile?.shortBio || PERSONAL_INFO.shortBio;

  return (
    <div className="w-full">
      {/* 1. HERO — Clean, Centered Layout with Balanced Spacing & Timed Sequence */}
      <section
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-[82vh] flex flex-col items-center justify-center text-center px-6 sm:px-8 lg:px-12 pt-24 sm:pt-28 pb-10 overflow-hidden"
      >
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          {/* Step 3: Availability / Status Label */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 border border-neutral-200/90 bg-white/80 text-[10px] sm:text-[11px] font-mono tracking-[0.22em] uppercase text-neutral-600"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{heroAvailability}</span>
          </motion.div>

          {/* Step 4: Large Name with subtle micro-offset tracking */}
          <motion.div
            style={{
              transform: `translate3d(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px, 0)`,
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif-editorial text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-[#111111] tracking-tight leading-[1.05]"
            >
              {heroName}
            </motion.h1>
          </motion.div>

          {/* Step 5: Professional Title with subtle gold accent line */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-4 pt-1"
          >
            <span className="hidden sm:block w-8 h-[1px] bg-[#B89047]/50" />
            <p className="text-sm sm:text-base md:text-lg font-medium tracking-[0.2em] uppercase text-neutral-600">
              {primaryTitle} <span className="text-[#B89047]">/</span> {secondaryTitle}
            </p>
            <span className="hidden sm:block w-8 h-[1px] bg-[#B89047]/50" />
          </motion.div>

          {/* Step 6: Short Statement */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl text-neutral-600 font-light max-w-2xl mx-auto leading-relaxed pt-1"
          >
            {heroTagline}
          </motion.p>

          {/* Step 7: Primary Action Buttons: EMAIL ME & RESUME */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="pt-2 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              id="hero-email-me-btn"
              type="button"
              onClick={onOpenContact || (() => onNavigate('contact'))}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold tracking-[0.18em] uppercase bg-[#111111] text-white hover:bg-[#B89047] transition-all duration-200 shadow-xs cursor-pointer active:scale-[0.99]"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>EMAIL ME</span>
            </button>

            {onOpenResume && (
              <button
                id="hero-view-resume-btn"
                type="button"
                onClick={onOpenResume}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold tracking-[0.18em] uppercase border border-neutral-300 text-neutral-800 hover:border-[#B89047] hover:text-[#111111] transition-all duration-200 bg-white shadow-xs cursor-pointer active:scale-[0.99]"
              >
                <span>VIEW RESUME</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#B89047]" />
              </button>
            )}
          </motion.div>
        </div>

        {/* Step 8: Scroll Indicator — Subtle, Calm, Non-bouncing */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85, ease: 'easeOut' }}
          className="mt-8 sm:mt-12 flex flex-col items-center gap-2 pb-2 relative z-10"
        >
          <button
            onClick={scrollToWhoIAm}
            className="group flex flex-col items-center gap-2 text-[11px] font-mono tracking-[0.25em] uppercase text-neutral-400 hover:text-[#111111] transition-colors focus:outline-none cursor-pointer"
          >
            <span>SCROLL TO EXPLORE</span>
            <div className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center group-hover:border-[#B89047] transition-colors">
              <ArrowDown className="w-3 h-3 text-neutral-500 group-hover:text-[#B89047] transition-transform duration-300 group-hover:translate-y-0.5" />
            </div>
          </button>
        </motion.div>
      </section>

      {/* 2. "WHO I AM" — Large Editorial Statement with Abundant Whitespace */}
      <section id="who-i-am" className="py-28 sm:py-36 border-t border-neutral-200/80 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#B89047] block mb-6">
            01 // CORE PERSPECTIVE
          </span>

          <h2 className="font-serif-editorial text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#111111] leading-[1.15] max-w-5xl tracking-tight">
            I BUILD. I ANALYZE. <span className="italic font-normal text-[#B89047]">I SOLVE.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-16 mt-16 sm:mt-24 pt-12 border-t border-neutral-200/80">
            <div className="md:col-span-5">
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-neutral-400 block mb-3">
                CANDIDATE PROFILE
              </span>
              <p className="text-xl sm:text-2xl font-serif-editorial text-[#111111] leading-snug">
                {candidateBio}
              </p>
            </div>

            <div className="md:col-span-7 space-y-6 text-neutral-600 text-sm sm:text-base leading-relaxed font-light">
              <p>
                My work centers at the convergence of resilient full-stack web applications, clean backend architecture, and high-impact data analytics. I do not merely write code—I design complete end-to-end systems that eliminate operational bottlenecks, clarify business metrics, and enhance user agency.
              </p>
              <p>
                With hands-on internship experience across backend system engineering at 1Stop.ai and mobile generative-AI workflows at MindMatrix, I bring a methodical, production-first approach to every codebase.
              </p>

              <div className="pt-6 flex flex-wrap items-center gap-6">
                <button
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#111111] hover:text-[#B89047] transition-colors group"
                >
                  <span>READ FULL ABOUT & CREDENTIALS</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#B89047]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SELECTED WORK PREVIEW — Editorial Framing */}
      <section className="py-24 sm:py-32 border-t border-neutral-200/80 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4 pb-6 border-b border-neutral-200">
            <div>
              <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#B89047] block mb-2">
                02 // SELECTED CREATIONS
              </span>
              <h3 className="font-serif-editorial text-3xl sm:text-4xl text-[#111111]">
                Featured Systems & Platforms
              </h3>
            </div>
            <button
              onClick={() => onNavigate('work')}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#111111] hover:text-[#B89047] transition-colors group self-start sm:self-auto"
            >
              <span>EXPLORE ALL 5 PROJECTS</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#B89047]" />
            </button>
          </div>

          <div className="space-y-24">
            {featuredProjects.map((project, idx) => (
              <article
                key={project.id}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center"
              >
                {/* Visual Canvas / Architectural Framing */}
                <div
                  onClick={() => onSelectProject(project)}
                  className="lg:col-span-7 cursor-pointer overflow-hidden border border-neutral-200/80 bg-white p-8 sm:p-12 hover:border-[#B89047] transition-all duration-300 relative group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex items-center justify-between pb-8 border-b border-neutral-100 text-[11px] font-mono text-neutral-400">
                    <span className="text-[#B89047] tracking-[0.2em] uppercase">{project.categoryLabel}</span>
                    <span>{project.period}</span>
                  </div>

                  <div className="py-12 sm:py-16 text-center">
                    <span className="font-serif-editorial text-3xl sm:text-5xl font-light text-[#111111] group-hover:text-[#B89047] transition-colors">
                      {project.title}
                    </span>
                    <p className="text-xs sm:text-sm text-neutral-500 font-mono mt-3 max-w-md mx-auto">
                      {project.subtitle}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-neutral-100 flex flex-wrap gap-2 justify-center">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono text-neutral-600 px-2 py-0.5 bg-neutral-50 border border-neutral-200/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Subtle Gold line on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B89047] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>

                {/* Editorial Content */}
                <div className="lg:col-span-5 space-y-5">
                  <span className="font-serif-editorial text-3xl text-[#B89047] font-light">
                    0{idx + 1}
                  </span>

                  <h4 className="font-serif-editorial text-2xl sm:text-3xl text-[#111111]">
                    {project.title}
                  </h4>

                  <p className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                    THE PROBLEM
                  </p>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {project.problemSolved}
                  </p>

                  <div className="pt-4 flex items-center gap-4">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-[0.16em] uppercase bg-[#111111] text-white hover:bg-[#B89047] transition-colors focus:outline-none"
                    >
                      <span>VIEW CASE STUDY</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold tracking-[0.16em] uppercase text-neutral-500 hover:text-[#111111] transition-colors px-2 py-2"
                      >
                        <span>SOURCE</span>
                        <ArrowUpRight className="w-3 h-3 text-[#B89047]" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EXECUTIVE DIRECTORY — Architectural Navigation Tiles */}
      <section className="py-24 border-t border-neutral-200/80 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#B89047] block mb-3">
            03 // INDEX & EXPLORATION
          </span>
          <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#111111] mb-12">
            Explore Dedicated Disciplines
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                num: '01',
                title: 'WORK',
                desc: 'Five case studies across web systems, AI, and business intelligence.',
                view: 'work' as PageView,
              },
              {
                num: '02',
                title: 'EXPERIENCE',
                desc: 'Verified internships at 1Stop.ai, MindMatrix, and leadership history.',
                view: 'experience' as PageView,
              },
              {
                num: '03',
                title: 'SKILLS',
                desc: 'Technical map with verified project evidence and zero fake percentages.',
                view: 'skills' as PageView,
              },
              {
                num: '04',
                title: 'CONTACT',
                desc: 'Direct communication channels, verified LinkedIn, GitHub, and email.',
                view: 'contact' as PageView,
              },
            ].map((card) => (
              <button
                key={card.num}
                onClick={() => onNavigate(card.view)}
                className="group text-left p-8 border border-neutral-200/80 bg-[#FAFAFA] hover:bg-white hover:border-[#B89047] transition-all duration-300 flex flex-col justify-between min-h-[220px] focus:outline-none"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-mono text-[#B89047]">{card.num}</span>
                  <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-[#B89047] transition-colors" />
                </div>

                <div>
                  <h4 className="font-serif-editorial text-2xl text-[#111111] mb-2 group-hover:text-[#B89047] transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
