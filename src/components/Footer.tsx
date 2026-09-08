import React from 'react';
import { PageView } from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { triggerMailto } from '../utils/contactUtils';

interface FooterProps {
  onNavigate: (view: PageView) => void;
  onOpenResume: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenResume }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks: { label: string; view: PageView }[] = [
    { label: 'HOME', view: 'home' },
    { label: 'ABOUT', view: 'about' },
    { label: 'WORK', view: 'work' },
    { label: 'EXPERIENCE', view: 'experience' },
    { label: 'SKILLS', view: 'skills' },
    { label: 'SOCIAL', view: 'social' },
    { label: 'CONTACT', view: 'contact' },
  ];

  return (
    <footer className="border-t border-neutral-200 bg-white text-[#111111] pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-neutral-200">
          {/* Brand & Persona */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-serif-editorial text-2xl font-semibold tracking-wider text-[#111111]">
                NANDAN PRUTHVI RAJ R
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#B89047]" />
            </div>

            <p className="text-xs font-mono tracking-[0.2em] uppercase text-[#B89047]">
              Software Engineer <span className="text-neutral-300">/</span> Data Analyst
            </p>

            <p className="text-xs sm:text-sm text-neutral-500 font-light max-w-sm leading-relaxed">
              Synthesizing full-stack engineering discipline, AI integrations, and quantitative data modeling into high-trust production solutions.
            </p>

            <div className="pt-2">
              <span className="inline-block text-[11px] font-mono text-neutral-400">
                Bengaluru, India • Available for immediate employment
              </span>
            </div>
          </div>

          {/* Directory Navigation */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-neutral-400 block mb-2">
              DIRECTORY
            </span>
            <div className="grid grid-cols-2 gap-y-2.5 text-xs font-mono tracking-wider">
              {navLinks.map((item) => (
                <button
                  key={item.view}
                  onClick={() => {
                    onNavigate(item.view);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-left text-neutral-600 hover:text-[#B89047] transition-colors focus:outline-none"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={onOpenResume}
                className="text-left text-[#B89047] font-semibold hover:underline focus:outline-none"
              >
                RESUME [PDF]
              </button>
            </div>
          </div>

          {/* Direct Channels & Back to Top */}
          <div className="md:col-span-3 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-neutral-400 block mb-2">
                CHANNELS
              </span>
              <div className="space-y-2 text-xs font-mono">
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between text-neutral-600 hover:text-[#111111] transition-colors group"
                >
                  <span>LINKEDIN</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#B89047] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <a
                  href={PERSONAL_INFO.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between text-neutral-600 hover:text-[#111111] transition-colors group"
                >
                  <span>GITHUB</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#B89047] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <a
                  id="footer-email-link"
                  href={`mailto:${PERSONAL_INFO.email}`}
                  onClick={() => triggerMailto(PERSONAL_INFO.email, 'Portfolio Inquiry')}
                  className="flex items-center justify-between text-neutral-600 hover:text-[#111111] transition-colors group"
                >
                  <span>{PERSONAL_INFO.email}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#B89047] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="group self-start inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-neutral-500 hover:text-[#111111] transition-colors"
            >
              <span>BACK TO TOP</span>
              <div className="w-6 h-6 border border-neutral-300 flex items-center justify-center group-hover:border-[#B89047] transition-colors">
                <ArrowUp className="w-3 h-3 text-[#B89047]" />
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div>
            © 2026 NANDAN PRUTHVI RAJ R. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    </footer>
  );
};
