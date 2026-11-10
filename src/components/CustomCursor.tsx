'use client';

import { useEffect, useRef, useState } from 'react';
import GlobalInteractiveField from './cursor/GlobalInteractiveField';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Touch detection & screen check
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const desktopMode = !hasTouch && window.innerWidth >= 1024 && !isReduced;
    setIsDesktop(desktopMode);

    if (!desktopMode) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let auraX = mouseX;
    let auraY = mouseY;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    // Physics loop for trailing elements
    const render = () => {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;

      auraX += (mouseX - auraX) * 0.08;
      auraY += (mouseY - auraY) * 0.08;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      if (auraRef.current) {
        auraRef.current.style.transform = `translate3d(${auraX}px, ${auraY}px, 0)`;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Dynamic hover detection for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.interactive') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('[data-magnetic]')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Global Interactive Background Field */}
      <GlobalInteractiveField />

      {isDesktop && (
        <>
          {/* Ambient cursor spotlight in Electric Blue & Lime Green */}
          <div
            ref={auraRef}
            className="fixed top-0 left-0 w-[480px] h-[480px] -ml-[240px] -mt-[240px] rounded-full pointer-events-none z-[5] opacity-30 mix-blend-screen transition-opacity duration-300"
            style={{
              background:
                'radial-gradient(circle, rgba(49, 94, 255, 0.22) 0%, rgba(184, 217, 76, 0.08) 40%, rgba(8, 11, 18, 0) 70%)',
            }}
          />

          {/* Trailing electric blue / lime ring */}
          <div
            ref={ringRef}
            className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9999] -ml-5 -mt-5 transition-all duration-150 ease-out ${
              isHovered
                ? 'w-14 h-14 -ml-7 -mt-7 border-2 border-lime-green bg-lime-green/10 shadow-[0_0_20px_rgba(184,217,76,0.35)]'
                : isClicking
                ? 'w-8 h-8 -ml-4 -mt-4 border-2 border-electric-blue-light scale-90'
                : 'w-10 h-10 border border-electric-blue/60 shadow-[0_0_12px_rgba(49,94,255,0.3)]'
            }`}
          />

          {/* Center pinpoint */}
          <div
            ref={dotRef}
            className={`fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full pointer-events-none z-[10000] transition-colors duration-150 ${
              isHovered ? 'bg-lime-green scale-150 shadow-[0_0_8px_#B8D94C]' : 'bg-electric-blue-light'
            }`}
          />
        </>
      )}
    </>
  );
}
