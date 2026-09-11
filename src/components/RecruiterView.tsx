import React, { useState } from 'react';
import { PageView, ProjectItem } from '../types';
import { PERSONAL_INFO, PROJECTS, CERTIFICATIONS as FALLBACK_CERTIFICATIONS } from '../data/portfolioData';
import { usePortfolio } from '../hooks/usePortfolio';
import {
  Download,
  Eye,
  Mail,
  Linkedin,
  Github,
  Check,
  Copy,
  ArrowUpRight,
  Sparkles,
  Award,
  GraduationCap,
  Briefcase,
  Layers,
  Code2,
  Database,
  Cpu,
} from 'lucide-react';
import { copyTextToClipboard } from '../utils/contactUtils';

interface RecruiterViewProps {
  onNavigate: (view: PageView) => void;
  onOpenResume: () => void;
  onOpenContact: (subject?: string) => void;
  onSelectProject: (project: ProjectItem) => void;
}

export const RecruiterView: React.FC<RecruiterViewProps> = ({
  onNavigate,
  onOpenResume,
  onOpenContact,
  onSelectProject,
}) => {
  const { profile, projects, education, certifications, resumeInfo, recruiter } = usePortfolio();
  const allProjects = projects && projects.length > 0 ? projects : PROJECTS;
  const activeEducation = education && education.degree ? education : {
    degree: 'B.E. Computer Science & Engineering',
    institution: 'Cambridge Institute of Technology',
    location: 'Bengaluru',
    period: '2022 – 2026',
    cgpa: profile?.cgpa || '8.0 / 10.0',
    coursework: ['Data Structures', 'DBMS', 'Web Architecture', 'Operating Systems'],
  };
  const activeCerts = certifications && certifications.length > 0 ? certifications : FALLBACK_CERTIFICATIONS;
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Filter top flagship projects from new resume: Skinmatics, CloudVault
  const flagshipProjects = [
    allProjects.find((p) => p.id === 'skinmatics'),
    allProjects.find((p) => p.id === 'cloudvault'),
  ].filter(Boolean) as ProjectItem[];

  // Compact BI projects: Sales Dashboard, HR Analytics Dashboard
  const dataBiProjects = allProjects.filter((p) => p.category === 'data-bi');

  const contactEmail = profile?.email || PERSONAL_INFO.email;

  const handleCopyEmail = async () => {
    const ok = await copyTextToClipboard(contactEmail);
    if (ok) {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const handleDownloadResume = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);

    const downloadUrl = resumeInfo?.fileUrl || '/resume.pdf';
    const downloadFileName = resumeInfo?.fileName || 'Nandan_Pruthvi_Raj_Resume.pdf';

    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // Direct browser download fallback
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = downloadFileName;
      link.target = '_blank';
      link.click();
    }
  };

  return (
    <div className="w-full bg-[#FAFAFA] text-[#111111] pt-24 pb-28">
      {/* 1. TOP EXECUTIVE HEADER & HERO */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 pt-8 pb-14 border-b border-neutral-200/80">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-neutral-200 text-[#B89047] text-[10px] font-mono tracking-[0.25em] uppercase mb-4 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B89047]" />
              <span>EXECUTIVE RECRUITER BRIEF // 60-SEC SCAN</span>
            </div>

            <h1 className="font-serif-editorial text-4xl sm:text-5xl md:text-6xl font-normal text-[#111111] tracking-tight leading-[1.08]">
              NANDAN PRUTHVI RAJ R
            </h1>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <p className="text-sm sm:text-base font-medium tracking-[0.18em] uppercase text-neutral-700">
                Software Engineer <span className="text-[#B89047]">/</span> Data Analyst
              </p>
              <span className="text-neutral-300">•</span>
              <span className="text-xs font-mono text-neutral-500">
                Bengaluru, India
              </span>
            </div>
          </div>

          {/* Availability Status Badge */}
          <div className="self-start sm:self-auto p-4 bg-white border border-neutral-200/90 shadow-2xs min-w-[240px]">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 block mb-1">
              CURRENT STATUS
            </span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs font-semibold text-[#111111] tracking-wide">
                Available / Immediate Joiner
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1 font-light">
              Open for full-time Software Engineer & Data Analyst roles.
            </p>
          </div>
        </div>

        {/* Concise Professional Statement */}
        <div className="bg-white p-6 sm:p-8 border border-neutral-200/80 shadow-2xs space-y-4">
          <p className="text-base sm:text-lg text-neutral-800 font-light leading-relaxed">
            Computer Science Engineering graduate from{' '}
            <strong className="font-medium text-[#111111]">Cambridge Institute of Technology (CGPA 8.0/10)</strong>{' '}
            synthesizing robust full-stack software development with quantitative data modeling. Experienced in building
            production-ready REST APIs, relational databases, AI integrations with Google Gemini, and interactive analytics
            dashboards. Proven track record across backend systems (<strong className="font-medium text-[#111111]">1Stop.ai</strong>),
            Android development workflows (<strong className="font-medium text-[#111111]">MindMatrix</strong>), and 90+ algorithmic
            problems solved on LeetCode & GeeksforGeeks.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-neutral-100 text-xs font-mono">
            <div>
              <span className="text-neutral-400 block text-[10px]">EDUCATION</span>
              <span className="text-[#111111] font-medium">B.E. CSE (2022–2026)</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px]">ACADEMIC CGPA</span>
              <span className="text-[#B89047] font-semibold">8.0 / 10.0</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px]">DSA PROBLEMS</span>
              <span className="text-[#111111] font-medium">90+ Solved</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[10px]">PRIMARY STACK</span>
              <span className="text-[#111111] font-medium">React • Node • SQL • Python</span>
            </div>
          </div>
        </div>

        {/* Highly Visible Recruiter Actions Bar (Top Cluster) */}
        <div className="pt-8">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-400 block mb-3">
            DIRECT CANDIDATE ACTIONS
          </span>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="recruiter-view-resume-top"
              type="button"
              onClick={onOpenResume}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold tracking-[0.18em] uppercase bg-[#111111] text-white hover:bg-[#B89047] transition-all duration-200 cursor-pointer shadow-xs"
            >
              <Eye className="w-3.5 h-3.5 text-[#B89047]" />
              <span>VIEW RESUME</span>
            </button>

            <button
              id="recruiter-download-resume-top"
              type="button"
              onClick={handleDownloadResume}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold tracking-[0.18em] uppercase border border-neutral-300 bg-white text-[#111111] hover:border-[#B89047] hover:text-[#B89047] transition-all duration-200 cursor-pointer shadow-xs"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">DOWNLOADING...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-[#B89047]" />
                  <span>DOWNLOAD RESUME (PDF)</span>
                </>
              )}
            </button>

            <button
              id="recruiter-contact-me-top"
              type="button"
              onClick={() => onOpenContact('Recruiter Interview / Candidate Inquiry')}
              className="inline-flex items-center gap-2 px-5 py-3 text-xs font-semibold tracking-[0.18em] uppercase bg-[#B89047] text-white hover:bg-[#9E7835] transition-all duration-200 cursor-pointer shadow-xs"
            >
              <Mail className="w-3.5 h-3.5 text-white" />
              <span>CONTACT ME</span>
            </button>

            <a
              id="recruiter-linkedin-top"
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-mono uppercase border border-neutral-300 bg-white text-neutral-700 hover:text-[#111111] hover:border-[#111111] transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
              <span>LINKEDIN</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-400" />
            </a>

            <a
              id="recruiter-github-top"
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-mono uppercase border border-neutral-300 bg-white text-neutral-700 hover:text-[#111111] hover:border-[#111111] transition-colors"
            >
              <Github className="w-3.5 h-3.5 text-[#111111]" />
              <span>GITHUB</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-400" />
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-1.5 px-3 py-3 text-xs font-mono text-neutral-500 hover:text-[#111111] transition-colors"
              title="Copy Email Address"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="hidden sm:inline">{PERSONAL_INFO.email}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 2. CORE CAPABILITIES (Grouped, Zero Fake Percentages) */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-16 border-b border-neutral-200/80">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#B89047] block mb-1">
              01 // TECHNICAL MAP
            </span>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl text-[#111111]">
              Core Capabilities & Technologies
            </h2>
          </div>
          <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">
            Verified Production Skills
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Software Engineering */}
          <div className="bg-white p-6 border border-neutral-200/80 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-neutral-400 mb-3">
                <Code2 className="w-4 h-4 text-[#B89047]" />
                <span className="text-[11px] font-mono tracking-[0.2em] uppercase font-semibold text-[#111111]">
                  SOFTWARE ENGINEERING
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-light mb-4 leading-relaxed">
                Full-stack web architecture, server REST APIs, modular component engineering, and cloud deployment.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'React.js',
                  'Node.js',
                  'Express.js',
                  'JavaScript (ES6+)',
                  'REST APIs',
                  'MongoDB',
                  'SQL / MySQL',
                  'Tailwind CSS',
                  'HTML5 / CSS3',
                  'Git & GitHub',
                  'Render / Netlify',
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-[11px] font-mono bg-[#FAFAFA] border border-neutral-200 text-neutral-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-neutral-100 text-[11px] font-mono text-neutral-400">
              Evidence: Skinmatics • CloudVault
            </div>
          </div>

          {/* Data & Analytics */}
          <div className="bg-white p-6 border border-neutral-200/80 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-neutral-400 mb-3">
                <Database className="w-4 h-4 text-[#B89047]" />
                <span className="text-[11px] font-mono tracking-[0.2em] uppercase font-semibold text-[#111111]">
                  DATA & ANALYTICS
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-light mb-4 leading-relaxed">
                Quantitative business intelligence, relational schema queries, automated ETL pipelines, and executive dashboards.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Python (Analytics)',
                  'SQL Joins & CRUD',
                  'Power BI Desktop',
                  'Power Query ETL',
                  'DAX Measures',
                  'Data Modeling',
                  'MS Excel / Sheets',
                  'Relational DBMS',
                  'KPI Scorecards',
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-[11px] font-mono bg-[#FAFAFA] border border-neutral-200 text-neutral-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-neutral-100 text-[11px] font-mono text-neutral-400">
              Evidence: HR Analytics • Sales Dashboard • Deloitte Simulation
            </div>
          </div>

          {/* AI & Systems */}
          <div className="bg-white p-6 border border-neutral-200/80 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-neutral-400 mb-3">
                <Cpu className="w-4 h-4 text-[#B89047]" />
                <span className="text-[11px] font-mono tracking-[0.2em] uppercase font-semibold text-[#111111]">
                  AI & SYSTEMS
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-light mb-4 leading-relaxed">
                Generative AI SDK integrations, algorithmic problem solving, object-oriented design, and mobile workflows.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Google Gemini API',
                  'Generative AI Workflows',
                  'Android Studio',
                  'DSA (90+ LeetCode/GFG)',
                  'OOP Principles',
                  'Postman API Testing',
                  'Agile Sprint Tracking',
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-[11px] font-mono bg-[#FAFAFA] border border-neutral-200 text-neutral-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-neutral-100 text-[11px] font-mono text-neutral-400">
              Evidence: MindMatrix Intern • Claude 101 • HackerRank SWE
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXPERIENCE (Verified Internships with Concise Bullet Points) */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-16 border-b border-neutral-200/80">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#B89047] block mb-1">
              02 // PROFESSIONAL HISTORY
            </span>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl text-[#111111]">
              Verified Industry Experience
            </h2>
          </div>
          <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">
            Engineering & Technical Operations
          </span>
        </div>

        <div className="space-y-6">
          {/* MindMatrix Organisation */}
          <div className="bg-white p-6 sm:p-8 border border-neutral-200/80 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-4 border-b border-neutral-100">
              <div>
                <h3 className="font-serif-editorial text-2xl text-[#111111]">
                  MindMatrix Organisation
                </h3>
                <p className="text-xs font-mono font-semibold tracking-wider text-[#B89047] uppercase mt-0.5">
                  Android App Development Intern
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs font-mono text-neutral-500">
                  Feb 2026 – May 2026
                </span>
                <span className="block text-[11px] font-mono text-neutral-400">
                  Remote Engineering Team
                </span>
              </div>
            </div>

            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B89047] mt-1.5 shrink-0" />
                <span>
                  Engineered native Android application screens, navigation hierarchies, and interactive input forms utilizing <strong className="font-medium text-neutral-900">Android Studio</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B89047] mt-1.5 shrink-0" />
                <span>
                  Integrated <strong className="font-medium text-neutral-900">Generative AI developer tools</strong> directly into mobile engineering workflows for prompt requirement analysis, UI code refinement, and automated test-case generation.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B89047] mt-1.5 shrink-0" />
                <span>
                  Maintained structured sprint tracking datasets, milestone documentation, and organized team velocity updates for remote collaboration.
                </span>
              </li>
            </ul>

            <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-wrap gap-2 items-center text-[11px] font-mono text-neutral-500">
              <span className="text-neutral-400">Technologies:</span>
              <span>Android Studio • Generative AI Workflows • Mobile UI • Git • Sprint Datasets</span>
            </div>
          </div>

          {/* 1Stop.ai */}
          <div className="bg-white p-6 sm:p-8 border border-neutral-200/80 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-4 border-b border-neutral-100">
              <div>
                <h3 className="font-serif-editorial text-2xl text-[#111111]">
                  1Stop.ai
                </h3>
                <p className="text-xs font-mono font-semibold tracking-wider text-[#B89047] uppercase mt-0.5">
                  Back-End Developer Intern
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs font-mono text-neutral-500">
                  Jun 2025 – Sep 2025
                </span>
                <span className="block text-[11px] font-mono text-neutral-400">
                  Bengaluru (Hybrid)
                </span>
              </div>
            </div>

            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B89047] mt-1.5 shrink-0" />
                <span>
                  Constructed backend modules utilizing relational <strong className="font-medium text-neutral-900">SQL databases (MySQL)</strong> and <strong className="font-medium text-neutral-900">Node.js/PHP</strong> to handle structured client requests and server-side logic.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B89047] mt-1.5 shrink-0" />
                <span>
                  Implemented reliable administrative CRUD endpoints, robust request validation pipelines, and session-based authentication mechanisms.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B89047] mt-1.5 shrink-0" />
                <span>
                  Optimized relational database queries to power administrative control panel operations, reducing query latency and eliminating record duplication.
                </span>
              </li>
            </ul>

            <div className="mt-4 pt-3 border-t border-neutral-100 flex flex-wrap gap-2 items-center text-[11px] font-mono text-neutral-500">
              <span className="text-neutral-400">Technologies:</span>
              <span>SQL / MySQL • Node.js • CRUD Operations • REST APIs • Data Validation</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SELECTED WORK (Top 3 Flagship Projects + Compact BI) */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-16 border-b border-neutral-200/80">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#B89047] block mb-1">
              03 // PORTFOLIO EVIDENCE
            </span>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl text-[#111111]">
              Selected Systems & Engineering Work
            </h2>
          </div>
          <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">
            Production Implementations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {flagshipProjects.map((project, index) => (
            <div
              key={project.id}
              className="bg-white p-6 border border-neutral-200/80 shadow-2xs flex flex-col justify-between hover:border-[#B89047] transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-[#B89047]">0{index + 1} // FLAGSHIP</span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 border border-neutral-200 text-neutral-500 bg-[#FAFAFA]">
                    {project.categoryLabel}
                  </span>
                </div>

                <h3 className="font-serif-editorial text-2xl text-[#111111] mb-1">
                  {project.title}
                </h3>
                <p className="text-xs text-[#B89047] font-mono mb-3">
                  {project.subtitle}
                </p>

                <p className="text-xs text-neutral-600 font-light leading-relaxed mb-4">
                  {project.solution}
                </p>

                <div className="pt-3 border-t border-neutral-100 mb-4">
                  <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1.5">
                    TECHNOLOGY STACK
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 text-[10px] font-mono bg-[#FAFAFA] border border-neutral-200 text-neutral-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onSelectProject(project)}
                  className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-[#111111] hover:text-[#B89047] transition-colors cursor-pointer"
                >
                  <span>VIEW CASE STUDY</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#B89047]" />
                </button>

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-neutral-400 hover:text-[#111111] transition-colors"
                  >
                    GitHub →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Compact Data & BI Projects Strip */}
        <div className="mt-6 bg-white p-5 sm:p-6 border border-neutral-200/80 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#B89047]">
                COMPACT DATA & BI PORTFOLIO
              </span>
              <h4 className="font-serif-editorial text-xl text-[#111111]">
                Business Intelligence & Financial Performance Dashboards
              </h4>
            </div>
            <button
              onClick={() => onNavigate('work')}
              className="self-start sm:self-auto text-xs font-mono text-neutral-600 hover:text-[#B89047] transition-colors inline-flex items-center gap-1"
            >
              <span>Explore All 5 Projects in Work View</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#B89047]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs font-sans text-neutral-600">
            <div>
              <strong className="text-neutral-900 font-medium font-mono text-xs block">
                1. HR Analytics Intelligence Dashboard
              </strong>
              <p className="text-neutral-500 font-light mt-0.5">
                Workforce attrition modeling using Power BI, Power Query pipelines, and custom DAX measures for retention trends.
              </p>
              <span className="text-[11px] font-mono text-[#B89047]">Power BI Desktop • DAX • Power Query</span>
            </div>
            <div>
              <strong className="text-neutral-900 font-medium font-mono text-xs block">
                2. Sales Performance & Profitability Suite
              </strong>
              <p className="text-neutral-500 font-light mt-0.5">
                Automated multi-parameter financial analysis model with dynamic revenue, margin %, and territory slicers.
              </p>
              <span className="text-[11px] font-mono text-[#B89047]">Excel Modeling • Financial Formulas • KPI Analytics</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EDUCATION & CREDENTIALS (Compact, Elegant) */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-16 border-b border-neutral-200/80">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Education */}
          <div className="md:col-span-6 bg-white p-6 sm:p-8 border border-neutral-200/80 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-neutral-400 mb-4">
                <GraduationCap className="w-4 h-4 text-[#B89047]" />
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#B89047]">
                  ACADEMIC FOUNDATION
                </span>
              </div>

              <h3 className="font-serif-editorial text-2xl text-[#111111] mb-1">
                {activeEducation.degree}
              </h3>
              <p className="text-xs font-mono text-neutral-600 mb-4">
                {activeEducation.institution}{activeEducation.location ? `, ${activeEducation.location}` : ''}
              </p>

              <div className="space-y-2 text-xs text-neutral-600 font-light">
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-100 font-mono text-xs">
                  <span className="text-neutral-500">Graduation Timeline:</span>
                  <span className="text-neutral-900 font-medium">{activeEducation.period}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-100 font-mono text-xs">
                  <span className="text-neutral-500">Cumulative GPA:</span>
                  <span className="text-[#B89047] font-semibold text-sm">{activeEducation.cgpa}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 font-mono text-xs">
                  <span className="text-neutral-500">Core Disciplines:</span>
                  <span className="text-neutral-900">
                    {(activeEducation.coursework || []).slice(0, 4).join(', ') || 'Data Structures, DBMS, Web Architecture, OS'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 text-[11px] font-mono text-neutral-400">
              Verified degree program candidate, 8th semester completion 2026.
            </div>
          </div>

          {/* Credentials */}
          <div className="md:col-span-6 bg-white p-6 sm:p-8 border border-neutral-200/80 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-neutral-400 mb-4">
                <Award className="w-4 h-4 text-[#B89047]" />
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#B89047]">
                  VERIFIED CREDENTIALS
                </span>
              </div>

              <h3 className="font-serif-editorial text-2xl text-[#111111] mb-4">
                Professional Certifications ({activeCerts.length})
              </h3>

              <div className="space-y-3">
                {activeCerts.map((cert) => (
                  <div key={cert.id || cert.name} className="py-1.5 border-b border-neutral-100 last:border-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-xs font-medium text-neutral-900 font-mono">
                        {cert.name}
                      </h4>
                      <span className="text-[10px] font-mono text-[#B89047] shrink-0">Verified</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 font-light">
                      {cert.issuer} • {cert.description || cert.category}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-100 text-[11px] font-mono text-neutral-400">
              Verified certifications backed by industry-standard course programs.
            </div>
          </div>
        </div>
      </section>

      {/* 6. RECRUITER CLOSING ACTIONS (High Visibility, Decisive) */}
      <section className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 pt-16">
        <div className="bg-white p-8 sm:p-12 border border-neutral-200/90 shadow-2xs text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#B89047] block">
              NEXT STEP FOR HIRING MANAGERS & RECRUITERS
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl text-[#111111]">
              Ready to Discuss an Engineering or Analytics Role?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
              Available immediately for full-time engineering and data opportunities in Bengaluru or remote.
              Reach out directly or inspect the verified credentials below.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              id="recruiter-view-resume-bottom"
              type="button"
              onClick={onOpenResume}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold tracking-[0.18em] uppercase bg-[#111111] text-white hover:bg-[#B89047] transition-all duration-200 cursor-pointer shadow-xs"
            >
              <Eye className="w-3.5 h-3.5 text-[#B89047]" />
              <span>VIEW RESUME</span>
            </button>

            <button
              id="recruiter-download-resume-bottom"
              type="button"
              onClick={handleDownloadResume}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold tracking-[0.18em] uppercase border border-neutral-300 bg-white text-[#111111] hover:border-[#B89047] hover:text-[#B89047] transition-all duration-200 cursor-pointer shadow-xs"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">DOWNLOADING...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-[#B89047]" />
                  <span>DOWNLOAD RESUME</span>
                </>
              )}
            </button>

            <button
              id="recruiter-contact-me-bottom"
              type="button"
              onClick={() => onOpenContact('Recruiter Interview / Candidate Inquiry')}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold tracking-[0.18em] uppercase bg-[#B89047] text-white hover:bg-[#9E7835] transition-all duration-200 cursor-pointer shadow-xs"
            >
              <Mail className="w-3.5 h-3.5 text-white" />
              <span>CONTACT ME</span>
            </button>

            <a
              id="recruiter-linkedin-bottom"
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-3.5 text-xs font-mono uppercase border border-neutral-300 bg-white text-neutral-700 hover:text-[#111111] hover:border-[#111111] transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
              <span>LINKEDIN</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-400" />
            </a>

            <a
              id="recruiter-github-bottom"
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-3.5 text-xs font-mono uppercase border border-neutral-300 bg-white text-neutral-700 hover:text-[#111111] hover:border-[#111111] transition-colors"
            >
              <Github className="w-3.5 h-3.5 text-[#111111]" />
              <span>GITHUB</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-400" />
            </a>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono text-neutral-500">
            <span>Direct Email: <strong className="text-neutral-900">{PERSONAL_INFO.email}</strong></span>
            <span className="hidden sm:inline">•</span>
            <span>Location: <strong className="text-neutral-900">Bengaluru, Karnataka, India</strong></span>
            <span className="hidden sm:inline">•</span>
            <button
              onClick={() => onNavigate('home')}
              className="text-[#B89047] hover:underline cursor-pointer"
            >
              Return to Full Portfolio →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
