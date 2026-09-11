import React from 'react';
import { usePortfolio } from '../hooks/usePortfolio';
import { EDUCATION as FALLBACK_EDUCATION, CERTIFICATIONS as FALLBACK_CERTIFICATIONS } from '../data/portfolioData';
import { Check, GraduationCap, Award, BookOpen, ArrowUpRight } from 'lucide-react';
import { PageView } from '../types';

interface AboutViewProps {
  onNavigate: (view: PageView) => void;
  onOpenResume: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate, onOpenResume }) => {
  const { education, certifications, about, profile } = usePortfolio();
  const activeEducation = education && education.degree ? education : FALLBACK_EDUCATION;
  const activeCerts = certifications && certifications.length > 0 ? certifications : FALLBACK_CERTIFICATIONS;

  return (
    <div className="w-full pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-20 pb-8 border-b border-neutral-200">
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#B89047] block mb-3">
            ABOUT // BACKGROUND & PERSPECTIVE
          </span>
          <h1 className="font-serif-editorial text-4xl sm:text-6xl md:text-7xl font-normal text-[#111111] tracking-tight">
            {about?.heading || 'Who I Am & What I Build'}
          </h1>
          <p className="text-base sm:text-lg text-neutral-500 font-light mt-4 max-w-2xl leading-relaxed">
            {about?.subheading ||
              'A disciplined Computer Science Engineer focused on building robust full-stack software, automated data pipelines, and intelligent AI-augmented digital products.'}
          </p>
        </div>

        {/* 1. WHO I AM — Editorial Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 mb-28">
          <div className="lg:col-span-4 space-y-6">
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-neutral-400 block">
              01 // PROFESSIONAL IDENTITY
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl text-[#111111] leading-snug">
              Bridging engineering precision with analytical clarity.
            </h2>
            <div className="p-6 border border-neutral-200 bg-white space-y-3">
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                CURRENT STANDING
              </div>
              <p className="text-sm font-medium text-[#111111]">
                {activeEducation.degree}
              </p>
              <p className="text-xs text-neutral-500 font-mono">
                {activeEducation.institution} • CGPA {activeEducation.cgpa}
              </p>
              <div className="pt-2">
                <span className="inline-block px-2.5 py-0.5 text-[10px] font-mono text-[#B89047] border border-[#B89047]/40 bg-[#B89047]/5">
                  IMMEDIATE JOINER • {profile?.location || 'BENGALURU'}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6 text-neutral-600 text-sm sm:text-base leading-relaxed font-light">
            <p className="text-lg sm:text-xl font-serif-editorial text-[#111111] leading-relaxed">
              {about?.narrativeP1 ||
                'I view software engineering not as an isolated discipline of code writing, but as a systematic methodology to eliminate friction in human work and business operations.'}
            </p>
            <p>
              {about?.narrativeP2 ||
                'During my academic tenure at Cambridge Institute of Technology and across industry internships, I observed that the greatest leverage occurs when developers understand both the full-stack architecture of user interfaces and the underlying data lifecycle—from ingestion and relational modeling to executive reporting.'}
            </p>
            <p>
              {about?.narrativeP3 ||
                'At 1Stop.ai, I engineered backend request pipelines, structured MySQL schemas, and implemented administrative CRUD workflows that prioritized reliable session management. At MindMatrix, I translated interface specifications into native Android views while integrating Generative AI tooling into developer velocity workflows.'}
            </p>
            <p>
              Whether deploying web platforms like <em>Skinmatics</em>, engineering cloud-based file management systems with <em>CloudVault</em>, or modeling workforce analytics in Power BI and automated Excel dashboards, I build with restraint, modularity, and relentless attention to architectural detail.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-6">
              <button
                onClick={onOpenResume}
                className="px-6 py-3 text-xs font-semibold tracking-[0.2em] uppercase border border-[#B89047] text-[#111111] hover:bg-[#B89047] hover:text-white transition-all"
              >
                VIEW FULL RESUME DOCUMENT
              </button>
              <button
                onClick={() => onNavigate('work')}
                className="text-xs font-semibold tracking-[0.18em] uppercase text-neutral-600 hover:text-[#B89047] transition-colors"
              >
                SEE PRODUCTION WORK →
              </button>
            </div>
          </div>
        </div>

        {/* 2. WHAT I DO — Three Major Pillars */}
        <div className="mb-28 pt-16 border-t border-neutral-200">
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#B89047] block mb-4">
            02 // THE THREE PILLARS
          </span>
          <h2 className="font-serif-editorial text-3xl sm:text-5xl text-[#111111] mb-14">
            Areas of Technical Mastery
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Software Engineering */}
            <div className="p-8 border border-neutral-200 bg-white hover:border-[#B89047] transition-all flex flex-col justify-between min-h-[360px] group">
              <div>
                <span className="font-serif-editorial text-3xl text-[#B89047] block mb-6">
                  01
                </span>
                <h3 className="font-serif-editorial text-2xl text-[#111111] mb-3 group-hover:text-[#B89047] transition-colors">
                  SOFTWARE ENGINEERING
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light mb-6">
                  Full-stack web applications, REST APIs, databases, authentication, and cloud deployment pipelines.
                </p>
                <div className="space-y-2 border-t border-neutral-100 pt-4 text-xs text-neutral-500 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#B89047]" />
                    <span>React.js, Node.js, Express.js</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#B89047]" />
                    <span>MongoDB, MySQL, CRUD Systems</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#B89047]" />
                    <span>REST Endpoints & Security</span>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-neutral-100 text-[11px] font-mono text-neutral-400">
                PROVEN IN: SKINMATICS, CLOUDVAULT, 1STOP.AI
              </div>
            </div>

            {/* Pillar 2: Data & Analytics */}
            <div className="p-8 border border-neutral-200 bg-white hover:border-[#B89047] transition-all flex flex-col justify-between min-h-[360px] group">
              <div>
                <span className="font-serif-editorial text-3xl text-[#B89047] block mb-6">
                  02
                </span>
                <h3 className="font-serif-editorial text-2xl text-[#111111] mb-3 group-hover:text-[#B89047] transition-colors">
                  DATA & ANALYTICS
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light mb-6">
                  SQL data modeling, Advanced Excel formulas, Power BI dashboards, DAX measures, and business intelligence reporting.
                </p>
                <div className="space-y-2 border-t border-neutral-100 pt-4 text-xs text-neutral-500 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#B89047]" />
                    <span>Power BI Desktop & Power Query</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#B89047]" />
                    <span>DAX Calculations & Star Schemas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#B89047]" />
                    <span>Advanced Excel (XLOOKUP, Pivot)</span>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-neutral-100 text-[11px] font-mono text-neutral-400">
                PROVEN IN: HR ANALYTICS & DELOITTE SIMULATION
              </div>
            </div>

            {/* Pillar 3: AI Integration */}
            <div className="p-8 border border-neutral-200 bg-white hover:border-[#B89047] transition-all flex flex-col justify-between min-h-[360px] group">
              <div>
                <span className="font-serif-editorial text-3xl text-[#B89047] block mb-6">
                  03
                </span>
                <h3 className="font-serif-editorial text-2xl text-[#111111] mb-3 group-hover:text-[#B89047] transition-colors">
                  AI INTEGRATION
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-light mb-6">
                  Google Gemini API, conversational workflows, prompt engineering, and GenAI-assisted developer velocity workflows.
                </p>
                <div className="space-y-2 border-t border-neutral-100 pt-4 text-xs text-neutral-500 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#B89047]" />
                    <span>Google GenAI SDK Integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#B89047]" />
                    <span>Contextual Prompt Engineering</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#B89047]" />
                    <span>AI-Accelerated Mobile Sprints</span>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-neutral-100 text-[11px] font-mono text-neutral-400">
                PROVEN IN: MINDMATRIX & ANTHROPIC CLAUDE 101
              </div>
            </div>
          </div>
        </div>

        {/* 3. ACADEMIC FOUNDATION & VERIFIED CERTIFICATIONS */}
        <div className="pt-16 border-t border-neutral-200">
          <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#B89047] block mb-4">
            03 // ACADEMIC & VERIFIED CREDENTIALS
          </span>
          <h2 className="font-serif-editorial text-3xl sm:text-4xl text-[#111111] mb-12">
            Formal Credentials & Verification
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* University Degree */}
            <div className="lg:col-span-5 p-8 border border-neutral-200 bg-white">
              <div className="w-10 h-10 border border-[#B89047]/50 flex items-center justify-center text-[#B89047] mb-6">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono text-neutral-400">{activeEducation.period}</span>
              <h3 className="font-serif-editorial text-2xl text-[#111111] mt-2 mb-1">
                {activeEducation.degree}
              </h3>
              <p className="text-sm font-medium text-neutral-700">
                {activeEducation.institution}, {activeEducation.location}
              </p>

              <div className="my-6 p-4 border border-neutral-100 bg-[#FAFAFA] flex items-center justify-between">
                <div>
                  <span className="text-xs text-neutral-500 font-mono block">CUMULATIVE GPA</span>
                  <span className="text-xs text-neutral-400 font-mono">Class of 2026</span>
                </div>
                <div className="text-2xl font-serif-editorial text-[#B89047] font-semibold">
                  {activeEducation.cgpa}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                  KEY COURSEWORK
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(activeEducation.coursework || []).map((course) => (
                    <span
                      key={course}
                      className="text-[11px] font-mono text-neutral-600 px-2 py-0.5 border border-neutral-200 bg-white"
                    >
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-neutral-100 flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-[#B89047]" />
                <span className="text-xs text-neutral-600 font-mono">
                  Solved 90+ DSA problems on LeetCode & GeeksforGeeks
                </span>
              </div>
            </div>

            {/* Verified Certifications */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-neutral-400 block mb-2">
                VERIFIED CREDENTIALS ({activeCerts.length})
              </span>

              {activeCerts.map((cert) => (
                <div
                  key={cert.id}
                  className="p-6 border border-neutral-200 bg-white hover:border-[#B89047] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1">
                    <h4 className="font-serif-editorial text-xl text-[#111111]">
                      {cert.name}
                    </h4>
                    <span className="text-[11px] font-mono text-[#B89047] tracking-wider uppercase">
                      {cert.issuer}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed mt-2">
                    {cert.description}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-neutral-600">
                    <Check className="w-3.5 h-3.5 text-[#B89047]" />
                    <span>Verified Completion • {cert.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
