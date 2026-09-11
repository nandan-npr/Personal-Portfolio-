import React, { useState, useEffect, useCallback } from 'react';
import { CERTIFICATIONS } from '../data/portfolioData';
import { usePortfolio } from '../hooks/usePortfolio';
import { CertificationItem, PageView } from '../types';
import { Award, CheckCircle2, ArrowUpRight, X, ExternalLink, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CertificatesViewProps {
  onNavigate: (view: PageView) => void;
  onOpenResume: () => void;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({ onNavigate, onOpenResume }) => {
  const { certifications } = usePortfolio();
  const certList = certifications && certifications.length > 0 ? certifications : CERTIFICATIONS;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);

  const filteredCerts = selectedCategory === 'all'
    ? certList
    : certList.filter((c) => {
        if (selectedCategory === 'tech') return c.category === 'Tech & Dev';
        if (selectedCategory === 'data') return c.category === 'Data Analytics';
        if (selectedCategory === 'ai') return c.category === 'AI & Systems';
        return true;
      });

  const currentIndex = selectedCert ? filteredCerts.findIndex((c) => c.id === selectedCert.id) : -1;

  const handlePrev = useCallback(() => {
    if (filteredCerts.length === 0) return;
    const prevIdx = currentIndex <= 0 ? filteredCerts.length - 1 : currentIndex - 1;
    setSelectedCert(filteredCerts[prevIdx]);
  }, [currentIndex, filteredCerts]);

  const handleNext = useCallback(() => {
    if (filteredCerts.length === 0) return;
    const nextIdx = currentIndex >= filteredCerts.length - 1 ? 0 : currentIndex + 1;
    setSelectedCert(filteredCerts[nextIdx]);
  }, [currentIndex, filteredCerts]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCert(null);
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    if (selectedCert) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedCert, handlePrev, handleNext]);

  return (
    <div className="w-full pt-28 pb-28">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-14 pb-8 border-b border-neutral-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono tracking-[0.3em] uppercase text-[#B89047] block mb-3">
                OFFICIAL CREDENTIALS // VERIFIED CERTIFICATIONS
              </span>
              <h1 className="font-serif-editorial text-4xl sm:text-6xl md:text-7xl font-normal text-[#111111] tracking-tight">
                Certifications
              </h1>
              <p className="text-base sm:text-lg text-neutral-500 font-light mt-4 max-w-2xl leading-relaxed">
                Extracted directly from official resumes. Every credential represents rigorous coursework, hands-on simulation assessments, or vendor competency testing.
              </p>
            </div>

            <button
              onClick={onOpenResume}
              className="px-5 py-2.5 bg-[#111111] text-white text-xs font-mono uppercase hover:bg-[#B89047] transition-colors self-start sm:self-auto shrink-0"
            >
              VIEW OFFICIAL RESUME
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 pb-6 mb-12 border-b border-neutral-200/80 text-xs font-mono tracking-[0.16em] uppercase">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`pb-2 relative transition-colors focus:outline-none ${
              selectedCategory === 'all' ? 'text-[#111111] font-semibold' : 'text-neutral-400 hover:text-[#111111]'
            }`}
          >
            <span>ALL CREDENTIALS ({CERTIFICATIONS.length})</span>
            {selectedCategory === 'all' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B89047]" />
            )}
          </button>
          <button
            onClick={() => setSelectedCategory('tech')}
            className={`pb-2 relative transition-colors focus:outline-none ${
              selectedCategory === 'tech' ? 'text-[#111111] font-semibold' : 'text-neutral-400 hover:text-[#111111]'
            }`}
          >
            <span>SOFTWARE & DEV ({CERTIFICATIONS.filter((c) => c.category === 'Tech & Dev').length})</span>
            {selectedCategory === 'tech' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B89047]" />
            )}
          </button>
          <button
            onClick={() => setSelectedCategory('data')}
            className={`pb-2 relative transition-colors focus:outline-none ${
              selectedCategory === 'data' ? 'text-[#111111] font-semibold' : 'text-neutral-400 hover:text-[#111111]'
            }`}
          >
            <span>DATA & ANALYTICS ({CERTIFICATIONS.filter((c) => c.category === 'Data Analytics').length})</span>
            {selectedCategory === 'data' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B89047]" />
            )}
          </button>
          <button
            onClick={() => setSelectedCategory('ai')}
            className={`pb-2 relative transition-colors focus:outline-none ${
              selectedCategory === 'ai' ? 'text-[#111111] font-semibold' : 'text-neutral-400 hover:text-[#111111]'
            }`}
          >
            <span>AI & SYSTEMS ({CERTIFICATIONS.filter((c) => c.category === 'AI & Systems').length})</span>
            {selectedCategory === 'ai' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#B89047]" />
            )}
          </button>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => (
            <div
              key={cert.id}
              id={`cert-card-${cert.id}`}
              onClick={() => setSelectedCert(cert)}
              className="bg-white border border-neutral-200/90 p-6 sm:p-7 hover:border-[#B89047] transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:shadow-md"
            >
              <div>
                {/* Header Tag & Verification */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#B89047] bg-[#B89047]/10 px-2 py-0.5">
                    {cert.category}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-400">
                    <CheckCircle2 className="w-3 h-3 text-[#B89047]" />
                    <span>VERIFIED</span>
                  </div>
                </div>

                {/* Certificate Name */}
                <h3 className="font-serif-editorial text-xl sm:text-2xl text-[#111111] leading-snug group-hover:text-[#B89047] transition-colors mb-2">
                  {cert.name}
                </h3>

                {/* Issuing Organization */}
                <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-600 mb-4">
                  <span className="text-neutral-400">ISSUER:</span>
                  <span className="text-[#111111] font-medium">{cert.issuer}</span>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed mb-6">
                  {cert.description}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-400">YEAR: {cert.date || '2026'}</span>
                <span className="text-[#111111] group-hover:text-[#B89047] transition-colors flex items-center gap-1 font-medium">
                  <span>PREVIEW</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#B89047]" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 p-8 bg-[#FAFAFA] border border-neutral-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#B89047] block mb-1">
              AUTHENTIC RECORD SYNCHRONIZATION
            </span>
            <h4 className="font-serif-editorial text-2xl text-[#111111]">
              Need Full Verified Transcripts or Documentation?
            </h4>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-xl font-light">
              All certifications are confirmed in the official curriculum vitae. Download the master PDF or connect directly to review credential IDs.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenResume}
              className="px-5 py-2.5 bg-[#111111] text-white text-xs font-mono uppercase hover:bg-[#B89047] transition-colors"
            >
              DOWNLOAD RESUME
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-5 py-2.5 border border-neutral-300 text-[#111111] text-xs font-mono uppercase hover:border-[#B89047] transition-colors bg-white"
            >
              CONTACT
            </button>
          </div>
        </div>
      </div>

      {/* Certificate Preview Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-modal-title"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-white border border-neutral-300 shadow-2xl overflow-hidden p-6 sm:p-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar with Navigation Controls */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-200">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                  <span className="text-[#B89047] font-semibold">
                    {currentIndex >= 0 ? `0${currentIndex + 1}` : '01'}
                  </span>
                  <span>/</span>
                  <span>{filteredCerts.length < 10 ? `0${filteredCerts.length}` : filteredCerts.length}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-1.5 border border-neutral-300 text-neutral-700 hover:border-[#B89047] hover:text-[#111111] transition-colors focus:outline-none"
                    aria-label="Previous Certificate (Arrow Left)"
                    title="Previous Certificate (←)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-1.5 border border-neutral-300 text-neutral-700 hover:border-[#B89047] hover:text-[#111111] transition-colors focus:outline-none"
                    aria-label="Next Certificate (Arrow Right)"
                    title="Next Certificate (→)"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <div className="w-[1px] h-4 bg-neutral-200 mx-1" />
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="p-1.5 border border-neutral-300 text-neutral-700 hover:border-[#B89047] hover:text-[#111111] transition-colors focus:outline-none"
                    aria-label="Close Preview (Escape)"
                    title="Close Preview (Esc)"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Decorative Certificate Frame */}
              <div className="border border-neutral-300 p-6 sm:p-8 bg-[#FAF8F5] relative">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#B89047]" />
                    <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-500">
                      OFFICIAL CERTIFICATE RECORD
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#B89047] font-semibold uppercase tracking-wider">
                    {selectedCert.category}
                  </span>
                </div>

                <div className="text-center my-6">
                  <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-neutral-400 block mb-2">
                    THIS CERTIFIES THAT
                  </span>
                  <h2 className="font-serif-editorial text-3xl sm:text-4xl text-[#111111] tracking-wide mb-3">
                    Nandan Pruthvi Raj R
                  </h2>
                  <p className="text-xs font-mono text-neutral-500 max-w-md mx-auto mb-6">
                    has successfully satisfied all curriculum standards, hands-on simulations, and technical evaluations for:
                  </p>
                  <div className="p-4 bg-white border border-neutral-200 my-4 shadow-xs">
                    <h3 id="cert-modal-title" className="font-serif-editorial text-2xl sm:text-3xl text-[#111111]">
                      {selectedCert.name}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-4 border-t border-neutral-200 mt-6">
                  <div>
                    <span className="text-neutral-400 block text-[10px]">ISSUING BODY</span>
                    <span className="text-[#111111] font-medium">{selectedCert.issuer}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-neutral-400 block text-[10px]">COMPLETION TIMELINE</span>
                    <span className="text-[#111111] font-medium">{selectedCert.date || '2026'}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 text-xs text-neutral-600 font-light border-t border-neutral-200/60 leading-relaxed">
                  {selectedCert.description}
                </div>
              </div>

              {/* Bottom CTAs */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified in uploaded official resume</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedCert.credentialUrl && (
                    <a
                      href={selectedCert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono uppercase bg-[#111111] text-white hover:bg-[#B89047] transition-colors"
                    >
                      <span>VISIT ISSUER</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="px-4 py-2 text-xs font-mono uppercase border border-neutral-300 hover:border-[#B89047] transition-colors bg-white text-neutral-800"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
