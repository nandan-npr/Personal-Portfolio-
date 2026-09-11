import React, { useState, useEffect } from 'react';
import { X, Download, ArrowUpRight, Check, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '../hooks/usePortfolio';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ResumeVersion = 'overall' | 'swe' | 'da';

interface ResumeOption {
  id: ResumeVersion;
  label: string;
  subLabel: string;
  path: string;
  previewImage: string;
  downloadFilename: string;
}

const RESUME_OPTIONS: ResumeOption[] = [
  {
    id: 'overall',
    label: 'OVERALL RESUME',
    subLabel: 'Master Comprehensive Profile',
    path: '/resume.pdf',
    previewImage: '/resume-page-overall.png',
    downloadFilename: 'Nandan_Pruthvi_Raj_Resume.pdf',
  },
  {
    id: 'swe',
    label: 'SOFTWARE ENGINEER',
    subLabel: 'Full-Stack & Systems Focus',
    path: '/resume-software-engineer.pdf',
    previewImage: '/resume-page-swe.png',
    downloadFilename: 'Nandan_Pruthvi_Raj_Software_Engineer_Resume.pdf',
  },
  {
    id: 'da',
    label: 'DATA ANALYST',
    subLabel: 'Data & Analytics Focus',
    path: '/resume-data-analyst.pdf',
    previewImage: '/resume-page-da.png',
    downloadFilename: 'Nandan_Pruthvi_Raj_Data_Analyst_Resume.pdf',
  },
];

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [selectedVersion, setSelectedVersion] = useState<ResumeVersion>('overall');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const { resumeInfo } = usePortfolio();
  const baseResume = RESUME_OPTIONS.find((r) => r.id === selectedVersion) || RESUME_OPTIONS[0];
  const currentResume = {
    ...baseResume,
    path: (selectedVersion === 'overall' && resumeInfo?.isActive && resumeInfo?.fileUrl) ? resumeInfo.fileUrl : baseResume.path,
    downloadFilename: (selectedVersion === 'overall' && resumeInfo?.isActive && resumeInfo?.fileName) ? resumeInfo.fileName : baseResume.downloadFilename,
  };

  const triggerDownload = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);

    try {
      const response = await fetch(currentResume.path);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const objectUrl = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = currentResume.downloadFilename;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(objectUrl);
      }, 1000);
    } catch (err) {
      console.warn('Blob download fallback triggered:', err);
      const fallbackLink = document.createElement('a');
      fallbackLink.href = currentResume.path;
      fallbackLink.download = currentResume.downloadFilename;
      fallbackLink.target = '_blank';
      fallbackLink.rel = 'noopener noreferrer';
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      setTimeout(() => document.body.removeChild(fallbackLink), 1000);
    }
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 160));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 75));
  const handleZoomReset = () => setZoomLevel(100);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-viewer-title"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-6xl bg-white border border-neutral-300 shadow-2xl flex flex-col h-[95vh] max-h-[1050px] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 border-b border-neutral-200 bg-white gap-3 z-10">
            {/* Title & Metadata */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-2 h-2 rounded-full bg-[#B89047]" />
              <div>
                <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-neutral-400 block leading-tight">
                  OFFICIAL CURRICULUM VITAE
                </span>
                <h2 id="resume-viewer-title" className="font-serif-editorial text-xl sm:text-2xl text-[#111111] leading-none">
                  RESUME
                </h2>
              </div>
            </div>

            {/* Resume Track Selector: SOFTWARE ENGINEER vs DATA ANALYST */}
            <div className="flex items-center bg-[#F3F4F6] p-1 border border-neutral-200 shrink-0">
              {RESUME_OPTIONS.map((option) => {
                const isActive = option.id === selectedVersion;
                return (
                  <button
                    key={option.id}
                    id={`resume-select-${option.id}`}
                    onClick={() => {
                      setSelectedVersion(option.id);
                      setZoomLevel(100);
                    }}
                    className={`px-3 sm:px-5 py-2 text-[11px] font-mono tracking-wider transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-white text-[#111111] shadow-xs font-semibold border-b-2 border-[#B89047]'
                        : 'text-neutral-500 hover:text-[#111111]'
                    }`}
                  >
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Actions: Zoom Controls + DOWNLOAD RESUME + OPEN IN NEW TAB */}
            <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
              {/* Zoom Tools */}
              <div className="hidden md:flex items-center border border-neutral-200 bg-[#FAFAFA] p-0.5 text-neutral-600 mr-1">
                <button
                  id="resume-zoom-out-btn"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 75}
                  className="p-1.5 hover:text-[#111111] hover:bg-neutral-200/60 disabled:opacity-40 transition-colors"
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 text-[10px] font-mono select-none min-w-[40px] text-center">
                  {zoomLevel}%
                </span>
                <button
                  id="resume-zoom-in-btn"
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 160}
                  className="p-1.5 hover:text-[#111111] hover:bg-neutral-200/60 disabled:opacity-40 transition-colors"
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  id="resume-zoom-reset-btn"
                  onClick={handleZoomReset}
                  className="p-1.5 hover:text-[#111111] hover:bg-neutral-200/60 transition-colors border-l border-neutral-200 ml-0.5"
                  title="Reset Zoom to 100%"
                  aria-label="Reset Zoom"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              {/* DOWNLOAD RESUME Button */}
              <button
                id="resume-download-btn"
                onClick={triggerDownload}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-mono uppercase bg-[#111111] text-white hover:bg-[#B89047] transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer"
                title={`Download ${currentResume.label} PDF`}
              >
                {downloadSuccess ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>DOWNLOAD RESUME</span>
              </button>

              {/* OPEN IN NEW TAB Button */}
              <a
                id="resume-open-tab-btn"
                href={currentResume.path}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-mono uppercase border border-neutral-300 text-neutral-800 hover:border-[#B89047] hover:text-[#111111] transition-colors bg-white whitespace-nowrap shrink-0 cursor-pointer"
                title={`Open ${currentResume.label} in New Tab`}
              >
                <span>OPEN IN NEW TAB</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#B89047]" />
              </a>

              {/* Close Modal Button */}
              <button
                id="resume-modal-close-btn"
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-[#111111] hover:bg-neutral-100 transition-colors ml-1"
                aria-label="Close Resume Viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Document Display Canvas Stage */}
          <div className="flex-1 bg-[#ECEEF1] relative overflow-y-auto overflow-x-auto p-4 sm:p-6 md:p-8 flex justify-center items-start">
            <div
              style={{
                width: `${Math.round(zoomLevel * 8.5)}px`,
                maxWidth: zoomLevel === 100 ? '850px' : 'none',
                transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="bg-white shadow-2xl border border-neutral-300/80 rounded-none overflow-hidden my-auto"
            >
              {/* Document Page Canvas */}
              <div className="relative w-full bg-white select-none">
                <img
                  id="resume-document-page"
                  key={currentResume.previewImage}
                  src={currentResume.previewImage}
                  alt={`Nandan Pruthvi Raj - ${currentResume.label} Resume`}
                  className="w-full h-auto block"
                  loading="eager"
                  decoding="sync"
                />

                {/* Subtle watermark badge indicating authentic PDF document rendering */}
                <div className="absolute top-3 right-4 px-2 py-0.5 bg-black/5 border border-black/10 text-[9px] font-mono text-neutral-600 uppercase tracking-widest pointer-events-none rounded">
                  AUTHENTIC PDF RENDER • A4
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar — Quick Actions & File Reference */}
          <div className="px-5 py-2.5 bg-white border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-500 gap-2 shrink-0 z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-neutral-400">FILE:</span>
              <span className="text-[#111111] font-medium">{currentResume.path}</span>
              <span className="text-neutral-300">•</span>
              <span className="text-[#B89047]">{currentResume.subLabel}</span>
              <span className="text-neutral-300 hidden md:inline">•</span>
              <span className="text-neutral-400 hidden md:inline">100% Vector Source Output</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="resume-bottom-download-btn"
                onClick={triggerDownload}
                className="text-[#111111] hover:text-[#B89047] transition-colors inline-flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0 font-mono text-xs"
              >
                <Download className="w-3 h-3 text-[#B89047]" />
                <span>DOWNLOAD RESUME</span>
              </button>
              <span className="text-neutral-300">|</span>
              <a
                href={currentResume.path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#111111] hover:text-[#B89047] transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <span>OPEN IN NEW TAB</span>
                <ArrowUpRight className="w-3 h-3 text-[#B89047]" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
