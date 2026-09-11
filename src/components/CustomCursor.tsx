import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const [visible, setVisible] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const animFrame = useRef<number | null>(null);

  useEffect(() => {
    // Only enable on desktop with fine pointer and no reduced motion preference
    if (typeof window === 'undefined') return;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isFinePointer || isTouch || prefersReducedMotion) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    const onMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      setVisible(true);

      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('button, a, [role="button"], input, textarea, select, [data-cursor]');
      if (interactive) {
        setIsHovered(true);
        const customText = interactive.getAttribute('data-cursor');
        if (customText) {
          setHoverText(customText);
        } else if (interactive.tagName.toLowerCase() === 'a' && (interactive as HTMLAnchorElement).target === '_blank') {
          setHoverText('LINK →');
        } else if (interactive.closest('#work, article, [data-project-card]')) {
          setHoverText('VIEW');
        } else {
          setHoverText('');
        }
      } else {
        setIsHovered(false);
        setHoverText('');
      }
    };

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth lerp for outer ring
    const updateRing = () => {
      ringPos.current.x += (targetPos.current.x - ringPos.current.x) * 0.25;
      ringPos.current.y += (targetPos.current.y - ringPos.current.y) * 0.25;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }
      animFrame.current = requestAnimationFrame(updateRing);
    };
    animFrame.current = requestAnimationFrame(updateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, []);

  if (!enabled || !visible) return null;

  return (
    <>
      {/* Small Central Dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#111111] transition-transform duration-75 ease-out"
        style={{
          left: '-100px',
          top: '-100px',
          width: isHovered ? '4px' : '5px',
          height: isHovered ? '4px' : '5px',
          backgroundColor: isHovered ? '#B89047' : '#111111',
        }}
      />

      {/* Subtle Outer Ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-200 ease-out flex items-center justify-center text-[9px] font-mono tracking-wider uppercase text-[#111111]"
        style={{
          left: '-100px',
          top: '-100px',
          width: hoverText ? '48px' : isHovered ? '32px' : '22px',
          height: hoverText ? '48px' : isHovered ? '32px' : '22px',
          borderColor: isHovered ? '#B89047' : 'rgba(17, 17, 17, 0.25)',
          backgroundColor: isHovered ? 'rgba(184, 144, 71, 0.04)' : 'transparent',
        }}
      >
        {hoverText && (
          <span className="scale-90 text-[8px] font-bold text-[#111111]">
            {hoverText}
          </span>
        )}
      </div>
    </>
  );
};
