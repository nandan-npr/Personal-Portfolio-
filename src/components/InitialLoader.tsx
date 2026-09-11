import React, { useEffect, useState, useRef } from 'react';

export const InitialLoader: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    const hasLoaded = sessionStorage.getItem('npr_revealed_v1');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !hasLoaded && !prefersReducedMotion;
  });

  const [fading, setFading] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!visible) {
      if (onCompleteRef.current) onCompleteRef.current();
      return;
    }

    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        setVisible(false);
        try {
          sessionStorage.setItem('npr_revealed_v1', 'true');
        } catch {
          // ignore
        }
        if (onCompleteRef.current) onCompleteRef.current();
      }, 300);
    }, 700);

    return () => clearTimeout(timer);
  }, []); // Run only once on mount

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-[#FAFAFA] flex flex-col items-center justify-center transition-opacity duration-300 pointer-events-none ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className="text-center space-y-4">
        <span className="font-serif-editorial text-3xl sm:text-4xl tracking-widest text-[#111111] block">
          NPR
        </span>
        <div className="w-24 h-[1.5px] bg-neutral-200 overflow-hidden mx-auto">
          <div className="h-full bg-[#B89047] w-full origin-left animate-[loadingBar_0.7s_cubic-bezier(0.16,1,0.3,1)_forwards]" />
        </div>
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-neutral-400 block pt-1">
          PORTFOLIO ARCHIVE // 2026
        </span>
      </div>
    </div>
  );
};
