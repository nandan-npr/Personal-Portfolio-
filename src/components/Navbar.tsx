import React, { useState, useEffect } from 'react';
import { PageView } from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  activeView: PageView;
  onNavigate: (view: PageView) => void;
  onOpenResume: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  onOpenResume,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; view: PageView; number: string; isRecruiter?: boolean }[] = [
    { label: 'HOME', view: 'home', number: '00' },
    { label: 'ABOUT', view: 'about', number: '01' },
    { label: 'WORK', view: 'work', number: '02' },
    { label: 'EXPERIENCE', view: 'experience', number: '03' },
    { label: 'SKILLS', view: 'skills', number: '04' },
    { label: 'CERTIFICATES', view: 'certificates', number: '05' },
    { label: 'SOCIAL', view: 'social', number: '06' },
    { label: 'CONTACT', view: 'contact', number: '07' },
    { label: 'RECRUITER', view: 'recruiter', number: '08', isRecruiter: true },
  ];

  const handleItemClick = (view: PageView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#FAFAFA]/95 backdrop-blur-md border-b border-neutral-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.03)]'
          : 'bg-transparent border-b border-neutral-200/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand / Name */}
        <button
          onClick={() => handleItemClick('home')}
          className="group text-left flex items-center gap-2 focus:outline-none cursor-pointer"
        >
          <span className="font-serif-editorial text-xl sm:text-2xl font-semibold tracking-wider text-[#111111] group-hover:text-[#B89047] transition-colors">
            NPR
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#B89047]" />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[12px] font-medium tracking-[0.16em]">
          {navItems.map((item) => {
            const isActive = activeView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => handleItemClick(item.view)}
                className={`relative py-1.5 transition-colors group focus:outline-none cursor-pointer ${
                  isActive ? 'text-[#111111] font-semibold' : 'text-neutral-500 hover:text-[#111111]'
                }`}
              >
                {item.isRecruiter ? (
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 border transition-all text-[11px] font-mono tracking-widest ${
                      isActive
                        ? 'border-[#B89047] bg-[#B89047] text-white'
                        : 'border-[#B89047]/60 text-[#B89047] hover:border-[#B89047] hover:bg-[#B89047]/10'
                    }`}
                  >
                    <span>RECRUITER</span>
                    <span className={`w-1 h-1 rounded-full ${isActive ? 'bg-white' : 'bg-[#B89047]'}`} />
                  </span>
                ) : (
                  <>
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#B89047] transition-all" />
                    )}
                  </>
                )}
              </button>
            );
          })}

          {/* Minimalist Gold-Accented Resume Button */}
          <button
            id="nav-resume-btn"
            onClick={onOpenResume}
            className="ml-1 inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium tracking-[0.16em] uppercase border border-[#B89047] text-[#111111] hover:bg-[#B89047] hover:text-white transition-all duration-200 focus:outline-none cursor-pointer"
          >
            <span>RESUME</span>
            <ArrowUpRight className="w-3 h-3 text-[#B89047] group-hover:text-white" />
          </button>
        </nav>

        {/* Mobile Hamburger Toggle & Quick Recruiter Action */}
        <div className="flex items-center gap-2.5 lg:hidden">
          <button
            id="nav-recruiter-mobile-btn"
            onClick={() => handleItemClick('recruiter')}
            className={`px-2 py-1 text-[10px] font-mono tracking-wider border cursor-pointer ${
              activeView === 'recruiter'
                ? 'bg-[#B89047] text-white border-[#B89047]'
                : 'border-[#B89047]/60 text-[#B89047] bg-white'
            }`}
          >
            RECRUITER
          </button>
          <button
            id="nav-resume-mobile-btn"
            onClick={onOpenResume}
            className="px-2 py-1 text-[10px] font-mono tracking-wider border border-neutral-300 text-[#111111] cursor-pointer"
          >
            RESUME
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#111111] hover:text-[#B89047] focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Fullscreen Mobile Overlay Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-[#FAFAFA] z-50 flex flex-col justify-between px-8 py-10 border-t border-neutral-200">
          <div className="space-y-6">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#B89047] block mb-4">
              DIRECTORY // ARCHITECTURE
            </span>
            {navItems.map((item) => {
              const isActive = activeView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => handleItemClick(item.view)}
                  className="w-full flex items-center justify-between text-left py-2 border-b border-neutral-200/80 group focus:outline-none"
                >
                  <span
                    className={`font-serif-editorial text-2xl tracking-wide ${
                      isActive ? 'text-[#111111] font-semibold' : 'text-neutral-500 group-hover:text-[#111111]'
                    }`}
                  >
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#B89047]">{item.number}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#B89047]" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-8 border-t border-neutral-200 flex flex-col gap-4">
            <button
              id="mobile-menu-resume-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResume();
              }}
              className="w-full py-3 text-center text-xs font-medium tracking-[0.2em] uppercase border border-[#B89047] text-[#111111] hover:bg-[#B89047] hover:text-white transition-all"
            >
              VIEW RESUME (PDF)
            </button>
            <p className="text-[11px] font-mono text-neutral-400 text-center">
              {PERSONAL_INFO.location} • {PERSONAL_INFO.email}
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
